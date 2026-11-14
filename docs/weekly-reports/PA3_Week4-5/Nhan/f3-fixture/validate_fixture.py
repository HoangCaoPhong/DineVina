"""Validate F3 sample venue/menu fixture and generate PostgreSQL seed SQL."""

from __future__ import annotations

import json
import re
from pathlib import Path

ALLOWED_DISTRICTS = {
    "District 1",
    "District 3",
    "District 5",
    "District 7",
    "Binh Thanh",
    "Phu Nhuan",
    "Thu Duc",
    "Tan Binh",
}
ALLOWED_CUISINES = {
    "Vietnamese",
    "Traditional",
    "Hotpot",
    "BBQ",
    "Japanese",
    "Seafood",
    "Vegetarian",
    "Fusion",
    "Street Food",
}
ALLOWED_AMENITIES = {
    "Private Room",
    "Outdoor Seating",
    "Parking",
    "Air Conditioning",
    "Wi-Fi",
    "Kid Friendly",
    "Wheelchair Accessible",
}
ALLOWED_APPROVAL_STATUSES = {"approved", "pending_review", "returned", "suspended"}
ALLOWED_CATEGORIES = {
    "Appetizer",
    "Main Course",
    "Hotpot",
    "BBQ",
    "Dessert",
    "Beverage",
}
TIME_RE = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")

FIXTURE_DIR = Path(__file__).resolve().parent
JSON_PATH = FIXTURE_DIR / "venues_sample.json"
SQL_PATH = FIXTURE_DIR / "schema_and_seed.sql"
SUPABASE_SEED_PATH = FIXTURE_DIR / "supabase_seed_f3.sql"


def load_fixture(path: Path = JSON_PATH) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_fixture(data: dict) -> list[str]:
    """Return a list of validation errors; empty list means valid."""
    errors: list[str] = []
    venues = data.get("venues")
    menu_items = data.get("menu_items")
    if not isinstance(venues, list) or not venues:
        return ["'venues' must be a non-empty list."]
    if not isinstance(menu_items, list) or not menu_items:
        return ["'menu_items' must be a non-empty list."]

    venue_ids: set[str] = set()
    slugs: set[str] = set()
    required_venue_fields = {
        "id",
        "name",
        "slug",
        "city",
        "district",
        "address",
        "cuisine_types",
        "min_price_vnd",
        "max_price_vnd",
        "total_capacity",
        "max_party_size",
        "amenities",
        "approval_status",
        "hotline",
        "opening_time",
        "closing_time",
        "average_rating",
        "review_count",
        "cover_image_url",
        "description",
    }

    for idx, v in enumerate(venues):
        missing = required_venue_fields - set(v.keys())
        if missing:
            errors.append(f"Venue[{idx}] missing fields: {sorted(missing)}")
            continue
        vid = v["id"]
        if vid in venue_ids:
            errors.append(f"Duplicate venue id: {vid}")
        venue_ids.add(vid)

        if v["slug"] in slugs:
            errors.append(f"Duplicate venue slug: {v['slug']}")
        slugs.add(v["slug"])

        if v["city"] != "Ho Chi Minh City":
            errors.append(f"{vid}: city must be 'Ho Chi Minh City'")
        if v["district"] not in ALLOWED_DISTRICTS:
            errors.append(f"{vid}: invalid district {v['district']!r}")
        if not v["cuisine_types"] or not set(v["cuisine_types"]).issubset(ALLOWED_CUISINES):
            errors.append(f"{vid}: invalid cuisine_types {v['cuisine_types']!r}")
        if not set(v["amenities"]).issubset(ALLOWED_AMENITIES):
            errors.append(f"{vid}: invalid amenities {v['amenities']!r}")
        if v["approval_status"] not in ALLOWED_APPROVAL_STATUSES:
            errors.append(f"{vid}: invalid approval_status {v['approval_status']!r}")

        if not (20000 <= v["min_price_vnd"] <= v["max_price_vnd"] <= 5000000):
            errors.append(f"{vid}: invalid price range")
        if not (1 <= v["max_party_size"] <= v["total_capacity"]):
            errors.append(f"{vid}: max_party_size must be in [1, total_capacity]")
        if not (0.0 <= float(v["average_rating"]) <= 5.0):
            errors.append(f"{vid}: average_rating out of range")
        if v["review_count"] < 0:
            errors.append(f"{vid}: negative review_count")
        if not TIME_RE.match(v["opening_time"]) or not TIME_RE.match(v["closing_time"]):
            errors.append(f"{vid}: invalid time format")
        elif v["opening_time"] >= v["closing_time"]:
            errors.append(f"{vid}: opening_time must precede closing_time")

    menu_ids: set[str] = set()
    for idx, m in enumerate(menu_items):
        if m.get("id") in menu_ids:
            errors.append(f"Duplicate menu id: {m.get('id')}")
        menu_ids.add(m.get("id", f"idx_{idx}"))
        if m.get("venue_id") not in venue_ids:
            errors.append(f"Menu[{idx}] unknown venue_id: {m.get('venue_id')}")
        if not m.get("name"):
            errors.append(f"Menu[{idx}] empty name")
        if m.get("category") not in ALLOWED_CATEGORIES:
            errors.append(f"Menu[{idx}] invalid category: {m.get('category')}")
        if not isinstance(m.get("price_vnd"), int) or m["price_vnd"] <= 0:
            errors.append(f"Menu[{idx}] price_vnd must be positive integer")

    return errors


def _sql_str(val: str) -> str:
    return "'" + val.replace("'", "''") + "'"


def _sql_arr(vals: list[str]) -> str:
    inner = ", ".join(_sql_str(x) for x in vals)
    return f"ARRAY[{inner}]::TEXT[]"


def generate_postgres_sql(data: dict) -> str:
    lines = [
        "-- DineVina F3 Discovery Schema & Sample Fixture (PostgreSQL 17)",
        "-- Generated from venues_sample.json by validate_fixture.py",
        "",
        "BEGIN;",
        "",
        "CREATE TABLE IF NOT EXISTS venues (",
        "    id TEXT PRIMARY KEY,",
        "    name TEXT NOT NULL,",
        "    slug TEXT NOT NULL UNIQUE,",
        "    city TEXT NOT NULL DEFAULT 'Ho Chi Minh City',",
        "    district TEXT NOT NULL,",
        "    address TEXT NOT NULL,",
        "    cuisine_types TEXT[] NOT NULL,",
        "    min_price_vnd INTEGER NOT NULL CHECK (min_price_vnd >= 20000),",
        "    max_price_vnd INTEGER NOT NULL CHECK (max_price_vnd >= min_price_vnd),",
        "    total_capacity INTEGER NOT NULL CHECK (total_capacity >= 1),",
        "    max_party_size INTEGER NOT NULL CHECK (max_party_size >= 1 AND max_party_size <= total_capacity),",
        "    amenities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],",
        "    approval_status TEXT NOT NULL CHECK (approval_status IN ('approved', 'pending_review', 'returned', 'suspended')),",
        "    hotline TEXT NOT NULL,",
        "    opening_time TIME NOT NULL,",
        "    closing_time TIME NOT NULL CHECK (closing_time > opening_time),",
        "    average_rating NUMERIC(2,1) NOT NULL DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),",
        "    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),",
        "    cover_image_url TEXT NOT NULL,",
        "    description TEXT NOT NULL",
        ");",
        "",
        "CREATE TABLE IF NOT EXISTS menu_items (",
        "    id TEXT PRIMARY KEY,",
        "    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,",
        "    name TEXT NOT NULL,",
        "    category TEXT NOT NULL,",
        "    description TEXT NOT NULL,",
        "    price_vnd INTEGER NOT NULL CHECK (price_vnd > 0),",
        "    is_available BOOLEAN NOT NULL DEFAULT TRUE",
        ");",
        "",
        "CREATE OR REPLACE VIEW public_approved_venues AS",
        "SELECT * FROM venues WHERE approval_status = 'approved';",
        "",
        "TRUNCATE TABLE menu_items, venues;",
        "",
    ]

    for v in data["venues"]:
        lines.append(
            "INSERT INTO venues (id, name, slug, city, district, address, cuisine_types, "
            "min_price_vnd, max_price_vnd, total_capacity, max_party_size, amenities, "
            "approval_status, hotline, opening_time, closing_time, average_rating, "
            "review_count, cover_image_url, description) VALUES ("
            f"{_sql_str(v['id'])}, {_sql_str(v['name'])}, {_sql_str(v['slug'])}, "
            f"{_sql_str(v['city'])}, {_sql_str(v['district'])}, {_sql_str(v['address'])}, "
            f"{_sql_arr(v['cuisine_types'])}, {v['min_price_vnd']}, {v['max_price_vnd']}, "
            f"{v['total_capacity']}, {v['max_party_size']}, {_sql_arr(v['amenities'])}, "
            f"{_sql_str(v['approval_status'])}, {_sql_str(v['hotline'])}, "
            f"{_sql_str(v['opening_time'])}, {_sql_str(v['closing_time'])}, "
            f"{v['average_rating']}, {v['review_count']}, "
            f"{_sql_str(v['cover_image_url'])}, {_sql_str(v['description'])});"
        )

    lines.append("")
    for m in data["menu_items"]:
        avail = "TRUE" if m["is_available"] else "FALSE"
        lines.append(
            "INSERT INTO menu_items (id, venue_id, name, category, description, price_vnd, is_available) VALUES ("
            f"{_sql_str(m['id'])}, {_sql_str(m['venue_id'])}, {_sql_str(m['name'])}, "
            f"{_sql_str(m['category'])}, {_sql_str(m['description'])}, {m['price_vnd']}, {avail});"
        )

    lines.extend(["", "COMMIT;", ""])
    return "\n".join(lines)


def _slug_cat(cat: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", cat.lower()).strip("_")


def generate_supabase_seed_sql(data: dict) -> str:
    """Generate idempotent, non-destructive upsert SQL for production Supabase schema."""
    lines = [
        "-- DineVina Production Supabase F3 Seed (Non-destructive UPSERT)",
        "-- Generated from venues_sample.json by validate_fixture.py",
        "",
        "BEGIN;",
        "",
    ]

    for v in data["venues"]:
        cuisine_str = ", ".join(v["cuisine_types"])
        price_range = f"{v['min_price_vnd']:,} - {v['max_price_vnd']:,} VND"
        is_verified = "TRUE" if v["approval_status"] == "approved" else "FALSE"
        features_json = json.dumps(v["amenities"], ensure_ascii=False)
        slots_json = json.dumps(["11:30", "12:30", "18:00", "19:00", "20:00"])
        lines.append(
            "INSERT INTO public.venues ("
            "id, name, slug, tagline, description, cuisine, cuisine_types, address, district, city, "
            "phone, price_range, min_spend, max_spend, total_capacity, max_party_size, amenities, "
            "features, approval_status, is_verified, opening_time, closing_time, rating, "
            "total_reviews, cover_image, available_slots"
            ") VALUES ("
            f"{_sql_str(v['id'])}, {_sql_str(v['name'])}, {_sql_str(v['slug'])}, "
            f"{_sql_str(v['description'][:80])}, {_sql_str(v['description'])}, "
            f"{_sql_str(cuisine_str)}, {_sql_arr(v['cuisine_types'])}, "
            f"{_sql_str(v['address'])}, {_sql_str(v['district'])}, {_sql_str(v['city'])}, "
            f"{_sql_str(v['hotline'])}, {_sql_str(price_range)}, "
            f"{v['min_price_vnd']}, {v['max_price_vnd']}, {v['total_capacity']}, {v['max_party_size']}, "
            f"{_sql_arr(v['amenities'])}, {_sql_str(features_json)}::jsonb, "
            f"{_sql_str(v['approval_status'])}, {is_verified}, "
            f"{_sql_str(v['opening_time'])}, {_sql_str(v['closing_time'])}, "
            f"{v['average_rating']}, {v['review_count']}, "
            f"{_sql_str(v['cover_image_url'])}, {_sql_str(slots_json)}::jsonb"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, "
            "cuisine = EXCLUDED.cuisine, cuisine_types = EXCLUDED.cuisine_types, "
            "address = EXCLUDED.address, district = EXCLUDED.district, city = EXCLUDED.city, "
            "phone = EXCLUDED.phone, price_range = EXCLUDED.price_range, "
            "min_spend = EXCLUDED.min_spend, max_spend = EXCLUDED.max_spend, "
            "total_capacity = EXCLUDED.total_capacity, max_party_size = EXCLUDED.max_party_size, "
            "amenities = EXCLUDED.amenities, features = EXCLUDED.features, "
            "approval_status = EXCLUDED.approval_status, is_verified = EXCLUDED.is_verified, "
            "opening_time = EXCLUDED.opening_time, closing_time = EXCLUDED.closing_time, "
            "rating = EXCLUDED.rating, total_reviews = EXCLUDED.total_reviews, "
            "cover_image = EXCLUDED.cover_image, available_slots = EXCLUDED.available_slots, "
            "updated_at = NOW();"
        )

    lines.append("")
    seen_cats: set[tuple[str, str]] = set()
    for m in data["menu_items"]:
        key = (m["venue_id"], m["category"])
        if key in seen_cats:
            continue
        seen_cats.add(key)
        cat_id = f"cat_{m['venue_id']}_{_slug_cat(m['category'])}"
        lines.append(
            "INSERT INTO public.menu_categories (id, venue_id, name, sort_order) VALUES ("
            f"{_sql_str(cat_id)}, {_sql_str(m['venue_id'])}, {_sql_str(m['category'])}, 1"
            ") ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;"
        )

    lines.append("")
    for m in data["menu_items"]:
        cat_id = f"cat_{m['venue_id']}_{_slug_cat(m['category'])}"
        is_pop = "TRUE" if m["is_available"] else "FALSE"
        lines.append(
            "INSERT INTO public.dishes (id, category_id, venue_id, name, price, description, is_popular) VALUES ("
            f"{_sql_str(m['id'])}, {_sql_str(cat_id)}, {_sql_str(m['venue_id'])}, "
            f"{_sql_str(m['name'])}, {m['price_vnd']}, {_sql_str(m['description'])}, {is_pop}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "category_id = EXCLUDED.category_id, venue_id = EXCLUDED.venue_id, "
            "name = EXCLUDED.name, price = EXCLUDED.price, "
            "description = EXCLUDED.description, is_popular = EXCLUDED.is_popular;"
        )

    lines.extend(["", "COMMIT;", ""])
    return "\n".join(lines)


def search_public_venues(
    data: dict,
    *,
    q: str | None = None,
    district: str | None = None,
    cuisine: str | None = None,
    budget_max: int | None = None,
    party_size: int | None = None,
    min_capacity: int | None = None,
    amenities: list[str] | None = None,
) -> list[dict]:
    """Reference public F3 discovery query enforcing approval_status == 'approved'."""
    menu_by_venue: dict[str, list[str]] = {}
    for m in data["menu_items"]:
        menu_by_venue.setdefault(m["venue_id"], []).append(m["name"].lower())

    results = []
    for v in data["venues"]:
        if v["approval_status"] != "approved":
            continue
        if district and v["district"] != district:
            continue
        if cuisine and cuisine not in v["cuisine_types"]:
            continue
        if budget_max is not None and v["min_price_vnd"] > budget_max:
            continue
        if party_size is not None and v["max_party_size"] < party_size:
            continue
        if min_capacity is not None and v["total_capacity"] < min_capacity:
            continue
        if amenities and not set(amenities).issubset(set(v["amenities"])):
            continue
        if q:
            ql = q.lower()
            hay = " ".join([v["name"].lower(), *menu_by_venue.get(v["id"], [])])
            if ql not in hay:
                continue
        results.append(v)
    return results


if __name__ == "__main__":
    fixture = load_fixture()
    errs = validate_fixture(fixture)
    if errs:
        raise SystemExit("Validation failed:\n" + "\n".join(errs))
    SQL_PATH.write_text(generate_postgres_sql(fixture), encoding="utf-8")
    SUPABASE_SEED_PATH.write_text(generate_supabase_seed_sql(fixture), encoding="utf-8")
    approved = [v for v in fixture["venues"] if v["approval_status"] == "approved"]
    unapproved = [v for v in fixture["venues"] if v["approval_status"] != "approved"]
    print(
        f"Valid fixture: {len(approved)} approved venues, {len(unapproved)} unapproved venues, "
        f"{len(fixture['menu_items'])} menu items. Wrote {SQL_PATH.name} and {SUPABASE_SEED_PATH.name}."
    )
