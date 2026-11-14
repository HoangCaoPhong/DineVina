# Feature Specification: Functional Group F3 — Restaurant Discovery and Venue Details

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Feature Branch**: `002-f3-venue-discovery`  
**Sprint / Milestone**: PA3 (Sprint 3 — Build B2)  
**Status**: Completed & Verified  
**Author**: Nguyễn Trung Kiên (`ntkien2418@clc.fitus.edu.vn`)  
**Scope**: End-to-End Implementation of Functional Group F3 (Vision Section 5.3)  

---

## 1. Overview & Problem Context

Per Section 5.3 of the DineVina Vision Document, customers need to search restaurants and dishes in Ho Chi Minh City, filter venues by district, cuisine, budget per person, party size (seating capacity), and amenities, and inspect a comprehensive venue detail page with categorized menus and operating conditions. Public browsing must work without requiring user sign-in or device geolocation permissions, and must strictly expose only administrator-approved (`status = 'approved'`) venues.

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 — Browse & Search Approved Venues by Keyword (Priority: P1)
As a customer browsing DineVina without signing in, I want to view approved restaurants in Ho Chi Minh City and search by keyword (restaurant name, dish name, cuisine, or district) so that I can quickly find relevant dining options.

**Independent Test**: `GET /api/venues` and `GET /api/venues?q=<keyword>`

**Acceptance Scenarios**:
1. **Given** a database seeded with 8 approved venues and 3 unapproved venues (`pending`, `returned`, `rejected`), **When** a customer requests `GET /api/venues`, **Then** the API returns HTTP `200 OK` containing only the 8 approved venues, each marked with `status: "approved"` and `is_sample: true`.
2. **Given** approved venues with dishes in the database, **When** a customer searches `GET /api/venues?q=Phở` or `GET /api/venues?q=Sashimi`, **Then** the API returns only approved venues whose name, cuisine, description, or menu dishes match the keyword case-insensitively.
3. **Given** a keyword that matches no approved venue (`GET /api/venues?q=xyznonexistent`), **When** the request is executed, **Then** the API returns HTTP `200 OK` with `total: 0` and an empty `items: []` array so the UI can render a clean empty state.

---

### User Story 2 — Multi-Attribute Filtering & Sorting (Priority: P1)
As a customer with specific dining constraints, I want to filter restaurants by district, cuisine, maximum/minimum budget per person, party size (capacity), and required amenities, and sort the results, so that I can narrow down a shortlist that fits my occasion.

**Independent Test**: `GET /api/venues?district=...&cuisine=...&max_budget=...&party_size=...&amenity=...&sort=...` and `GET /api/venues/filters`

**Acceptance Scenarios**:
1. **Given** approved venues across Ho Chi Minh City districts, **When** a customer filters by `district=Quận 1` and `cuisine=Ẩm thực Việt`, **Then** only approved venues matching both criteria are returned.
2. **Given** a customer with a budget limit of `350000` VND/person (`max_budget=350000`) and a group of `40` guests (`party_size=40`), **When** the query is submitted, **Then** only approved venues with `min_budget_vnd <= 350000` and `max_capacity >= 40` are returned.
3. **Given** a customer requiring private rooms (`amenity=Phòng riêng`), **When** the filter is applied, **Then** only approved venues containing `"Phòng riêng"` in their amenities list are returned.
4. **Given** invalid numeric filter parameters (e.g., `party_size=0`, `min_budget=-50000`, or `min_budget > max_budget`), **When** the request is sent, **Then** the API returns HTTP `422 Unprocessable Entity` with a clear validation error message.
5. **Given** the frontend initialization flow, **When** the UI requests `GET /api/venues/filters`, **Then** the API returns distinct districts, cuisines, amenities, budget bounds, and maximum capacity aggregated strictly from approved venues.

---

### User Story 3 — Inspect Complete Venue Details & Categorized Menu (Priority: P1)
As a customer who selected a venue card from the discovery list, I want to open its detail page to inspect its full description, address, opening hours, price range, seating capacity, amenities, cancellation policy, available booking slots, and categorized dish menu with VND prices.

**Independent Test**: `GET /api/venues/{venue_id}` (supports both venue ID and URL slug)

**Acceptance Scenarios**:
1. **Given** an approved venue ID `v-hcmc-001` (or slug `nha-hang-viet-xua-quan-1`), **When** the client requests `GET /api/venues/v-hcmc-001`, **Then** the API returns HTTP `200 OK` with full venue metadata, `menu_categories` grouped by course, flat `dishes` list, `available_slots`, and sample data attribution.
2. **Given** an unapproved venue ID `v-unapproved-001` (`status = 'pending'`) or a non-existent ID `v-999`, **When** a client requests `GET /api/venues/v-unapproved-001`, **Then** the API returns HTTP `404 Not Found` and never exposes unapproved venue data.

---

## 3. Non-Functional & Data Contract Invariants
* **Public Access**: No authentication token or geolocation permission is required for any F3 endpoint.
* **Approved-Only Guardrail**: Enforced at the SQLAlchemy query layer (`VenueModel.status == "approved"`).
* **Sample Data Labeling**: Every fixture venue includes `is_sample: true` and `sample_label: "Sample Data — PA3 Validated Fixture"`.
* **Performance**: $p95$ response latency $\le 300\text{ ms}$ via indexed SQL columns (`status`, `district`, `cuisine`, `min_budget_vnd`, `max_capacity`).
