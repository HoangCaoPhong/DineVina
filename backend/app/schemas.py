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
