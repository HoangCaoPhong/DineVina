import copy
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.seed_data import SEED_VENUES, SEED_MENUS, SEED_REVIEWS, SEED_RESERVATIONS, SEED_NOTIFICATIONS

class DataStore:
    def __init__(self):
        self.venues: List[Dict[str, Any]] = copy.deepcopy(SEED_VENUES)
        self.menus: Dict[str, List[Dict[str, Any]]] = copy.deepcopy(SEED_MENUS)
        self.reviews: List[Dict[str, Any]] = copy.deepcopy(SEED_REVIEWS)
        self.reservations: List[Dict[str, Any]] = copy.deepcopy(SEED_RESERVATIONS)
        self.notifications: List[Dict[str, Any]] = copy.deepcopy(SEED_NOTIFICATIONS)
        self.events: List[Dict[str, Any]] = [
            {
                "id": "evt_101",
                "venue_id": "v3",
                "venue_name": "Dim Tu Tac - Ẩm Thực Quảng Đông",
                "customer_id": "cust_1",
                "customer_name": "Nguyễn Văn A",
                "customer_phone": "0912 345 678",
                "occasion": "Tiệc sinh nhật gia đình",
                "headcount": 18,
                "event_date": "2026-10-25",
                "event_time": "18:30",
                "budget_range": "8.000.000đ - 12.000.000đ",
                "special_needs": "Cần phòng VIP riêng tư, trang trí bong bóng sinh nhật cơ bản và máy chiếu phát video kỷ niệm.",
                "status": "ProposalSent",
                "messages": [
                    {
                        "id": "m1",
                        "sender_role": "customer",
                        "sender_name": "Nguyễn Văn A",
                        "body": "Chào nhà hàng, mình muốn đặt phòng riêng cho 18 người dịp sinh nhật ba mình. Nhờ nhà hàng tư vấn set menu tiệc.",
                        "created_at": "2026-10-15 09:30"
                    },
                    {
                        "id": "m2",
                        "sender_role": "partner",
                        "sender_name": "Quản lý Dim Tu Tac",
                        "body": "Dạ Dim Tu Tac xin chào quý khách. Nhà hàng có phòng VIP Hoa Mai sức chứa tối đa 22 khách, set menu Tiệc Phúc Lộc Thọ 550.000đ/người kèm Vịt quay Bắc Kinh 2 món và hỗ trợ setup backdrop sinh nhật miễn phí.",
                        "created_at": "2026-10-15 11:00"
                    }
                ],
                "created_at": "2026-10-15 09:30"
            }
        ]
        self.users = {
            "cust_1": {
                "id": "cust_1",
                "email": "khachhang@dinevina.vn",
                "full_name": "Nguyễn Văn A",
                "phone": "0912 345 678",
                "role": "customer",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                "role_label": "Thực khách VIP"
            },
            "partner_1": {
                "id": "partner_1",
                "email": "doitac@manwah.vn",
                "full_name": "Quản Lý Nhà Hàng (Manwah)",
                "phone": "028 7300 7981",
                "role": "partner",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                "role_label": "Đối tác nhà hàng"
            },
            "admin_1": {
                "id": "admin_1",
                "email": "admin@dinevina.vn",
                "full_name": "Ban Quản Trị Hệ Thống",
                "phone": "0909 888 999",
                "role": "admin",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                "role_label": "Quản trị viên hệ thống"
            }
        }
        self.current_user: Optional[Dict[str, Any]] = self.users["cust_1"]

    # --- Authentication (Group 1) ---
    def login(self, email: Optional[str] = None, role: Optional[str] = None) -> Dict[str, Any]:
        if role:
            for u in self.users.values():
                if u["role"] == role:
                    self.current_user = u
                    return u
        if email:
            clean_email = email.strip().lower()
            for u in self.users.values():
                if u["email"].lower() == clean_email:
                    self.current_user = u
                    return u
        # Fallback to customer if unknown demo email
        user_id = f"cust_{uuid.uuid4().hex[:4]}"
        new_u = {
            "id": user_id,
            "email": email or "user@dinevina.vn",
            "full_name": email.split("@")[0].capitalize() if email else "Thực khách mới",
            "phone": "0900 123 456",
            "role": "customer",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            "role_label": "Thực khách"
        }
        self.users[user_id] = new_u
        self.current_user = new_u
        return new_u

    def logout(self) -> None:
        self.current_user = None

    def register(self, data: Dict[str, Any]) -> Dict[str, Any]:
        user_id = f"user_{uuid.uuid4().hex[:4]}"
        role = data.get("role", "customer")
        new_u = {
            "id": user_id,
            "email": data["email"],
            "full_name": data["full_name"],
            "phone": data.get("phone", "0900 000 000"),
            "role": role,
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            "role_label": "Đối tác nhà hàng" if role == "partner" else "Thực khách"
        }
        self.users[user_id] = new_u
        self.current_user = new_u
        return new_u

    # --- Discovery & Venues ---
    def list_venues(
        self,
        q: Optional[str] = None,
        district: Optional[str] = None,
        cuisine: Optional[str] = None,
        has_deal: Optional[bool] = None,
        amenity: Optional[str] = None,
        sort: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = [v for v in self.venues if v.get("status") == "approved"]
        
        if q:
            term = q.strip().lower()
            results = [
                v for v in results
                if term in v["name"].lower()
                or term in v["cuisine"].lower()
                or term in v["district"].lower()
                or term in v["address"].lower()
            ]
        
        if district and district != "all":
            results = [v for v in results if district.lower() in v["district"].lower()]

        if cuisine and cuisine != "all":
            results = [v for v in results if cuisine.lower() in v["cuisine"].lower()]

        if has_deal:
            results = [v for v in results if v.get("max_discount", 0) > 0]

        if amenity and amenity != "all":
            results = [v for v in results if amenity in v.get("amenities", [])]

        if sort == "rating":
            results.sort(key=lambda x: x.get("rating", 0), reverse=True)
        elif sort == "discount":
            results.sort(key=lambda x: x.get("max_discount", 0), reverse=True)
        elif sort == "reviews":
            results.sort(key=lambda x: x.get("review_count", 0), reverse=True)

        return results

    def get_venue(self, venue_id: str) -> Optional[Dict[str, Any]]:
        for v in self.venues:
            if v["id"] == venue_id:
                return v
        return None

    def get_venue_menu(self, venue_id: str) -> List[Dict[str, Any]]:
        return self.menus.get(venue_id, [])

    # --- Reservations & Cancellation Policy ---
    def create_reservation(self, data: Dict[str, Any]) -> Dict[str, Any]:
        venue = self.get_venue(data["venue_id"])
        if not venue:
            raise ValueError("Nhà hàng không tồn tại")

        res_id = f"res_{uuid.uuid4().hex[:6]}"
        code = f"DV-{uuid.uuid4().hex[:5].upper()}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

        new_res = {
            "id": res_id,
            "confirmation_code": code,
            "venue_id": venue["id"],
            "venue_name": venue["name"],
            "venue_address": venue["address"],
            "venue_image": venue["cover_image"],
            "customer_id": "cust_1",
            "customer_name": data["customer_name"],
            "customer_phone": data["customer_phone"],
            "reserved_date": data["reserved_date"],
            "reserved_time": data["reserved_time"],
            "party_size": data["party_size"],
            "discount_percent": data.get("discount_percent", 0),
            "note": data.get("note", ""),
            "status": "Pending",
            "created_at": now_str,
            "cancellation_cutoff_hours": venue.get("cancellation_cutoff_hours", 2),
            "can_cancel": True,
            "reject_reason": None,
            "status_history": [
                {
                    "from_status": "Initial",
                    "to_status": "Pending",
                    "actor_id": "cust_1",
                    "actor_name": f"{data['customer_name']} (Khách hàng)",
                    "reason": f"Yêu cầu đặt bàn {data['party_size']} khách lúc {data['reserved_time']} ngày {data['reserved_date']}",
                    "changed_at": now_str
                }
            ]
        }
        self.reservations.insert(0, new_res)

        # Trigger notification
        self.notifications.insert(0, {
            "id": f"notif_{uuid.uuid4().hex[:6]}",
            "user_id": "cust_1",
            "title": "Đã gửi yêu cầu đặt bàn",
            "message": f"Yêu cầu đặt bàn tại {venue['name']} ({code}) đang chờ nhà hàng xác nhận.",
            "type": "reservation",
            "read": False,
            "created_at": now_str,
            "link": "/my-bookings"
        })

        return new_res

    def cancel_reservation(self, res_id: str, reason: str = "Khách hàng hủy bàn") -> Dict[str, Any]:
        res = next((r for r in self.reservations if r["id"] == res_id), None)
        if not res:
            raise KeyError("Không tìm thấy đơn đặt bàn")

        if res["status"] in ["Cancelled", "Rejected", "Completed"]:
            raise ValueError(f"Không thể hủy đơn đặt bàn đang ở trạng thái {res['status']}")

        # Cancellation Policy check:
        # If Confirmed, check cutoff window
        if res["status"] == "Confirmed":
            cutoff_hours = res.get("cancellation_cutoff_hours", 2)
            try:
                res_datetime = datetime.strptime(f"{res['reserved_date']} {res['reserved_time']}", "%Y-%m-%d %H:%M")
                if datetime.now() + timedelta(hours=cutoff_hours) > res_datetime:
                    raise PermissionError(
                        f"Không thể hủy do đã quá thời hạn cho phép hủy (Quy định: Hủy trước giờ hẹn ít nhất {cutoff_hours} tiếng)."
                    )
            except ValueError:
                pass  # if format differs, allow in demo

        old_status = res["status"]
        res["status"] = "Cancelled"
        res["can_cancel"] = False
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

        res["status_history"].append({
            "from_status": old_status,
            "to_status": "Cancelled",
            "actor_id": "cust_1",
            "actor_name": "Khách hàng",
            "reason": reason,
            "changed_at": now_str
        })

        self.notifications.insert(0, {
            "id": f"notif_{uuid.uuid4().hex[:6]}",
            "user_id": "cust_1",
            "title": "Đã hủy đặt bàn",
            "message": f"Đơn đặt bàn {res['confirmation_code']} tại {res['venue_name']} đã được hủy thành công.",
            "type": "reservation",
            "read": False,
            "created_at": now_str,
            "link": "/my-bookings"
        })

        return res

    def partner_confirm_reservation(self, res_id: str) -> Dict[str, Any]:
        res = next((r for r in self.reservations if r["id"] == res_id), None)
        if not res:
            raise KeyError("Không tìm thấy đơn đặt bàn")

        if res["status"] != "Pending":
            raise ValueError("Chỉ có thể xác nhận đơn đang ở trạng thái Chờ duyệt (Pending)")

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        res["status"] = "Confirmed"
        res["status_history"].append({
            "from_status": "Pending",
            "to_status": "Confirmed",
            "actor_id": "partner_1",
            "actor_name": "Quản lý nhà hàng",
            "reason": "Nhà hàng đã giữ bàn thành công",
            "changed_at": now_str
        })

        self.notifications.insert(0, {
            "id": f"notif_{uuid.uuid4().hex[:6]}",
            "user_id": res["customer_id"],
            "title": "Nhà hàng đã xác nhận đặt bàn! 🎉",
            "message": f"{res['venue_name']} đã xác nhận giữ bàn cho bạn ({res['confirmation_code']}).",
            "type": "reservation",
            "read": False,
            "created_at": now_str,
            "link": "/my-bookings"
        })

        return res

    def partner_reject_reservation(self, res_id: str, reason: str = "Hết bàn vào khung giờ này") -> Dict[str, Any]:
        res = next((r for r in self.reservations if r["id"] == res_id), None)
        if not res:
            raise KeyError("Không tìm thấy đơn đặt bàn")

        if res["status"] != "Pending":
            raise ValueError("Chỉ có thể từ chối đơn đang ở trạng thái Chờ duyệt (Pending)")

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        res["status"] = "Rejected"
        res["reject_reason"] = reason
        res["can_cancel"] = False
        res["status_history"].append({
            "from_status": "Pending",
            "to_status": "Rejected",
            "actor_id": "partner_1",
            "actor_name": "Quản lý nhà hàng",
            "reason": reason,
            "changed_at": now_str
        })

        self.notifications.insert(0, {
            "id": f"notif_{uuid.uuid4().hex[:6]}",
            "user_id": res["customer_id"],
            "title": "Yêu cầu đặt bàn bị từ chối",
            "message": f"Rất tiếc, {res['venue_name']} không thể tiếp nhận ({res['confirmation_code']}). Lý do: {reason}",
            "type": "reservation",
            "read": False,
            "created_at": now_str,
            "link": "/my-bookings"
        })

        return res

    # --- Events ---
    def create_event(self, data: Dict[str, Any]) -> Dict[str, Any]:
        venue = self.get_venue(data["venue_id"])
        if not venue:
            raise ValueError("Nhà hàng không tồn tại")

        evt_id = f"evt_{uuid.uuid4().hex[:6]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

        new_event = {
            "id": evt_id,
            "venue_id": venue["id"],
            "venue_name": venue["name"],
            "customer_id": "cust_1",
            "customer_name": data["customer_name"],
            "customer_phone": data["customer_phone"],
            "occasion": data["occasion"],
            "headcount": data["headcount"],
            "event_date": data["event_date"],
            "event_time": data["event_time"],
            "budget_range": data["budget_range"],
            "special_needs": data["special_needs"],
            "status": "Submitted",
            "messages": [
                {
                    "id": f"m_{uuid.uuid4().hex[:4]}",
                    "sender_role": "customer",
                    "sender_name": data["customer_name"],
                    "body": f"Yêu cầu tiệc {data['occasion']} ({data['headcount']} khách). Yêu cầu: {data['special_needs']}",
                    "created_at": now_str
                }
            ],
            "created_at": now_str
        }
        self.events.insert(0, new_event)
        return new_event

    def add_event_message(self, event_id: str, sender_role: str, sender_name: str, body: str) -> Dict[str, Any]:
        evt = next((e for e in self.events if e["id"] == event_id), None)
        if not evt:
            raise KeyError("Không tìm thấy yêu cầu sự kiện")

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        msg = {
            "id": f"m_{uuid.uuid4().hex[:4]}",
            "sender_role": sender_role,
            "sender_name": sender_name,
            "body": body,
            "created_at": now_str
        }
        evt["messages"].append(msg)
        return evt

    # --- Reviews (Group 11) ---
    def add_review(self, reservation_id: str, rating: int, body: str) -> Dict[str, Any]:
        res = next((r for r in self.reservations if r["id"] == reservation_id), None)
        if not res:
            raise KeyError("Đơn đặt bàn không tồn tại")
        
        # Enforce rule: must be Confirmed or Completed
        if res["status"] not in ["Confirmed", "Completed"]:
            raise PermissionError("Chỉ có thể đánh giá sau khi đặt bàn được xác nhận và dùng bữa")

        rev_id = f"rev_{uuid.uuid4().hex[:6]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

        new_rev = {
            "id": rev_id,
            "reservation_id": reservation_id,
            "venue_id": res["venue_id"],
            "customer_name": res["customer_name"],
            "rating": rating,
            "body": body,
            "created_at": now_str,
            "partner_reply": None,
            "is_hidden": False
        }
        self.reviews.insert(0, new_rev)

        # Recalculate venue rating
        venue = self.get_venue(res["venue_id"])
        if venue:
            venue_revs = [r for r in self.reviews if r["venue_id"] == venue["id"] and not r["is_hidden"]]
            if venue_revs:
                avg = sum(r["rating"] for r in venue_revs) / len(venue_revs)
                venue["rating"] = round(avg, 1)
                venue["review_count"] = len(venue_revs)

        return new_rev

    # --- AI Recommendation Logic (Group 9) ---
    def get_ai_recommendations(self, query: str) -> Dict[str, Any]:
        q_lower = query.lower()
        matched = []
        explanation = ""

        if "lẩu" in q_lower:
            matched = [v for v in self.venues if "lẩu" in v["cuisine"].lower()]
            explanation = "Đã tìm thấy các nhà hàng chuyên lẩu đậm đà phong vị với nhiều ưu đãi hấp dẫn."
        elif "nướng" in q_lower or "bbq" in q_lower:
            matched = [v for v in self.venues if "nướng" in v["cuisine"].lower() or "bbq" in v["name"].lower()]
            explanation = "Dưới đây là các điểm nướng BBQ thượng hạng có hệ thống hút khói và suất giảm giá giờ vàng."
        elif "tiệc" in q_lower or "phòng riêng" in q_lower or "sinh nhật" in q_lower:
            matched = [v for v in self.venues if "Phòng riêng" in v.get("amenities", []) or "Phòng VIP riêng tư" in v.get("amenities", [])]
            explanation = "Các nhà hàng có không gian phòng riêng sang trọng, phù hợp họp mặt gia đình hoặc tiếp khách."
        elif "rẻ" in q_lower or "ưu đãi" in q_lower or "giảm" in q_lower:
            matched = sorted(self.venues, key=lambda x: x.get("max_discount", 0), reverse=True)
            explanation = "Tổng hợp các nhà hàng có mức giảm sâu nhất theo khung giờ vàng (lên tới 50%)."
        else:
            matched = sorted(self.venues, key=lambda x: x.get("rating", 0), reverse=True)
            explanation = f"Gợi ý các nhà hàng được đánh giá cao nhất phù hợp với yêu cầu: '{query}'."

        if not matched:
            matched = self.venues[:3]

        return {
            "query": query,
            "explanation": explanation,
            "suggestions": matched[:4]
        }

store = DataStore()
