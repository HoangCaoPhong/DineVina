# Implementation Plan: Availability & Partner Dashboard (Functional Group F7)

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

**Spec Reference:** [spec.md](./spec.md)  
**Implementation Branch:** `feat/PA4_F7_Nhan`  
**Research/Docs Branch:** `research/PA4_Nhan`  
**Baseline:** `origin/dev` at `4072ede`, with schema/API coordination informed by Kiên's F5 branch contract

---

## 1. Technical Context & Integration Boundary

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

The current `origin/dev` backend contains F3 venue/dish discovery only. Kiên's F5 branch defines the reservation lifecycle schema and the shared capacity states. F7 therefore uses the same state names and compatible reservation table shape, but implements only the parts required for availability calculation and dashboard queues:

* F7 owns availability settings, operating hours, blocked slots, slot calculation, and partner dashboard aggregation.
* F5 owns customer reservation creation and partner decision/cancellation/attendance actions.
* F6 owns event-inquiry conversation/proposal behavior. F7 stores/reads a forward-compatible queue projection so the dashboard is persisted end-to-end without claiming full F6 behavior.
* Authentication production behavior is out of scope. F7 uses the PA4 header contract already used by the F5 reference (`X-User-Id`, `X-User-Role`, `X-Partner-Venues`).

The implementation must work with PostgreSQL through `compose.yaml` and with the local SQLite fallback used by the existing pytest suite.

---

## 2. Backend Architecture

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

### 2.1 Modules

| File | Responsibility |
| --- | --- |
| `backend/app/auth.py` | Resolve demo actor context from headers and enforce role/venue ownership helpers. |
| `backend/app/models.py` | Add availability, blocked-slot, reservation read-model, reservation-history, and event-inquiry models while preserving existing venue/dish models. |
| `backend/app/schemas.py` | Add typed Pydantic request/response contracts for settings, blocks, availability slots, dashboard summary, and queue rows. |
| `backend/app/availability_service.py` | Contain validation, transactional settings mutation, block conflict checks, slot generation/capacity calculation, lazy pending-expiry handling, and dashboard aggregation. |
| `backend/app/main.py` | Register public availability and partner availability/dashboard endpoints. |
| `backend/app/seed.py` | Add `seed_f7_database()` and invoke it idempotently after F3 seeding. |
| `backend/app/fixtures/f7_operations_fixture.json` | Store deterministic demo operating exceptions, reservations, and event inquiries using relative day offsets where needed. |
| `backend/migrations/002_f7_availability_dashboard.sql` | Provide idempotent PostgreSQL migration SQL for PA4 submission evidence. |
| `backend/tests/test_f7_availability_dashboard.py` | Retain generated/derived pytest coverage for the acceptance scenarios. |

### 2.2 Schema plan

#### `venue_availability_settings`

* `venue_id` primary key and foreign key to `venues.id` with cascade.
* `default_slot_capacity` integer, validated `1..venues.max_capacity`.
* `slot_granularity_minutes` integer, fixed at `30` for PA4.
* `revision` integer, incremented on every successful settings write.
* `updated_by`, `updated_at` audit metadata.

#### `venue_operating_hours`

* `id` primary key.
* `venue_id` foreign key with cascade.
* `day_of_week` integer `0..6` (`0=Monday`).
* `open_time`, `close_time` time values.
* `is_active` boolean.
* unique constraint on `(venue_id, day_of_week)`.

#### `venue_blocked_slots`

* `id` primary key.
* `venue_id` foreign key with cascade.
* `blocked_date`, `start_time`, `end_time`.
* `reason` text.
* `status`: `Active` or `Cancelled`.
* `created_by`, `created_at`, `cancelled_by`, `cancelled_at` audit metadata.
* indexes on `(venue_id, blocked_date, status)`.

#### Shared/forward-compatible read models

* `reservations` and `reservation_status_history` follow Kiên's F5 shape and canonical state names so integration does not require a different capacity contract.
* `event_inquiries` stores the minimum persisted fields needed by `UC-P05`: inquiry code, venue, customer display data, occasion, preferred date, party size, budget range, special needs, status, timestamps, and message preview.

---

## 3. Service Logic Plan

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

### 3.1 Availability settings read/update

1. Resolve actor with `require_roles('partner_staff')`.
2. Verify target venue ownership through `X-Partner-Venues`.
3. Load venue and settings. If a legacy venue has no settings row, initialize defaults from its existing `opening_hours` display string and `max_capacity` inside a transaction.
4. For `PUT`, validate:
   * unique `day_of_week` values in `0..6`;
   * `open_time < close_time` for active rows;
   * `default_slot_capacity` in `1..venue.max_capacity`;
   * optional `expected_revision` matches persisted revision;
   * no active future reservation slot holds more seats than the proposed capacity.
5. On PostgreSQL, lock the settings/venue row with `SELECT ... FOR UPDATE` before validation/write. On SQLite pytest, rely on serialized writes and transactional rollback.
6. Replace operating-hour rows and increment revision atomically. Return the persisted representation.

### 3.2 Blocked slots

1. Validate non-empty reason, valid date/time formats, non-past range, and `start_time < end_time`.
2. Reject overlap with active blocks using half-open interval logic: `new_start < existing_end AND new_end > existing_start`.
3. Treat every reservation slot as a 30-minute half-open interval. Reject creation if it overlaps a future `Confirmed` reservation and return affected IDs. Collect overlapping `Pending confirmation` IDs as non-blocking warnings.
4. Cancellation is a state transition to `Cancelled`; it is idempotent and preserves audit evidence.

### 3.3 Public slot calculation

1. Validate approved venue, date format/future-or-today, and party size.
2. Lazily expire overdue pending reservations for the venue/date before aggregation, appending system history when the shared history table is present.
3. Load active operating-hours row for `date.weekday()`. If missing/inactive, return an empty slot list with `closed_reason`.
4. Generate slots in 30-minute increments from open to close using half-open intervals.
5. Preload active reservation quantities and active blocked ranges for the date.
6. For each slot calculate:
   * `occupied = sum(party_size)` for non-expired `Pending confirmation` plus `Confirmed`;
   * `remaining_capacity = max(0, default_slot_capacity - occupied)`;
   * status precedence `Past` → `Blocked` → `Sold out` → `Available`.
7. Return discount metadata from the existing F3 `available_slots` JSON where present.

### 3.4 Partner dashboard

1. Validate partner ownership and pagination/filter parameters.
2. Apply lazy expiry before calculating counts.
3. Summary metrics:
   * pending reservations requiring action;
   * confirmed reservations for selected date or today;
   * seats reserved for selected date or today;
   * open event inquiries;
   * active blocked slots in the next seven days;
   * nearest pending response deadline.
4. Reservation rows are sorted by operational urgency: pending response deadline first, then service date/time.
5. Event rows are sorted by latest update descending.
6. Both queues use the requested page/page_size metadata and never expose other venues.

---

## 4. Frontend Architecture

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| File | Responsibility |
| --- | --- |
| `frontend/src/availabilityApi.ts` | Typed API client, actor-header helper, error formatting, and F7 response types. |
| `frontend/src/PartnerAvailability.tsx` | Weekly operating-hours editor, capacity field, optimistic revision handling, blocked-slot form/list, validation/conflict display. |
| `frontend/src/PartnerDashboard.tsx` | Summary cards, reservation/event queues, status/date filters, pagination metadata, retry/empty states. |
| `frontend/src/partnerF7.css` | Responsive accessible layout for partner operational screens. |
| `frontend/src/App.tsx` | Integrate the F7 screens into the existing partner workspace without disturbing customer discovery behavior. |

The existing frontend is a monolithic React prototype. F7 components will therefore be modular but integrated through the current workspace modal rather than introducing a new router dependency.

---

## 5. Test & Verification Plan

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

### 5.1 Backend pytest scenarios

`backend/tests/test_f7_availability_dashboard.py` will cover:

1. seeded/default settings are readable and use approved venue metadata;
2. valid settings update persists and increments revision;
3. invalid times/capacity return `422` and do not mutate;
4. stale revision returns `409`;
5. unauthenticated/customer/other-venue partner access returns `401/403`;
6. public availability generates 30-minute slots and respects active reservation holds;
7. closed weekday returns empty slots with reason;
8. blocked-slot creation affects public availability;
9. overlapping blocks return `409 BLOCKED_SLOT_OVERLAP`;
10. confirmed-reservation overlap returns `409 BLOCKED_SLOT_CONFLICT` with IDs;
11. capacity reduction below active holds returns `409 CAPACITY_CONFLICT`;
12. dashboard returns persisted summary/queues, filters, empty states, and pagination validation.

### 5.2 Frontend verification

* `npm run build` must pass TypeScript and Vite production build.
* The partner workspace will be manually smoke-tested with the API running where feasible.
* If Playwright is already available in the integrated branch later, F7 scenarios can be added without changing the backend contract; this plan does not introduce a new heavyweight browser dependency solely for PA4 F7.

### 5.3 General verification

* `python -m pytest -v` must keep existing health/F3 tests passing.
* `ruff check backend` must pass.
* `npm run build` must pass.
* PostgreSQL migration SQL must be idempotent and aligned with SQLAlchemy models.

---

## 6. Commit Slices

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

1. `feat(f7): add availability persistence models and migration`
2. `feat(f7): implement availability settings and blocked-slot APIs`
3. `feat(f7): implement public slot calculation and dashboard API`
4. `feat(f7): seed f7 demo operations data`
5. `test(f7): add backend availability and dashboard tests`
6. `feat(f7): add partner availability management ui`
7. `feat(f7): add partner dashboard ui`
8. `chore(f7): verify full-stack integration`

Each commit should remain small enough to review independently while preserving a buildable branch where feasible.
