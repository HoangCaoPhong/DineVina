import json
import os
import urllib.error
import urllib.request
from collections.abc import Iterator
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from uuid import uuid4

import pytest
from app.auth import ActorContext
from app.database import SessionLocal
from app.main import app, ensure_db_seeded
from app.models import ReservationModel
from app.reservations_service import (
    VN_TZ,
    cancel_by_customer,
    partner_check_in,
    partner_confirm,
    partner_no_show,
)
from fastapi import HTTPException
from fastapi.testclient import TestClient

client = TestClient(app)

CUST_1 = {"X-User-Id": "test-cust-1", "X-User-Role": "customer"}
CUST_2 = {"X-User-Id": "test-cust-2", "X-User-Role": "customer"}
PARTNER_V1 = {
    "X-User-Id": "test-partner-1",
    "X-User-Role": "partner_staff",
    "X-Partner-Venues": "v-hcmc-001",
}
PARTNER_OTHER = {
    "X-User-Id": "test-partner-other",
    "X-User-Role": "partner_staff",
    "X-Partner-Venues": "v-hcmc-002",
}
ADMIN_HDR = {"X-User-Id": "test-admin-1", "X-User-Role": "administrator"}


@pytest.fixture(autouse=True)
def _clean_f5_test_rows() -> Iterator[None]:
    ensure_db_seeded()
    with SessionLocal() as db:
        db.query(ReservationModel).filter(
            ReservationModel.customer_id.like("test-%")
        ).delete(synchronize_session=False)
        db.commit()
    yield
    with SessionLocal() as db:
        db.query(ReservationModel).filter(
            ReservationModel.customer_id.like("test-%")
        ).delete(synchronize_session=False)
        db.commit()


def _future_date_str(days_ahead: int = 10) -> str:
    return (datetime.now(VN_TZ).date() + timedelta(days=days_ahead)).isoformat()


def _create_booking(
    headers: dict[str, str] | None = None,
    venue_id: str = "v-hcmc-001",
    reserved_date: str | None = None,
    reserved_time: str = "19:00",
    party_size: int = 4,
    idempotency_key: str | None = None,
) -> dict:
    payload = {
        "venue_id": venue_id,
        "reserved_date": reserved_date or _future_date_str(10),
        "reserved_time": reserved_time,
        "party_size": party_size,
        "customer_name": "Nguyễn Test",
        "customer_phone": "0909888777",
        "special_requests": "Gần cửa sổ",
    }
    if idempotency_key is not None:
        payload["idempotency_key"] = idempotency_key
    res = client.post(
        "/api/reservations",
        json=payload,
        headers=headers or CUST_1,
    )
    assert res.status_code in (200, 201), res.text
    return res.json()


def test_seeded_f5_demo_reservations_exist() -> None:
    res = client.get("/api/admin/reservations/support", headers=ADMIN_HDR)
    assert res.status_code == 200
    payload = res.json()
    assert payload["total"] >= 3
    codes = {item["reservation_code"] for item in payload["items"]}
    assert {"DV-F50001", "DV-F50002", "DV-F50003"}.issubset(codes)


def test_availability_lookup_and_unapproved_guardrail() -> None:
    target_date = _future_date_str(5)
    res_ok = client.get(
        "/api/venues/v-hcmc-001/availability",
        params={"date": target_date, "party_size": 4},
    )
    assert res_ok.status_code == 200
    data = res_ok.json()
    assert data["venue_id"] == "v-hcmc-001"
    assert len(data["slots"]) >= 10
    slot_1900 = next(s for s in data["slots"] if s["time"] == "19:00")
    assert slot_1900["status"] == "Available"
    assert slot_1900["remaining_capacity"] == 120

    res_unapproved = client.get(
        "/api/venues/v-unapproved-001/availability",
        params={"date": target_date, "party_size": 2},
    )
    assert res_unapproved.status_code == 404


def test_availability_rejects_past_date_and_invalid_party_size() -> None:
    past_date = (datetime.now(VN_TZ).date() - timedelta(days=2)).isoformat()
    res_past = client.get(
        "/api/venues/v-hcmc-001/availability",
        params={"date": past_date, "party_size": 2},
    )
    assert res_past.status_code == 422

    res_large = client.get(
        "/api/venues/v-hcmc-004/availability",
        params={"date": _future_date_str(3), "party_size": 50},
    )
    assert res_large.status_code == 200 or res_large.status_code == 422


def test_customer_auth_and_role_isolation() -> None:
    res_anon = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-001",
            "reserved_date": _future_date_str(4),
            "reserved_time": "19:00",
            "party_size": 2,
            "customer_name": "Guest",
            "customer_phone": "0909111222",
        },
    )
    assert res_anon.status_code == 401

    res_wrong_role = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-001",
            "reserved_date": _future_date_str(4),
            "reserved_time": "19:00",
            "party_size": 2,
            "customer_name": "Partner",
            "customer_phone": "0909111222",
        },
        headers=PARTNER_V1,
    )
    assert res_wrong_role.status_code == 403


def test_create_reservation_holds_capacity_and_supports_idempotency() -> None:
    target_date = _future_date_str(6)
    idem = f"idem-{uuid4().hex[:8]}"
    res1 = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-001",
            "reserved_date": target_date,
            "reserved_time": "19:00",
            "party_size": 10,
            "customer_name": "Nguyễn Test",
            "customer_phone": "0909888777",
            "idempotency_key": idem,
        },
        headers=CUST_1,
    )
    assert res1.status_code == 201
    created = res1.json()
    assert created["status"] == "Pending confirmation"
    assert len(created["status_history"]) == 1

    res2 = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-001",
            "reserved_date": target_date,
            "reserved_time": "19:00",
            "party_size": 10,
            "customer_name": "Nguyễn Test",
            "customer_phone": "0909888777",
            "idempotency_key": idem,
        },
        headers=CUST_1,
    )
    assert res2.status_code == 200
    assert res2.json()["id"] == created["id"]

    avail = client.get(
        "/api/venues/v-hcmc-001/availability",
        params={"date": target_date, "party_size": 4},
    ).json()
    slot_1900 = next(s for s in avail["slots"] if s["time"] == "19:00")
    assert slot_1900["remaining_capacity"] == 110


def test_full_slot_rejects_with_409_and_adjacent_suggestions() -> None:
    target_date = _future_date_str(7)
    # v-hcmc-008 max_capacity = 55; fill 50 seats on 19:00
    _create_booking(
        venue_id="v-hcmc-008",
        reserved_date=target_date,
        reserved_time="19:00",
        party_size=50,
    )
    res_full = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-008",
            "reserved_date": target_date,
            "reserved_time": "19:00",
            "party_size": 10,
            "customer_name": "Nguyễn Overflow",
            "customer_phone": "0909000111",
        },
        headers=CUST_2,
    )
    assert res_full.status_code == 409
    detail = res_full.json()["detail"]
    assert detail["code"] == "SLOT_FULL"
    assert "18:30" in detail["suggested_slots"]
    assert "19:30" in detail["suggested_slots"]


def test_customer_track_ownership_isolation() -> None:
    created = _create_booking(headers=CUST_1, reserved_date=_future_date_str(8))
    res_list = client.get("/api/reservations", headers=CUST_1)
    assert res_list.status_code == 200
    assert any(item["id"] == created["id"] for item in res_list.json()["items"])

    res_other = client.get(
        f"/api/reservations/{created['id']}", headers=CUST_2
    )
    assert res_other.status_code == 403


def test_partner_confirm_and_decline_with_mandatory_reason_and_ownership() -> None:
    booking = _create_booking(headers=CUST_1, reserved_date=_future_date_str(9))

    res_wrong_venue = client.post(
        f"/api/partner/reservations/{booking['id']}/confirm",
        headers=PARTNER_OTHER,
    )
    assert res_wrong_venue.status_code == 403

    res_confirm = client.post(
        f"/api/partner/reservations/{booking['id']}/confirm",
        headers=PARTNER_V1,
    )
    assert res_confirm.status_code == 200
    assert res_confirm.json()["status"] == "Confirmed"
    assert len(res_confirm.json()["status_history"]) == 2

    booking2 = _create_booking(
        headers=CUST_2,
        reserved_date=_future_date_str(9),
        reserved_time="19:30",
    )
    res_blank_reason = client.post(
        f"/api/partner/reservations/{booking2['id']}/decline",
        json={"reason": "   "},
        headers=PARTNER_V1,
    )
    assert res_blank_reason.status_code == 422

    res_decline = client.post(
        f"/api/partner/reservations/{booking2['id']}/decline",
        json={"reason": "Hết bàn khu vực phòng lạnh"},
        headers=PARTNER_V1,
    )
    assert res_decline.status_code == 200
    assert res_decline.json()["status"] == "Declined"


def test_customer_cancel_2h_cutoff_and_hotline_fallback() -> None:
    target_date = _future_date_str(12)
    booking = _create_booking(
        headers=CUST_1, reserved_date=target_date, reserved_time="19:00"
    )
    res_c = client.post(
        f"/api/partner/reservations/{booking['id']}/confirm",
        headers=PARTNER_V1,
    )
    assert res_c.status_code == 200

    reserved_dt = datetime.fromisoformat(f"{target_date}T19:00:00+07:00")
    customer_actor = ActorContext("test-cust-1", "customer", frozenset())

    with SessionLocal() as db:
        with pytest.raises(HTTPException) as late_exc:
            cancel_by_customer(
                db,
                customer_actor,
                booking["id"],
                "Kẹt xe đột xuất",
                now=reserved_dt - timedelta(minutes=119),
            )
        late_detail: Any = late_exc.value.detail
        assert late_exc.value.status_code == 409
        assert late_detail["code"] == "CANCELLATION_CUTOFF_PASSED"
        assert late_detail["venue_hotline"]

        ok_out = cancel_by_customer(
            db,
            customer_actor,
            booking["id"],
            "Thay đổi lịch họp",
            now=reserved_dt - timedelta(minutes=121),
        )
        assert ok_out.status == "Cancelled by customer"


def test_partner_30m_expiry_and_operational_cancel() -> None:
    target_date = _future_date_str(14)
    stale_booking = _create_booking(
        headers=CUST_1, reserved_date=target_date, reserved_time="18:00"
    )
    partner_actor = ActorContext(
        "test-partner-1", "partner_staff", frozenset({"v-hcmc-001"})
    )
    with SessionLocal() as db:
        with pytest.raises(HTTPException) as exp_exc:
            partner_confirm(
                db,
                partner_actor,
                stale_booking["id"],
                now=datetime.now(VN_TZ) + timedelta(minutes=31),
            )
        exp_detail: Any = exp_exc.value.detail
        assert exp_exc.value.status_code == 409
        assert exp_detail["code"] == "RESERVATION_EXPIRED"

    refreshed = client.get(
        f"/api/reservations/{stale_booking['id']}", headers=CUST_1
    ).json()
    assert refreshed["status"] == "Expired"

    op_booking = _create_booking(
        headers=CUST_1, reserved_date=target_date, reserved_time="19:00"
    )
    client.post(
        f"/api/partner/reservations/{op_booking['id']}/confirm",
        headers=PARTNER_V1,
    )
    res_op_cancel = client.post(
        f"/api/partner/reservations/{op_booking['id']}/cancel",
        json={"reason": "Bảo trì điện khẩn cấp"},
        headers=PARTNER_V1,
    )
    assert res_op_cancel.status_code == 200
    assert res_op_cancel.json()["status"] == "Cancelled by restaurant"


def test_partner_checkin_and_30m_no_show_grace_and_admin_support() -> None:
    target_date = _future_date_str(15)
    b1 = _create_booking(
        headers=CUST_1, reserved_date=target_date, reserved_time="19:00"
    )
    b2 = _create_booking(
        headers=CUST_2, reserved_date=target_date, reserved_time="19:30"
    )
    client.post(
        f"/api/partner/reservations/{b1['id']}/confirm", headers=PARTNER_V1
    )
    client.post(
        f"/api/partner/reservations/{b2['id']}/confirm", headers=PARTNER_V1
    )

    partner_actor = ActorContext(
        "test-partner-1", "partner_staff", frozenset({"v-hcmc-001"})
    )
    dt_b1 = datetime.fromisoformat(f"{target_date}T19:00:00+07:00")
    dt_b2 = datetime.fromisoformat(f"{target_date}T19:30:00+07:00")

    with SessionLocal() as db:
        completed = partner_check_in(db, partner_actor, b1["id"], now=dt_b1)
        assert completed.status == "Completed"

        with pytest.raises(HTTPException) as early_ns:
            partner_no_show(
                db,
                partner_actor,
                b2["id"],
                "Too early",
                now=dt_b2 + timedelta(minutes=25),
            )
        assert early_ns.value.status_code == 409

        no_show = partner_no_show(
            db,
            partner_actor,
            b2["id"],
            "",
            now=dt_b2 + timedelta(minutes=31),
        )
        assert no_show.status == "No-show"

    res_admin_forbidden = client.get(
        f"/api/admin/reservations/{b1['id']}", headers=CUST_1
    )
    assert res_admin_forbidden.status_code == 403

    res_admin = client.get(
        f"/api/admin/reservations/{b1['id']}", headers=ADMIN_HDR
    )
    assert res_admin.status_code == 200
    history_states = [
        h["to_state"] for h in res_admin.json()["status_history"]
    ]
    assert history_states == [
        "Pending confirmation",
        "Confirmed",
        "Completed",
    ]


def test_partner_queue_list_filters_and_ownership_guardrail() -> None:
    d1 = _future_date_str(16)
    d2 = _future_date_str(17)
    b1 = _create_booking(
        headers=CUST_1, reserved_date=d1, reserved_time="19:00", party_size=2
    )
    b2 = _create_booking(
        headers=CUST_2, reserved_date=d2, reserved_time="19:30", party_size=3
    )
    client.post(
        f"/api/partner/reservations/{b1['id']}/confirm", headers=PARTNER_V1
    )

    res_all = client.get("/api/partner/reservations", headers=PARTNER_V1)
    assert res_all.status_code == 200
    returned_ids = {item["id"] for item in res_all.json()["items"]}
    assert {b1["id"], b2["id"]}.issubset(returned_ids)

    res_filtered = client.get(
        "/api/partner/reservations",
        params={"status": "Confirmed", "reserved_date": d1},
        headers=PARTNER_V1,
    )
    assert res_filtered.status_code == 200
    assert [i["id"] for i in res_filtered.json()["items"]] == [b1["id"]]

    res_wrong_venue = client.get(
        "/api/partner/reservations",
        params={"venue_id": "v-hcmc-002"},
        headers=PARTNER_V1,
    )
    assert res_wrong_venue.status_code == 403

    res_cust_forbidden = client.get("/api/partner/reservations", headers=CUST_1)
    assert res_cust_forbidden.status_code == 403


def test_overlapping_capacity_and_release_on_decline() -> None:
    target_date = _future_date_str(18)
    # v-hcmc-008 max_capacity = 50
    b1 = _create_booking(
        headers=CUST_1,
        venue_id="v-hcmc-008",
        reserved_date=target_date,
        reserved_time="19:00",
        party_size=30,
    )
    _create_booking(
        headers=CUST_2,
        venue_id="v-hcmc-008",
        reserved_date=target_date,
        reserved_time="19:00",
        party_size=20,
    )

    res_overflow = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-008",
            "reserved_date": target_date,
            "reserved_time": "19:00",
            "party_size": 1,
            "customer_name": "Late Guest",
            "customer_phone": "0909333444",
        },
        headers=CUST_1,
    )
    assert res_overflow.status_code == 409

    partner_v8 = {
        "X-User-Id": "test-partner-8",
        "X-User-Role": "partner_staff",
        "X-Partner-Venues": "v-hcmc-008",
    }
    res_decline = client.post(
        f"/api/partner/reservations/{b1['id']}/decline",
        json={"reason": "Khách đổi ngày"},
        headers=partner_v8,
    )
    assert res_decline.status_code == 200

    res_after_release = client.post(
        "/api/reservations",
        json={
            "venue_id": "v-hcmc-008",
            "reserved_date": target_date,
            "reserved_time": "19:00",
            "party_size": 10,
            "customer_name": "New Guest",
            "customer_phone": "0909333555",
        },
        headers=CUST_1,
    )
    assert res_after_release.status_code == 201


def test_supabase_reservations_table_reachability() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    env_vars: dict[str, str] = {}
    if env_path.exists():
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", maxsplit=1)
                env_vars[k.strip()] = v.strip().strip('"').strip("'")

    url = (os.getenv("SUPABASE_URL") or env_vars.get("SUPABASE_URL") or "").rstrip(
        "/"
    )
    key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or env_vars.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or env_vars.get("SUPABASE_ANON_KEY")
    )
    if not url or not key:
        pytest.skip("Supabase credentials (.env) not configured.")

    req = urllib.request.Request(
        f"{url}/rest/v1/reservations?select=id,venue_id,status&limit=5",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=6.0) as resp:
            assert resp.status == 200
            rows = json.loads(resp.read().decode("utf-8"))
            assert isinstance(rows, list)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        pytest.skip(f"Supabase network unavailable: {exc}")
