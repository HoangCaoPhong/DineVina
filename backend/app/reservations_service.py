from __future__ import annotations

from datetime import date, datetime, time, timedelta, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload

from .auth import ActorContext
from .models import (
    ReservationModel,
    ReservationStatusHistoryModel,
    VenueModel,
)
from .schemas import (
    ReservationCreateIn,
    ReservationListResponse,
    ReservationOut,
    ReservationStatusHistoryOut,
    SlotAvailabilityItemOut,
    VenueAvailabilityOut,
)

VN_TZ = timezone(timedelta(hours=7))

STATE_PENDING = "Pending confirmation"
STATE_CONFIRMED = "Confirmed"
STATE_DECLINED = "Declined"
STATE_EXPIRED = "Expired"
STATE_CANCELLED_CUSTOMER = "Cancelled by customer"
STATE_CANCELLED_RESTAURANT = "Cancelled by restaurant"
STATE_COMPLETED = "Completed"
STATE_NO_SHOW = "No-show"

ACTIVE_HOLD_STATES = (STATE_PENDING, STATE_CONFIRMED)


def current_vn_time() -> datetime:
    return datetime.now(VN_TZ)


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=VN_TZ)
    return dt.astimezone(VN_TZ)


def _raise_api_error(
    status_code: int,
    code: str,
    message: str,
    **extra: Any,
) -> HTTPException:
    detail: dict[str, Any] = {
        "code": code,
        "message": message,
        "request_id": uuid4().hex[:12],
        **extra,
    }
    return HTTPException(status_code=status_code, detail=detail)


def _parse_hhmm(raw: str) -> time | None:
    parts = raw.strip().split(":")
    if len(parts) != 2:
        return None
    try:
        hour, minute = int(parts[0]), int(parts[1])
        return time(hour=hour, minute=minute)
    except ValueError:
        return None


def _generate_venue_slots(venue_obj: VenueModel) -> list[tuple[str, int]]:
    """Build ordered 30-minute time slots from venue opening hours and promos."""
    venue: Any = venue_obj
    discount_map: dict[str, int] = {}
    for slot in venue.available_slots or []:
        t_str = str(slot.get("time", "")).strip()
        if t_str:
            discount_map[t_str] = int(slot.get("discount_percent", 0))

    open_str, close_str = "10:00", "22:00"
    if venue.opening_hours and "-" in venue.opening_hours:
        raw_parts = [p.strip() for p in venue.opening_hours.split("-", maxsplit=1)]
        if len(raw_parts) == 2 and _parse_hhmm(raw_parts[0]) and _parse_hhmm(
            raw_parts[1]
        ):
            open_str, close_str = raw_parts[0], raw_parts[1]

    open_t = _parse_hhmm(open_str) or time(10, 0)
    close_t = _parse_hhmm(close_str) or time(22, 0)

    base_date = date(2026, 1, 1)
    cursor = datetime.combine(base_date, open_t)
    end_dt = datetime.combine(base_date, close_t)
    if end_dt <= cursor:
        end_dt = cursor + timedelta(hours=12)

    slots: list[tuple[str, int]] = []
    while cursor < end_dt:
        hhmm = cursor.strftime("%H:%M")
        slots.append((hhmm, discount_map.get(hhmm, 0)))
        cursor += timedelta(minutes=30)
    return slots


def _reserved_datetime(reserved_date: str, reserved_time: str) -> datetime:
    d_obj = date.fromisoformat(reserved_date)
    t_obj = _parse_hhmm(reserved_time)
    if t_obj is None:
        raise ValueError("Invalid time")
    return datetime.combine(d_obj, t_obj, tzinfo=VN_TZ)


def _append_history(
    db: Session,
    reservation_id: str,
    from_state: str | None,
    to_state: str,
    actor_id: str,
    actor_role: str,
    reason: str,
    timestamp: datetime,
) -> ReservationStatusHistoryModel:
    entry = ReservationStatusHistoryModel(
        id=f"rhist-{uuid4().hex[:12]}",
        reservation_id=reservation_id,
        from_state=from_state,
        to_state=to_state,
        actor_id=actor_id,
        actor_role=actor_role,
        reason=reason,
        created_at=timestamp,
    )
    db.add(entry)
    return entry


def _expire_if_stale(
    db: Session,
    reservation_obj: ReservationModel,
    now: datetime,
) -> bool:
    reservation: Any = reservation_obj
    if (
        reservation.status == STATE_PENDING
        and now > _ensure_aware(reservation.response_deadline)
    ):
        prev = reservation.status
        reservation.status = STATE_EXPIRED
        reservation.updated_at = now
        _append_history(
            db=db,
            reservation_id=reservation.id,
            from_state=prev,
            to_state=STATE_EXPIRED,
            actor_id="system",
            actor_role="system",
            reason="Partner response window (30 minutes) elapsed.",
            timestamp=now,
        )
        return True
    return False


def _expire_slot_pending(
    db: Session,
    venue_id: str,
    reserved_date: str,
    reserved_time: str,
    now: datetime,
) -> None:
    pending_rows = (
        db.query(ReservationModel)
        .filter(
            ReservationModel.venue_id == venue_id,
            ReservationModel.reserved_date == reserved_date,
            ReservationModel.reserved_time == reserved_time,
            ReservationModel.status == STATE_PENDING,
        )
        .all()
    )
    changed = False
    for row in pending_rows:
        if _expire_if_stale(db, row, now):
            changed = True
    if changed:
        db.flush()


def _occupied_seats(
    db: Session,
    venue_id: str,
    reserved_date: str,
    reserved_time: str,
    exclude_reservation_id: str | None = None,
) -> int:
    rows: list[Any] = (
        db.query(ReservationModel)
        .filter(
            ReservationModel.venue_id == venue_id,
            ReservationModel.reserved_date == reserved_date,
            ReservationModel.reserved_time == reserved_time,
            ReservationModel.status.in_(ACTIVE_HOLD_STATES),
        )
        .all()
    )
    return sum(
        int(r.party_size) for r in rows if str(r.id) != exclude_reservation_id
    )


def _get_approved_venue(
    db: Session, venue_id: str, lock_row: bool = False
) -> VenueModel:
    query = db.query(VenueModel).filter(
        VenueModel.id == venue_id,
        VenueModel.status == "approved",
    )
    if (
        lock_row
        and db.bind is not None
        and db.bind.dialect.name == "postgresql"
    ):
        query = query.with_for_update()
    venue = query.first()
    if venue is None:
        raise _raise_api_error(
            404,
            "VENUE_NOT_FOUND",
            "Approved venue not found.",
        )
    return venue


def _to_reservation_out(
    reservation_obj: ReservationModel,
    venue_obj: VenueModel | None = None,
) -> ReservationOut:
    reservation: Any = reservation_obj
    target_venue: Any = venue_obj or reservation.venue
    history_items = [
        ReservationStatusHistoryOut.model_validate(h)
        for h in sorted(
            list(reservation.status_history),
            key=lambda item: _ensure_aware(item.created_at),
        )
    ]
    return ReservationOut(
        id=reservation.id,
        reservation_code=reservation.reservation_code,
        venue_id=reservation.venue_id,
        venue_name=target_venue.name if target_venue else "",
        venue_hotline=target_venue.contact_phone if target_venue else "",
        customer_id=reservation.customer_id,
        customer_name=reservation.customer_name,
        customer_phone=reservation.customer_phone,
        reserved_date=reservation.reserved_date,
        reserved_time=reservation.reserved_time,
        party_size=reservation.party_size,
        special_requests=reservation.special_requests,
        status=reservation.status,
        response_deadline=_ensure_aware(reservation.response_deadline),
        cancellation_deadline=_ensure_aware(reservation.cancellation_deadline),
        created_at=_ensure_aware(reservation.created_at),
        updated_at=_ensure_aware(reservation.updated_at),
        status_history=history_items,
    )


def get_venue_availability(
    db: Session,
    venue_id: str,
    reserved_date: str,
    party_size: int,
    now: datetime | None = None,
) -> VenueAvailabilityOut:
    ref_now = now or current_vn_time()
    venue: Any = _get_approved_venue(db, venue_id, lock_row=False)

    try:
        target_date = date.fromisoformat(reserved_date)
    except ValueError as exc:
        raise _raise_api_error(
            422,
            "INVALID_DATE",
            "Date must use YYYY-MM-DD format.",
        ) from exc

    if target_date < ref_now.date():
        raise _raise_api_error(
            422,
            "PAST_DATE",
            "Reservation date cannot be in the past.",
        )

    if party_size < 1 or party_size > 50 or party_size > venue.max_capacity:
        raise _raise_api_error(
            422,
            "PARTY_SIZE_OUT_OF_RANGE",
            f"Party size must be between 1 and {min(50, venue.max_capacity)}.",
        )

    slots_cfg = _generate_venue_slots(venue)
    slot_items: list[SlotAvailabilityItemOut] = []
    for slot_time, discount in slots_cfg:
        _expire_slot_pending(db, venue.id, reserved_date, slot_time, ref_now)
        used = _occupied_seats(db, venue.id, reserved_date, slot_time)
        remaining = max(0, venue.max_capacity - used)
        slot_dt = _reserved_datetime(reserved_date, slot_time)
        is_past_slot = target_date == ref_now.date() and slot_dt <= ref_now
        is_available = (not is_past_slot) and remaining >= party_size
        slot_items.append(
            SlotAvailabilityItemOut(
                time=slot_time,
                status="Available" if is_available else "Sold out",
                remaining_capacity=remaining,
                total_capacity=venue.max_capacity,
                is_blocked=False,
                discount_percent=discount,
            )
        )
    db.commit()

    return VenueAvailabilityOut(
        venue_id=venue.id,
        date=reserved_date,
        party_size=party_size,
        slots=slot_items,
    )


def create_reservation(
    db: Session,
    actor: ActorContext,
    payload: ReservationCreateIn,
    now: datetime | None = None,
) -> tuple[ReservationOut, bool]:
    ref_now = now or current_vn_time()

    if payload.idempotency_key:
        existing = (
            db.query(ReservationModel)
            .options(
                selectinload(ReservationModel.status_history),
                selectinload(ReservationModel.venue),
            )
            .filter(
                ReservationModel.customer_id == actor.user_id,
                ReservationModel.idempotency_key == payload.idempotency_key,
            )
            .first()
        )
        if existing is not None:
            return _to_reservation_out(existing), False

    venue: Any = _get_approved_venue(db, payload.venue_id, lock_row=True)

    try:
        reserved_dt = _reserved_datetime(
            payload.reserved_date, payload.reserved_time
        )
    except ValueError as exc:
        raise _raise_api_error(
            422,
            "INVALID_DATETIME",
            "Invalid reservation date or time slot.",
        ) from exc

    if reserved_dt <= ref_now:
        raise _raise_api_error(
            422,
            "PAST_DATETIME",
            "Reservation date and time must be in the future.",
        )

    if payload.party_size > venue.max_capacity:
        raise _raise_api_error(
            422,
            "PARTY_SIZE_EXCEEDS_CAPACITY",
            f"Party size exceeds venue maximum capacity ({venue.max_capacity}).",
        )

    valid_slots = [t for t, _disc in _generate_venue_slots(venue)]
    if payload.reserved_time not in valid_slots:
        raise _raise_api_error(
            422,
            "INVALID_SLOT",
            "Requested time must align with venue 30-minute service slots.",
        )

    _expire_slot_pending(
        db, venue.id, payload.reserved_date, payload.reserved_time, ref_now
    )
    used = _occupied_seats(
        db, venue.id, payload.reserved_date, payload.reserved_time
    )
    remaining = venue.max_capacity - used
    if remaining < payload.party_size:
        idx = valid_slots.index(payload.reserved_time)
        adjacent: list[str] = []
        for offset in (-1, 1):
            adj_idx = idx + offset
            if 0 <= adj_idx < len(valid_slots):
                adj_time = valid_slots[adj_idx]
                _expire_slot_pending(
                    db, venue.id, payload.reserved_date, adj_time, ref_now
                )
                adj_rem = venue.max_capacity - _occupied_seats(
                    db, venue.id, payload.reserved_date, adj_time
                )
                if adj_rem >= payload.party_size:
                    adjacent.append(adj_time)
        raise _raise_api_error(
            409,
            "SLOT_FULL",
            "Selected time slot does not have enough remaining capacity.",
            suggested_slots=adjacent,
        )

    res_id = f"res-{uuid4().hex[:10]}"
    res_code = f"DV-{uuid4().hex[:6].upper()}"
    response_deadline = ref_now + timedelta(minutes=30)
    cancellation_deadline = reserved_dt - timedelta(hours=2)

    reservation = ReservationModel(
        id=res_id,
        reservation_code=res_code,
        venue_id=venue.id,
        customer_id=actor.user_id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        reserved_date=payload.reserved_date,
        reserved_time=payload.reserved_time,
        party_size=payload.party_size,
        special_requests=payload.special_requests.strip(),
        status=STATE_PENDING,
        idempotency_key=payload.idempotency_key,
        response_deadline=response_deadline,
        cancellation_deadline=cancellation_deadline,
        created_at=ref_now,
        updated_at=ref_now,
    )
    db.add(reservation)
    db.flush()
    _append_history(
        db=db,
        reservation_id=res_id,
        from_state=None,
        to_state=STATE_PENDING,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason="Customer submitted table reservation request.",
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(reservation)
    return _to_reservation_out(reservation, venue), True


def _load_reservation_or_404(
    db: Session, reservation_id: str
) -> ReservationModel:
    row = (
        db.query(ReservationModel)
        .options(
            selectinload(ReservationModel.status_history),
            selectinload(ReservationModel.venue),
        )
        .filter(ReservationModel.id == reservation_id)
        .first()
    )
    if row is None:
        raise _raise_api_error(
            404,
            "RESERVATION_NOT_FOUND",
            "Reservation not found.",
        )
    return row


def list_customer_reservations(
    db: Session,
    actor: ActorContext,
    status_filter: str | None = None,
    page: int = 1,
    page_size: int = 20,
    now: datetime | None = None,
) -> ReservationListResponse:
    ref_now = now or current_vn_time()
    all_rows: list[Any] = (
        db.query(ReservationModel)
        .options(
            selectinload(ReservationModel.status_history),
            selectinload(ReservationModel.venue),
        )
        .filter(ReservationModel.customer_id == actor.user_id)
        .order_by(ReservationModel.created_at.desc())
        .all()
    )

    changed = False
    for row in all_rows:
        if _expire_if_stale(db, row, ref_now):
            changed = True
    if changed:
        db.commit()

    if status_filter:
        all_rows = [r for r in all_rows if r.status == status_filter]

    total = len(all_rows)
    start = (page - 1) * page_size
    paged = all_rows[start : start + page_size]
    return ReservationListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[_to_reservation_out(r) for r in paged],
    )


def get_customer_reservation(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    if row.customer_id != actor.user_id:
        raise _raise_api_error(
            403,
            "FORBIDDEN_RESERVATION",
            "You can only inspect your own reservations.",
        )
    if _expire_if_stale(db, row, ref_now):
        db.commit()
    return _to_reservation_out(row)


def cancel_by_customer(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    reason: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    if row.customer_id != actor.user_id:
        raise _raise_api_error(
            403,
            "FORBIDDEN_RESERVATION",
            "You can only cancel your own reservations.",
        )

    if _expire_if_stale(db, row, ref_now):
        db.commit()
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            "Reservation has expired and cannot be cancelled.",
        )

    if row.status != STATE_CONFIRMED:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot cancel reservation in state '{row.status}'.",
        )

    if ref_now > _ensure_aware(row.cancellation_deadline):
        hotline = row.venue.contact_phone if row.venue else ""
        raise _raise_api_error(
            409,
            "CANCELLATION_CUTOFF_PASSED",
            "Less than 2 hours remain before reserved time. Contact restaurant.",
            venue_hotline=hotline,
        )

    prev = row.status
    row.status = STATE_CANCELLED_CUSTOMER
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_CANCELLED_CUSTOMER,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason=reason.strip(),
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row)


def _enforce_partner_ownership(actor: ActorContext, venue_id: str) -> None:
    if venue_id not in actor.owned_venue_ids:
        raise _raise_api_error(
            403,
            "FORBIDDEN_VENUE",
            "Partner staff is not authorized for this venue.",
        )


def partner_confirm(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    _enforce_partner_ownership(actor, str(row.venue_id))

    if _expire_if_stale(db, row, ref_now):
        db.commit()
        raise _raise_api_error(
            409,
            "RESERVATION_EXPIRED",
            "30-minute partner response window has expired.",
        )

    if row.status != STATE_PENDING:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot confirm reservation in state '{row.status}'.",
        )

    venue: Any = _get_approved_venue(db, str(row.venue_id), lock_row=True)
    _expire_slot_pending(
        db, venue.id, row.reserved_date, row.reserved_time, ref_now
    )
    used_other = _occupied_seats(
        db,
        venue.id,
        row.reserved_date,
        row.reserved_time,
        exclude_reservation_id=row.id,
    )
    if venue.max_capacity - used_other < row.party_size:
        raise _raise_api_error(
            409,
            "INSUFFICIENT_CAPACITY",
            "Remaining slot capacity is insufficient to confirm this booking.",
        )

    prev = row.status
    row.status = STATE_CONFIRMED
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_CONFIRMED,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason="Partner staff confirmed reservation after capacity recheck.",
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row, venue)


def partner_decline(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    reason: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    _enforce_partner_ownership(actor, row.venue_id)

    if _expire_if_stale(db, row, ref_now):
        db.commit()
        raise _raise_api_error(
            409,
            "RESERVATION_EXPIRED",
            "30-minute partner response window has expired.",
        )

    if row.status != STATE_PENDING:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot decline reservation in state '{row.status}'.",
        )

    prev = row.status
    row.status = STATE_DECLINED
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_DECLINED,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason=reason.strip(),
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row)


def partner_cancel(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    reason: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    _enforce_partner_ownership(actor, row.venue_id)

    if row.status != STATE_CONFIRMED:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot operationally cancel reservation in state '{row.status}'.",
        )

    prev = row.status
    row.status = STATE_CANCELLED_RESTAURANT
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_CANCELLED_RESTAURANT,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason=reason.strip(),
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row)


def partner_check_in(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    _enforce_partner_ownership(actor, row.venue_id)

    if row.status != STATE_CONFIRMED:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot check in reservation in state '{row.status}'.",
        )

    reserved_dt = _reserved_datetime(row.reserved_date, row.reserved_time)
    window_start = reserved_dt - timedelta(minutes=30)
    window_end = reserved_dt + timedelta(minutes=30)
    if ref_now < window_start or ref_now > window_end:
        raise _raise_api_error(
            409,
            "OUTSIDE_CHECKIN_WINDOW",
            "Check-in allowed only within +-30 minutes of reserved time.",
        )

    prev = row.status
    row.status = STATE_COMPLETED
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_COMPLETED,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason="Partner validated customer arrival and check-in.",
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row)


def partner_no_show(
    db: Session,
    actor: ActorContext,
    reservation_id: str,
    reason: str = "",
    now: datetime | None = None,
) -> ReservationOut:
    ref_now = now or current_vn_time()
    row: Any = _load_reservation_or_404(db, reservation_id)
    _enforce_partner_ownership(actor, row.venue_id)

    if row.status != STATE_CONFIRMED:
        raise _raise_api_error(
            409,
            "INVALID_STATE_TRANSITION",
            f"Cannot mark no-show for reservation in state '{row.status}'.",
        )

    reserved_dt = _reserved_datetime(row.reserved_date, row.reserved_time)
    grace_end = reserved_dt + timedelta(minutes=30)
    if ref_now <= grace_end:
        raise _raise_api_error(
            409,
            "GRACE_PERIOD_ACTIVE",
            "30-minute arrival grace period has not elapsed yet.",
        )

    prev = row.status
    row.status = STATE_NO_SHOW
    row.updated_at = ref_now
    _append_history(
        db=db,
        reservation_id=row.id,
        from_state=prev,
        to_state=STATE_NO_SHOW,
        actor_id=actor.user_id,
        actor_role=actor.role,
        reason=reason.strip()
        or "Customer did not arrive within 30-minute grace period.",
        timestamp=ref_now,
    )
    db.commit()
    db.refresh(row)
    return _to_reservation_out(row)


def admin_search_reservations(
    db: Session,
    q: str | None = None,
    venue_id: str | None = None,
    status_filter: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> ReservationListResponse:
    query = db.query(ReservationModel).options(
        selectinload(ReservationModel.status_history),
        selectinload(ReservationModel.venue),
    )
    if venue_id:
        query = query.filter(ReservationModel.venue_id == venue_id)
    if status_filter:
        query = query.filter(ReservationModel.status == status_filter)
    if q and q.strip():
        like = f"%{q.strip()}%"
        query = query.filter(
            or_(
                ReservationModel.id.ilike(like),
                ReservationModel.reservation_code.ilike(like),
                ReservationModel.customer_id.ilike(like),
                ReservationModel.customer_name.ilike(like),
            )
        )

    rows = query.order_by(ReservationModel.created_at.desc()).all()
    total = len(rows)
    start = (page - 1) * page_size
    paged = rows[start : start + page_size]
    return ReservationListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[_to_reservation_out(r) for r in paged],
    )


def admin_get_reservation(
    db: Session, reservation_id: str
) -> ReservationOut:
    row = _load_reservation_or_404(db, reservation_id)
    return _to_reservation_out(row)
