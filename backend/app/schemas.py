from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TimeSlotInfo(BaseModel):
    time: str
    discount_percent: int = 0
    remaining_tables: int = 4


class DishOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    venue_id: str
    category_name: str
    name: str
    description: str
    price_vnd: int
    image_url: str
    dietary_tags: list[str] = Field(default_factory=list)
    is_signature: bool = False
    is_available: bool = True


class MenuCategoryOut(BaseModel):
    category_name: str
    dishes: list[DishOut]


class VenueSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    tagline: str
    description: str
    address: str
    district: str
    city: str
    cuisine: str
    price_range: str
    min_budget_vnd: int
    max_budget_vnd: int
    max_capacity: int
    rating: float
    review_count: int
    cover_image: str
    amenities: list[str] = Field(default_factory=list)
    opening_hours: str
    status: str
    is_sample: bool
    sample_label: str
    signature_dishes_preview: list[str] = Field(default_factory=list)


class VenueDetailOut(VenueSummaryOut):
    gallery_images: list[str] = Field(default_factory=list)
    contact_phone: str
    cancellation_policy: str
    available_slots: list[TimeSlotInfo] = Field(default_factory=list)
    dishes: list[DishOut] = Field(default_factory=list)
    menu_categories: list[MenuCategoryOut] = Field(default_factory=list)


class AppliedFiltersOut(BaseModel):
    q: str | None = None
    district: str | None = None
    cuisine: str | None = None
    min_budget: int | None = None
    max_budget: int | None = None
    party_size: int | None = None
    amenity: str | None = None
    sort: str = "rating"


class FilterOptionsOut(BaseModel):
    districts: list[str]
    cuisines: list[str]
    amenities: list[str]
    min_budget_vnd: int
    max_budget_vnd: int
    max_capacity: int
    total_approved_venues: int


class VenueListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[VenueSummaryOut]
    filters_applied: AppliedFiltersOut
    available_filters: FilterOptionsOut


class OperatingHourItem(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    open_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    close_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    is_active: bool = True


class AvailabilitySettingsUpdateIn(BaseModel):
    default_slot_capacity: int = Field(ge=1)
    operating_hours: list[OperatingHourItem] = Field(default_factory=list)
    expected_revision: int | None = None


class BlockedSlotCreateIn(BaseModel):
    blocked_date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    start_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    end_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    reason: str = Field(min_length=1, max_length=500)


class BlockedSlotOut(BaseModel):
    id: str
    venue_id: str
    blocked_date: str
    start_time: str
    end_time: str
    reason: str
    status: str
    created_by: str
    created_at: datetime | None = None
    cancelled_by: str | None = None
    cancelled_at: datetime | None = None
    affected_pending_reservation_ids: list[str] = Field(default_factory=list)


class AvailabilitySettingsOut(BaseModel):
    venue_id: str
    venue_name: str
    max_capacity: int
    default_slot_capacity: int
    slot_granularity_minutes: int
    revision: int
    updated_by: str
    updated_at: datetime | None = None
    operating_hours: list[OperatingHourItem]
    blocked_slots: list[BlockedSlotOut]


class SlotAvailabilityItemOut(BaseModel):
    time: str
    status: str
    remaining_capacity: int
    total_capacity: int
    is_blocked: bool = False
    discount_percent: int = 0


class VenueAvailabilityOut(BaseModel):
    venue_id: str
    date: str
    party_size: int
    slot_granularity_minutes: int
    closed_reason: str | None = None
    slots: list[SlotAvailabilityItemOut]


class DashboardReservationOut(BaseModel):
    id: str
    reservation_code: str
    customer_name: str
    customer_phone: str
    reserved_date: str
    reserved_time: str
    party_size: int
    status: str
    special_requests: str
    response_deadline: datetime | None = None
    created_at: datetime | None = None


class DashboardEventOut(BaseModel):
    id: str
    inquiry_code: str
    customer_name: str
    occasion: str
    preferred_date: str
    party_size: int
    budget_min_vnd: int
    budget_max_vnd: int
    status: str
    special_needs: str
    last_message_preview: str
    updated_at: datetime | None = None


class DashboardReservationQueue(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[DashboardReservationOut]


class DashboardEventQueue(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[DashboardEventOut]


class DashboardSummaryOut(BaseModel):
    pending_reservations: int
    confirmed_today: int
    open_event_inquiries: int
    seats_reserved_today: int
    active_blocked_slots_next_7_days: int
    nearest_response_deadline: datetime | None = None


class PartnerDashboardOut(BaseModel):
    venue_id: str
    venue_name: str
    generated_at: datetime
    summary: DashboardSummaryOut
    reservation_queue: DashboardReservationQueue
    event_queue: DashboardEventQueue
