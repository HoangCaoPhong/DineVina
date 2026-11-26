# PA3 F3 PostgreSQL Verification
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

## Environment and method
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

On 14 November 2026, the F3 backend test suite was executed against a fresh, disposable **PostgreSQL 17 Alpine** container on the local machine. The API used `DATABASE_URL` pointing to that container, not SQLite. The database was created for this verification and the container was stopped afterward. No remote Supabase project was configured. The packaged `.env.example` contains only local example values; no live credential is included.

## Results
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

| Check | Observed result |
| --- | --- |
| `pytest -q -rs` with PostgreSQL `DATABASE_URL` | **25 passed, 2 skipped** in 2.18 seconds. The two skips explicitly state that Supabase credentials were not configured. |
| Persisted `venues` grouped by moderation status | `approved = 8`, `pending = 1`, `rejected = 1`, `returned = 1` (11 total). |
| Persisted `dishes` | 21 rows. |
| `GET /api/venues` using FastAPI TestClient with the PostgreSQL connection | HTTP 200, `total = 8`. |
| `GET /api/venues/v-unapproved-001` | HTTP 404. |
| `GET /api/venues/v-hcmc-001` | HTTP 200 with approved venue detail. |
| `GET /api/health` | HTTP 200. |
| Separate 15-venue fixture validator tests | **8 passed** against the copied `source/f3-fixture/` files. This is a distinct dataset and not the API seed. |

The 25 passing tests cover the backend behavior on PostgreSQL, including filtering, pagination, validation, and venue visibility. This run verifies the local PostgreSQL path and persistence of the seeded records. It does **not** establish that the group's remote Supabase deployment, credentials, schema, or network path work. The two Supabase-specific tests remain unverified rather than being treated as passes.

## Reproduction
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

From the packaged `source/` directory, start an isolated PostgreSQL 17 service (for example through `compose.yaml`), set `DATABASE_URL` to its local connection string, install `requirements-dev.txt`, and run `python -m pytest -q -rs`. Do not put real connection credentials in this report or the submission archive. For remote Supabase verification, configure the project's own `SUPABASE_URL` and a suitable key outside the archive, then rerun the two specific tests and record the observed result separately.
