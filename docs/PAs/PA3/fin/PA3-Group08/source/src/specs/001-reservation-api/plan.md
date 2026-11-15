# Implementation Plan: Table Reservation & Restaurant Discovery Backend

**Feature Branch**: `001-reservation-api`  
**Created**: 2026-10-26  
**Status**: Completed  
**Owner**: Nguyễn Trung Kiên (Backend Engineer)  

---

## 1. Architecture & Component Design

The backend implementation follows a modular layer separation under `backend/app/`:

```text
backend/app/
├── main.py          # FastAPI application initialization & REST route controllers
├── schemas.py       # Pydantic v2 schemas for request validation & response contracts
├── store.py         # Thread-safe in-memory data store with atomic state mutators
└── seed_data.py     # Deterministic initial seed data (venues, menus, slots)
```

### Component Roles:
1. **`schemas.py`:** Defines `ReservationCreate`, `ReservationItem`, `VenueItem`, `MenuItem`, ensuring strict type safety and OpenAPI compliance.
2. **`store.py`:** Simulates relational storage with in-memory dicts (`self.venues`, `self.reservations`) and atomic status update helper methods.
3. **`main.py`:** Exposes endpoints `/api/health`, `/api/venues`, `/api/venues/{id}`, `/api/reservations`, `/api/reservations/{id}/cancel`, equipped with CORS middleware for Vite frontend integration.
4. **`tests/test_reservations.py`:** Comprehensive `pytest` test suite covering end-to-end user journeys.

---

## 2. Test Strategy

1. **Unit & Contract Tests:**
   * Test health endpoint (`/api/health`) returns 200 OK.
   * Test venue discovery (`/api/venues`) returns seeded venue cards.
   * Test venue detail (`/api/venues/{id}`) returns dishes and operational metadata.
2. **Integration Flow:**
   * End-to-end reservation booking flow: create reservation -> verify state -> cancel reservation -> verify cancellation state.

---

## 3. Risk Mitigation
* **Data Persistence:** In-memory store is decoupled behind standard repository interfaces to facilitate frictionless migration to SQLAlchemy and PostgreSQL in PA3.
* **CORS:** Middleware allows cross-origin requests from Vite development server (`http://localhost:5173`).
