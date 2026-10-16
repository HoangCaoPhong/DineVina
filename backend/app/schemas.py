from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# --- User & Profile (Group 1) ---
class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: str  # customer, partner, admin
    avatar_url: Optional[str] = None
    role_label: Optional[str] = None

class LoginPayload(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None  # for 1-click quick demo login

class RegisterPayload(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str
    role: str = "customer"

class UserPreferences(BaseModel):
    cuisines: List[str] = []
    area: Optional[str] = None
    price_range: Optional[str] = None
    party_size: int = 2

# --- Restaurant & Onboarding (Group 2, 3) ---
class VenueTimeSlotDiscount(BaseModel):
    time: str  # e.g. "11:30"
    discount_percent: int  # e.g. 50, 30, 20, 10
    remaining_tables: int

class DishItem(BaseModel):
    id: str
    category_id: str
    name: str
    description: str
    price_vnd: int
    image_url: str
    dietary_tags: List[str] = []
    available: bool = True
    is_special: bool = False

class MenuCategory(BaseModel):
    id: str
    venue_id: str
    name: str
    position: int
    dishes: List[DishItem] = []

class VenueSummary(BaseModel):
    id: str
    name: str
    slug: str
    address: str
    district: str
    city: str = "Hồ Chí Minh"
    cuisine: str
    price_range: str  # e.g. "200.000đ - 350.000đ"
    rating: float
    review_count: int
    cover_image: str
    images: List[str] = []
    amenities: List[str] = []  # "Phòng riêng", "Chỗ đỗ ô tô", "Bàn ngoài trời", "Ghế trẻ em"
    status: str = "approved"  # draft, submitted, approved, rejected, suspended
    max_discount: int = 0
    deal_label: Optional[str] = None  # "Giảm tới 50%", "Tặng món đặc biệt"
    opening_hours: str = "10:30 - 22:30"
    description: str = ""
    time_slots: List[VenueTimeSlotDiscount] = []

class VenueDetail(VenueSummary):
    full_description: str = ""
    contact_phone: str = ""
    cancellation_cutoff_hours: int = 2  # cancellation policy: 2h before
    available_seats: int = 60
    owner_id: str = "partner_1"

# --- Reservations (Group 5 & Cancellation Policy) ---
class ReservationCreate(BaseModel):
    venue_id: str
    customer_name: str
    customer_phone: str
    reserved_date: str  # YYYY-MM-DD
    reserved_time: str  # HH:mm
    party_size: int
    discount_percent: int = 0
    note: Optional[str] = None

class StatusHistoryEntry(BaseModel):
    from_status: str
    to_status: str
    actor_id: str
    actor_name: str
    reason: Optional[str] = None
    changed_at: str

class ReservationItem(BaseModel):
    id: str
    confirmation_code: str
    venue_id: str
    venue_name: str
    venue_address: str
    venue_image: str
    customer_id: str
    customer_name: str
    customer_phone: str
    reserved_date: str
    reserved_time: str
    party_size: int
    discount_percent: int = 0
    note: Optional[str] = None
    status: str  # Pending, Confirmed, Rejected, Cancelled, Completed, Expired
    created_at: str
    cancellation_cutoff_hours: int = 2
    can_cancel: bool = True
    reject_reason: Optional[str] = None
    status_history: List[StatusHistoryEntry] = []

# --- Event Bookings (Group 6) ---
class EventBookingCreate(BaseModel):
    venue_id: str
    customer_name: str
    customer_phone: str
    occasion: str  # Sinh nhật, Tiệc công ty, Họp mặt bạn bè, Thôi nôi
    headcount: int
    event_date: str
    event_time: str
    budget_range: str
    special_needs: str

class EventMessage(BaseModel):
    id: str
    sender_role: str  # customer, partner
    sender_name: str
    body: str
    created_at: str

class EventBookingItem(BaseModel):
    id: str
    venue_id: str
    venue_name: str
    customer_id: str
    customer_name: str
    customer_phone: str
    occasion: str
    headcount: int
    event_date: str
    event_time: str
    budget_range: str
    special_needs: str
    status: str  # Submitted, ClarificationRequested, ProposalSent, Accepted, Declined, Closed
    messages: List[EventMessage] = []
    created_at: str

# --- Reviews (Group 11) ---
class ReviewCreate(BaseModel):
    reservation_id: str
    rating: int  # 1 to 5
    body: str

class ReviewItem(BaseModel):
    id: str
    reservation_id: str
    venue_id: str
    customer_name: str
    rating: int
    body: str
    created_at: str
    partner_reply: Optional[str] = None
    is_hidden: bool = False

# --- Notifications (Group 10) ---
class NotificationItem(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str  # reservation, event, deal, system
    read: bool = False
    created_at: str
    link: Optional[str] = None

# --- AI Assistant (Group 9) ---
class AIQueryRequest(BaseModel):
    query: str
    district: Optional[str] = None
    party_size: Optional[int] = None
    budget: Optional[str] = None

# --- User & Authentication (Group 1) ---
class UserItem(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str
    role: str  # customer, partner, admin
    avatar_url: Optional[str] = None

class LoginPayload(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None

class RegisterPayload(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str
    role: Optional[str] = "customer"

LoginRequest = LoginPayload
RegisterRequest = RegisterPayload
