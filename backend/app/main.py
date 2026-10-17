from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.schemas import (
    ReservationCreate,
    ReservationItem,
    EventBookingCreate,
    ReviewCreate,
    AIQueryRequest,
    LoginPayload,
    RegisterPayload
)
from app.store import store

app = FastAPI(
    title="DineVina API - Restaurant Reservation & Event Booking",
    version="0.2.0",
    description="Smart Restaurant Reservation & Event Booking System (Group 8 - CSC13002)"
)

# Enable CORS for local dev / Vite preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/system-info")
def system_info():
    return {
        "status": "ok",
        "service": "DineVina API Prototype",
        "groups_implemented": [
            "1. Accounts & Profiles",
            "2. Restaurant Onboarding",
            "3. Restaurant Discovery",
            "4. Menus",
            "5. Table Reservations",
            "6. Event Booking",
            "7. Availability & Partner Dashboard",
            "8. Promotions (Time-slot discounts)",
            "9. Intelligent Assistance (AI Search)",
            "10. Notifications",
            "11. Ratings & Reviews",
            "Cancellation Policy"
        ]
    }



# --- User & Profile (Group 1: Authentication & Profiles) ---
@app.get("/api/me")
def get_current_user():
    user = store.current_user
    if not user:
        raise HTTPException(status_code=401, detail="Chưa đăng nhập")
    return user


@app.post("/api/auth/login")
def login(payload: LoginPayload):
    user = store.login(email=payload.email, role=payload.role)
    return {"status": "success", "user": user}


@app.post("/api/auth/logout")
def logout():
    store.logout()
    return {"status": "success"}


@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterPayload):
    user = store.register(payload.model_dump())
    return {"status": "success", "user": user}


# --- Notifications (Group 10) ---
@app.get("/api/me/notifications")
def get_notifications():
    return store.notifications


@app.patch("/api/me/notifications/{notif_id}/read")
def mark_notification_read(notif_id: str):
    for n in store.notifications:
        if n["id"] == notif_id:
            n["read"] = True
            return {"status": "success", "id": notif_id}
    raise HTTPException(status_code=404, detail="Notification not found")


# --- Discovery & Venues (Group 3) ---
@app.get("/api/venues")
def list_venues(
    q: Optional[str] = None,
    district: Optional[str] = None,
    cuisine: Optional[str] = None,
    has_deal: Optional[bool] = None,
    amenity: Optional[str] = None,
    sort: Optional[str] = None,
):
    return store.list_venues(
        q=q,
        district=district,
        cuisine=cuisine,
        has_deal=has_deal,
        amenity=amenity,
        sort=sort
    )


@app.get("/api/venues/{venue_id}")
def get_venue_detail(venue_id: str):
    venue = store.get_venue(venue_id)
    if not venue:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà hàng")
    return venue


@app.get("/api/venues/{venue_id}/menu")
def get_venue_menu(venue_id: str):
    return store.get_venue_menu(venue_id)


@app.get("/api/venues/{venue_id}/reviews")
def get_venue_reviews(venue_id: str):
    return [r for r in store.reviews if r["venue_id"] == venue_id and not r.get("is_hidden", False)]


# --- Table Reservations (Group 5 & Cancellation Policy) ---
@app.post("/api/reservations", status_code=status.HTTP_201_CREATED)
def create_reservation(payload: ReservationCreate):
    try:
        res = store.create_reservation(payload.model_dump())
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/reservations")
def list_my_reservations():
    return store.reservations


@app.get("/api/reservations/{res_id}")
def get_reservation(res_id: str):
    res = next((r for r in store.reservations if r["id"] == res_id), None)
    if not res:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn đặt bàn")
    return res


class CancelPayload(BaseModel):
    reason: Optional[str] = "Khách hàng hủy bàn"


@app.post("/api/reservations/{res_id}/cancel")
def cancel_reservation(res_id: str, payload: CancelPayload = CancelPayload()):
    try:
        return store.cancel_reservation(res_id, reason=payload.reason or "Khách hàng hủy bàn")
    except KeyError:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn đặt bàn")
    except PermissionError as e:
        # 409 Conflict as specified in Kien.md for cutoff window violation
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Partner Operations (Group 7 & Group 5) ---
@app.get("/api/partner/reservations")
def get_partner_reservations():
    return store.reservations


@app.post("/api/partner/reservations/{res_id}/confirm")
def partner_confirm(res_id: str):
    try:
        return store.partner_confirm_reservation(res_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class RejectPayload(BaseModel):
    reason: str = "Hết bàn vào khung giờ này"


@app.post("/api/partner/reservations/{res_id}/reject")
def partner_reject(res_id: str, payload: RejectPayload):
    try:
        return store.partner_reject_reservation(res_id, reason=payload.reason)
    except KeyError:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/partner/dashboard")
def get_partner_dashboard():
    total_received = len(store.reservations)
    pending_count = len([r for r in store.reservations if r["status"] == "Pending"])
    confirmed_count = len([r for r in store.reservations if r["status"] == "Confirmed"])
    cancelled_count = len([r for r in store.reservations if r["status"] == "Cancelled"])
    events_count = len(store.events)

    return {
        "metrics": {
            "total_requests": total_received,
            "pending_requests": pending_count,
            "confirmed_requests": confirmed_count,
            "cancelled_requests": cancelled_count,
            "event_leads": events_count,
            "average_response_time": "14 phút"
        },
        "venues_managed": store.venues[:2],
        "recent_reservations": store.reservations[:5]
    }


# --- Event Booking (Group 6) ---
@app.post("/api/events", status_code=status.HTTP_201_CREATED)
def create_event(payload: EventBookingCreate):
    try:
        return store.create_event(payload.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/events")
def list_events():
    return store.events


class EventMessagePayload(BaseModel):
    sender_role: str
    sender_name: str
    body: str


@app.post("/api/events/{event_id}/messages")
def send_event_message(event_id: str, payload: EventMessagePayload):
    try:
        return store.add_event_message(
            event_id=event_id,
            sender_role=payload.sender_role,
            sender_name=payload.sender_name,
            body=payload.body
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")


# --- Ratings & Reviews (Group 11) ---
@app.post("/api/reservations/{res_id}/review", status_code=status.HTTP_201_CREATED)
def submit_review(res_id: str, payload: ReviewCreate):
    try:
        return store.add_review(
            reservation_id=res_id,
            rating=payload.rating,
            body=payload.body
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Đơn đặt bàn không tồn tại")
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


# --- Intelligent Assistance (Group 9) ---
@app.post("/api/ai/recommend")
def ai_recommend(payload: AIQueryRequest):
    return store.get_ai_recommendations(payload.query)


# --- Restaurant Onboarding (Group 2) ---
class VenueCreatePayload(BaseModel):
    name: str
    address: str
    district: str
    cuisine: str
    price_range: str
    opening_hours: str
    description: str
    contact_phone: str
    cover_image: Optional[str] = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"


@app.post("/api/partner/venues")
def partner_submit_venue(payload: VenueCreatePayload):
    import uuid
    v_id = f"v_{uuid.uuid4().hex[:5]}"
    new_v = {
        "id": v_id,
        "name": payload.name,
        "slug": payload.name.lower().replace(" ", "-"),
        "address": payload.address,
        "district": payload.district,
        "city": "Hồ Chí Minh",
        "cuisine": payload.cuisine,
        "price_range": payload.price_range,
        "rating": 5.0,
        "review_count": 0,
        "cover_image": payload.cover_image or "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
        "images": [payload.cover_image or "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"],
        "amenities": ["Điều hòa", "Thanh toán thẻ"],
        "status": "submitted",  # Submitted for admin approval
        "max_discount": 10,
        "deal_label": "Ưu đãi khai trương giảm 10%",
        "opening_hours": payload.opening_hours,
        "description": payload.description,
        "full_description": payload.description,
        "contact_phone": payload.contact_phone,
        "cancellation_cutoff_hours": 2,
        "available_seats": 50,
        "owner_id": "partner_new",
        "time_slots": [
            {"time": "11:30", "discount_percent": 10, "remaining_tables": 5},
            {"time": "18:00", "discount_percent": 10, "remaining_tables": 5}
        ]
    }
    store.venues.append(new_v)
    return new_v


@app.get("/api/admin/venues")
def admin_list_venues(status_filter: Optional[str] = None):
    if status_filter:
        return [v for v in store.venues if v.get("status") == status_filter]
    return store.venues


@app.post("/api/admin/venues/{venue_id}/approve")
def admin_approve_venue(venue_id: str):
    v = store.get_venue(venue_id)
    if not v:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà hàng")
    v["status"] = "approved"
    return {"status": "approved", "venue": v}


@app.post("/api/admin/venues/{venue_id}/reject")
def admin_reject_venue(venue_id: str):
    v = store.get_venue(venue_id)
    if not v:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà hàng")
    v["status"] = "rejected"
    return {"status": "rejected", "venue": v}
