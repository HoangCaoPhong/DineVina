import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.supabase_client import get_supabase_client

STATUS_APP_TO_DB = {
    "Pending": "PendingConfirmation",
    "Confirmed": "Confirmed",
    "Rejected": "Declined",
    "Cancelled": "Cancelled",
    "Completed": "Completed",
    "Expired": "Expired"
}

STATUS_DB_TO_APP = {
    "PendingConfirmation": "Pending",
    "Confirmed": "Confirmed",
    "Declined": "Rejected",
    "Cancelled": "Cancelled",
    "Completed": "Completed",
    "Expired": "Expired",
    "NoShow": "Expired"
}

class SupabaseService:
    def __init__(self):
        pass

    @property
    def client(self):
        return get_supabase_client()

    def is_active(self) -> bool:
        return self.client is not None

    def list_venues(self, q: Optional[str] = None, district: Optional[str] = None, cuisine: Optional[str] = None) -> Optional[List[Dict[str, Any]]]:
        if not self.is_active():
            return None
        try:
            query = self.client.table("venues").select("*")
            if district and district != "all":
                query = query.ilike("district", f"%{district}%")
            if cuisine and cuisine != "all":
                query = query.ilike("cuisine", f"%{cuisine}%")
            
            res = query.execute()
            data = res.data or []
            
            # Map columns for frontend compatibility
            for v in data:
                v["review_count"] = v.get("total_reviews", 0)
                v["max_discount"] = v.get("max_discount", 30 if "v1" in v["id"] else 0)
                v["status"] = "approved"
                if "slots" not in v and "available_slots" in v:
                    v["slots"] = v["available_slots"]
                if "time_slots" not in v and "available_slots" in v:
                    v["time_slots"] = v["available_slots"]
            
            if q:
                term = q.strip().lower()
                data = [
                    v for v in data
                    if term in v.get("name", "").lower()
                    or term in v.get("cuisine", "").lower()
                    or term in v.get("district", "").lower()
                    or term in v.get("address", "").lower()
                ]
            return data
        except Exception as e:
            print(f"[SupabaseService] list_venues error: {e}")
            return None

    def get_venue(self, venue_id: str) -> Optional[Dict[str, Any]]:
        if not self.is_active():
            return None
        try:
            res = self.client.table("venues").select("*").eq("id", venue_id).execute()
            if not res.data:
                return None
            v = res.data[0]
            v["review_count"] = v.get("total_reviews", 0)
            v["max_discount"] = v.get("max_discount", 30 if "v1" in v["id"] else 0)
            v["status"] = "approved"
            if "slots" not in v and "available_slots" in v:
                v["slots"] = v["available_slots"]
            if "time_slots" not in v and "available_slots" in v:
                v["time_slots"] = v["available_slots"]
            return v
        except Exception as e:
            print(f"[SupabaseService] get_venue error: {e}")
            return None

    def get_venue_menu(self, venue_id: str) -> Optional[List[Dict[str, Any]]]:
        if not self.is_active():
            return None
        try:
            res = self.client.table("menu_categories").select("*, dishes(*)").eq("venue_id", venue_id).order("sort_order").execute()
            categories = res.data or []
            result = []
            for cat in categories:
                cat_dishes = []
                for d in cat.get("dishes", []):
                    cat_dishes.append({
                        "id": d["id"],
                        "category_id": cat["id"],
                        "name": d["name"],
                        "price": float(d["price"]),
                        "price_vnd": float(d["price"]),
                        "description": d.get("description", ""),
                        "image": d.get("image_url", ""),
                        "image_url": d.get("image_url", ""),
                        "is_special": d.get("is_popular", False),
                        "is_popular": d.get("is_popular", False),
                        "available": True
                    })
                result.append({
                    "id": cat["id"],
                    "venue_id": venue_id,
                    "name": cat["name"],
                    "position": cat.get("sort_order", 0),
                    "dishes": cat_dishes
                })
            return result if result else None
        except Exception as e:
            print(f"[SupabaseService] get_venue_menu error: {e}")
            return None

    def create_reservation(self, data: Dict[str, Any], venue_meta: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        if not self.is_active():
            return None
        try:
            res_id = f"res_{uuid.uuid4().hex[:6]}"
            code = f"DV-{uuid.uuid4().hex[:5].upper()}"
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
            
            app_status = data.get("status", "Pending")
            db_status = STATUS_APP_TO_DB.get(app_status, "PendingConfirmation")
            
            row = {
                "id": res_id,
                "venue_id": data["venue_id"],
                "customer_name": data["customer_name"],
                "customer_phone": data["customer_phone"],
                "customer_email": data.get("customer_email"),
                "reserved_date": str(data["reserved_date"]),
                "reserved_time": str(data["reserved_time"]),
                "party_size": int(data["party_size"]),
                "status": db_status,
                "special_requests": data.get("note", "")
            }
            
            self.client.table("reservations").insert(row).execute()
            
            # Return enriched representation for frontend
            v_name = venue_meta.get("name") if venue_meta else data["venue_id"]
            v_addr = venue_meta.get("address", "") if venue_meta else ""
            v_img = venue_meta.get("cover_image", "") if venue_meta else ""
            cutoff = venue_meta.get("cancellation_cutoff_hours", 2) if venue_meta else 2
            
            return {
                "id": res_id,
                "confirmation_code": code,
                "venue_id": data["venue_id"],
                "venue_name": v_name,
                "venue_address": v_addr,
                "venue_image": v_img,
                "customer_id": "cust_1",
                "customer_name": data["customer_name"],
                "customer_phone": data["customer_phone"],
                "reserved_date": str(data["reserved_date"]),
                "reserved_time": str(data["reserved_time"]),
                "party_size": int(data["party_size"]),
                "discount_percent": data.get("discount_percent", 0),
                "note": data.get("note", ""),
                "status": "Pending",
                "created_at": now_str,
                "cancellation_cutoff_hours": cutoff,
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
        except Exception as e:
            print(f"[SupabaseService] create_reservation error: {e}")
            return None

    def list_reservations(self) -> Optional[List[Dict[str, Any]]]:
        if not self.is_active():
            return None
        try:
            res = self.client.table("reservations").select("*, venues(name, address, cover_image)").order("created_at", desc=True).execute()
            data = res.data or []
            results = []
            for r in data:
                venue_info = r.get("venues") or {}
                app_status = STATUS_DB_TO_APP.get(r.get("status"), r.get("status", "Pending"))
                results.append({
                    "id": r["id"],
                    "confirmation_code": f"DV-{r['id'][:5].upper()}",
                    "venue_id": r["venue_id"],
                    "venue_name": venue_info.get("name", "Nhà hàng"),
                    "venue_address": venue_info.get("address", ""),
                    "venue_image": venue_info.get("cover_image", ""),
                    "customer_id": str(r.get("customer_id") or "cust_1"),
                    "customer_name": r["customer_name"],
                    "customer_phone": r["customer_phone"],
                    "reserved_date": str(r["reserved_date"]),
                    "reserved_time": str(r["reserved_time"]),
                    "party_size": r["party_size"],
                    "discount_percent": 0,
                    "note": r.get("special_requests", "") or "",
                    "status": app_status,
                    "created_at": str(r.get("created_at", "")),
                    "cancellation_cutoff_hours": 2,
                    "can_cancel": app_status in ["Pending", "Confirmed"],
                    "reject_reason": r.get("cancellation_reason"),
                    "status_history": []
                })
            return results
        except Exception as e:
            print(f"[SupabaseService] list_reservations error: {e}")
            return None

    def update_reservation_status(self, res_id: str, new_status: str, reason: Optional[str] = None) -> bool:
        if not self.is_active():
            return False
        try:
            db_status = STATUS_APP_TO_DB.get(new_status, new_status)
            update_payload = {"status": db_status}
            if reason:
                update_payload["cancellation_reason"] = reason
            self.client.table("reservations").update(update_payload).eq("id", res_id).execute()
            return True
        except Exception as e:
            print(f"[SupabaseService] update_reservation_status error: {e}")
            return False

supabase_service = SupabaseService()
