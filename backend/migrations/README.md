# Backend Database Migrations & Seed Guide (F3 + F5)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

## 1. Local Docker PostgreSQL (`compose.yaml`)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

When running with Docker Compose (`compose.yaml`), the `api` container connects to PostgreSQL 17 (`db:5432`) and initializes tables + idempotent seeds automatically on startup (`ensure_db_seeded()` in `backend/app/main.py`):

```powershell
docker compose up --build
```

To apply the idempotent F5 SQL migration manually against a running Docker `db` container:

```powershell
Get-Content backend/migrations/001_f5_reservations.sql | docker compose exec -T db psql -U dinevina -d dinevina
```

## 2. Supabase Cloud PostgreSQL (SQL Editor)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

1. Open **Supabase Dashboard** $\rightarrow$ **SQL Editor** $\rightarrow$ **New Query**.
2. Paste and execute [`backend/migrations/001_f5_reservations.sql`](001_f5_reservations.sql).
3. The script safely preserves existing PA2/PA3 `venues` and `reservations` rows while adding F5 columns (`reservation_code`, `idempotency_key`, `response_deadline`, `cancellation_deadline`), indexes, and `public.reservation_status_history`.

## 3. Local Development & Automated Tests (`SQLite` Fallback)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

To reset and re-seed the local development database (`dinevina_f3.db`) cleanly:

```powershell
$env:PYTHONPATH = "backend"
python -c "from app.database import Base, SessionLocal, engine; from app.seed import seed_f3_database, seed_f5_database; Base.metadata.create_all(bind=engine); s = SessionLocal(); print(seed_f3_database(s, force_refresh=True)); print(seed_f5_database(s, force_refresh=True)); s.close()"
```
