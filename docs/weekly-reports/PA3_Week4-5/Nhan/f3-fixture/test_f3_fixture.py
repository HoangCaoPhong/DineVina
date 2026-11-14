"""Smoke tests for F3 discovery fixture validation and public filtering."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from validate_fixture import (  # noqa: E402
    SQL_PATH,
    SUPABASE_SEED_PATH,
    generate_postgres_sql,
    generate_supabase_seed_sql,
    load_fixture,
    search_public_venues,
    validate_fixture,
)


def test_fixture_has_no_validation_errors() -> None:
    data = load_fixture()
    assert validate_fixture(data) == []


def test_public_discovery_excludes_unapproved_venues() -> None:
    data = load_fixture()
    public = search_public_venues(data)
    assert len(public) == 12
    statuses = {v["approval_status"] for v in public}
    assert statuses == {"approved"}
    ids = {v["id"] for v in public}
    assert "rest_13_unapproved_pending_d1" not in ids
    assert "rest_14_unapproved_returned_d3" not in ids
    assert "rest_15_unapproved_suspended_td" not in ids


def test_smoke_district_and_cuisine_filter() -> None:
    data = load_fixture()
    res = search_public_venues(data, district="District 1", cuisine="Vietnamese")
    assert len(res) == 2
    assert {v["id"] for v in res} == {
        "rest_01_bep_vina_d1",
        "rest_12_saigon_street_d1",
    }


def test_smoke_budget_party_size_capacity_amenities() -> None:
    data = load_fixture()
    res = search_public_venues(
        data,
        budget_max=300000,
        party_size=20,
        min_capacity=100,
        amenities=["Private Room", "Parking"],
    )
    assert [v["id"] for v in res] == [
        "rest_04_thao_dien_garden",
        "rest_11_fusion_river_bt",
    ]


def test_smoke_food_keyword_excludes_unapproved() -> None:
    data = load_fixture()
    res = search_public_venues(data, q="Lẩu")
    assert len(res) >= 3
    assert all(v["approval_status"] == "approved" for v in res)


def test_smoke_empty_result_for_unmatched_filters() -> None:
    data = load_fixture()
    res = search_public_venues(
        data,
        district="District 5",
        cuisine="Japanese",
        amenities=["Outdoor Seating"],
    )
    assert res == []


def test_generated_sql_is_in_sync() -> None:
    data = load_fixture()
    expected = generate_postgres_sql(data)
    assert SQL_PATH.read_text(encoding="utf-8") == expected


def test_generated_supabase_seed_is_in_sync() -> None:
    data = load_fixture()
    expected = generate_supabase_seed_sql(data)
    assert SUPABASE_SEED_PATH.read_text(encoding="utf-8") == expected
