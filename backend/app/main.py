from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from .auth import ActorContext, require_roles
from .database import Base, SessionLocal, engine, get_db
from .models import DishModel, VenueModel
from .reservations_service import (
    admin_get_reservation,
    admin_search_reservations,
    cancel_by_customer,
    create_reservation,
    get_customer_reservation,
    get_venue_availability,
    list_customer_reservations,
    partner_cancel,
    partner_check_in,
    partner_confirm,
    partner_decline,
    partner_no_show,
)
from .schemas import (
    AppliedFiltersOut,
    DishOut,
    FilterOptionsOut,
    MenuCategoryOut,
    ReservationCreateIn,
    ReservationListResponse,
    ReservationNoShowIn,
    ReservationOut,
    ReservationReasonIn,
    TimeSlotInfo,
    VenueAvailabilityOut,
    VenueDetailOut,
    VenueListResponse,
    VenueSummaryOut,
)
from .seed import seed_f3_database, seed_f5_database

_DB_INITIALIZED = False
_DB_DEPENDENCY = Depends(get_db)
_CUSTOMER_ACTOR = Depends(require_roles("customer"))
_PARTNER_ACTOR = Depends(require_roles("partner_staff"))
_ADMIN_ACTOR = Depends(require_roles("administrator"))


def ensure_db_seeded() -> None:
    global _DB_INITIALIZED
    if _DB_INITIALIZED:
        return
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        seed_f3_database(session, force_refresh=False)
        seed_f5_database(session, force_refresh=False)
    _DB_INITIALIZED = True


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    ensure_db_seeded()
    yield


app = FastAPI(
    title="DineVina API",
    version="0.2.0",
    description=(
        "DineVina Backend API — PA3 Functional Group F3 "
        "(Restaurant Discovery and Venue Details)"
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _build_venue_summary(venue: VenueModel) -> VenueSummaryOut:
    venue_any: Any = venue
    dishes_list: list[Any] = list(venue_any.dishes or [])
    signature_names = [
        str(d.name) for d in dishes_list if d.is_signature and d.is_available
    ]
    if not signature_names:
        signature_names = [str(d.name) for d in dishes_list if d.is_available][:3]

    base_summary = VenueSummaryOut.model_validate(venue)
    return base_summary.model_copy(
        update={
            "amenities": list(base_summary.amenities or []),
            "signature_dishes_preview": signature_names[:4],
        }
    )


def _compute_filter_options(db: Session) -> FilterOptionsOut:
    approved_venues = (
        db.query(VenueModel).filter(VenueModel.status == "approved").all()
    )
    if not approved_venues:
        return FilterOptionsOut(
            districts=[],
            cuisines=[],
            amenities=[],
            min_budget_vnd=0,
            max_budget_vnd=0,
            max_capacity=0,
            total_approved_venues=0,
        )

    summaries = [VenueSummaryOut.model_validate(v) for v in approved_venues]
    districts = sorted({s.district for s in summaries if s.district})
    cuisines = sorted({s.cuisine for s in summaries if s.cuisine})
    amenities_set: set[str] = set()
    for s in summaries:
        for item in s.amenities or []:
            if item:
                amenities_set.add(item)

    min_budget_val = min(s.min_budget_vnd for s in summaries)
    max_budget_val = max(s.max_budget_vnd for s in summaries)
    max_cap_val = max(s.max_capacity for s in summaries)

    return FilterOptionsOut(
        districts=districts,
        cuisines=cuisines,
        amenities=sorted(amenities_set),
        min_budget_vnd=min_budget_val,
        max_budget_vnd=max_budget_val,
        max_capacity=max_cap_val,
        total_approved_venues=len(summaries),
    )


@app.get("/api/health")
def health() -> dict[str, str]:
    ensure_db_seeded()
    return {"status": "ok"}


@app.get("/api/venues/filters", response_model=FilterOptionsOut)
def get_venue_filter_options(db: Session = _DB_DEPENDENCY) -> FilterOptionsOut:
    """
    Returns distinct districts, cuisines, amenities, budget bounds, and maximum capacity
    aggregated strictly from administrator-approved venues (`status == 'approved'`).
    """
    ensure_db_seeded()
    return _compute_filter_options(db)


@app.get("/api/venues", response_model=VenueListResponse)
@app.get("/api/v1/restaurants/search", response_model=VenueListResponse)
def list_approved_venues(
    q: str | None = Query(
        default=None,
        description="Từ khóa tìm kiếm theo tên nhà hàng, món ăn, ẩm thực, khu vực",
    ),
    district: str | None = Query(
        default=None,
        description="Quận / khu vực tại TP. Hồ Chí Minh",
    ),
    cuisine: str | None = Query(
        default=None,
        description="Phong cách ẩm thực",
    ),
    min_budget: int | None = Query(
        default=None,
        ge=0,
        description="Ngân sách tối thiểu mỗi khách (VNĐ)",
    ),
    max_budget: int | None = Query(
        default=None,
        ge=0,
        description="Ngân sách tối đa mỗi khách (VNĐ)",
    ),
    party_size: int | None = Query(
        default=None,
        ge=1,
        le=1000,
        description="Số lượng khách dự kiến",
    ),
    amenity: str | None = Query(
        default=None,
        description="Tiện ích yêu cầu (ví dụ: Phòng riêng VIP, Bãi đỗ xe ô tô)",
    ),
    sort: str = Query(
        default="rating",
        pattern="^(rating|price_asc|price_desc|capacity|name)$",
        description="Tiêu chí sắp xếp: rating | price_asc | price_desc | capacity | name",
    ),
    page: int = Query(default=1, ge=1, description="Trang hiện tại"),
    page_size: int = Query(
        default=20, ge=1, le=50, description="Số lượng kết quả mỗi trang"
    ),
    db: Session = _DB_DEPENDENCY,
) -> VenueListResponse:
    """
    F3 Restaurant Discovery Endpoint.
    Strictly filters `VenueModel.status == 'approved'` and supports combined search,
    district, cuisine, budget range, party size capacity, and amenity filtering.
    """
    ensure_db_seeded()

    if (
        min_budget is not None
        and max_budget is not None
        and min_budget > max_budget
    ):
        raise HTTPException(
            status_code=422,
            detail="Ngân sách tối thiểu (min_budget) không được lớn hơn ngân sách tối đa (max_budget).",
        )

    query = (
        db.query(VenueModel)
        .options(selectinload(VenueModel.dishes))
        .filter(VenueModel.status == "approved")
    )

    clean_district = (
        district.strip()
        if district and district.strip().lower() not in ("", "all", "tat-ca")
        else None
    )
    clean_cuisine = (
        cuisine.strip()
        if cuisine and cuisine.strip().lower() not in ("", "all", "tat-ca")
        else None
    )
    clean_q = q.strip() if q and q.strip() else None
    clean_amenity = (
        amenity.strip()
        if amenity and amenity.strip().lower() not in ("", "all", "tat-ca")
        else None
    )

    CUISINE_SYNONYMS = {
        "món việt": "Việt",
        "món nhật": "Nhật",
        "món chay": "Chay",
        "nướng": "Nướng",
        "lẩu": "Lẩu",
        "hải sản": "Hải sản",
    }
    AMENITY_SYNONYMS = {
        "bãi đỗ xe": ["chỗ đậu ô tô", "bãi đỗ xe"],
        "sân vườn": ["bàn ngoài trời", "sân vườn"],
        "phòng vip": ["phòng riêng", "phòng vip"],
    }

    if clean_district:
        query = query.filter(VenueModel.district.ilike(f"%{clean_district}%"))

    if clean_cuisine:
        effective_cuisine = CUISINE_SYNONYMS.get(clean_cuisine.lower(), clean_cuisine)
        query = query.filter(VenueModel.cuisine.ilike(f"%{effective_cuisine}%"))

    if min_budget is not None:
        query = query.filter(VenueModel.max_budget_vnd >= min_budget)

    if max_budget is not None:
        query = query.filter(VenueModel.min_budget_vnd <= max_budget)

    if party_size is not None:
        query = query.filter(VenueModel.max_capacity >= party_size)

    if clean_q:
        like_pattern = f"%{clean_q}%"
        matching_dish_venue_ids = (
            select(DishModel.venue_id)
            .where(
                or_(
                    DishModel.name.ilike(like_pattern),
                    DishModel.description.ilike(like_pattern),
                    DishModel.category_name.ilike(like_pattern),
                )
            )
            .distinct()
        )
        query = query.filter(
            or_(
                VenueModel.name.ilike(like_pattern),
                VenueModel.tagline.ilike(like_pattern),
                VenueModel.description.ilike(like_pattern),
                VenueModel.cuisine.ilike(like_pattern),
                VenueModel.district.ilike(like_pattern),
                VenueModel.address.ilike(like_pattern),
                VenueModel.id.in_(matching_dish_venue_ids),
            )
        )

    candidates = query.all()

    if clean_amenity:
        amenity_needles = AMENITY_SYNONYMS.get(
            clean_amenity.lower(), [clean_amenity.lower()]
        )
        candidates = [
            v
            for v in candidates
            if any(
                needle in (item or "").lower()
                for item in (v.amenities or [])
                for needle in amenity_needles
            )
        ]

    if sort == "price_asc":
        candidates.sort(key=lambda v: (v.min_budget_vnd, -v.rating, v.name))
    elif sort == "price_desc":
        candidates.sort(key=lambda v: (-v.max_budget_vnd, -v.rating, v.name))
    elif sort == "capacity":
        candidates.sort(key=lambda v: (-v.max_capacity, -v.rating, v.name))
    elif sort == "name":
        candidates.sort(key=lambda v: v.name.lower())
    else:
        candidates.sort(key=lambda v: (-v.rating, -v.review_count, v.name))

    total = len(candidates)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_venues = candidates[start_idx:end_idx]

    items = [_build_venue_summary(v) for v in paged_venues]

    return VenueListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=items,
        filters_applied=AppliedFiltersOut(
            q=clean_q,
            district=clean_district,
            cuisine=clean_cuisine,
            min_budget=min_budget,
            max_budget=max_budget,
            party_size=party_size,
            amenity=clean_amenity,
            sort=sort,
        ),
        available_filters=_compute_filter_options(db),
    )


@app.get("/api/venues/{venue_id}", response_model=VenueDetailOut)
@app.get("/api/v1/restaurants/{venue_id}", response_model=VenueDetailOut)
def get_approved_venue_detail(
    venue_id: str,
    db: Session = _DB_DEPENDENCY,
) -> VenueDetailOut:
    """
    Returns full venue metadata and categorized menu dishes for an approved venue
    by either `id` (e.g., `vn-001`) or `slug` (e.g., `an-viet-garden-dong-khoi`).
    Returns 404 if the venue does not exist or has not been approved by an administrator.
    """
    ensure_db_seeded()

    venue = (
        db.query(VenueModel)
        .options(selectinload(VenueModel.dishes))
        .filter(
            or_(VenueModel.id == venue_id, VenueModel.slug == venue_id),
            VenueModel.status == "approved",
        )
        .first()
    )

    if venue is None:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy nhà hàng đã được duyệt hoặc nhà hàng chưa được công bố.",
        )

    summary = _build_venue_summary(venue)
    dishes_out = [DishOut.model_validate(d) for d in venue.dishes]

    category_map: dict[str, list[DishOut]] = {}
    for dish in dishes_out:
        category_map.setdefault(dish.category_name, []).append(dish)

    menu_categories = [
        MenuCategoryOut(category_name=cat_name, dishes=cat_dishes)
        for cat_name, cat_dishes in category_map.items()
    ]

    venue_any: Any = venue
    slots_out = [
        TimeSlotInfo.model_validate(slot)
        for slot in (venue_any.available_slots or [])
    ]

    return VenueDetailOut(
        **summary.model_dump(),
        gallery_images=list(venue_any.gallery_images or []),
        contact_phone=str(venue_any.contact_phone or ""),
        cancellation_policy=str(venue_any.cancellation_policy or ""),
        available_slots=slots_out,
        dishes=dishes_out,
        menu_categories=menu_categories,
    )


@app.get(
    "/api/venues/{venue_id}/availability",
    response_model=VenueAvailabilityOut,
)
def lookup_venue_availability(
    venue_id: str,
    date: str = Query(description="Reservation date (YYYY-MM-DD)"),
    party_size: int = Query(default=2, ge=1, le=50),
    db: Session = _DB_DEPENDENCY,
) -> VenueAvailabilityOut:
    """UC-C08: Return 30-minute slots and remaining seats for an approved venue."""
    ensure_db_seeded()
    return get_venue_availability(db, venue_id, date, party_size)


@app.post("/api/reservations", response_model=ReservationOut)
def submit_reservation_request(
    payload: ReservationCreateIn,
    response: Response,
    actor: ActorContext = _CUSTOMER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-C09: Create a Pending confirmation booking with atomic slot hold."""
    ensure_db_seeded()
    result, created = create_reservation(db, actor, payload)
    response.status_code = 201 if created else 200
    return result


@app.get("/api/reservations", response_model=ReservationListResponse)
def list_my_reservations(
    status: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    actor: ActorContext = _CUSTOMER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationListResponse:
    """UC-C10: List reservations owned by the signed-in Customer."""
    ensure_db_seeded()
    return list_customer_reservations(db, actor, status, page, page_size)


@app.get(
    "/api/reservations/{reservation_id}",
    response_model=ReservationOut,
)
def get_my_reservation_detail(
    reservation_id: str,
    actor: ActorContext = _CUSTOMER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-C10: Retrieve a reservation and full chronological status history."""
    ensure_db_seeded()
    return get_customer_reservation(db, actor, reservation_id)


@app.post(
    "/api/reservations/{reservation_id}/cancel",
    response_model=ReservationOut,
)
def cancel_my_reservation(
    reservation_id: str,
    payload: ReservationReasonIn,
    actor: ActorContext = _CUSTOMER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-C11: Customer cancels a Confirmed booking at least 2 hours prior."""
    ensure_db_seeded()
    return cancel_by_customer(db, actor, reservation_id, payload.reason)


@app.post(
    "/api/partner/reservations/{reservation_id}/confirm",
    response_model=ReservationOut,
)
def partner_confirm_reservation(
    reservation_id: str,
    actor: ActorContext = _PARTNER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-P06: Partner confirms a Pending confirmation reservation atomically."""
    ensure_db_seeded()
    return partner_confirm(db, actor, reservation_id)


@app.post(
    "/api/partner/reservations/{reservation_id}/decline",
    response_model=ReservationOut,
)
def partner_decline_reservation(
    reservation_id: str,
    payload: ReservationReasonIn,
    actor: ActorContext = _PARTNER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-P06 A1: Partner declines a Pending confirmation booking with reason."""
    ensure_db_seeded()
    return partner_decline(db, actor, reservation_id, payload.reason)


@app.post(
    "/api/partner/reservations/{reservation_id}/cancel",
    response_model=ReservationOut,
)
def partner_cancel_reservation(
    reservation_id: str,
    payload: ReservationReasonIn,
    actor: ActorContext = _PARTNER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-P11: Partner operationally cancels a Confirmed booking with reason."""
    ensure_db_seeded()
    return partner_cancel(db, actor, reservation_id, payload.reason)


@app.post(
    "/api/partner/reservations/{reservation_id}/check-in",
    response_model=ReservationOut,
)
def partner_check_in_reservation(
    reservation_id: str,
    actor: ActorContext = _PARTNER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-P12: Partner validates guest arrival and transitions to Completed."""
    ensure_db_seeded()
    return partner_check_in(db, actor, reservation_id)


@app.post(
    "/api/partner/reservations/{reservation_id}/no-show",
    response_model=ReservationOut,
)
def partner_mark_no_show(
    reservation_id: str,
    payload: ReservationNoShowIn | None = None,
    actor: ActorContext = _PARTNER_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-P12 A1: Partner marks No-show after the 30-minute grace period."""
    ensure_db_seeded()
    reason = payload.reason if payload is not None else ""
    return partner_no_show(db, actor, reservation_id, reason)


@app.get(
    "/api/admin/reservations/support",
    response_model=ReservationListResponse,
)
def admin_support_lookup(
    q: str | None = Query(default=None),
    venue_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    _actor: ActorContext = _ADMIN_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationListResponse:
    """UC-A04: Administrator searches reservations across venues for support."""
    ensure_db_seeded()
    return admin_search_reservations(db, q, venue_id, status, page, page_size)


@app.get(
    "/api/admin/reservations/{reservation_id}",
    response_model=ReservationOut,
)
def admin_support_detail(
    reservation_id: str,
    _actor: ActorContext = _ADMIN_ACTOR,
    db: Session = _DB_DEPENDENCY,
) -> ReservationOut:
    """UC-A04: Administrator inspects immutable chronological audit history."""
    ensure_db_seeded()
    return admin_get_reservation(db, reservation_id)
