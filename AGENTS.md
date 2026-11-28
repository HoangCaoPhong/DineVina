# DineVina Agent Guidelines

Tài liệu này dành cho contributor/agent tiếp tục phát triển repo. Mục tiêu là giữ thay đổi nhỏ, kiểm thử được và không làm vỡ tích hợp F3/F5/F7.

## Branch và commit

- Base branch chính cho PA4 là `dev`.
- Branch docs/research theo mẫu: `research/PA4_<Ten>`.
- Branch implementation theo mẫu: `feat/PA4_F<n>_<Ten>`.
- Commit nhỏ theo phạm vi: model/migration, API, seed, backend test, frontend UI, E2E test.
- Không commit file untracked cá nhân hoặc artifact không liên quan.
- Không commit secret, `.env`, credential, database local, test output, `node_modules`, `dist`, `playwright-report`, `test-results`.
- Không đưa attribution của AI/agent/bot vào author, co-author, commit message hoặc PR body.
- Không rewrite/force-push branch đã public nếu chưa có xác nhận rõ ràng của owner.

## Backend

Backend nằm trong `backend/app`, dùng FastAPI + SQLAlchemy. Migration PostgreSQL thủ công nằm trong `backend/migrations`.

Chạy lint:

```bash
PYTHONPATH=backend .venv/bin/ruff check backend/app backend/tests
```

Chạy test:

```bash
PYTHONPATH=backend .venv/bin/pytest backend/tests -q
```

Chạy server local:

```bash
PYTHONPATH=backend .venv/bin/uvicorn app.main:app --reload --port 8000
```

### F7 backend contract

Các endpoint partner yêu cầu actor headers tương thích F5:

```text
X-User-Id: partner-demo
X-User-Role: partner_staff
X-Partner-Venues: v-hcmc-001,v-hcmc-002
```

Endpoint chính:

- `GET/PUT /api/partner/venues/{venue_id}/availability-settings`
- `GET/POST /api/partner/venues/{venue_id}/blocked-slots`
- `DELETE /api/partner/venues/{venue_id}/blocked-slots/{blocked_slot_id}`
- `GET /api/venues/{venue_id}/availability?date=YYYY-MM-DD&party_size=N`
- `GET /api/partner/venues/{venue_id}/dashboard`

Khi thay schema:

1. cập nhật SQLAlchemy model;
2. thêm/cập nhật migration SQL idempotent trong `backend/migrations`;
3. cập nhật fixture/seed nếu cần;
4. bổ sung regression test trước khi merge.

## Frontend

Frontend nằm trong `frontend`, dùng React + TypeScript + Vite.

Build kiểm tra production:

```bash
cd frontend
npm run build
```

Chạy dev server:

```bash
cd frontend
npm run dev
```

Vite proxy `/api` tới `http://127.0.0.1:8000`.

## Playwright E2E

Playwright đã được cấu hình:

- Config: `frontend/playwright.config.ts`
- Tests: `frontend/tests-e2e/`
- Script: `npm run test:e2e`

Config tự boot cả backend FastAPI và frontend Vite. Chạy:

```bash
cd frontend
npm run test:e2e
```

Nếu máy chưa có browser:

```bash
cd frontend
npx playwright install chromium
```

Không commit:

```text
frontend/test-results/
frontend/playwright-report/
```

Khi sửa UI F7 hoặc API contract, cập nhật E2E tương ứng. Ưu tiên assert theo role/heading/text ổn định; tránh selector strict dễ trùng text.

## Dữ liệu demo F7

Fixture chính: `backend/app/fixtures/f7_availability_dashboard_fixture.json`.

Venue demo thường dùng:

- `v-hcmc-001`
- `v-hcmc-002`

Seed được gọi trong `ensure_db_seeded()` và idempotent. Không dùng migration/seed để xóa dữ liệu thật trừ khi có yêu cầu rõ ràng.

## PR checklist

Trước khi mở/merge PR implementation:

- [ ] `PYTHONPATH=backend .venv/bin/ruff check backend/app backend/tests`
- [ ] `PYTHONPATH=backend .venv/bin/pytest backend/tests -q`
- [ ] `cd frontend && npm run build`
- [ ] `cd frontend && npm run test:e2e`
- [ ] migration SQL và SQLAlchemy model khớp nhau
- [ ] không commit artifact/cache/database/secret
- [ ] PR body ghi summary và test plan, không attribution AI/agent/bot
