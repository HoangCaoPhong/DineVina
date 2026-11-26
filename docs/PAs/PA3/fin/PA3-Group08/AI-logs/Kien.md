# AI Usage Record - Nguyễn Trung Kiên

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Project:** DineVina - Smart Restaurant Reservation and Event Booking Marketplace  
**Member:** Nguyễn Trung Kiên (Backend Engineer — F3 Spec Kit, FastAPI & PostgreSQL Owner)  
**Sprint:** PA3  
**Tool:** Antigravity AI Assistant  

## 1. Declaration

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

I used an AI coding assistant as a supporting tool during PA3 to draft Spec Kit specifications, scaffold SQLAlchemy 2.0 relational models and Pydantic v2 response schemas, implement FastAPI discovery/filtering endpoints for Functional Group F3, write automated `pytest` integration test cases, and format technical Markdown documentation and video narration guides. Every architectural constraint, endpoint contract, database invariant (strict `status == "approved"` filtering), and test execution result was manually verified by running the suite locally before committing.

## 2. Usage Log

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Date | Tool | Material supplied | Purpose | Result | Human verification |
| --- | --- | --- | --- | --- | --- |
| 12 November 2026 | Antigravity AI Assistant | `PA3-2026.pdf`, `src/constitution.md`, `PA2/Vision.md`, `PA3-Tasks.md` | Author PA3 Spec Kit artifacts for Functional Group F3 (`002-f3-venue-discovery`) covering search, multi-attribute filtering, and venue detail inspection | Updated `constitution.md` (v1.1.0) and drafted `spec.md`, `plan.md`, and `tasks.md` with Given-When-Then acceptance scenarios and REST contract table | Reviewed every user story against Vision Section 5.3 and checked attribution lines under each Markdown header |
| 12 November 2026 | Antigravity AI Assistant | `compose.yaml`, `pyproject.toml`, `backend/app/main.py`, PA3 F3 fixture scope | Implement SQLAlchemy 2.0 relational models (`venues`, `dishes`), Pydantic v2 schemas, idempotent fixture seeder, and FastAPI endpoints (`/api/venues`, `/api/venues/filters`, `/api/venues/{venue_id}`) | Created `database.py`, `models.py`, `schemas.py`, `seed.py`, `f3_venues_fixture.json`, and updated `main.py` with approved-only enforcement | Started local checks, inspected schema fields against Nhân's fixture format, and confirmed unapproved venues (`pending`, `returned`, `rejected`) never leak to public endpoints |
| 12 November 2026 | Antigravity AI Assistant | `backend/app/main.py`, `backend/app/fixtures/f3_venues_fixture.json` | Write automated integration tests covering approved-only isolation, dish/venue keyword search, multi-filter intersections, sorting, `422` validation, and `404` blocking | Created `backend/tests/test_f3_discovery.py` and fixed fixture-aligned assertions | Executed `python -m pytest -v` directly in terminal and verified 10/10 tests passed (`2.67s`) |
| 12–14 November 2026 | Antigravity AI Assistant | Test logs, Mermaid syntax rules, Trello task descriptions, teammate submission audit | Prepare English technical backend report, narrated video storyboard/script, and individual PA3 AI usage record | Created `F3-Backend-and-Database-Report.md`, `F3-Video-Narration-Script.md`, `AI-Usage-Kien.md`, and updated `PA3-Tasks.md` | Checked `git status` and `git diff` to ensure zero frontend or unrelated branch conflicts before pushing to PR #24 |

## 3. Supported Outputs

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

- `src/constitution.md` (v1.1.0)
- `src/specs/002-f3-venue-discovery/spec.md`
- `src/specs/002-f3-venue-discovery/plan.md`
- `src/specs/002-f3-venue-discovery/tasks.md`
- `backend/app/database.py`
- `backend/app/models.py`
- `backend/app/schemas.py`
- `backend/app/seed.py`
- `backend/app/main.py`
- `backend/app/fixtures/f3_venues_fixture.json`
- `backend/tests/test_f3_discovery.py`
- `docs/weekly-reports/PA3_Week4-5/Kien/F3-Backend-and-Database-Report.md`
- `docs/weekly-reports/PA3_Week4-5/Kien/F3-Video-Narration-Script.md`
- `docs/weekly-reports/PA3_Week4-5/Kien/AI-Usage-Kien.md`
- `docs/weekly-reports/PA3_Week4-5/Kien/PA3-Tasks.md`

## 4. Limitations

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

This record covers only AI assistance used for Nguyễn Trung Kiên's assigned PA3 deliverables (F3 Spec Kit artifacts, FastAPI + PostgreSQL backend, automated integration tests, technical report, and demo video narration script). It does not cover deliverables owned by other team members. Final video screen recording, YouTube upload/link verification, and peer review sign-off by Trương Khánh Duy remain human-executed steps.

