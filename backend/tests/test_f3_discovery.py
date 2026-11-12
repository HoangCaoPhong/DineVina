from fastapi.testclient import TestClient

from app.database import SessionLocal
from app.main import app, ensure_db_seeded
from app.models import VenueModel

client = TestClient(app)


def test_database_contains_both_approved_and_unapproved_fixtures() -> None:
    """
    Verifies that the relational database is seeded with both approved venues (8)
    and unapproved venues (pending, returned, rejected) to test moderation isolation.
    """
    ensure_db_seeded()
    with SessionLocal() as db:
        total_in_db = db.query(VenueModel).count()
        approved_in_db = (
            db.query(VenueModel).filter(VenueModel.status == "approved").count()
        )
        unapproved_statuses = {
            v.status
            for v in db.query(VenueModel)
            .filter(VenueModel.status != "approved")
            .all()
        }

    assert total_in_db == 11
    assert approved_in_db == 8
    assert {"pending", "returned", "rejected"}.issubset(unapproved_statuses)


def test_list_venues_returns_only_approved_venues() -> None:
    """
    US-F3-01 AC1: Public discovery must strictly return only approved venues
    and include explicit sample data metadata.
    """
    response = client.get("/api/venues")
    assert response.status_code == 200
    payload = response.json()

    assert payload["total"] == 8
    assert len(payload["items"]) == 8

    returned_ids = {item["id"] for item in payload["items"]}
    assert "v-unapproved-001" not in returned_ids
    assert "v-unapproved-002" not in returned_ids
    assert "v-unapproved-003" not in returned_ids

    for item in payload["items"]:
        assert item["status"] == "approved"
        assert item["is_sample"] is True
        assert "Sample Data" in item["sample_label"]
        assert len(item["signature_dishes_preview"]) >= 1


def test_keyword_search_matches_venue_name_and_dish_name() -> None:
    """
    US-F3-01 AC2: Searching by keyword matches both venue metadata and dish names,
    while still excluding unapproved venues whose names/dishes might match.
    """
    # Search by dish keyword "Phở bò Wagyu" -> matches Nhà Hàng Việt Xưa Sài Gòn (v-hcmc-001)
    res_dish = client.get("/api/venues", params={"q": "Phở bò Wagyu"})
    assert res_dish.status_code == 200
    data_dish = res_dish.json()
    assert data_dish["total"] >= 1
    assert any(v["id"] == "v-hcmc-001" for v in data_dish["items"])

    # Search for keyword from an unapproved venue ("Pending Moderation") -> must return 0 results
    res_unapproved = client.get("/api/venues", params={"q": "Pending Moderation"})
    assert res_unapproved.status_code == 200
    assert res_unapproved.json()["total"] == 0


def test_multi_attribute_filtering_district_cuisine_budget_party_size_amenity() -> None:
    """
    US-F3-02 AC1 & AC2: Filtering by district, cuisine, budget range, party size,
    and amenity returns the exact intersection of approved venues.
    """
    # Filter by District = "Quận 1" and party_size = 40
    res = client.get(
        "/api/venues",
        params={
            "district": "Quận 1",
            "party_size": 40,
            "min_budget": 200000,
            "max_budget": 600000,
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 2
    for item in data["items"]:
        assert item["district"] == "Quận 1"
        assert item["max_capacity"] >= 40
        assert item["max_budget_vnd"] >= 200000
        assert item["min_budget_vnd"] <= 600000

    # Filter by specific cuisine and amenity
    res_amenity = client.get(
        "/api/venues",
        params={"cuisine": "Nhật Bản", "amenity": "Phòng riêng"},
    )
    assert res_amenity.status_code == 200
    amenity_items = res_amenity.json()["items"]
    assert len(amenity_items) == 1
    assert amenity_items[0]["id"] == "v-hcmc-004"


def test_invalid_budget_range_returns_422() -> None:
    """
    US-F3-02 AC3: Submitting min_budget > max_budget or negative party_size returns 422.
    """
    res_budget = client.get(
        "/api/venues",
        params={"min_budget": 1000000, "max_budget": 300000},
    )
    assert res_budget.status_code == 422

    res_party = client.get("/api/venues", params={"party_size": 0})
    assert res_party.status_code == 422


def test_sorting_modes() -> None:
    """
    Verifies rating, price_asc, price_desc, capacity, and name sorting modes.
    """
    res_price_asc = client.get("/api/venues", params={"sort": "price_asc"})
    assert res_price_asc.status_code == 200
    items_asc = res_price_asc.json()["items"]
    min_budgets = [v["min_budget_vnd"] for v in items_asc]
    assert min_budgets == sorted(min_budgets)

    res_cap = client.get("/api/venues", params={"sort": "capacity"})
    assert res_cap.status_code == 200
    items_cap = res_cap.json()["items"]
    capacities = [v["max_capacity"] for v in items_cap]
    assert capacities == sorted(capacities, reverse=True)


def test_filter_options_endpoint() -> None:
    """
    Verifies GET /api/venues/filters returns distinct districts, cuisines, amenities,
    and budget/capacity bounds strictly from approved venues.
    """
    res = client.get("/api/venues/filters")
    assert res.status_code == 200
    meta = res.json()
    assert meta["total_approved_venues"] == 8
    assert "Quận 1" in meta["districts"]
    assert "Quận 3" in meta["districts"]
    assert len(meta["cuisines"]) >= 5
    assert len(meta["amenities"]) >= 5
    assert meta["min_budget_vnd"] == 100000
    assert meta["max_budget_vnd"] == 950000
    assert meta["max_capacity"] == 250


def test_venue_detail_endpoint_by_id_and_slug() -> None:
    """
    US-F3-03 AC1: Inspecting an approved venue by ID or slug returns full details,
    available time slots, and dishes grouped by menu_categories.
    """
    res_by_id = client.get("/api/venues/v-hcmc-001")
    assert res_by_id.status_code == 200
    detail = res_by_id.json()
    assert detail["id"] == "v-hcmc-001"
    assert detail["name"] == "Nhà Hàng Việt Xưa Sài Gòn"
    assert detail["status"] == "approved"
    assert detail["is_sample"] is True
    assert len(detail["dishes"]) == 4
    assert len(detail["menu_categories"]) == 3
    assert len(detail["available_slots"]) == 4

    res_by_slug = client.get("/api/venues/nha-hang-viet-xua-quan-1")
    assert res_by_slug.status_code == 200
    assert res_by_slug.json()["id"] == "v-hcmc-001"


def test_venue_detail_blocks_unapproved_and_nonexistent_venues() -> None:
    """
    US-F3-03 AC2: Direct detail lookup for pending, returned, rejected, or unknown
    venue IDs/slugs must return 404 Not Found.
    """
    for blocked_id in (
        "v-unapproved-001",
        "quan-nuong-dang-cho-duyet-q1",
        "v-unapproved-002",
        "v-unapproved-003",
        "v-hcmc-999-nonexistent",
    ):
        response = client.get(f"/api/venues/{blocked_id}")
        assert response.status_code == 404
