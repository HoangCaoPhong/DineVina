from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_venues_discovery():
    res = client.get("/api/venues")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0
    assert any("Lẩu Hoàng Gia" in v["name"] for v in data)

def test_venue_detail_and_menu():
    res = client.get("/api/venues/v1")
    assert res.status_code == 200
    assert res.json()["name"].startswith("Nhà Hàng Lẩu Hoàng Gia")

    menu_res = client.get("/api/venues/v1/menu")
    assert menu_res.status_code == 200
    categories = menu_res.json()
    assert len(categories) > 0
    assert len(categories[0]["dishes"]) > 0

def test_create_and_cancel_reservation_flow():
    # 1. Create a reservation
    payload = {
        "venue_id": "v1",
        "customer_name": "Nguyen Van A",
        "customer_phone": "0988776655",
        "reserved_date": "2026-10-20",
        "reserved_time": "19:00",
        "party_size": 4,
        "discount_percent": 10,
        "note": "Ban gan cua so"
    }
    create_res = client.post("/api/reservations", json=payload)
    assert create_res.status_code == 201
    res_data = create_res.json()
    assert res_data["status"] == "Pending"
    res_id = res_data["id"]

    # 2. Cancel while Pending (allowed anytime without cutoff)
    cancel_res = client.post(f"/api/reservations/{res_id}/cancel", json={"reason": "Ban viec dot xuat"})
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "Cancelled"

def test_partner_confirm_reservation():
    payload = {
        "venue_id": "v2",
        "customer_name": "Tran Van B",
        "customer_phone": "0911223344",
        "reserved_date": "2026-10-21",
        "reserved_time": "12:00",
        "party_size": 2,
        "discount_percent": 30,
        "note": "Ban doi"
    }
    create_res = client.post("/api/reservations", json=payload)
    assert create_res.status_code == 201
    res_id = create_res.json()["id"]

    # Partner confirms
    confirm_res = client.post(f"/api/partner/reservations/{res_id}/confirm")
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "Confirmed"

def test_ai_recommendation():
    ai_res = client.post("/api/ai/recommend", json={"query": "Tìm quán lẩu có phòng riêng"})
    assert ai_res.status_code == 200
    data = ai_res.json()
    assert len(data["suggestions"]) > 0
    assert "explanation" in data

def test_auth_flow():
    # 1. Check me
    me_res = client.get("/api/me")
    assert me_res.status_code == 200
    assert "email" in me_res.json()

    # 2. Login as partner
    login_res = client.post("/api/auth/login", json={"role": "partner"})
    assert login_res.status_code == 200
    assert login_res.json()["user"]["role"] == "partner"

    # 3. Register a new user
    reg_res = client.post("/api/auth/register", json={
        "email": "demo.user@dinevina.vn",
        "password": "Password123!",
        "full_name": "Nguyen Demo",
        "phone": "0988000111",
        "role": "customer"
    })
    assert reg_res.status_code == 201
    assert reg_res.json()["user"]["email"] == "demo.user@dinevina.vn"

    # 4. Logout
    logout_res = client.post("/api/auth/logout")
    assert logout_res.status_code == 200
    assert client.get("/api/me").status_code == 401
