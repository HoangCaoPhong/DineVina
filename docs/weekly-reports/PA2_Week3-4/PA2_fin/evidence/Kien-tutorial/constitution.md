# DineVina Backend Constitution

## Core Principles

### I. API Contract-First & Schema Determinism
Every backend capability must begin with a formal API contract. All request parameters, response bodies, and error formats must be strictly typed using Pydantic v2 schemas and conform to OpenAPI 3.1 specifications. Code is not implemented until the schema and endpoints are reviewed.

### II. Test-First & Automated Verification (NON-NEGOTIABLE)
All business workflows must have automated unit and integration tests using `pytest` and FastAPI `TestClient`. Every state transition, boundary condition, and error response must be verified by automated tests. Red-Green-Refactor cycle is strictly enforced: test cases are authored against contract specifications before final route logic is completed.

### III. Reservation State Machine Integrity & Concurrency Safety
Table and event reservations must follow deterministic state transitions (`AWAITING_CONFIRMATION` → `CONFIRMED` / `DECLINED` / `EXPIRED`, `CONFIRMED` → `CANCELLED_BY_CUSTOMER` / `CANCELLED_BY_RESTAURANT` / `COMPLETED` / `NO_SHOW`). Terminal states are immutable. Race conditions on seat capacity must be protected via atomic operations and slot quota checks.

### IV. Zero Credential Exposure & Secret Isolation
No API credentials, secret keys, or environment-specific tokens may ever be hardcoded or committed to version control. Configuration must be loaded from environment variables (`.env`). Local `.gitignore` must actively filter all agent tokens and temporary caches.

### V. Human-in-the-Loop AI Engineering
AI coding assistants (Spec Kit, Antigravity, Gemini CLI) are used as productivity amplifiers under strict human oversight. The engineer reviews every generated line of code, validates business invariants against course requirements, and executes all test suites locally before committing.

## Technology Stack & Architectural Constraints
* **Runtime:** Python 3.13+
* **Web Framework:** FastAPI (RESTful JSON APIs, CORS enabled)
* **Validation:** Pydantic v2 (Strict typing, ISO 8601 timestamps, Vietnamese phone validation)
* **Testing:** `pytest`, `httpx`, `TestClient`
* **Data Layer:** In-memory atomic store for prototype verification; PostgreSQL schema compatibility for production

## Governance
This Constitution establishes the baseline engineering principles for DineVina backend development in PA2 and beyond. All pull requests, AI-assisted code generations, and task breakdowns must adhere to these non-negotiables.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Author**: Nguyễn Trung Kiên (Backend Engineer)
