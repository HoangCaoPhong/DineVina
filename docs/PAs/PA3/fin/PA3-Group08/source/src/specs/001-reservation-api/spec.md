# Feature Specification: Table Reservation & Restaurant Discovery Backend

**Feature Branch**: `001-reservation-api`  
**Created**: 2026-10-26  
**Status**: Completed & Verified  
**Author**: Nguyễn Trung Kiên (`ntkien2418@clc.fitus.edu.vn`)  
**Input**: Spec Kit Tutorial Walkthrough on DineVina FastAPI Backend

---

## User Scenarios & Testing

### User Story 1 - Discover Venues & Check Available Slots (Priority: P1)
As a diner, I want to query the list of available restaurants and inspect live booking slots so that I can decide where and when to reserve a table.

**Why this priority**: Core entry point of the marketplace. Without venue discovery and slot availability, no booking can occur.

**Independent Test**: Can be tested independently via `GET /api/venues` and `GET /api/venues/{id}` returning mock/seed restaurant cards and operational hours.

**Acceptance Scenarios**:
1. **Given** 3 seeded restaurants in DB, **When** diner sends `GET /api/venues`, **Then** return status 200 with non-empty restaurant array containing venue name, cuisine, and pricing.
2. **Given** valid venue ID `v1`, **When** diner sends `GET /api/venues/v1`, **Then** return venue details and menu categories with dishes.

---

### User Story 2 - Submit Table Reservation Request (Priority: P1)
As a customer, I want to submit a table booking request with my contact details, date, time, and party size so that the restaurant can reserve a table for me.

**Why this priority**: Fundamental transaction of the DineVina B2B2C marketplace.

**Independent Test**: Can be tested via `POST /api/reservations` with JSON payload, returning status 200/201 and initial state `PENDING_CONFIRMATION` or confirmed.

**Acceptance Scenarios**:
1. **Given** valid booking payload (`venue_id`, `party_size=4`, `reserved_date`, `reserved_time`), **When** user posts to `/api/reservations`, **Then** reservation is created with unique ID and saved in store.
2. **Given** negative party size or missing venue, **When** user submits request, **Then** backend returns `400 Bad Request` or `422 Unprocessable Entity`.

---

### User Story 3 - Cancel Existing Reservation (Priority: P2)
As a customer, I want to cancel my reservation before arrival so that the table is freed for other diners.

**Why this priority**: Required for state lifecycle completion and customer courtesy.

**Independent Test**: Can be tested via `POST /api/reservations/{id}/cancel`.

**Acceptance Scenarios**:
1. **Given** active reservation ID, **When** customer sends cancellation request, **Then** state transitions to `CANCELLED` and cancellation timestamp is recorded.

---

## Technical Constraints & Requirements
* **Framework:** FastAPI with Python 3.13
* **Validation:** Pydantic models for request bodies and response schemas
* **Test Client:** Pytest with FastAPI `TestClient`
* **Concurrency:** In-memory store with dictionary locks to prevent double-booking
