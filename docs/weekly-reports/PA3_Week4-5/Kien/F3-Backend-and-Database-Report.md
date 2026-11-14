# PA3 Technical Report: Functional Group F3 — Spec Kit Artifacts, FastAPI Backend & PostgreSQL Persistence

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

---

## 1. Executive Summary & Scope

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

In Project Assignment 3 (PA3 / Sprint 3), Group 08 selected **Functional Group F3 — Restaurant Discovery and Venue Details** (Section 5.3 of the DineVina Vision Document) for full end-to-end implementation across the React frontend, FastAPI backend, and PostgreSQL relational database.

As the Backend & Spec Kit Owner for Functional Group F3 ([Trello Card: F3 Spec Kit, API và database](https://trello.com/c/ociR28Qz)), **Nguyễn Trung Kiên** delivered:
1. **Spec-Driven Development (Spec Kit) Artifacts**:
   * Updated project constitution (`src/constitution.md`, v1.1.0) enforcing relational persistence, approved-only public discovery, and explicit sample data labeling.
   * Feature Specification (`src/specs/002-f3-venue-discovery/spec.md`) with 3 User Stories (`US-F3-01`, `US-F3-02`, `US-F3-03`) and Given-When-Then acceptance criteria.
   * Technical Implementation Plan (`src/specs/002-f3-venue-discovery/plan.md`) and Actionable Task List (`src/specs/002-f3-venue-discovery/tasks.md`).
2. **PostgreSQL & SQLAlchemy 2.0 Persistence Layer**:
   * Relational schema (`backend/app/models.py` and `backend/app/database.py`) defining `venues` and `dishes` tables with indexed columns for sub-300ms filtering.
   * Idempotent database seeder (`backend/app/seed.py`) loading the validated Ho Chi Minh City restaurant fixture (`backend/app/fixtures/f3_venues_fixture.json`) coordinated with **Lương Thiện Nhân**.
3. **FastAPI Discovery & Detail Endpoints**:
   * `GET /api/venues`: Keyword search across venues and dishes (`q`), multi-attribute filtering (`district`, `cuisine`, `min_budget`, `max_budget`, `party_size`, `amenity`), multi-mode sorting (`rating`, `price_asc`, `price_desc`, `capacity`, `name`), and pagination.
   * `GET /api/venues/filters`: Dynamic aggregation of distinct districts, cuisines, amenities, budget bounds, and maximum capacity strictly from approved venues.
   * `GET /api/venues/{venue_id}`: Full venue profile, operating conditions, available reservation slots, and categorized dish menu (`menu_categories`) by ID or URL slug.
4. **Automated Verification Suite**:
   * 10 comprehensive `pytest` integration tests (`backend/tests/test_f3_discovery.py` and `backend/tests/test_health.py`) verifying positive paths, multi-filter intersections, `422` validation errors, and strict `404` isolation of unapproved venues (`pending`, `returned`, `rejected`).

---

## 2. End-to-End Architecture & Data Flow

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

The diagram below illustrates how the React UI (developed by **Hoàng Cao Phong**), the FastAPI service (**Nguyễn Trung Kiên**), the PostgreSQL database, and the validated F3 fixture (**Lương Thiện Nhân** & **Nguyễn Trung Kiên**) interact in PA3:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Unauthenticated)
    participant UI as React Frontend (Phong)<br/>frontend/src/App.tsx
    participant API as FastAPI Backend (Kiên)<br/>backend/app/main.py
    participant ORM as SQLAlchemy 2.0 Layer<br/>models.py & schemas.py
    participant DB as PostgreSQL 17 Database<br/>(venues & dishes tables)

    Note over API,DB: Startup Lifespan: Base.metadata.create_all() + seed_f3_database()
    Customer->>UI: Opens DineVina Discovery Page
    UI->>API: GET /api/venues/filters
    API->>ORM: Query distinct facets WHERE status = 'approved'
    ORM->>DB: SELECT * FROM venues WHERE status = 'approved'
    DB-->>ORM: 8 Approved HCMC Venues (3 Unapproved Excluded)
    ORM-->>API: FilterOptionsOut (districts, cuisines, amenities, bounds)
    API-->>UI: 200 OK (Filter Metadata JSON)

    Customer->>UI: Enters keyword q="Phở bò Wagyu", district="Quận 1", party_size=40
    UI->>API: GET /api/venues?q=Phở+bò+Wagyu&district=Quận+1&party_size=40
    API->>ORM: Validate bounds & filter approved venues + dishes subquery
    ORM->>DB: SELECT venues + dishes WHERE status='approved' AND ...
    DB-->>ORM: Matching VenueModel rows
    ORM-->>API: VenueListResponse (items, total, filters_applied)
    API-->>UI: 200 OK (Filtered Approved Venues with Sample Labels)

    Customer->>UI: Clicks Venue Card ("Nhà Hàng Việt Xưa Sài Gòn")
    UI->>API: GET /api/venues/v-hcmc-001
    API->>ORM: Lookup by ID or slug WHERE status = 'approved'
    ORM->>DB: SELECT venue + dishes WHERE id='v-hcmc-001' AND status='approved'
    DB-->>ORM: VenueModel + 4 DishModel rows
    ORM-->>API: VenueDetailOut (grouped into menu_categories)
    API-->>UI: 200 OK (Full Venue Detail & Categorized Menu)
```

---

## 3. Relational Database Schema (`venues` & `dishes`)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

The relational schema in `backend/app/models.py` enforces foreign-key integrity and indexes all high-frequency search and filter attributes:

```mermaid
erDiagram
    VENUES ||--o{ DISHES : "has menu items (ON DELETE CASCADE)"
    VENUES {
        string id PK "e.g., v-hcmc-001"
        string name "Indexed restaurant name"
        string slug UK "Unique URL-friendly slug"
        string tagline "Short highlight summary"
        text description "Full venue introduction"
        string address "Street address"
        string district "Indexed HCMC district"
        string city "TP. Hồ Chí Minh"
        string cuisine "Indexed cuisine category"
        string price_range "Formatted VND range"
        int min_budget_vnd "Indexed lower budget per guest"
        int max_budget_vnd "Indexed upper budget per guest"
        int max_capacity "Indexed max seating capacity"
        float rating "Average rating (0.0 - 5.0)"
        int review_count "Verified review count"
        json gallery_images "List of photo URLs"
        json amenities "List of venue amenities"
        string opening_hours "Operating hours"
        string contact_phone "Venue contact phone"
        string cancellation_policy "Booking cancellation policy"
        json available_slots "Time slots with discount_percent"
        string status "Indexed: approved | pending | returned | rejected"
        boolean is_sample "True for PA3 fixture records"
        string sample_label "Sample Data — PA3 Validated Fixture"
    }
    DISHES {
        string id PK "e.g., d-001-1"
        string venue_id FK "References venues.id"
        string category_name "e.g., Khai vị, Món chính, Tráng miệng"
        string name "Indexed dish name"
        text description "Ingredients & preparation notes"
        int price_vnd "Unit price in VND"
        string image_url "Dish photo URL"
        json dietary_tags "Dietary & highlight tags"
        boolean is_signature "Featured signature dish flag"
        boolean is_available "Current availability flag"
    }
```

### Moderation Isolation Invariant
To prove that the F3 discovery pipeline strictly enforces administrator approval (`status == "approved"`), the database seeder (`backend/app/seed.py`) populates **11 total venues**:
* **8 Approved Venues (`v-hcmc-001` to `v-hcmc-008`)**: Spanning Quận 1, Quận 3, Bình Thạnh, Thủ Đức, Quận 7, and Phú Nhuận, with 21 authentic dishes across multiple categories.
* **3 Unapproved Test Venues (`v-unapproved-001` to `v-unapproved-003`)**:
  * `v-unapproved-001` (`status = "pending"`): Newly submitted partner profile awaiting admin review.
  * `v-unapproved-002` (`status = "returned"`): Profile returned to partner for menu revision.
  * `v-unapproved-003` (`status = "rejected"`): Suspended/rejected venue profile.

All public F3 endpoints filter `VenueModel.status == "approved"` at the SQL query level, ensuring unapproved records never leak into search results, filter facets, or direct detail URLs (`404 Not Found`).

---

## 4. REST API Contract Specification (For Frontend & QA Integration)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Endpoint | Method | Query / Path Parameters | Response Schema | Key Behavior & Validation |
|:---|:---:|:---|:---|:---|
| `/api/health` | `GET` | None | `{"status": "ok"}` | Ensures DB schema and F3 seed data are initialized; returns `200 OK`. |
| `/api/venues/filters` | `GET` | None | `FilterOptionsOut` | Aggregates distinct sorted `districts`, `cuisines`, `amenities`, `min_budget_vnd`, `max_budget_vnd`, `max_capacity`, and `total_approved_venues` (8). |
| `/api/venues` | `GET` | `q`, `district`, `cuisine`, `min_budget`, `max_budget`, `party_size`, `amenity`, `sort`, `page`, `page_size` | `VenueListResponse` | Searches venue fields AND dish names/descriptions; applies multi-attribute filters; returns `422` if `min_budget > max_budget` or `party_size < 1`. |
| `/api/venues/{venue_id}` | `GET` | `venue_id` (ID `v-hcmc-001` or slug `nha-hang-viet-xua-quan-1`) | `VenueDetailOut` | Returns full venue details, `available_slots`, flat `dishes`, and grouped `menu_categories`. Returns `404` if unapproved or missing. |

---

## 5. Automated Verification & Test Evidence

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

All 10 automated integration tests in `backend/tests/test_f3_discovery.py` and `backend/tests/test_health.py` were executed against the FastAPI application and relational database:

```text
$ python -m pytest -v
============================= test session starts =============================
platform win32 -- Python 3.13.3, pytest-9.1.1, pluggy-1.6.0
rootdir: D:\DineVina
configfile: pyproject.toml
testpaths: backend/tests
collected 10 items

backend/tests/test_f3_discovery.py::test_database_contains_both_approved_and_unapproved_fixtures PASSED [ 10%]
backend/tests/test_f3_discovery.py::test_list_venues_returns_only_approved_venues PASSED [ 20%]
backend/tests/test_f3_discovery.py::test_keyword_search_matches_venue_name_and_dish_name PASSED [ 30%]
backend/tests/test_f3_discovery.py::test_multi_attribute_filtering_district_cuisine_budget_party_size_amenity PASSED [ 40%]
backend/tests/test_f3_discovery.py::test_invalid_budget_range_returns_422 PASSED [ 50%]
backend/tests/test_f3_discovery.py::test_sorting_modes PASSED            [ 60%]
backend/tests/test_f3_discovery.py::test_filter_options_endpoint PASSED  [ 70%]
backend/tests/test_f3_discovery.py::test_venue_detail_endpoint_by_id_and_slug PASSED [ 80%]
backend/tests/test_f3_discovery.py::test_venue_detail_blocks_unapproved_and_nonexistent_venues PASSED [ 90%]
backend/tests/test_health.py::test_health PASSED                         [100%]

======================== 10 passed in 2.43s ========================
```
