# Actionable Tasks: Functional Group F3 — Restaurant Discovery and Venue Details

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Feature Branch**: `002-f3-venue-discovery`  
**Plan Reference**: `src/specs/002-f3-venue-discovery/plan.md`  

---

## Task Execution Checklist

- [x] **TASK-F3-01: Configure SQLAlchemy 2.0 & PostgreSQL Database Layer**
  * **Files**: `backend/app/database.py`, `backend/app/models.py`, `requirements.txt`, `pyproject.toml`
  * **Description**: Set up SQLAlchemy engine supporting `DATABASE_URL` (PostgreSQL 17 in Docker Compose and SQLite fallback for local CLI tests). Define `VenueModel` and `DishModel` with indexed filter columns (`status`, `district`, `cuisine`, `min_budget_vnd`, `max_capacity`).
  * **Verification**: Database tables create cleanly on startup without migration errors.

- [x] **TASK-F3-02: Define Pydantic v2 Data Contract Schemas**
  * **Files**: `backend/app/schemas.py`
  * **Description**: Author strict response schemas (`VenueSummaryOut`, `VenueDetailOut`, `MenuCategoryOut`, `DishOut`, `FilterOptionsOut`, `VenueListResponse`) aligned with Lương Thiện Nhân's F3 data contract and Hoàng Cao Phong's React UI props.
  * **Verification**: OpenAPI `/openapi.json` schema validates without warnings.

- [x] **TASK-F3-03: Author & Seed Validated F3 Venue/Menu Fixture**
  * **Files**: `backend/app/fixtures/f3_venues_fixture.json`, `backend/app/seed.py`
  * **Description**: Create idempotent seeder loading 8 approved Ho Chi Minh City venues (spanning District 1, District 3, Binh Thanh, Thu Duc, District 7, Phu Nhuan; multiple cuisines, budgets, capacities, and amenities; 32+ dishes) plus 3 unapproved venues (`pending`, `returned`, `rejected`) to test moderation filtering. Include explicit `is_sample` and `sample_label` fields.
  * **Verification**: Startup seed populates exactly 11 total venues (8 approved, 3 unapproved) and is idempotent across restarts.

- [x] **TASK-F3-04: Implement `GET /api/venues` Search, Multi-Filter & Sort Endpoint**
  * **Files**: `backend/app/main.py`
  * **Description**: Implement keyword search (`q` matching venue name, cuisine, district, description, and dish names), multi-attribute filters (`district`, `cuisine`, `min_budget`, `max_budget`, `party_size`, `amenity`), sorting (`rating`, `price_asc`, `price_desc`, `capacity`, `name`), and pagination (`page`, `page_size`), strictly restricted to `status == 'approved'`.
  * **Verification**: Queries return only matching approved venues and validate invalid numeric bounds with `422 Unprocessable Entity`.

- [x] **TASK-F3-05: Implement `GET /api/venues/filters` & `GET /api/venues/{venue_id}` Endpoints**
  * **Files**: `backend/app/main.py`
  * **Description**: Implement dynamic filter metadata aggregation from approved venues and detailed single-venue retrieval (supporting both ID and slug lookup) with categorized menus (`menu_categories` and `dishes`). Return `404 Not Found` for non-existent or unapproved venues.
  * **Verification**: Approved venue returns `200 OK` with menu categories; unapproved venue returns `404 Not Found`.

- [x] **TASK-F3-06: Author & Execute Automated Integration Test Suite**
  * **Files**: `backend/tests/test_f3_discovery.py`, `backend/tests/test_health.py`
  * **Description**: Write 16 automated `pytest` scenarios covering health status, approved-only isolation, keyword search across venues and dishes, each filter dimension, combined filters, sorting, empty result states, invalid parameter `422` errors, and `404` on unapproved venue detail access.
  * **Verification**: `python -m pytest -v` passes 100% of test cases.

- [x] **TASK-F3-07: Prepare End-to-End Verification Log & Demo Video Narration Script**
  * **Files**: `docs/weekly-reports/PA3_Week4-5/Kien/PA3-Tasks.md`, `docs/weekly-reports/PA3_Week4-5/Kien/F3-Backend-and-Database-Report.md`, `docs/weekly-reports/PA3_Week4-5/Kien/F3-Video-Narration-Script.md`
  * **Description**: Document API contract, PostgreSQL schema, Spec Kit traceability, test outputs, and scene-by-scene narration script for the PA3 YouTube demo video.
  * **Verification**: All documentation files formatted in Markdown with required attribution headers.
