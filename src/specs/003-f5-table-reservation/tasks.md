# Actionable Tasks: Functional Group F5 — Table Reservation Requests & Lifecycle

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Feature Branch:** `003-f5-table-reservation` (`research/PA4_Kien`)  
**Plan Reference:** [plan.md](file:///d:/DineVina/src/specs/003-f5-table-reservation/plan.md)  
**Spec Reference:** [spec.md](file:///d:/DineVina/src/specs/003-f5-table-reservation/spec.md)

---

## Task Execution Checklist

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

- [ ] **TASK-F5-01: Confirm Sprint Scope, Role Contracts & F5/F7 Schema Boundary**
  * **Participants:** Nguyễn Trung Kiên, Lương Thiện Nhân, Võ Mỹ Ngọc, Trương Khánh Duy
  * **Description**: Confirm F5 & F7 scope from PA3 Project Plan §3.1 at Sprint Planning. Lock `Customer` / `Partner Staff` / `Administrator` session/role dependency with Ngọc & Duy, and finalize shared slot capacity, blocked-slot lookup, and transaction boundary with Nhân (F7).
  * **Verification**: Shared dependency contract and F5/F7 schema interface documented before API implementation.

- [ ] **TASK-F5-02: Extend Relational Models & Migration/Seed Setup**
  * **Files**: `backend/app/models.py`, `backend/app/seed.py`, `backend/app/fixtures/f5_reservations_fixture.json`, `README.md` / report migration notes
  * **Description**: Add `ReservationModel` (`reservations`) and `ReservationStatusHistoryModel` (`reservation_status_history`) with composite `(venue_id, reserved_date, reserved_time, status)` indexing, foreign keys, and idempotent demo fixture records spanning all 8 reservation states.
  * **Verification**: Schema initializes cleanly against both PostgreSQL 17 (`compose.yaml`) and SQLite test runs (`Base.metadata.create_all()`).

- [ ] **TASK-F5-03: Define F5 Pydantic v2 Schemas & Error Envelopes**
  * **Files**: `backend/app/schemas.py`
  * **Description**: Author typed request/response contracts for slot availability (`SlotAvailabilityOut`), reservation creation/detail/list (`ReservationCreateIn`, `ReservationOut`, `ReservationStatusHistoryOut`), decision/cancel payloads (`ReasonActionIn`), admin support search, and `STD-01` structured error responses (including `suggested_slots` and `venue_hotline`).
  * **Verification**: OpenAPI `/openapi.json` schema validates cleanly with `pyrefly` reporting 0 errors.

- [ ] **TASK-F5-04: Implement Atomic Slot Availability & Customer Reservation Flow (`UC-C08`–`UC-C11`)**
  * **Files**: `backend/app/reservations_service.py`, `backend/app/auth.py`, `backend/app/main.py`
  * **Description**: Implement `GET /api/venues/{venue_id}/availability`, `POST /api/reservations` (idempotency + atomic slot capacity hold + adjacent slot suggestions on `409`), `GET /api/reservations`, `GET /api/reservations/{id}`, and `POST /api/reservations/{id}/cancel` (enforcing exact 2-hour cutoff and hotline return).
  * **Verification**: Customer booking lifecycle persists across server restarts and respects F7 operating hours and blocked slots.

- [ ] **TASK-F5-05: Implement Partner Decisions, Operational Cancel & Attendance (`UC-P06`, `UC-P11`, `UC-P12`)**
  * **Files**: `backend/app/reservations_service.py`, `backend/app/main.py`
  * **Description**: Implement `confirm`, `decline` (mandatory reason), `cancel` (`Cancelled by restaurant` with mandatory reason), `check-in` (`Completed`), and `no-show` (`No-show` after 30-min grace period), plus lazy 30-minute partner-response expiry (`Expired`). Enforce `partner_staff` venue ownership (`SEC-04`).
  * **Verification**: Concurrent confirmation attempts never exceed slot capacity; expired or terminal bookings reject illegal transitions (`REL-01`).

- [ ] **TASK-F5-06: Implement Admin Support History Investigation (`UC-A04`)**
  * **Files**: `backend/app/main.py`, `backend/app/reservations_service.py`
  * **Description**: Implement `GET /api/admin/reservations/support` and `GET /api/admin/reservations/{id}` scoped strictly to `administrator` role (`403` for customer/partner), returning full chronological `reservation_status_history`.
  * **Verification**: Support queries return full immutable transition log (`actor_id`, `actor_role`, `reason`, `created_at`).

- [ ] **TASK-F5-07: Generate & Retain Automated Pytest Integration Suite (`PA4 §E`)**
  * **Files**: `backend/tests/test_f5_reservations.py`
  * **Description**: Generate and retain automated `pytest` tests verifying slot availability, request creation + idempotency, 2-hour cancel cutoff boundary, 30-minute expiry window, atomic capacity locking, partner cancel/attendance transitions, role isolation (`401`/`403`), and admin history retrieval—while keeping all 27 existing F3/health tests passing.
  * **Verification**: `python -m pytest -v` passes 100% with 0 regressions.

- [ ] **TASK-F5-08: Verify Frontend Integration & Update Architecture/Demo Artifacts**
  * **Files**: `docs/weekly-reports/PA4_Week6-7/Kien/C4-Architecture-L2-L3.md`, `docs/weekly-reports/PA4_Week6-7/Kien/F5-F7-Video-Narration-Script.md`
  * **Description**: Verify customer, partner, and admin screens operate end-to-end against persisted F5 & F7 backend data; cross-check C4 Level 2 & Level 3 diagrams against the integrated submission commit; record and upload the narrated PA4 YouTube demo video.
  * **Verification**: Reviewer (**Trương Khánh Duy**) confirms code, tests, architecture consistency, and playable demo link before Done.
