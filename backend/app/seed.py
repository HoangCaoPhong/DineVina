import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy.orm import Session

from .models import (
    DishModel,
    ReservationModel,
    ReservationStatusHistoryModel,
    VenueModel,
)

FIXTURE_PATH = Path(__file__).parent / "fixtures" / "f3_venues_fixture.json"
F5_FIXTURE_PATH = Path(__file__).parent / "fixtures" / "f5_reservations_fixture.json"
_VN_TZ = timezone(timedelta(hours=7))


def load_fixture_data() -> dict:
    with open(FIXTURE_PATH, encoding="utf-8") as f:
        return json.load(f)


def seed_f3_database(db: Session, force_refresh: bool = False) -> dict[str, int]:
    """
    Idempotently seeds the F3 venue and dish fixture into the relational database.
    Includes both approved venues (for public discovery) and unapproved venues
    (to verify moderation filtering invariants).
    """
    payload = load_fixture_data()
    venues_data = payload.get("venues", [])

    if force_refresh:
        db.query(DishModel).delete()
        db.query(VenueModel).delete()
        db.commit()

    inserted_venues = 0
    inserted_dishes = 0

    for v_item in venues_data:
        existing = db.query(VenueModel).filter(VenueModel.id == v_item["id"]).first()
        dishes_list = v_item.get("dishes", [])

        if existing is None:
            venue_obj = VenueModel(
                id=v_item["id"],
                name=v_item["name"],
                slug=v_item["slug"],
                tagline=v_item.get("tagline", ""),
                description=v_item.get("description", ""),
                address=v_item["address"],
                district=v_item["district"],
                city=v_item.get("city", "TP. Hồ Chí Minh"),
                cuisine=v_item["cuisine"],
                price_range=v_item["price_range"],
                min_budget_vnd=v_item["min_budget_vnd"],
                max_budget_vnd=v_item["max_budget_vnd"],
                max_capacity=v_item["max_capacity"],
                rating=v_item.get("rating", 4.5),
                review_count=v_item.get("review_count", 0),
                cover_image=v_item.get("cover_image", ""),
                gallery_images=v_item.get("gallery_images", []),
                amenities=v_item.get("amenities", []),
                opening_hours=v_item.get("opening_hours", "10:00 - 22:00"),
                contact_phone=v_item.get("contact_phone", ""),
                cancellation_policy=v_item.get("cancellation_policy", ""),
                available_slots=v_item.get("available_slots", []),
                status=v_item.get("status", "pending"),
                is_sample=v_item.get("is_sample", True),
                sample_label=v_item.get(
                    "sample_label", "Sample Data — PA3 Validated Fixture"
                ),
            )
            db.add(venue_obj)
            inserted_venues += 1

        for d_item in dishes_list:
            existing_dish = (
                db.query(DishModel).filter(DishModel.id == d_item["id"]).first()
            )
            if existing_dish is None:
                dish_obj = DishModel(
                    id=d_item["id"],
                    venue_id=v_item["id"],
                    category_name=d_item.get("category_name", "Món chính"),
                    name=d_item["name"],
                    description=d_item.get("description", ""),
                    price_vnd=d_item["price_vnd"],
                    image_url=d_item.get("image_url", ""),
                    dietary_tags=d_item.get("dietary_tags", []),
                    is_signature=d_item.get("is_signature", False),
                    is_available=d_item.get("is_available", True),
                )
                db.add(dish_obj)
                inserted_dishes += 1

    db.commit()
    total_approved = (
        db.query(VenueModel).filter(VenueModel.status == "approved").count()
    )
    total_all = db.query(VenueModel).count()
    return {
        "inserted_venues": inserted_venues,
        "inserted_dishes": inserted_dishes,
        "total_approved_venues": total_approved,
        "total_venues_in_db": total_all,
    }


def seed_f5_database(db: Session, force_refresh: bool = False) -> dict[str, int]:
    """Idempotently seeds PA4 F5 reservations and status history fixtures."""
    if not F5_FIXTURE_PATH.exists():
        return {"inserted_reservations": 0, "total_reservations": 0}

    payload = json.loads(F5_FIXTURE_PATH.read_text(encoding="utf-8"))
    items = payload.get("reservations", [])

    if force_refresh:
        db.query(ReservationStatusHistoryModel).delete()
        db.query(ReservationModel).delete()
        db.commit()

    inserted = 0
    base_now = datetime.now(_VN_TZ)
    for item in items:
        if (
            db.query(ReservationModel)
            .filter(ReservationModel.id == item["id"])
            .first()
            is not None
        ):
            continue
        venue_exists = (
            db.query(VenueModel)
            .filter(VenueModel.id == item["venue_id"])
            .first()
        )
        if venue_exists is None:
            continue

        reserved_dt = datetime.fromisoformat(
            f"{item['reserved_date']}T{item['reserved_time']}:00+07:00"
        )
        res_obj = ReservationModel(
            id=item["id"],
            reservation_code=item["reservation_code"],
            venue_id=item["venue_id"],
            customer_id=item["customer_id"],
            customer_name=item["customer_name"],
            customer_phone=item["customer_phone"],
            reserved_date=item["reserved_date"],
            reserved_time=item["reserved_time"],
            party_size=int(item["party_size"]),
            special_requests=item.get("special_requests", ""),
            status=item["status"],
            idempotency_key=None,
            response_deadline=base_now + timedelta(minutes=30),
            cancellation_deadline=reserved_dt - timedelta(hours=2),
            created_at=base_now,
            updated_at=base_now,
        )
        db.add(res_obj)
        db.flush()
        for idx, h in enumerate(item.get("history", [])):
            db.add(
                ReservationStatusHistoryModel(
                    id=f"hist-{item['id']}-{idx + 1}",
                    reservation_id=item["id"],
                    from_state=h.get("from_state"),
                    to_state=h["to_state"],
                    actor_id=h["actor_id"],
                    actor_role=h["actor_role"],
                    reason=h.get("reason", ""),
                    created_at=base_now + timedelta(seconds=idx),
                )
            )
        inserted += 1

    db.commit()
    total = db.query(ReservationModel).count()
    return {"inserted_reservations": inserted, "total_reservations": total}
