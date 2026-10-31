# DineVina

**Group 8 · Introduction to Software Engineering (CSC13002)**  
Smart Restaurant Reservation & Event Booking System

DineVina is a planned restaurant marketplace for customers to discover restaurants, view menus and promotions, reserve tables, and request event services. Restaurant partners will manage their own listings, menus, availability, and bookings. AI features will be added in stages; the initial repository is a runnable scaffold, not a finished product.

## Team

| Student ID | Member | Email |
| --- | --- | --- |
| 24127486 | Hoàng Cao Phong (group leader) | hcphong2425@clc.fitus.edu.vn |
| 24127294 | Võ Mỹ Ngọc | vmngoc2433@clc.fitus.edu.vn |
| 24127475 | Lương Thiện Nhân | ltnhan2433@clc.fitus.edu.vn |
| 24127068 | Nguyễn Trung Kiên | ntkien2418@clc.fitus.edu.vn |
| 24127160 | Trương Khánh Duy | tkduy2414@clc.fitus.edu.vn |

## Start with Docker

Requirements: Docker and Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

Open <http://localhost:8080> for the web scaffold, <http://localhost:8000/docs> for API documentation, and <http://localhost:8000/api/health> for the health check. The database runs inside Compose and is not yet used by the API. Before using any shared environment, change the example password in both `POSTGRES_PASSWORD` and `DATABASE_URL`. Stop with `docker compose down`; this preserves database data in a named volume.

## Start without Docker

Use Python 3.12+ and Node.js 22+ in two terminals. Choose either `pip` or `uv` for the Python environment.

### Using pip

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --app-dir backend --reload
```

### Using uv

Install `uv` with the [official instructions](https://docs.astral.sh/uv/getting-started/installation/), then run:

```bash
uv sync --extra dev
uv run uvicorn app.main:app --app-dir backend --reload
```

`uv sync` creates or updates `.venv` from `pyproject.toml` and the committed `uv.lock` file. The `requirements*.txt` files remain available for the pip and Docker workflows.

```bash
cd frontend
npm ci
npm run dev
```

The Vite development server is at <http://localhost:5173> and proxies `/api` to the local backend. Run checks from the repository root:

```bash
ruff check backend       # pip environment
pytest
# or, without activating .venv:
uv run ruff check backend
uv run pytest
cd frontend && npm run build
```

## Repository map

```text
backend/app/              FastAPI endpoints and future domain modules
backend/tests/            Backend tests
frontend/src/             React/TypeScript client
docs/product-scope.md     Actors, functional groups, AI stages, MVP
docs/architecture.md      Planned architecture and data boundaries
docs/roadmap.md           Suggested delivery slices
docs/weekly-reports/      Weekly report source and evidence links
docs/adr/                 Architecture decision records
.github/workflows/        CI and container publishing
```

See [contribution workflow](CONTRIBUTING.md) before opening a pull request. Project reports and PDFs belong in `docs/`; screenshots used as evidence may be committed there if they contain no secrets or personal customer data.

## Delivery status

The current API only exposes `/api/health`. The UI is an informational placeholder. CI checks Python lint/tests, builds the frontend, and validates Docker builds. On a push to `main`, GitHub Actions can publish API and web images to GitHub Container Registry (GHCR). Deployment needs a hosting target and environment configuration; none is configured yet.
