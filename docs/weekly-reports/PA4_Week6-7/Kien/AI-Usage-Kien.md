# AI Usage Record - Nguyễn Trung Kiên (PA4 / Sprint 4)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Project:** DineVina — Smart Restaurant Reservation and Event Booking Marketplace  
**Member:** Nguyễn Trung Kiên (Backend Engineer — F5 Spec Kit, Reservation API & PostgreSQL, C4 Architecture L2/L3 Owner)  
**Sprint:** PA4 (Weeks 6–7)  
**Tool:** Antigravity AI Assistant  

---

## 1. Declaration

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

In compliance with PA4 Section F AI usage guidelines, AI assistance is used during Sprint 4 (PA4) solely as an engineering and documentation support tool for structuring F5 Spec Kit artifacts (`spec.md`, `plan.md`, `tasks.md`), drafting Mermaid C4 Level 2 and Level 3 architecture diagrams, scaffolding FastAPI/SQLAlchemy reservation modules and generated `pytest` tests, and organizing demo narration guides. Every specification rule, database schema invariant, diagram label, and test/execution output is manually reviewed and verified against the actual source code and teammate contracts before submission.

---

## 2. Usage Log

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Date | Tool | Material Supplied | Purpose | Result | Human Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 26 November 2026 | Antigravity AI Assistant | `PA4-2026.pdf`, PA3 Trello backlog, `UseCase-Model.md`, `UC-Customer.md`, `UC-Partner-Admin.md` | Initialize branch `research/PA4_Kien` and organize Kiên's PA4 task ownership, review duties, and handoff dependencies | Created `docs/weekly-reports/PA4_Week6-7/Kien/PA4-Tasks.md` | Verified every task description, owner, reviewer, and PA4 section reference against Trello cards |
| 26 November 2026 | Antigravity AI Assistant | `FR-5.1`–`FR-5.10`, `FR-7.3`, `UC-C08`–`UC-C11`, `UC-P06`/`P11`/`P12`, `UC-A04`, `src/constitution.md` | Draft complete PA4 Spec Kit artifacts (`spec.md`, `plan.md`, `tasks.md`) for Functional Group F5 (`003-f5-table-reservation`) | Authored F5 state machine, atomic capacity & cutoff rules, PostgreSQL schema plan, API contracts, and 8 implementation tasks | Cross-checked state transitions, 30-min response expiry, 2-hour cancel cutoff, and 30-min no-show grace rules against `UseCase-Model.md` |
| 26 November 2026 | Antigravity AI Assistant | `compose.yaml`, `Dockerfile.web`, `Dockerfile.api`, `frontend/nginx.conf`, `backend/app/*`, PA4 §C rubric | Draft Mermaid C4 Level 2 (Container) and Level 3 (Backend Component) architecture document and interface handoff table for Ngọc and Phong | Created `docs/weekly-reports/PA4_Week6-7/Kien/C4-Architecture-L2-L3.md` and `F5-F7-Video-Narration-Script.md` skeleton | Verified container names, ports (`8080`, `8000`, `5432`), and Nginx/FastAPI/PostgreSQL protocols match `compose.yaml` |
| 26 November 2026 | Antigravity AI Assistant | `src/specs/003-f5-table-reservation/*`, `backend/app/*`, Supabase live `reservations` schema check | Implement F5 models (`reservations`, `reservation_status_history`), Pydantic contracts, role/ownership guard (`auth.py`), atomic reservation lifecycle service, PostgreSQL/Supabase migration SQL, and retained `pytest` tests | Created `auth.py`, `reservations_service.py`, `f5_reservations_fixture.json`, `backend/migrations/001_f5_reservations.sql`, `test_f5_reservations.py`, and updated `models.py`, `schemas.py`, `seed.py`, `main.py` | Executed `pyrefly` (`0 errors`) and `pytest -v` verifying all F3 + F5 + health integration tests pass |

---

## 3. Supported Outputs (Current Revision)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

* `src/specs/003-f5-table-reservation/spec.md`
* `src/specs/003-f5-table-reservation/plan.md`
* `src/specs/003-f5-table-reservation/tasks.md`
* `backend/app/auth.py`
* `backend/app/models.py`
* `backend/app/schemas.py`
* `backend/app/reservations_service.py`
* `backend/app/seed.py`
* `backend/app/main.py`
* `backend/app/fixtures/f5_reservations_fixture.json`
* `backend/migrations/001_f5_reservations.sql`
* `backend/migrations/README.md`
* `backend/tests/test_f5_reservations.py`
* `docs/weekly-reports/PA4_Week6-7/Kien/PA4-Tasks.md`
* `docs/weekly-reports/PA4_Week6-7/Kien/C4-Architecture-L2-L3.md`
* `docs/weekly-reports/PA4_Week6-7/Kien/F5-F7-Video-Narration-Script.md`
* `docs/weekly-reports/PA4_Week6-7/Kien/AI-Usage-Kien.md`

---

## 4. Planned Future Entries & Limitations

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

Post-integration C4 L2/L3 verification against the final integrated team commit and the narrated PA4 F5 + F7 demo video recording will be appended once F7 and UI integration are complete. Final peer review and sign-off remain human-executed by **Trương Khánh Duy**.
