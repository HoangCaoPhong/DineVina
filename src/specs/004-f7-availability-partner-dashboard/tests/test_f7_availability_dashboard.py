from datetime import UTC, date, datetime, timedelta

from app.database import SessionLocal
from app.main import app
from app.models import ReservationModel
from fastapi.testclient import TestClient

client = TestClient(app)
VENUE_ID = "v-hcmc-001"
PARTNER_HEADERS = {
    "X-User-Id": "partner-f7-test",
    "X-User-Role": "partner_staff",
    "X-Partner-Venues": VENUE_ID,
}
ADMIN_HEADERS = {
    "X-User-Id": "admin-f7-test",
    "X-User-Role": "administrator",
}
CUSTOMER_HEADERS = {"X-User-Id": "customer-f7-test", "X-User-Role": "customer"}


def _settings_payload(capacity: int = 24) -> dict:
    return {
        "default_slot_capacity": capacity,
        "operating_hours": [
            {
                "day_of_week": day,
                "open_time": "10:00",
                "close_time": "22:00",
                "is_active": day != 0,
            }
            for day in range(7)
        ],
    }


def _future_iso(days: int) -> str:
    return (date.today() + timedelta(days=days)).isoformat()


def _reset_settings() -> dict:
    response = client.put(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=PARTNER_HEADERS,
        json=_settings_payload(),
    )
    assert response.status_code == 200, response.text
    return response.json()


def test_partner_endpoints_require_authentication() -> None:
    response = client.get(f"/api/partner/venues/{VENUE_ID}/availability-settings")
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "AUTH_REQUIRED"


def test_partner_endpoints_reject_customer_role_and_foreign_venue() -> None:
    response = client.get(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=CUSTOMER_HEADERS,
    )
    assert response.status_code == 403
    foreign = {
        "X-User-Id": "other-partner",
        "X-User-Role": "partner_staff",
        "X-Partner-Venues": "v-hcmc-002",
    }
    response = client.get(
        f"/api/partner/venues/{VENUE_ID}/availability-settings", headers=foreign
    )
    assert response.status_code == 403
    assert response.json()["detail"]["code"] == "VENUE_ACCESS_DENIED"


def test_availability_settings_round_trip_and_revision_conflict() -> None:
    first = _reset_settings()
    assert first["venue_id"] == VENUE_ID
    assert first["default_slot_capacity"] == 24
    assert len(first["operating_hours"]) == 7

    payload = _settings_payload(capacity=20)
    payload["expected_revision"] = first["revision"]
    response = client.put(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=PARTNER_HEADERS,
        json=payload,
    )
    assert response.status_code == 200, response.text
    updated = response.json()
    assert updated["default_slot_capacity"] == 20
    assert updated["revision"] == first["revision"] + 1
    assert updated["updated_by"] == "partner-f7-test"

    payload["expected_revision"] = first["revision"]
    conflict = client.put(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=PARTNER_HEADERS,
        json=payload,
    )
    assert conflict.status_code == 409
    assert conflict.json()["detail"]["code"] == "REVISION_CONFLICT"


def test_availability_settings_validate_time_and_capacity_bounds() -> None:
    payload = _settings_payload()
    payload["operating_hours"][1]["close_time"] = "09:00"
    response = client.put(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=PARTNER_HEADERS,
        json=payload,
    )
    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "INVALID_TIME_RANGE"

    payload = _settings_payload(capacity=999)
    response = client.put(
        f"/api/partner/venues/{VENUE_ID}/availability-settings",
        headers=PARTNER_HEADERS,
        json=payload,
    )
    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "CAPACITY_EXCEEDS_MAXIMUM"


def test_blocked_slot_lifecycle_and_public_availability() -> None:
    _reset_settings()
    blocked_date = _future_iso(12)
    payload = {
        "blocked_date": blocked_date,
        "start_time": "18:00",
        "end_time": "19:30",
        "reason": "Private event maintenance",
    }
    created = client.post(
        f"/api/partner/venues/{VENUE_ID}/blocked-slots",
        headers=PARTNER_HEADERS,
        json=payload,
    )
    assert created.status_code in (201, 409), created.text
    if created.status_code == 409:
        existing = client.get(
            f"/api/partner/venues/{VENUE_ID}/blocked-slots?status=all",
            headers=PARTNER_HEADERS,
        ).json()
        for row in existing:
            if row["blocked_date"] == blocked_date and row["start_time"] == "18:00":
                client.delete(
                    f"/api/partner/venues/{VENUE_ID}/blocked-slots/{row['id']}",
                    headers=PARTNER_HEADERS,
                )
        created = client.post(
            f"/api/partner/venues/{VENUE_ID}/blocked-slots",
            headers=PARTNER_HEADERS,
            json=payload,
        )
    assert created.status_code == 201, created.text
    block = created.json()
    assert block["status"] == "Active"

    overlap = client.post(
        f"/api/partner/venues/{VENUE_ID}/blocked-slots",
        headers=PARTNER_HEADERS,
        json={**payload, "start_time": "19:00", "end_time": "20:00"},
    )
    assert overlap.status_code == 409
    assert overlap.json()["detail"]["code"] == "BLOCKED_SLOT_OVERLAP"

    availability = client.get(
        f"/api/venues/{VENUE_ID}/availability?date={blocked_date}&party_size=2"
    )
    assert availability.status_code == 200
    slots = {row["time"]: row for row in availability.json()["slots"]}
    assert slots["18:00"]["status"] == "blocked"
    assert slots["19:00"]["status"] == "blocked"
    assert slots["19:30"]["status"] == "available"

    cancelled = client.delete(
        f"/api/partner/venues/{VENUE_ID}/blocked-slots/{block['id']}",
        headers=PARTNER_HEADERS,
    )
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "Cancelled"
    cancelled_again = client.delete(
        f"/api/partner/venues/{VENUE_ID}/blocked-slots/{block['id']}",
        headers=PARTNER_HEADERS,
    )
    assert cancelled_again.status_code == 200


def test_confirmed_reservation_prevents_blocking() -> None:
    _reset_settings()
    blocked_date = _future_iso(14)
    reservation_id = "f7-test-confirmed-conflict"
    now = datetime.now(UTC)
    with SessionLocal() as db:
        db.query(ReservationModel).filter(ReservationModel.id == reservation_id).delete()
        db.add(
            ReservationModel(
                id=reservation_id,
                reservation_code="DVF7CONF",
                venue_id=VENUE_ID,
                customer_id="customer-conflict",
                customer_name="Conflict Test",
                customer_phone="0900000000",
                reserved_date=blocked_date,
                reserved_time="18:00",
                party_size=4,
                special_requests="",
                status="Confirmed",
                idempotency_key="f7-conflict-key",
                response_deadline=now + timedelta(hours=1),
                cancellation_deadline=now + timedelta(days=1),
                created_at=now,
                updated_at=now,
            )
        )
        db.commit()

    response = client.post(
        f"/api/partner/venues/{VENUE_ID}/blocked-slots",
        headers=PARTNER_HEADERS,
        json={
            "blocked_date": blocked_date,
            "start_time": "17:30",
            "end_time": "18:30",
            "reason": "Attempt overlapping confirmed booking",
        },
    )
    assert response.status_code == 409
    body = response.json()["detail"]
    assert body["code"] == "CONFIRMED_RESERVATION_CONFLICT"
    assert reservation_id in body["conflicting_reservation_ids"]


def test_public_availability_capacity_and_closed_day() -> None:
    _reset_settings()
    open_date = _future_iso(15)
    response = client.get(
        f"/api/venues/{VENUE_ID}/availability?date={open_date}&party_size=4"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["slot_granularity_minutes"] == 30
    assert data["slots"]
    assert all(row["total_capacity"] == 24 for row in data["slots"])
    assert any(row["status"] == "available" for row in data["slots"])

    monday_offset = (0 - date.today().weekday()) % 7 or 7
    monday = (date.today() + timedelta(days=monday_offset)).isoformat()
    closed = client.get(f"/api/venues/{VENUE_ID}/availability?date={monday}")
    assert closed.status_code == 200
    assert closed.json()["slots"] == []
    assert closed.json()["closed_reason"]


def test_dashboard_summary_filters_and_admin_access() -> None:
    response = client.get(
        f"/api/partner/venues/{VENUE_ID}/dashboard", headers=PARTNER_HEADERS
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["venue_id"] == VENUE_ID
    assert data["summary"]["pending_reservations"] >= 1
    assert data["summary"]["open_event_inquiries"] >= 1
    assert data["reservation_queue"]["total"] >= 1
    assert data["event_queue"]["items"]

    filtered = client.get(
        f"/api/partner/venues/{VENUE_ID}/dashboard?status=Confirmed&page=1&page_size=1",
        headers=PARTNER_HEADERS,
    )
    assert filtered.status_code == 200
    queue = filtered.json()["reservation_queue"]
    assert queue["page"] == 1
    assert queue["page_size"] == 1
    assert all(item["status"] == "Confirmed" for item in queue["items"])

    searched = client.get(
        f"/api/partner/venues/{VENUE_ID}/dashboard?query=DVF7",
        headers=ADMIN_HEADERS,
    )
    assert searched.status_code == 200
    assert searched.json()["reservation_queue"]["total"] >= 1


def test_dashboard_invalid_auth_and_not_found_are_structured() -> None:
    missing = client.get(
        "/api/partner/venues/missing-venue/dashboard", headers=ADMIN_HEADERS
    )
    assert missing.status_code == 404
    assert missing.json()["detail"]["code"] == "VENUE_NOT_FOUND"
