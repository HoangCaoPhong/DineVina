# DineVina Backend & Full-Stack Constitution

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

## Core Principles

### I. API Contract-First & Schema Determinism
Every backend capability must begin with a formal API contract. All request parameters, query filters, response bodies, and error envelopes must be strictly typed using Pydantic v2 schemas and conform to OpenAPI 3.1 specifications before route implementation.

### II. Approved-Only Public Discovery & Sample Data Transparency (NON-NEGOTIABLE)
Public discovery and venue detail endpoints (`GET /api/venues`, `GET /api/venues/filters`, `GET /api/venues/{id}`) must strictly filter for administrator-approved records (`status = 'approved'`). Unapproved, pending, returned, rejected, or suspended venues must never leak into public search results, filter facet aggregations, or detail responses. All fixture records must carry explicit sample metadata (`is_sample`, `sample_label`).

### III. Persistent Relational Storage with PostgreSQL
All functional groups implemented from PA3 onward must persist data in a relational database managed via SQLAlchemy 2.0 ORM (`DATABASE_URL` targeting PostgreSQL 17 in Docker Compose and production environments, with deterministic test database isolation for automated `pytest` execution).

### IV. Test-First & Automated Verification
All business workflows, multi-attribute filters, boundary conditions, and negative paths (`404 Not Found` for unapproved/non-existent venues, `422 Unprocessable Entity` for invalid query parameters) must be verified by automated integration tests using `pytest` and FastAPI `TestClient`.

### V. Zero Credential Exposure & Secret Isolation
No API credentials, database passwords, or environment-specific tokens may ever be hardcoded or committed to version control. Configuration is injected via environment variables (`DATABASE_URL`, `.env`).

### VI. Human-in-the-Loop Spec-Driven Engineering
AI coding agents operate strictly within the boundaries of ratified `spec.md`, `plan.md`, and `tasks.md` artifacts. Every generated module is reviewed by the responsible engineer and verified against the use-case specifications.

## Technology Stack & Architectural Constraints
* **Runtime:** Python 3.12+ / 3.13+
* **Web Framework:** FastAPI (RESTful JSON APIs, CORS enabled, OpenAPI 3.1)
* **ORM & Persistence:** SQLAlchemy 2.0 + PostgreSQL (`psycopg2-binary`)
* **Validation:** Pydantic v2
* **Testing:** `pytest`, `httpx`, `TestClient`
* **Frontend Integration:** React 18 + TypeScript + Vite via `/api/*` REST proxy

**Version**: 1.1.0 | **Ratified**: 2026-10-26 | **Updated for PA3**: 2026-11-12 | **Author**: Nguyễn Trung Kiên (Backend Engineer)
