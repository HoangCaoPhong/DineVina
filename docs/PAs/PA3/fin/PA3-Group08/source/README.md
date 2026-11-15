# DineVina PA3 Source Package
**Performed by:** Hoàng Cao Phong and Nguyễn Trung Kiên | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

This is the runnable F3 restaurant discovery and venue detail increment submitted for PA3. The React client calls the FastAPI search, filter and detail endpoints; SQLAlchemy persists labeled sample venue and dish records. Public results are limited to approved venues. Other product groups in the Vision are planned or prototyped and are not implemented by this source package.

## Contents
**Performed by:** Hoàng Cao Phong and Nguyễn Trung Kiên | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

- `frontend/`: React, TypeScript, Vite client and lockfile.
- `backend/app/`: FastAPI endpoints, schemas, SQLAlchemy models and idempotent sample-data seeder.
- `backend/tests/`: backend integration tests, including two optional remote Supabase checks.
- `f3-fixture/`: Nhân's separate 15-venue SQL/Supabase-oriented sample fixture, validator and tests; this is not the 11-venue application seed used by the F3 API.
- `src/constitution.md` and `src/specs/002-f3-venue-discovery/`: Spec Kit constitution, specification, plan and tasks for F3. The `001-reservation-api` files are earlier planning artifacts, not a claim that reservations were implemented in PA3.
- `compose.yaml`, Dockerfiles, requirements files and `.env.example`: local deployment configuration. `.env.example` contains only placeholders; use your own credentials outside this archive for shared services.

## Run with Docker Compose
**Performed by:** Hoàng Cao Phong and Nguyễn Trung Kiên | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

From this `source/` directory:

```bash
cp .env.example .env
docker compose up --build
```

Open <http://localhost:8080> for the UI, <http://localhost:8000/docs> for OpenAPI, and <http://localhost:8000/api/venues> for approved venue results. Compose connects the API to PostgreSQL. Change the example database password before using a shared environment. Stop with `docker compose down`; this retains the database volume.

## Run locally without Docker
**Performed by:** Hoàng Cao Phong and Nguyễn Trung Kiên | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

Use Python 3.12+ and Node.js 22+ in two terminals. Without `DATABASE_URL`, the backend uses a local SQLite database for development. For a PostgreSQL check, point `DATABASE_URL` to an accessible PostgreSQL instance before starting the API or tests.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --app-dir backend --reload
```

In the second terminal:

```bash
cd frontend
npm ci
npm run dev
```

The Vite server is at <http://localhost:5173> and proxies `/api` to the backend. Run checks from `source/`:

```bash
ruff check backend
pytest -q -rs backend/tests
pytest -q f3-fixture/test_f3_fixture.py
cd frontend && npm run build
```

## API and verification boundary
**Performed by:** Hoàng Cao Phong and Nguyễn Trung Kiên | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

The F3 API exposes `/api/health`, `/api/venues`, `/api/venues/filters` and `/api/venues/{venue_id}`, plus compatible `/api/v1/restaurants` aliases. Search and detail endpoints reject unapproved venues. The UI shows an error when the API fails rather than substituting a hard-coded venue list. The PA3 package includes a separate `PostgreSQL-Local-Verification` report with a fresh PostgreSQL 17 run: 25 tests passed and 2 Supabase-specific tests skipped because remote credentials were not configured. That result does not prove a remote Supabase deployment works.
