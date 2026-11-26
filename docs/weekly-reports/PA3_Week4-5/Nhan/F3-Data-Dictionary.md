# DineVina - F3 Discovery Data Dictionary & Fixture Contract
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

This document defines the field dictionary, validation constraints, approval-status visibility rules, and UI/API smoke-test scenarios for the **F3 Restaurant Discovery and Venue Details** sample dataset (`f3-fixture/`).

## 1. Venue Record Schema (`venues`)
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Field | SQL Type | Required | Constraints / Allowed Values | F3 / FR Mapping |
| --- | --- | --- | --- | --- |
| `id` | `TEXT PRIMARY KEY` | Yes | Stable ID (`rest_<slug_or_code>`), non-empty | `FR-3.4`, API `id` |
| `name` | `TEXT` | Yes | Non-empty string (2–120 chars) | `FR-3.1`, `FR-3.4` |
| `slug` | `TEXT UNIQUE` | Yes | Lowercase kebab-case, unique | API `slug` |
| `city` | `TEXT` | Yes | Fixed `"Ho Chi Minh City"` for MVP | `FR-3.1` |
| `district` | `TEXT` | Yes | Valid HCMC district (`District 1`, `District 3`, `District 5`, `District 7`, `Binh Thanh`, `Phu Nhuan`, `Thu Duc`, `Tan Binh`) | `FR-3.2` |
| `address` | `TEXT` | Yes | Non-empty street address | `FR-3.4` |
| `cuisine_types` | `TEXT[]` | Yes | Non-empty array of allowed cuisines (`Vietnamese`, `Traditional`, `Hotpot`, `BBQ`, `Japanese`, `Seafood`, `Vegetarian`, `Fusion`, `Street Food`) | `FR-3.2` |
| `min_price_vnd` | `INTEGER` | Yes | `>= 20000` and `<= max_price_vnd` | `FR-3.2` (budget) |
| `max_price_vnd` | `INTEGER` | Yes | `>= min_price_vnd` and `<= 5000000` | `FR-3.2` (budget) |
| `total_capacity` | `INTEGER` | Yes | `>= 1` | `FR-3.2` (capacity) |
| `max_party_size` | `INTEGER` | Yes | `>= 1` and `<= total_capacity` | `FR-3.2` (party size) |
| `amenities` | `TEXT[]` | Yes | Subset of allowed amenities (`Private Room`, `Outdoor Seating`, `Parking`, `Air Conditioning`, `Wi-Fi`, `Kid Friendly`, `Wheelchair Accessible`) | `FR-3.2` (amenities) |
| `approval_status` | `TEXT` | Yes | Enum: `approved`, `pending_review`, `returned`, `suspended` | `FR-2.4` |
| `hotline` | `TEXT` | Yes | Non-empty Vietnamese phone string (synthetic/sample only, `PRIV-01`) | `FR-3.4`, `FR-5.5` |
| `opening_time` | `TIME` | Yes | `HH:MM` (e.g., `10:00`) | `FR-7.1` |
| `closing_time` | `TIME` | Yes | `HH:MM`, strictly after `opening_time` | `FR-7.1` |
| `average_rating` | `NUMERIC(2,1)` | Yes | `0.0` to `5.0` | `FR-3.3` (sort) |
| `review_count` | `INTEGER` | Yes | `>= 0` | API `review_count` |
| `cover_image_url` | `TEXT` | Yes | Non-empty URL/path | `FR-3.4` |
| `description` | `TEXT` | Yes | Non-empty venue summary | `FR-3.4` |

## 2. Menu Item Schema (`menu_items`)
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Field | SQL Type | Required | Constraints / Allowed Values | F3 / F4 Mapping |
| --- | --- | --- | --- | --- |
| `id` | `TEXT PRIMARY KEY` | Yes | Unique item ID (`menu_<code >`) | `FR-4.1`, `FR-4.2` |
| `venue_id` | `TEXT REFERENCES venues(id)` | Yes | Must reference an existing venue | `FR-4.2` |
| `name` | `TEXT` | Yes | Non-empty dish name | `FR-3.1`, `FR-4.1` |
| `category` | `TEXT` | Yes | `Appetizer`, `Main Course`, `Hotpot`, `BBQ`, `Dessert`, `Beverage` | `FR-4.2` |
| `description` | `TEXT` | Yes | Non-empty description | `FR-4.2` |
| `price_vnd` | `INTEGER` | Yes | Strictly `> 0` | `FR-4.1`, `FR-4.2` |
| `is_available` | `BOOLEAN` | Yes | `true` or `false` | `FR-4.2` |

## 3. Public Discovery Visibility Rule (`FR-2.4`)
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

Public F3 search (`GET /api/v1/restaurants/search`) and venue detail (`GET /api/v1/restaurants/{id}`) **must only return records where `approval_status = 'approved'`**.

The PostgreSQL seed script (`f3-fixture/schema_and_seed.sql`) includes a `public_approved_venues` view enforcing `WHERE approval_status = 'approved'`. The fixture intentionally includes labeled unapproved records (`pending_review`, `returned`, `suspended`) so automated tests and UI/API smoke checks can verify exclusion.

## 4. Fixture Summary & Smoke Scenarios
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- **Total sample venues:** 15 (12 `approved`, 1 `pending_review`, 1 `returned`, 1 `suspended`)
- **Total sample menu items:** 30 (2+ dishes per venue)
- **Supported smoke scenarios:**
  1. **Public discovery exclusion:** Querying public discovery returns 12 approved venues and 0 unapproved venues (`pending_review`, `returned`, `suspended`).
  2. **District + Cuisine filter:** `district = "District 1"` and `"Vietnamese" in cuisine_types` returns matching approved venues only.
  3. **Budget + Party Size + Capacity filter:** `min_price_vnd <= 300000`, `max_price_vnd >= 150000`, `max_party_size >= 10` returns group-capable venues.
  4. **Amenities filter:** Filtering by `"Private Room"` and `"Parking"` returns matching approved venues.
  5. **Empty result (`FR-3.5`):** Impossible filter combination (e.g., `district = "District 5"` + `"Japanese"` + `"Outdoor Seating"`) returns 0 items cleanly.
  6. **Food keyword search (`FR-3.1`):** Searching `"Lẩu"` or `"Phở"` matches venue menu items on approved venues only.
