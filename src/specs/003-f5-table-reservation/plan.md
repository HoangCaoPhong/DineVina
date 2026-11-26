# Technical Implementation Plan: Functional Group F5 — Table Reservation Requests & Lifecycle

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Feature Branch:** `003-f5-table-reservation` (`research/PA4_Kien`)  
**Spec Reference:** [spec.md](file:///d:/DineVina/src/specs/003-f5-table-reservation/spec.md)  
**Upstream Constitution:** [constitution.md](file:///d:/DineVina/src/constitution.md)

---

## 1. Architecture Alignment & Cross-Owner Dependencies

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

F5 extends the existing FastAPI + SQLAlchemy 2.0 + PostgreSQL 17 backend established in PA3 (`backend/app/`) without breaking any F3 discovery endpoints or contracts:

* **Role & Auth Dependency (Align with Võ Mỹ Ngọc & Trương Khánh Duy):**
  * Existing PA3 routes (`GET /api/venues*`) remain unauthenticated for `Guest` users.
  * F5 Customer, Partner, and Admin endpoints resolve an authenticated actor context (`user_id`, `role` in `{'customer', 'partner_staff', 'administrator'}`, `owned_venue_ids`) via a shared FastAPI dependency (`get_current_user` / `require_role`) agreed at Sprint Planning before API handoff.
* **Availability & Capacity Coordination with F7 (Align with Lương Thiện Nhân):**
  * F7 (`UC-P04`, `UC-P05`) owns venue operating hours, default slot capacity, blocked dates/time slots, and partner operational queues.
  * F5 (`UC-C08`, `UC-C09`, `UC-P06`, `UC-P11`, `UC-P12`) reads F7 availability configuration and executes atomic slot capacity accounting inside shared SQLAlchemy database transactions so booked + pending held seats never exceed `slot_capacity`.
  * Event inquiries (`F6`) remain in a separate table/queue and never deduct regular 30-minute F5 table slot inventory unless explicitly finalized under F6/F7 rules.

---

## 2. Relational PostgreSQL Schema Extensions (`backend/app/models.py`)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

Two new normalized F5 tables join existing `venues` (`VenueModel`) and `dishes` (`DishModel`), linking cleanly to F7 availability tables (`venue_availability_rules`, `venue_blocked_slots` coordinated with Nhân):

### 2.1 `reservations` (`ReservationModel`)
* `id` (`String(64)`, PK) — UUID / deterministic test ID (plus human-readable `reservation_code` `String(24)`, unique, indexed).
* `venue_id` (`String(64)`, FK -> `venues.id`, indexed).
* `customer_id` (`String(64)`, indexed) — owner user ID (`SEC-04`).
* `customer_name` (`String(120)`), `customer_phone` (`String(32)`).
* `reserved_date` (`Date`, indexed), `reserved_time` (`String(5)`, `"HH:MM"`, 30-minute slot, indexed).
* `party_size` (`Integer`, check `1 <= party_size <= 50`).
* `special_requests` (`Text`, default `""`).
* `status` (`String(32)`, indexed): `'Pending confirmation' | 'Confirmed' | 'Declined' | 'Expired' | 'Cancelled by customer' | 'Cancelled by restaurant' | 'Completed' | 'No-show'`.
* `idempotency_key` (`String(128)`, nullable, unique per `(customer_id, idempotency_key)` for `UC-C09` A6 duplicate retry protection).
* `response_deadline` (`DateTime(timezone=True)`, `created_at + 30 min`).
* `cancellation_deadline` (`DateTime(timezone=True)`, `reserved_datetime - 2 hours`).
* `created_at`, `updated_at` (`DateTime(timezone=True)`).
* Composite index: `(venue_id, reserved_date, reserved_time, status)` for fast slot capacity aggregation.

### 2.2 `reservation_status_history` (`ReservationStatusHistoryModel`)
* `id` (`String(64)`, PK).
* `reservation_id` (`String(64)`, FK -> `reservations.id ON DELETE CASCADE`, indexed).
* `from_state` (`String(32)`, nullable for initial creation).
* `to_state` (`String(32)`, nullable=False).
* `actor_id` (`String(64)`), `actor_role` (`String(32)`: `'customer' | 'partner_staff' | 'administrator' | 'system'`).
* `reason` (`Text`, default `""`).
* `created_at` (`DateTime(timezone=True)`, indexed).

---

## 3. Atomic Capacity & Expiry Mechanics

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

1. **Active Capacity Accounting (`FR-7.3`):**
   * Active reservations consuming capacity on `(venue_id, reserved_date, reserved_time)` are strictly those in `status IN ('Pending confirmation', 'Confirmed')` where `Pending confirmation` has not passed `response_deadline`.
   * On slot check or booking mutation, expired `Pending confirmation` requests (`now > response_deadline`) are lazily finalized to `'Expired'` (appending system audit history) and excluded from occupied seats; similarly `Confirmed` bookings past `reserved_datetime + 30 min` can be transitioned to `'No-show'`.
2. **Database Locking Strategy:**
   * On PostgreSQL, reservation creation (`POST /api/reservations`) and partner confirmation (`POST /api/partner/reservations/{id}/confirm`) acquire row-level locks (`SELECT ... FOR UPDATE` on the parent `venues` row or dedicated slot lock) before computing remaining capacity and committing state changes.
   * On SQLite (`pytest` local test runs), SQLAlchemy serializes write transactions cleanly while keeping full transactional rollback semantics.

---

## 4. REST API Contract Table (F5)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Endpoint | Method | Role | Query / Body | Response Schema / Behavior |
| :--- | :---: | :--- | :--- | :--- |
| `/api/venues/{venue_id}/availability` | `GET` | Guest+ | `?date=YYYY-MM-DD&party_size=4` | Returns 30-min slots (`time`, `status`, `remaining_capacity`, `is_blocked`). `404` if venue unapproved; `422` on past date or invalid party size. |
| `/api/reservations` | `POST` | Customer | `{venue_id, reserved_date, reserved_time, party_size, customer_name, customer_phone, special_requests, idempotency_key?}` | Atomically creates `Pending confirmation` request (`201 Created`) + history entry; idempotent retry returns `200 OK`; full slot returns `409` with adjacent slots. |
| `/api/reservations` | `GET` | Customer | `?status=&page=&page_size=` | Paginated list (`default 20`, `max 50`) scoped to signed-in `customer_id`. |
| `/api/reservations/{id}` | `GET` | Customer | Path `id` | Returns reservation detail, deadlines, and chronological `status_history` (`403`/`404` if not owner). |
| `/api/reservations/{id}/cancel` | `POST` | Customer | `{reason}` | Cancels `Confirmed` booking if `now <= cancellation_deadline` (`200 OK` -> `Cancelled by customer`); rejects `< 2h` cutoff with `409` + `venue_hotline`. |
| `/api/partner/reservations/{id}/confirm` | `POST` | Partner | `{}` | Lazy-checks 30-min expiry, rechecks capacity atomically, transitions `Pending confirmation` -> `Confirmed`. |
| `/api/partner/reservations/{id}/decline` | `POST` | Partner | `{reason}` (required) | Transitions `Pending confirmation` -> `Declined`, releases held capacity. `422` if `reason` blank. |
| `/api/partner/reservations/{id}/cancel` | `POST` | Partner | `{reason}` (required) | Transitions `Confirmed` -> `Cancelled by restaurant`, releases slot capacity (`UC-P11`). |
| `/api/partner/reservations/{id}/check-in` | `POST` | Partner | `{}` | Validates arrival window and transitions `Confirmed` -> `Completed` (`UC-P12`). |
| `/api/partner/reservations/{id}/no-show` | `POST` | Partner | `{reason?}` | Transitions `Confirmed` -> `No-show` after 30-min grace period (`UC-P12` A1). |
| `/api/admin/reservations/support` | `GET` | Admin | `?query=&venue_id=&status=&page=&page_size=` | Searches reservations across venues by code/ID/customer/venue (`403` for non-admin). |
| `/api/admin/reservations/{id}` | `GET` | Admin | Path `id` | Returns full reservation record and immutable chronological audit history (`UC-A04`). |

---

## 5. Planned Files, Migrations & Verification Strategy

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

* **Backend Modules (`backend/app/`):**
  * `models.py` — add `ReservationModel` and `ReservationStatusHistoryModel`.
  * `schemas.py` — add F5 request/response contracts + standard error envelope helper.
  * `reservations_service.py` (new) — atomic slot capacity computation, state transition guard table, lazy expiry/no-show handling, and audit logging.
  * `auth.py` (coordinated with Ngọc/Duy) — lightweight session/role dependency (`get_current_user`, `require_roles`) supporting Customer, Partner Staff, and Administrator contexts.
  * `main.py` — register Customer, Partner, and Admin F5 routers/endpoints.
  * `seed.py` & `fixtures/f5_reservations_fixture.json` — seed realistic demo reservations covering `Pending confirmation`, `Confirmed`, `Declined`, `Expired`, `Cancelled by customer`, `Cancelled by restaurant`, `Completed`, and `No-show` for immediate UI & Admin verification.
* **Database Initialization & Migration Instructions:**
  * `Base.metadata.create_all(bind=engine)` and `seed_f3_database()` + `seed_f5_database()` initialize PostgreSQL tables and idempotent seed rows automatically on FastAPI startup (`compose.yaml` `api` container -> PostgreSQL `db` container), with documented reset/migration commands for local PostgreSQL & SQLite verification.
* **Automated Test Suite (`backend/tests/test_f5_reservations.py`):**
  * Generated and retained `pytest` integration tests verifying every Given–When–Then criterion, 2-hour cutoff boundary (`119m`, `120m`, `121m`), 30-minute expiry window, 30-minute no-show grace period, idempotency retry, overlapping capacity concurrency checks, and `401`/`403`/`404`/`409`/`422` error paths.
