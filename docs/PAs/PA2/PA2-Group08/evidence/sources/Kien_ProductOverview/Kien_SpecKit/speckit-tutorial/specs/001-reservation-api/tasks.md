# Actionable Tasks: Table Reservation & Restaurant Discovery Backend

**Feature Branch**: `001-reservation-api`  
**Status**: 100% Completed  
**Owner**: Nguyễn Trung Kiên (Backend Engineer)  

---

## Task Checklist & Execution Log

- [x] **TASK-01: Establish Data Schemas (`backend/app/schemas.py`)**
  - Define `ReservationCreate` model with validation for `venue_id`, `customer_name`, `customer_phone`, `reserved_date`, `reserved_time`, `party_size`.
  - Define `ReservationItem` with status enum and timestamp fields.
  - Define `VenueItem` and `MenuItem` schemas for restaurant catalog.

- [x] **TASK-02: Implement In-Memory Simulation Store (`backend/app/store.py`)**
  - Implement `DataStore` class with thread-safe lock.
  - Add `create_reservation`, `get_reservation`, and `cancel_reservation` methods.
  - Implement seed loader initializing restaurants and mock availability.

- [x] **TASK-03: Implement Discovery & Reservation Endpoints (`backend/app/main.py`)**
  - Implement `GET /api/venues` and `GET /api/venues/{id}` with error handling (404 for missing venue).
  - Implement `POST /api/reservations` for booking creation with payload validation.
  - Implement `POST /api/reservations/{id}/cancel` handling lifecycle transition.
  - Configure CORS middleware for local Vite frontend requests.

- [x] **TASK-04: Author Automated Test Suite (`backend/tests/test_reservations.py`)**
  - Implement `test_health()` verification.
  - Implement `test_venues_discovery()` verifying catalog search.
  - Implement `test_venue_detail_and_menu()` verifying menu payload.
  - Implement `test_create_and_cancel_reservation_flow()` validating lifecycle transitions.

- [x] **TASK-05: Verification & Test Execution**
  - Execute `pytest` across test suite; ensure 100% pass rate.
  - Record execution log and verify convergence against initial spec.

