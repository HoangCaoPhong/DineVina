# Actionable Tasks: Functional Group F7 — Availability & Partner Dashboard

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

**Spec Reference:** [spec.md](./spec.md)  
**Plan Reference:** [plan.md](./plan.md)  
**Implementation Branch:** `feat/PA4_F7_Nhan`

---

## Task Execution Checklist

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- [ ] **TASK-F7-01: Lock F5/F7 Schema and State Contract**
  * **Files:** `src/specs/004-f7-availability-partner-dashboard/spec.md`, `docs/weekly-reports/PA4_Week6-7/Nhan/PA4-Tasks.md`
  * **Description:** Confirm active capacity-holding states (`Pending confirmation`, `Confirmed`), shared reservation table shape, response-deadline behavior, and the boundary that F7 does not implement F5 decision endpoints.
  * **Verification:** Spec and Partner/Admin use-case document use the same states and integration wording as Kiên's F5 artifacts.

- [ ] **TASK-F7-02: Add Availability Persistence Models and PostgreSQL Migration**
  * **Files:** `backend/app/models.py`, `backend/migrations/002_f7_availability_dashboard.sql`, `backend/migrations/README.md` if present/needed
  * **Description:** Add `venue_availability_settings`, `venue_operating_hours`, `venue_blocked_slots`, F5-compatible reservation read models, and `event_inquiries` with indexes/constraints.
  * **Verification:** `Base.metadata.create_all()` succeeds on SQLite and migration SQL is idempotent PostgreSQL syntax.

- [ ] **TASK-F7-03: Define F7 Pydantic Contracts and Actor Guardrails**
  * **Files:** `backend/app/schemas.py`, `backend/app/auth.py`
  * **Description:** Add typed schemas for settings, hours, blocks, availability, dashboard rows/summary, validation errors, and header-based actor resolution with `partner_staff` role enforcement.
  * **Verification:** OpenAPI generation succeeds and unauthorized requests produce `401 AUTH_REQUIRED` / `403 FORBIDDEN_ROLE` / `403 FORBIDDEN_VENUE`.

- [ ] **TASK-F7-04: Implement Availability Settings and Blocked-slot Service/API**
  * **Files:** `backend/app/availability_service.py`, `backend/app/main.py`
  * **Description:** Implement GET/PUT availability settings with revision checking and transactional replacement of operating hours; implement create/list/cancel blocked slots with overlap and confirmed-reservation conflict validation.
  * **Verification:** Valid updates persist, invalid writes roll back, overlapping blocks return `409 BLOCKED_SLOT_OVERLAP`, and confirmed overlaps return `409 BLOCKED_SLOT_CONFLICT` with IDs.

- [ ] **TASK-F7-05: Implement Public Slot Calculation**
  * **Files:** `backend/app/availability_service.py`, `backend/app/main.py`
  * **Description:** Implement `GET /api/venues/{venue_id}/availability` using weekly hours, blocked ranges, active reservation holds, closed weekdays, past slots, and non-negative capacity calculation.
  * **Verification:** Given–When–Then scenarios `US-F7-03` and `US-F7-05` pass; unapproved venues return `404`.

- [ ] **TASK-F7-06: Implement Partner Dashboard Aggregation API**
  * **Files:** `backend/app/availability_service.py`, `backend/app/main.py`
  * **Description:** Implement dashboard summary, paginated reservation/event queues, filters, sorting, nearest deadline, and owned-venue isolation.
  * **Verification:** Given–When–Then scenario `US-F7-06` passes and no rows outside the authorized venue scope are exposed.

- [ ] **TASK-F7-07: Seed Idempotent F7 Demo Data**
  * **Files:** `backend/app/seed.py`, `backend/app/fixtures/f7_operations_fixture.json`
  * **Description:** Seed availability settings/hours for approved venues plus demo blocked slots, reservations in meaningful states, and event inquiries using future relative dates.
  * **Verification:** Repeated startup does not duplicate rows; dashboard and availability screens have realistic persisted data.

- [ ] **TASK-F7-08: Generate and Retain Backend Test Suite**
  * **Files:** `backend/tests/test_f7_availability_dashboard.py`
  * **Description:** Implement pytest coverage derived from all Spec Kit acceptance scenarios while preserving existing health/F3 tests.
  * **Verification:** `python -m pytest -v` passes; `ruff check backend` passes.

- [ ] **TASK-F7-09: Implement React Availability Management UI**
  * **Files:** `frontend/src/availabilityApi.ts`, `frontend/src/PartnerAvailability.tsx`, `frontend/src/partnerF7.css`, `frontend/src/App.tsx`
  * **Description:** Build weekly hours/capacity editor, blocked-slot creation/cancellation, validation/conflict display, revision refresh behavior, and responsive accessible layout.
  * **Verification:** `npm run build` passes; saved values survive reload through the API.

- [ ] **TASK-F7-10: Implement React Partner Dashboard UI**
  * **Files:** `frontend/src/PartnerDashboard.tsx`, `frontend/src/availabilityApi.ts`, `frontend/src/partnerF7.css`, `frontend/src/App.tsx`
  * **Description:** Build summary cards, reservation/event queues, filters, empty/error/retry states, and responsive tables/cards.
  * **Verification:** `npm run build` passes; dashboard displays persisted API rows for owned venue only.

- [ ] **TASK-F7-11: Final Integration Verification and Evidence**
  * **Files:** implementation diff, test output, demo notes in `docs/weekly-reports/PA4_Week6-7/Nhan/`
  * **Description:** Run backend tests, lint, frontend build, inspect git diff, capture prototype/demo evidence, and prepare PR summary/test plan.
  * **Verification:** Reviewer can trace every implemented behavior to `spec.md`, `UC-P04`, `UC-P05`, tests, and commits.
