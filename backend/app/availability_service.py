from collections import defaultdict
from datetime import UTC, date, datetime, time, timedelta
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .auth import ActorContext
from .models import (
    EventInquiryModel,
    ReservationModel,
    ReservationStatusHistoryModel,
    VenueAvailabilitySettingsModel,
    VenueBlockedSlotModel,
    VenueModel,
    VenueOperatingHoursModel,
)
from .schemas import (
    AvailabilitySettingsOut,
    AvailabilitySettingsUpdateIn,
    BlockedSlotCreateIn,
    BlockedSlotOut,
    DashboardEventOut,
    DashboardEventQueue,
    DashboardReservationOut,
    DashboardReservationQueue,
    DashboardSummaryOut,
    OperatingHourItem,
    PartnerDashboardOut,
    SlotAvailabilityItemOut,
    VenueAvailabilityOut,
)

ACTIVE_HOLD_STATES = {"Pending confirmation", "Confirmed"}
OPEN_EVENT_STATUSES = {"New", "In discussion"}
SLOT_STEP = timedelta(minutes=30)


def _api_error(status_code: int, code: str, message: str, **extra):
    detail = {"code": code, "message": message}
    detail.update(extra)
    raise HTTPException(status_code=status_code, detail=detail)


def _parse_date(value: str, field: str = "date") -> date:
    try:
        return date.fromisoformat(value)
    except ValueError:
        _api_error(422, "VALIDATION_ERROR", f"{field} must be a valid YYYY-MM-DD date.")


def _parse_time(value: str, field: str = "time") -> time:
    try:
        return time.fromisoformat(value)
    except ValueError:
        _api_error(422, "VALIDATION_ERROR", f"{field} must be a valid HH:MM time.")


def _minutes(value: time) -> int:
    return value.hour * 60 + value.minute


def _overlaps(a_start: time, a_end: time, b_start: time, b_end: time) -> bool:
    return _minutes(a_start) < _minutes(b_end) and _minutes(a_end) > _minutes(b_start)


def _ensure_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value


def _now() -> datetime:
    return datetime.now(UTC)


def get_venue_or_404(db: Session, venue_id: str) -> VenueModel:
    venue = db.get(VenueModel, venue_id)
    if venue is None:
        _api_error(404, "VENUE_NOT_FOUND", "Venue not found.", venue_id=venue_id)
    return venue


def ensure_partner_access(actor: ActorContext, venue_id: str) -> None:
    if actor.role != "administrator" and venue_id not in actor.owned_venue_ids:
        _api_error(
            403,
            "VENUE_ACCESS_DENIED",
            "You do not have access to manage this venue.",
            venue_id=venue_id,
        )


def _default_hours_from_venue(venue: VenueModel) -> tuple[time, time]:
    try:
        first, last = venue.opening_hours.split("-", 1)
        open_time = _parse_time(first.strip(), "opening_hours")
        close_time = _parse_time(last.strip(), "opening_hours")
        if close_time > open_time:
            return open_time, close_time
    except (AttributeError, TypeError, ValueError):
        return time(10, 0), time(22, 0)
    return time(10, 0), time(22, 0)


def get_or_create_settings(
    db: Session, venue: VenueModel
) -> VenueAvailabilitySettingsModel:
    settings = db.get(VenueAvailabilitySettingsModel, venue.id)
    if settings is not None:
        return settings

    capacity = max(1, min(venue.max_capacity or 20, 40))
    settings = VenueAvailabilitySettingsModel(
        venue_id=venue.id,
        default_slot_capacity=capacity,
        slot_granularity_minutes=30,
        revision=1,
        updated_by="system",
        updated_at=_now(),
    )
    db.add(settings)
    db.flush()
    open_time, close_time = _default_hours_from_venue(venue)
    for day in range(7):
        db.add(
            VenueOperatingHoursModel(
                id=f"hours-{venue.id}-{day}-{uuid4().hex[:8]}",
                venue_id=venue.id,
                day_of_week=day,
                open_time=open_time,
                close_time=close_time,
                is_active=True,
                created_at=_now(),
                updated_at=_now(),
            )
        )
    db.commit()
    db.refresh(settings)
    return settings


def serialize_settings(
    venue: VenueModel, settings: VenueAvailabilitySettingsModel
) -> AvailabilitySettingsOut:
    hours = sorted(settings.operating_hours, key=lambda row: row.day_of_week)
    blocks = sorted(
        settings.blocked_slots,
        key=lambda row: (row.blocked_date, row.start_time),
        reverse=True,
    )
    return AvailabilitySettingsOut(
        venue_id=venue.id,
        venue_name=venue.name,
        max_capacity=venue.max_capacity,
        default_slot_capacity=settings.default_slot_capacity,
        slot_granularity_minutes=settings.slot_granularity_minutes,
        revision=settings.revision,
        updated_by=settings.updated_by,
        updated_at=settings.updated_at,
        operating_hours=[
            OperatingHourItem(
                day_of_week=row.day_of_week,
                open_time=row.open_time.strftime("%H:%M"),
                close_time=row.close_time.strftime("%H:%M"),
                is_active=row.is_active,
            )
            for row in hours
        ],
        blocked_slots=[serialize_blocked_slot(row) for row in blocks],
    )


def serialize_blocked_slot(
    row: VenueBlockedSlotModel, affected_ids: list[str] | None = None
) -> BlockedSlotOut:
    return BlockedSlotOut(
        id=row.id,
        venue_id=row.venue_id,
        blocked_date=row.blocked_date.isoformat(),
        start_time=row.start_time.strftime("%H:%M"),
        end_time=row.end_time.strftime("%H:%M"),
        reason=row.reason,
        status=row.status,
        created_by=row.created_by,
        created_at=row.created_at,
        cancelled_by=row.cancelled_by,
        cancelled_at=row.cancelled_at,
        affected_pending_reservation_ids=affected_ids or [],
    )


def expire_due_reservations(db: Session, venue_id: str | None = None) -> int:
    now = _now()
    stmt = select(ReservationModel).where(
        ReservationModel.status == "Pending confirmation"
    )
    if venue_id:
        stmt = stmt.where(ReservationModel.venue_id == venue_id)
    expired = 0
    for reservation in db.scalars(stmt).all():
        if _ensure_aware(reservation.response_deadline) <= now:
            reservation.status = "Expired"
            reservation.updated_at = now
            db.add(
                ReservationStatusHistoryModel(
                    id=f"hist-{uuid4().hex}",
                    reservation_id=reservation.id,
                    from_state="Pending confirmation",
                    to_state="Expired",
                    actor_id="system",
                    actor_role="system",
                    reason="Partner response deadline elapsed.",
                    created_at=now,
                )
            )
            expired += 1
    if expired:
        db.commit()
    return expired


def _future_active_reservations(db: Session, venue_id: str) -> list[ReservationModel]:
    today = _now().date().isoformat()
    return list(
        db.scalars(
            select(ReservationModel).where(
                ReservationModel.venue_id == venue_id,
                ReservationModel.status.in_(ACTIVE_HOLD_STATES),
                ReservationModel.reserved_date >= today,
            )
        ).all()
    )


def save_availability_settings(
    db: Session, venue_id: str, payload: AvailabilitySettingsUpdateIn, actor: ActorContext
) -> AvailabilitySettingsOut:
    venue = get_venue_or_404(db, venue_id)
    ensure_partner_access(actor, venue_id)
    expire_due_reservations(db, venue_id)
    settings = get_or_create_settings(db, venue)

    if (
        payload.expected_revision is not None
        and payload.expected_revision != settings.revision
    ):
        _api_error(
            409,
            "REVISION_CONFLICT",
            "Availability settings changed since you loaded them. Refresh and retry.",
            current_revision=settings.revision,
        )
    if payload.default_slot_capacity > venue.max_capacity:
        _api_error(
            422,
            "CAPACITY_EXCEEDS_MAXIMUM",
            "Default slot capacity cannot exceed venue maximum capacity.",
            max_capacity=venue.max_capacity,
        )

    seen_days: set[int] = set()
    parsed_hours: list[tuple[OperatingHourItem, time, time]] = []
    for row in payload.operating_hours:
        if row.day_of_week in seen_days:
            _api_error(
                422,
                "DUPLICATE_OPERATING_DAY",
                "Each day of week may only have one operating-hours row.",
                day_of_week=row.day_of_week,
            )
        seen_days.add(row.day_of_week)
        open_time = _parse_time(row.open_time, "open_time")
        close_time = _parse_time(row.close_time, "close_time")
        if row.is_active and close_time <= open_time:
            _api_error(
                422,
                "INVALID_TIME_RANGE",
                "Closing time must be later than opening time.",
                day_of_week=row.day_of_week,
            )
        parsed_hours.append((row, open_time, close_time))

    occupied = sum(
        row.party_size for row in _future_active_reservations(db, venue_id)
    )
    if payload.default_slot_capacity < occupied and occupied > 0:
        # This is intentionally only informational for total venue occupancy; the
        # stronger per-slot validation below prevents impossible calendar states.
        pass
    per_slot: dict[tuple[str, str], int] = defaultdict(int)
    for reservation in _future_active_reservations(db, venue_id):
        per_slot[(reservation.reserved_date, reservation.reserved_time)] += (
            reservation.party_size
        )
    for (reserved_date, reserved_time), seats in sorted(per_slot.items()):
        if seats > payload.default_slot_capacity:
            _api_error(
                409,
                "CAPACITY_REDUCTION_CONFLICT",
                "Capacity reduction conflicts with existing active reservations.",
                conflict={
                    "date": reserved_date,
                    "time": reserved_time,
                    "reserved_seats": seats,
                    "proposed_capacity": payload.default_slot_capacity,
                },
            )

    for existing in list(settings.operating_hours):
        db.delete(existing)
    db.flush()
    now = _now()
    for row, open_time, close_time in parsed_hours:
        db.add(
            VenueOperatingHoursModel(
                id=f"hours-{venue_id}-{row.day_of_week}-{uuid4().hex[:8]}",
                venue_id=venue_id,
                day_of_week=row.day_of_week,
                open_time=open_time,
                close_time=close_time,
                is_active=row.is_active,
                created_at=now,
                updated_at=now,
            )
        )
    settings.default_slot_capacity = payload.default_slot_capacity
    settings.slot_granularity_minutes = 30
    settings.revision += 1
    settings.updated_by = actor.user_id
    settings.updated_at = now
    db.commit()
    db.refresh(settings)
    return serialize_settings(venue, settings)


def list_blocked_slots(
    db: Session, venue_id: str, actor: ActorContext, status: str = "Active"
) -> list[BlockedSlotOut]:
    venue = get_venue_or_404(db, venue_id)
    ensure_partner_access(actor, venue_id)
    settings = get_or_create_settings(db, venue)
    rows = [
        row
        for row in settings.blocked_slots
        if status == "all" or row.status.lower() == status.lower()
    ]
    rows.sort(key=lambda row: (row.blocked_date, row.start_time))
    return [serialize_blocked_slot(row) for row in rows]


def create_blocked_slot(
    db: Session, venue_id: str, payload: BlockedSlotCreateIn, actor: ActorContext
) -> BlockedSlotOut:
    venue = get_venue_or_404(db, venue_id)
    ensure_partner_access(actor, venue_id)
    expire_due_reservations(db, venue_id)
    settings = get_or_create_settings(db, venue)
    blocked_date = _parse_date(payload.blocked_date, "blocked_date")
    start_time = _parse_time(payload.start_time, "start_time")
    end_time = _parse_time(payload.end_time, "end_time")
    if end_time <= start_time:
        _api_error(
            422,
            "INVALID_TIME_RANGE",
            "Blocked slot end time must be later than start time.",
        )
    if _minutes(start_time) % 30 or _minutes(end_time) % 30:
        _api_error(
            422,
            "INVALID_SLOT_BOUNDARY",
            "Blocked slot boundaries must align to 30-minute increments.",
        )

    for existing in settings.blocked_slots:
        if (
            existing.status == "Active"
            and existing.blocked_date == blocked_date
            and _overlaps(
                start_time, end_time, existing.start_time, existing.end_time
            )
        ):
            _api_error(
                409,
                "BLOCKED_SLOT_OVERLAP",
                "Blocked slot overlaps an existing active blocked slot.",
                existing_blocked_slot_id=existing.id,
            )

    active_rows = _future_active_reservations(db, venue_id)
    affected_pending: list[str] = []
    confirmed_conflicts: list[str] = []
    for reservation in active_rows:
        if reservation.reserved_date != payload.blocked_date:
            continue
        res_start = _parse_time(reservation.reserved_time, "reserved_time")
        res_end_dt = datetime.combine(blocked_date, res_start) + SLOT_STEP
        res_end = res_end_dt.time()
        if not _overlaps(start_time, end_time, res_start, res_end):
            continue
        if reservation.status == "Confirmed":
            confirmed_conflicts.append(reservation.id)
        elif reservation.status == "Pending confirmation":
            affected_pending.append(reservation.id)

    if confirmed_conflicts:
        _api_error(
            409,
            "CONFIRMED_RESERVATION_CONFLICT",
            "Cannot block a slot that overlaps confirmed reservations.",
            conflicting_reservation_ids=confirmed_conflicts,
        )

    row = VenueBlockedSlotModel(
        id=f"block-{uuid4().hex[:12]}",
        venue_id=venue_id,
        blocked_date=blocked_date,
        start_time=start_time,
        end_time=end_time,
        reason=payload.reason.strip(),
        status="Active",
        created_by=actor.user_id,
        created_at=_now(),
    )
    db.add(row)
    settings.revision += 1
    settings.updated_by = actor.user_id
    settings.updated_at = _now()
    db.commit()
    db.refresh(row)
    return serialize_blocked_slot(row, sorted(affected_pending))


def cancel_blocked_slot(
    db: Session, venue_id: str, blocked_slot_id: str, actor: ActorContext
) -> BlockedSlotOut:
    venue = get_venue_or_404(db, venue_id)
    ensure_partner_access(actor, venue_id)
    settings = get_or_create_settings(db, venue)
    row = next(
        (item for item in settings.blocked_slots if item.id == blocked_slot_id), None
    )
    if row is None:
        _api_error(404, "BLOCKED_SLOT_NOT_FOUND", "Blocked slot not found.")
    if row.status == "Cancelled":
        return serialize_blocked_slot(row)
    row.status = "Cancelled"
    row.cancelled_by = actor.user_id
    row.cancelled_at = _now()
    settings.revision += 1
    settings.updated_by = actor.user_id
    settings.updated_at = row.cancelled_at
    db.commit()
    db.refresh(row)
    return serialize_blocked_slot(row)


def calculate_public_availability(
    db: Session, venue_id: str, date_value: str, party_size: int
) -> VenueAvailabilityOut:
    venue = get_venue_or_404(db, venue_id)
    if str(venue.status) != "approved":
        _api_error(
            404,
            "VENUE_NOT_FOUND",
            "Approved venue not found.",
            venue_id=venue_id,
        )
    target_date = _parse_date(date_value)
    if target_date < _now().date():
        _api_error(422, "PAST_DATE", "Reservation date cannot be in the past.")
    expire_due_reservations(db, venue_id)
    settings = get_or_create_settings(db, venue)
    weekday = target_date.weekday()
    hour_row = next(
        (
            row
            for row in settings.operating_hours
            if row.day_of_week == weekday and row.is_active
        ),
        None,
    )
    if hour_row is None:
        return VenueAvailabilityOut(
            venue_id=venue_id,
            date=date_value,
            party_size=party_size,
            slot_granularity_minutes=30,
            closed_reason="Venue is closed on this date.",
            slots=[],
        )

    active_blocks = [
        row
        for row in settings.blocked_slots
        if row.status == "Active" and row.blocked_date == target_date
    ]
    reservations = [
        row
        for row in _future_active_reservations(db, venue_id)
        if row.reserved_date == date_value
    ]
    occupied_by_time: dict[str, int] = defaultdict(int)
    for reservation in reservations:
        occupied_by_time[reservation.reserved_time] += reservation.party_size

    discount_map: dict[str, int] = {}
    for row in venue.available_slots or []:
        if row.get("date") == date_value:
            discount_map[row.get("time", "")] = int(row.get("discount_percent") or 0)

    slots: list[SlotAvailabilityItemOut] = []
    cursor = datetime.combine(target_date, hour_row.open_time)
    close = datetime.combine(target_date, hour_row.close_time)
    while cursor < close:
        slot_time = cursor.time()
        slot_key = slot_time.strftime("%H:%M")
        is_blocked = any(
            _overlaps(
                slot_time,
                (cursor + SLOT_STEP).time(),
                row.start_time,
                row.end_time,
            )
            for row in active_blocks
        )
        occupied = occupied_by_time.get(slot_key, 0)
        remaining = max(0, settings.default_slot_capacity - occupied)
        fits_party = remaining >= party_size
        status = (
            "blocked"
            if is_blocked
            else "available"
            if fits_party and remaining > 0
            else "unavailable"
        )
        slots.append(
            SlotAvailabilityItemOut(
                time=slot_key,
                status=status,
                remaining_capacity=remaining,
                total_capacity=settings.default_slot_capacity,
                is_blocked=is_blocked,
                discount_percent=discount_map.get(slot_key, 0),
            )
        )
        cursor += SLOT_STEP

    return VenueAvailabilityOut(
        venue_id=venue_id,
        date=date_value,
        party_size=party_size,
        slot_granularity_minutes=30,
        closed_reason=None,
        slots=slots,
    )


def get_partner_dashboard(
    db: Session,
    venue_id: str,
    actor: ActorContext,
    status_filter: str | None = None,
    date_filter: str | None = None,
    query: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> PartnerDashboardOut:
    venue = get_venue_or_404(db, venue_id)
    ensure_partner_access(actor, venue_id)
    expire_due_reservations(db, venue_id)
    settings = get_or_create_settings(db, venue)
    if date_filter:
        _parse_date(date_filter, "date")

    all_reservations = list(
        db.scalars(
            select(ReservationModel).where(ReservationModel.venue_id == venue_id)
        ).all()
    )
    all_reservations.sort(
        key=lambda row: (
            row.reserved_date,
            row.reserved_time,
            row.reservation_code,
        )
    )
    today = date_filter or _now().date().isoformat()
    pending = [row for row in all_reservations if row.status == "Pending confirmation"]
    confirmed_today_rows = [
        row
        for row in all_reservations
        if row.status == "Confirmed" and row.reserved_date == today
    ]

    filtered = []
    q = (query or "").strip().lower()
    for row in all_reservations:
        if row.status not in ACTIVE_HOLD_STATES:
            continue
        if status_filter and row.status != status_filter:
            continue
        if date_filter and row.reserved_date != date_filter:
            continue
        haystack = (
            f"{row.customer_name} {row.customer_phone} {row.reservation_code}".lower()
        )
        if q and q not in haystack:
            continue
        filtered.append(row)

    filtered.sort(
        key=lambda row: (
            0 if row.status == "Pending confirmation" else 1,
            _ensure_aware(row.response_deadline),
            row.reserved_date,
            row.reserved_time,
        )
    )
    total = len(filtered)
    start = (page - 1) * page_size
    page_rows = filtered[start : start + page_size]

    inquiry_rows = list(
        db.scalars(
            select(EventInquiryModel).where(
                EventInquiryModel.venue_id == venue_id,
                EventInquiryModel.status.in_(OPEN_EVENT_STATUSES),
            )
        ).all()
    )
    if date_filter:
        inquiry_rows = [
            row for row in inquiry_rows if row.preferred_date == date_filter
        ]
    inquiry_rows.sort(key=lambda row: (_ensure_aware(row.updated_at), row.id), reverse=True)
    event_total = len(inquiry_rows)
    event_page_rows = inquiry_rows[start : start + page_size]

    week_end = _now().date() + timedelta(days=7)
    blocked_next_7 = sum(
        1
        for row in settings.blocked_slots
        if row.status == "Active" and _now().date() <= row.blocked_date <= week_end
    )
    deadlines = [
        _ensure_aware(row.response_deadline)
        for row in pending
        if row.response_deadline is not None
    ]

    return PartnerDashboardOut(
        venue_id=venue_id,
        venue_name=venue.name,
        generated_at=_now(),
        summary=DashboardSummaryOut(
            pending_reservations=len(pending),
            confirmed_today=len(confirmed_today_rows),
            open_event_inquiries=len(inquiry_rows),
            seats_reserved_today=sum(row.party_size for row in confirmed_today_rows),
            active_blocked_slots_next_7_days=blocked_next_7,
            nearest_response_deadline=min(deadlines) if deadlines else None,
        ),
        reservation_queue=DashboardReservationQueue(
            total=total,
            page=page,
            page_size=page_size,
            items=[
                DashboardReservationOut(
                    id=row.id,
                    reservation_code=row.reservation_code,
                    customer_name=row.customer_name,
                    customer_phone=row.customer_phone,
                    reserved_date=row.reserved_date,
                    reserved_time=row.reserved_time,
                    party_size=row.party_size,
                    status=row.status,
                    special_requests=row.special_requests,
                    response_deadline=row.response_deadline,
                    created_at=row.created_at,
                )
                for row in page_rows
            ],
        ),
        event_queue=DashboardEventQueue(
            total=event_total,
            page=page,
            page_size=page_size,
            items=[
                DashboardEventOut(
                    id=row.id,
                    inquiry_code=row.inquiry_code,
                    customer_name=row.customer_name,
                    occasion=row.occasion,
                    preferred_date=row.preferred_date,
                    party_size=row.party_size,
                    budget_min_vnd=row.budget_min_vnd,
                    budget_max_vnd=row.budget_max_vnd,
                    status=row.status,
                    special_needs=row.special_needs,
                    last_message_preview=row.last_message_preview,
                    updated_at=row.updated_at,
                )
                for row in event_page_rows
            ],
        ),
    )
