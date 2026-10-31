# Spec Kit Training - Nguyễn Trung Kiên

* **Task:** `[PA2] Spec Kit Training - Kien`
* **Owner:** Nguyễn Trung Kiên (`ntkien2418@clc.fitus.edu.vn`)
* **Reviewer:** Hoàng Cao Phong (`hoangcaophong.works@gmail.com`)
* **Proposed Due:** 30 Oct 2026
* **Status:** Completed & Verified
* **Tool / Repository:** [GitHub Spec Kit (github/spec-kit)](https://github.com/github/spec-kit)

---

## 1. Overview & Setup

Spec Kit is an open-source toolkit developed by GitHub for **Spec-Driven Development (SDD)** with AI coding agents (Antigravity, Gemini CLI, Claude Code, GitHub Copilot). It enforces rigorous engineering discipline by establishing baseline specifications, architectural plans, and deterministic task breakdowns before any implementation code is generated.

### Installation Record
* **Date:** 25 Oct 2026
* **Environment:** Windows, Python 3.13.3, `uv` tool
* **Command executed:**
  ```powershell
  python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
  ```
* **CLI Verification:**
  ```powershell
  specify --version
  ```

---

## 2. Tutorial Walkthrough & Steps

| Step # | Date | Tutorial Module / Action | Description & Execution Details | Evidence / Artifact Link |
|:---:|:---:|:---|:---|:---|
| 1 | 25/10/2026 | Environment Setup & CLI Installation | Installed `specify-cli` via `uv` tool from GitHub official repo. | [Step 1 Log](#step-1-cli--environment-setup) |
| 2 | 26/10/2026 | Project Initialization (`specify init`) | Initialized Spec Kit workspace with Gemini CLI / Antigravity integration and PowerShell scripts. | [speckit-tutorial/](./Kien-tutorial/) |
| 3 | 26/10/2026 | Establishing Constitution (`/speckit.constitution`) | Defined DineVina backend core non-negotiables: API-first, TDD, state machine integrity, secret isolation. | [constitution.md](./Kien-tutorial/constitution.md) |
| 4 | 26/10/2026 | Feature Specification (`/speckit.specify`) | Created baseline user scenarios and acceptance criteria for Table Reservation & Discovery backend. | [spec.md](./Kien-tutorial/specs/001-reservation-api/spec.md) |
| 5 | 27/10/2026 | Technical Plan & Tasks (`/speckit.plan`, `/speckit.tasks`) | Formulated layered architectural plan and 5 atomic, testable tasks. | [plan.md](./Kien-tutorial/specs/001-reservation-api/plan.md) / [tasks.md](./Kien-tutorial/specs/001-reservation-api/tasks.md) |
| 6 | 28/10/2026 | Implementation & Automated Verification | Verified implementation against FastAPI backend and executed `pytest` test suite (8/8 passed). | [Pytest Verification Log](#step-6-implementation--automated-verification) |

---

## 3. Detailed Step Logs

### Step 1: CLI & Environment Setup
* **Date:** 25 October 2026
* **Actions Taken:**
  * Installed `specify-cli` (v1.2.4.dev0) via `python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`.
  * Verified CLI executable at `C:\Users\ADMIN\.local\bin\specify.exe`.
  * Verified tool integration status with `specify check`.
* **CLI Evidence:**
  ```text
  $ specify version
  GitHub Spec Kit - Spec-Driven Development Toolkit
  CLI Version    1.2.4.dev0
  Python         3.13.3
  Platform       Windows AMD64

  $ specify check
  Checking for installed tools...
  ├── ● Antigravity (available)
  ├── ● Claude Code (available)
  ├── ● Gemini CLI (available)
  └── ○ GitHub Copilot (no CLI required)
  Specify CLI is ready to use!
  ```

---

### Step 2: Workspace Initialization
* **Date:** 26 October 2026
* **Actions Taken:**
  * Initialized a dedicated Spec Kit tutorial workspace targeting the DineVina backend service using `specify init`.
  * Selected PowerShell script execution (`--script ps`) and Gemini CLI / Antigravity integration (`--integration gemini`).
* **Execution Command:**
  ```powershell
  specify init --non-interactive --script ps --integration gemini "docs/weekly-reports/PA2_Week3-4/Kien_ProductOverview/Kien_SpecKit/speckit-tutorial"
  ```
* **CLI Output:**
  ```text
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │  Specify Project Setup                                                      │
  │  Project         speckit-tutorial                                           │
  │  Target Path     D:\DineVina\...\Kien_SpecKit\speckit-tutorial              │
  └─────────────────────────────────────────────────────────────────────────────┘
  Selected coding agent integration: gemini
  Selected script type: ps
  Initialize Specify Project
  ├── ● Check required tools (ok)
  ├── ● Select coding agent integration (gemini)
  ├── ● Select script type (ps)
  ├── ● Install integration (Gemini CLI)
  ├── ● Install shared infrastructure (scripts (ps) + templates)
  ├── ○ Ensure scripts executable
  ├── ● Constitution setup (copied from template)
  ├── ● Install bundled workflow (speckit installed)
  └── ● Finalize (project ready)
  Project ready.
  ```
* **Generated Workspace Structure:**
  * `.specify/memory/constitution.md`
  * `.specify/scripts/powershell/` (`create-new-feature.ps1`, `setup-plan.ps1`, `setup-tasks.ps1`, `common.ps1`)
  * `.specify/templates/` (`spec-template.md`, `plan-template.md`, `tasks-template.md`, `checklist-template.md`)

---

### Step 3: Establishing Project Constitution
* **Date:** 26 October 2026
* **Actions Taken:**
  * Customised `.specify/memory/constitution.md` to define project non-negotiables for DineVina backend engineering.
* **Core Principles Ratified:**
  1. **API Contract-First:** All endpoints strictly modeled via Pydantic v2 schemas and OpenAPI 3.1 before route implementation.
  2. **Test-First Verification (NON-NEGOTIABLE):** Automated Given-When-Then test cases written and validated with `pytest` and `TestClient`.
  3. **State Machine Integrity:** Deterministic reservation states (`AWAITING_CONFIRMATION` → `CONFIRMED`/`DECLINED` → `COMPLETED`/`CANCELLED`/`NO_SHOW`) with slot concurrency protection.
  4. **Zero Credential Exposure:** Strict isolation of secrets via environment variables; automated `.gitignore` filtering.
  5. **Human-in-the-Loop AI Engineering:** AI generates boilerplate; engineer reviews, validates edge cases, and verifies test suites.
* **Artifact Link:** [DineVina Backend Constitution](./Kien-tutorial/constitution.md)

---

### Step 4: Feature Specification (`001-reservation-api`)
* **Date:** 26 October 2026
* **Actions Taken:**
  * Created new feature branch specification using Spec Kit scaffolding script:
    ```powershell
    .\.specify\scripts\powershell\create-new-feature.ps1 -ShortName "reservation-api" -FeatureDescription "Table Reservation and Discovery Backend" -AllowExistingBranch
    ```
  * Authored user scenarios prioritized by customer value:
    * **User Story 1 (P1):** Discover Venues & Check Available Slots (`GET /api/venues`, `GET /api/venues/{id}`).
    * **User Story 2 (P1):** Submit Table Reservation Request (`POST /api/reservations`).
    * **User Story 3 (P2):** Cancel Existing Reservation (`POST /api/reservations/{id}/cancel`).
* **Artifact Link:** [Feature Specification (spec.md)](./Kien-tutorial/specs/001-reservation-api/spec.md)

---

### Step 5: Technical Plan & Task Breakdown
* **Date:** 27 October 2026
* **Actions Taken:**
  * Scaffolded architecture plan and tasks checklist:
    ```powershell
    $env:SPECIFY_FEATURE = '001-reservation-api'
    .\.specify\scripts\powershell\setup-plan.ps1
    .\.specify\scripts\powershell\setup-tasks.ps1
    ```
  * Defined layered backend architecture:
    * `backend/app/schemas.py`: Pydantic models for request validation and response contracts.
    * `backend/app/store.py`: In-memory thread-safe simulation store with atomic mutators.
    * `backend/app/main.py`: FastAPI endpoints and CORS middleware.
    * `backend/tests/test_reservations.py`: Automated integration test suite.
  * Broke down execution into 5 discrete tasks (`TASK-01` through `TASK-05`).
* **Artifact Links:** 
  * [Implementation Plan (plan.md)](./Kien-tutorial/specs/001-reservation-api/plan.md)
  * [Actionable Tasks (tasks.md)](./Kien-tutorial/specs/001-reservation-api/tasks.md)

---

### Step 6: Implementation & Automated Verification
* **Date:** 28 October 2026
* **Actions Taken:**
  * Implemented and linked the backend prototype components under `backend/app/` (`schemas.py`, `store.py`, `seed_data.py`, `main.py`).
  * Executed comprehensive test suite using `pytest`:
    ```powershell
    python -m pytest backend/tests -v
    ```
* **Execution Evidence & Test Results:**
  ```text
  ============================= test session starts =============================
  platform win32 -- Python 3.13.3, pytest-9.1.1, pluggy-1.6.0 -- C:\Python313\python.exe
  cachedir: .pytest_cache
  rootdir: D:\DineVina
  configfile: pyproject.toml
  plugins: anyio-4.11.0
  collecting ... collected 8 items

  backend/tests/test_health.py::test_health PASSED                         [ 12%]
  backend/tests/test_reservations.py::test_health PASSED                   [ 25%]
  backend/tests/test_reservations.py::test_venues_discovery PASSED         [ 37%]
  backend/tests/test_reservations.py::test_venue_detail_and_menu PASSED    [ 50%]
  backend/tests/test_reservations.py::test_create_and_cancel_reservation_flow PASSED [ 62%]
  backend/tests/test_reservations.py::test_partner_confirm_reservation PASSED [ 75%]
  backend/tests/test_reservations.py::test_ai_recommendation PASSED        [ 87%]
  backend/tests/test_reservations.py::test_auth_flow PASSED                [100%]

  ======================== 8 passed, 1 warning in 1.46s =========================
  ```
* **Outcome:** All 8 automated test scenarios passed with 100% success rate, satisfying all acceptance criteria established in `spec.md`.

---

## 4. Key Lessons Learned

### 1. Spec-Driven vs. Vibe Coding
* **"Vibe Coding" pitfalls:** Prompting an AI model to generate backend routes without formal constraints inevitably leads to hallucinations: inconsistent parameter naming (e.g., camelCase vs snake_case), mismatched HTTP status codes (200 vs 201 on creation), loose type coercion, and lack of boundary condition handling.
* **Spec-Driven Development (SDD) advantage:** Spec Kit forces the specification of data schemas, invariants, and edge cases **before** implementation starts. The AI agent acts within tight guardrails defined by the `constitution.md` and `spec.md`, resulting in deterministic, reproducible, and verifiable code generation on the first attempt.

### 2. Deterministic Task Breakdowns
* Decomposing a large feature (such as the Table Reservation Lifecycle) into discrete, self-contained tasks (`TASK-01` Schema → `TASK-02` Store → `TASK-03` Endpoints → `TASK-04` Pytest) drastically reduces cognitive load and token context overflow for the AI agent.
* Each task possesses an unambiguous acceptance criterion that can be verified immediately via automated tests (`pytest`) or schema validation, completely eliminating ambiguous "almost working" states.

### 3. Practical Integration with Project DineVina
* **Reusability across sprints:** The Spec Kit workflow proved directly effective for DineVina's backend deliverables. The feature specification (`001-reservation-api`) seamlessly aligns with the [Discovery-and-Reservation-API-Contract.md](./Discovery-and-Reservation-API-Contract.md).
* **Smooth migration path to PA3/PA4:** In future milestones, as the in-memory `store.py` is migrated to PostgreSQL via SQLAlchemy and Alembic migrations, the existing Spec Kit tests and contracts will serve as an automated regression safety net to guarantee zero behavioral regressions.

---
