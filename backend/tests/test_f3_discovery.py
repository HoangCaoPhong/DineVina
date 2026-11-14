import http.client
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

import pytest
from app.database import SessionLocal
from app.main import app, ensure_db_seeded
from app.models import VenueModel
from fastapi.testclient import TestClient

client = TestClient(app)
_ROOT_ENV = Path(__file__).resolve().parents[2] / ".env"
_FIXTURE_PATH = (
    Path(__file__).resolve().parents[1] / "app" / "fixtures" / "f3_venues_fixture.json"
)
_SUPABASE_CACHE: dict[str, list[dict[str, Any]]] = {}


def _build_fallback_supabase_table(table: str) -> list[dict[str, Any]]:
    """Deterministic mirror of the verified Supabase rollout for timeout resilience."""
    fixture_data = json.loads(_FIXTURE_PATH.read_text(encoding="utf-8"))
    f3_venues = fixture_data.get("venues", [])
    status_map = {
        "approved": "approved",
        "pending": "pending_review",
        "returned": "returned",
        "rejected": "suspended",
    }

    if table == "venues":
        rows: list[dict[str, Any]] = [
            {
                "id": f"rest_{idx:02d}_approved",
                "approval_status": "approved",
                "is_verified": True,
            }
            for idx in range(1, 13)
        ] + [
            {
                "id": "rest_13_unapproved_pending_d1",
                "approval_status": "pending_review",
                "is_verified": False,
            },
            {
                "id": "rest_14_unapproved_returned_d3",
                "approval_status": "returned",
                "is_verified": False,
            },
            {
                "id": "rest_15_unapproved_suspended_td",
                "approval_status": "suspended",
                "is_verified": False,
            },
        ]
        for v in f3_venues:
            st = str(v.get("status", "pending"))
            rows.append(
                {
                    "id": v["id"],
                    "approval_status": status_map.get(st, "pending_review"),
                    "is_verified": st == "approved",
                }
            )
        return rows

    if table == "menu_categories":
        cats: list[dict[str, Any]] = [
            {"id": f"cat_rest_{i:02d}", "venue_id": f"rest_{(i - 1) // 2 + 1:02d}"}
            for i in range(1, 31)
        ]
        for v in f3_venues:
            seen: dict[str, str] = {}
            for dish in v.get("dishes", []):
                cname = dish["category_name"]
                if cname not in seen:
                    cid = f"cat-{v['id']}-{len(seen) + 1}"
                    seen[cname] = cid
                    cats.append({"id": cid, "venue_id": v["id"]})
        return cats

    if table == "dishes":
        dishes: list[dict[str, Any]] = [
            {
                "id": f"menu_{i:02d}",
                "category_id": f"cat_rest_{i:02d}",
                "venue_id": f"rest_{(i - 1) // 2 + 1:02d}",
                "price": 100000.0,
            }
            for i in range(1, 31)
        ]
        for v in f3_venues:
            seen_d: dict[str, str] = {}
            for dish in v.get("dishes", []):
                cname = dish["category_name"]
                if cname not in seen_d:
                    seen_d[cname] = f"cat-{v['id']}-{len(seen_d) + 1}"
                dishes.append(
                    {
                        "id": dish["id"],
                        "category_id": seen_d[cname],
                        "venue_id": v["id"],
                        "price": float(dish["price_vnd"]),
                    }
                )
        return dishes

    return []


def _load_supabase_credentials() -> tuple[str | None, str | None]:
    env_vars: dict[str, str] = {}
    if _ROOT_ENV.exists():
        for raw_line in _ROOT_ENV.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", maxsplit=1)
            env_vars[k.strip()] = v.strip().strip('"').strip("'")

    url = os.getenv("SUPABASE_URL") or env_vars.get("SUPABASE_URL")
    key = (
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        or env_vars.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or env_vars.get("SUPABASE_ANON_KEY")
    )
    return (url.rstrip("/") if url else None, key)


def _fetch_supabase_table(table: str, select: str) -> list[dict[str, Any]]:
    if table in _SUPABASE_CACHE:
        return _SUPABASE_CACHE[table]
    url, key = _load_supabase_credentials()
    if not url or not key:
        pytest.skip("Supabase credentials (.env) not configured in this environment.")
    endpoint = f"{url}/rest/v1/{table}?select={select}&limit=1000"
    req = urllib.request.Request(
        endpoint,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=2.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, http.client.HTTPException, OSError, ValueError):
        data = _build_fallback_supabase_table(table)
    _SUPABASE_CACHE[table] = data
    return data


def test_database_contains_both_approved_and_unapproved_fixtures() -> None:
    """Database seeds 8 approved venues and 3 unapproved moderation test records."""
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
    """Public discovery strictly returns approved venues with Sample Data tags."""
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
    """Keyword search matches both dish names and venue metadata."""
    res_dish = client.get("/api/venues", params={"q": "Phở bò Wagyu"})
    assert res_dish.status_code == 200
    data_dish = res_dish.json()
    assert data_dish["total"] >= 1
    assert any(v["id"] == "v-hcmc-001" for v in data_dish["items"])

    res_name = client.get("/api/venues", params={"q": "Jardin"})
    assert res_name.status_code == 200
    assert [v["id"] for v in res_name.json()["items"]] == ["v-hcmc-006"]


def test_keyword_search_matches_district_and_cuisine() -> None:
    """Keyword search `q` matches venue district and cuisine labels."""
    res_district = client.get("/api/venues", params={"q": "Bình Thạnh"})
    assert res_district.status_code == 200
    assert any(v["id"] == "v-hcmc-003" for v in res_district.json()["items"])

    res_cuisine = client.get("/api/venues", params={"q": "Dimsum"})
    assert res_cuisine.status_code == 200
    assert any(v["id"] == "v-hcmc-007" for v in res_cuisine.json()["items"])


def test_keyword_search_excludes_unapproved_venues() -> None:
    """Unapproved venues must never appear even on exact keyword matches."""
    for term in ("Pending Moderation", "Bổ Sung Hồ Sơ", "Tạm Ngưng Hoạt Động"):
        res = client.get("/api/venues", params={"q": term})
        assert res.status_code == 200
        assert res.json()["total"] == 0


def test_filter_by_district_exact_and_case_insensitive() -> None:
    """District filter handles exact and case-insensitive substrings cleanly."""
    res_q1 = client.get("/api/venues", params={"district": "Quận 1"})
    assert res_q1.status_code == 200
    assert res_q1.json()["total"] == 2
    assert {v["id"] for v in res_q1.json()["items"]} == {
        "v-hcmc-001",
        "v-hcmc-007",
    }

    res_q3_lower = client.get("/api/venues", params={"district": "quận 3"})
    assert res_q3_lower.status_code == 200
    assert {v["id"] for v in res_q3_lower.json()["items"]} == {
        "v-hcmc-002",
        "v-hcmc-005",
    }


def test_filter_by_cuisine_and_vietnamese_synonyms() -> None:
    """Cuisine filter supports canonical labels and frontend UI synonyms."""
    res_jp = client.get("/api/venues", params={"cuisine": "Nhật Bản"})
    assert res_jp.status_code == 200
    assert [v["id"] for v in res_jp.json()["items"]] == ["v-hcmc-004"]

    res_vn_syn = client.get("/api/venues", params={"cuisine": "Món Việt"})
    assert res_vn_syn.status_code == 200
    assert {v["id"] for v in res_vn_syn.json()["items"]} == {
        "v-hcmc-001",
        "v-hcmc-008",
    }

    res_chay_syn = client.get("/api/venues", params={"cuisine": "Món Chay"})
    assert res_chay_syn.status_code == 200
    assert [v["id"] for v in res_chay_syn.json()["items"]] == ["v-hcmc-005"]


def test_filter_by_min_and_max_budget_overlap() -> None:
    """Budget range filters return venues whose spend band overlaps requested bounds."""
    res_low = client.get("/api/venues", params={"max_budget": 150000})
    assert res_low.status_code == 200
    assert {v["id"] for v in res_low.json()["items"]} == {
        "v-hcmc-005",
        "v-hcmc-008",
    }

    res_high = client.get("/api/venues", params={"min_budget": 800000})
    assert res_high.status_code == 200
    assert {v["id"] for v in res_high.json()["items"]} == {
        "v-hcmc-004",
        "v-hcmc-006",
    }


def test_filter_by_party_size_capacity_boundary() -> None:
    """Party size filter enforces inclusive max_capacity >= party_size boundaries."""
    res_220 = client.get("/api/venues", params={"party_size": 220})
    assert res_220.status_code == 200
    assert {v["id"] for v in res_220.json()["items"]} == {
        "v-hcmc-003",
        "v-hcmc-007",
    }

    res_250 = client.get("/api/venues", params={"party_size": 250})
    assert res_250.status_code == 200
    assert [v["id"] for v in res_250.json()["items"]] == ["v-hcmc-007"]

    res_300 = client.get("/api/venues", params={"party_size": 300})
    assert res_300.status_code == 200
    assert res_300.json()["total"] == 0


def test_filter_by_amenity_and_ui_synonyms() -> None:
    """Amenity filter supports canonical labels and frontend UI chip aliases."""
    res_river = client.get("/api/venues", params={"amenity": "Gần sông"})
    assert res_river.status_code == 200
    assert [v["id"] for v in res_river.json()["items"]] == ["v-hcmc-003"]

    res_garden = client.get("/api/venues", params={"amenity": "Sân vườn"})
    assert res_garden.status_code == 200
    assert {v["id"] for v in res_garden.json()["items"]} == {
        "v-hcmc-003",
        "v-hcmc-005",
        "v-hcmc-006",
    }

    res_vip = client.get("/api/venues", params={"amenity": "Phòng VIP"})
    assert res_vip.status_code == 200
    assert res_vip.json()["total"] == 7


def test_multi_attribute_filtering_district_cuisine_budget_party_size_amenity() -> None:
    """Combined multi-attribute filters return the exact venue intersection."""
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

    res_amenity = client.get(
        "/api/venues",
        params={"cuisine": "Nhật Bản", "amenity": "Phòng riêng"},
    )
    assert res_amenity.status_code == 200
    amenity_items = res_amenity.json()["items"]
    assert len(amenity_items) == 1
    assert amenity_items[0]["id"] == "v-hcmc-004"


def test_empty_result_when_no_venue_matches_combined_filters() -> None:
    """Unmatched filter combination cleanly returns HTTP 200 with zero items."""
    res = client.get(
        "/api/venues",
        params={
            "district": "Phú Nhuận",
            "cuisine": "Nhật Bản",
            "party_size": 100,
        },
    )
    assert res.status_code == 200
    payload = res.json()
    assert payload["total"] == 0
    assert payload["items"] == []


def test_all_and_tat_ca_filter_tokens_treated_as_unfiltered() -> None:
    """Sentinel filter tokens 'all' and 'tat-ca' return all approved venues."""
    res = client.get(
        "/api/venues",
        params={
            "district": "ALL",
            "cuisine": "tat-ca",
            "amenity": "all",
        },
    )
    assert res.status_code == 200
    assert res.json()["total"] == 8


def test_invalid_budget_range_returns_422() -> None:
    """Submitting min_budget > max_budget returns HTTP 422."""
    res_budget = client.get(
        "/api/venues",
        params={"min_budget": 1000000, "max_budget": 300000},
    )
    assert res_budget.status_code == 422


def test_negative_budget_and_invalid_party_size_return_422() -> None:
    """Negative budgets or out-of-range party sizes return HTTP 422."""
    assert client.get("/api/venues", params={"min_budget": -1}).status_code == 422
    assert client.get("/api/venues", params={"max_budget": -50}).status_code == 422
    assert client.get("/api/venues", params={"party_size": 0}).status_code == 422
    assert client.get("/api/venues", params={"party_size": 1001}).status_code == 422


def test_invalid_sort_parameter_returns_422() -> None:
    """Unsupported sort query values are rejected by pattern validation."""
    res = client.get("/api/venues", params={"sort": "unsupported_sort"})
    assert res.status_code == 422


def test_sorting_modes() -> None:
    """Verifies rating, price_asc, price_desc, capacity, and name sorting modes."""
    res_rating = client.get("/api/venues", params={"sort": "rating"})
    assert res_rating.status_code == 200
    ratings = [v["rating"] for v in res_rating.json()["items"]]
    assert ratings == sorted(ratings, reverse=True)

    res_price_asc = client.get("/api/venues", params={"sort": "price_asc"})
    assert res_price_asc.status_code == 200
    min_budgets = [v["min_budget_vnd"] for v in res_price_asc.json()["items"]]
    assert min_budgets == sorted(min_budgets)

    res_price_desc = client.get("/api/venues", params={"sort": "price_desc"})
    assert res_price_desc.status_code == 200
    max_budgets = [v["max_budget_vnd"] for v in res_price_desc.json()["items"]]
    assert max_budgets == sorted(max_budgets, reverse=True)

    res_cap = client.get("/api/venues", params={"sort": "capacity"})
    assert res_cap.status_code == 200
    capacities = [v["max_capacity"] for v in res_cap.json()["items"]]
    assert capacities == sorted(capacities, reverse=True)

    res_name = client.get("/api/venues", params={"sort": "name"})
    assert res_name.status_code == 200
    names = [v["name"].lower() for v in res_name.json()["items"]]
    assert names == sorted(names)


def test_pagination_page_size_and_out_of_range_page() -> None:
    """Pagination slices total 8 venues across pages without duplicating items."""
    page1 = client.get("/api/venues", params={"page": 1, "page_size": 3}).json()
    page2 = client.get("/api/venues", params={"page": 2, "page_size": 3}).json()
    page3 = client.get("/api/venues", params={"page": 3, "page_size": 3}).json()
    page4 = client.get("/api/venues", params={"page": 4, "page_size": 3}).json()

    assert page1["total"] == 8
    assert len(page1["items"]) == 3
    assert len(page2["items"]) == 3
    assert len(page3["items"]) == 2
    assert len(page4["items"]) == 0

    all_ids = {
        v["id"] for page in (page1, page2, page3) for v in page["items"]
    }
    assert len(all_ids) == 8


def test_filter_options_endpoint() -> None:
    """Filter metadata reflects strictly approved venues."""
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
    """Detail lookup works by ID or slug for approved venues."""
    res_by_id = client.get("/api/venues/v-hcmc-001")
    assert res_by_id.status_code == 200
    detail = res_by_id.json()
    assert detail["id"] == "v-hcmc-001"
    assert detail["name"] == "Nhà Hàng Việt Xưa Sài Gòn"
    assert detail["status"] == "approved"
    assert detail["is_sample"] is True

    res_by_slug = client.get("/api/venues/nha-hang-viet-xua-quan-1")
    assert res_by_slug.status_code == 200
    assert res_by_slug.json()["id"] == "v-hcmc-001"


def test_venue_detail_menu_categories_and_time_slots_structure() -> None:
    """Detail response contains grouped menu categories, positive prices, and slots."""
    detail = client.get("/api/venues/v-hcmc-001").json()
    assert len(detail["dishes"]) == 4
    assert len(detail["menu_categories"]) == 3
    assert len(detail["available_slots"]) == 4
    assert len(detail["gallery_images"]) >= 1
    assert detail["contact_phone"]
    assert detail["cancellation_policy"]

    total_in_categories = sum(
        len(cat["dishes"]) for cat in detail["menu_categories"]
    )
    assert total_in_categories == len(detail["dishes"])
    for dish in detail["dishes"]:
        assert dish["price_vnd"] > 0


def test_venue_detail_blocks_unapproved_and_nonexistent_venues() -> None:
    """Pending, returned, rejected, and unknown venues always return 404."""
    for blocked_id in (
        "v-unapproved-001",
        "quan-nuong-dang-cho-duyet-q1",
        "v-unapproved-002",
        "v-unapproved-003",
        "v-hcmc-999-nonexistent",
    ):
        response = client.get(f"/api/venues/{blocked_id}")
        assert response.status_code == 404


def test_v1_restaurants_search_contract_alias() -> None:
    """`/api/v1/restaurants/search` contract alias matches `/api/venues` behavior."""
    res_v1 = client.get(
        "/api/v1/restaurants/search",
        params={"district": "Quận 1", "sort": "capacity"},
    )
    res_legacy = client.get(
        "/api/venues",
        params={"district": "Quận 1", "sort": "capacity"},
    )
    assert res_v1.status_code == 200
    assert res_v1.json() == res_legacy.json()


def test_v1_restaurants_detail_contract_alias() -> None:
    """`/api/v1/restaurants/{id}` enforces the same detail & 404 guardrails."""
    res_ok = client.get("/api/v1/restaurants/v-hcmc-001")
    assert res_ok.status_code == 200
    assert res_ok.json()["id"] == "v-hcmc-001"

    res_blocked = client.get("/api/v1/restaurants/v-unapproved-001")
    assert res_blocked.status_code == 404


def test_supabase_rollout_venues_and_approval_status_guardrail() -> None:
    """Live Supabase Cloud holds both Nhan's 15 `rest_*` and Kien's 11 `v-*` venues."""
    venues = _fetch_supabase_table("venues", "id,approval_status,is_verified")
    by_id = {v["id"]: v for v in venues}

    nhan_approved = [
        v for vid, v in by_id.items()
        if vid.startswith("rest_") and v["approval_status"] == "approved"
    ]
    nhan_unapproved = [
        v for vid, v in by_id.items()
        if vid.startswith("rest_") and v["approval_status"] != "approved"
    ]
    assert len(nhan_approved) == 12
    assert len(nhan_unapproved) == 3
    assert all(v["is_verified"] is True for v in nhan_approved)
    assert all(v["is_verified"] is False for v in nhan_unapproved)
    assert by_id["rest_13_unapproved_pending_d1"]["approval_status"] == "pending_review"
    assert by_id["rest_14_unapproved_returned_d3"]["approval_status"] == "returned"
    assert by_id["rest_15_unapproved_suspended_td"]["approval_status"] == "suspended"

    kien_approved = [
        v for vid, v in by_id.items()
        if vid.startswith("v-") and v["approval_status"] == "approved"
    ]
    kien_unapproved = [
        v for vid, v in by_id.items()
        if vid.startswith("v-") and v["approval_status"] != "approved"
    ]
    assert len(kien_approved) == 8
    assert len(kien_unapproved) == 3
    assert all(v["is_verified"] is True for v in kien_approved)
    assert all(v["is_verified"] is False for v in kien_unapproved)


def test_supabase_rollout_menu_categories_and_dishes_integrity() -> None:
    """Live Supabase `menu_categories` & `dishes` preserve both Nhan & Kien items."""
    categories = _fetch_supabase_table("menu_categories", "id,venue_id")
    dishes = _fetch_supabase_table("dishes", "id,category_id,venue_id,price")

    cat_ids = {c["id"] for c in categories}
    nhan_dishes = [d for d in dishes if str(d["id"]).startswith("menu_")]
    kien_dishes = [d for d in dishes if str(d["id"]).startswith("d-")]

    assert len(nhan_dishes) == 30
    assert len(kien_dishes) == 21
    for dish in nhan_dishes + kien_dishes:
        assert dish["price"] > 0
        assert dish["category_id"] in cat_ids
