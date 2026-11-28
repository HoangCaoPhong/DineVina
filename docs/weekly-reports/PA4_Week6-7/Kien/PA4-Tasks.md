# PA4 — Nguyễn Trung Kiên

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

---

## 1. Tasks Owned by Nguyễn Trung Kiên

**Owner:** Nguyễn Trung Kiên | **Reviewer:** Trương Khánh Duy

### Task 1: F5 Spec Kit, Reservation Backend API & PostgreSQL Persistence
* **Source:** `PA4 §E` and `PA3 F5 model` (proposed PA4 groups from submitted PA3 Project Plan §3.1: **F5** & **F7**)
* **Scope & Deliverables:**
  * Confirm scope at Sprint Planning and review role/session dependencies before the API handoff.
  * Lead the **F5 Spec Kit workflow** (`specify`, `plan`, `tasks`, `implement`, and retain generated tests).
  * Extend the existing reservation contract and PostgreSQL schema as needed.
  * Implement **availability lookup**, **persisted requests/history**, **partner decisions**, **cancellation**, **expiry**, **attendance/no-show**, and **reservation support history** according to the agreed Vision and use cases.
  * Coordinate contracts:
    * Agree slot/capacity and atomic update behavior with **Lương Thiện Nhân**.
    * Agree API and role contracts with **Võ Mỹ Ngọc** and **Trương Khánh Duy**.
* **Acceptance Criteria:**
  * F5 works with both the customer and partner/admin screens against persisted data.
  * Commit the Spec Kit artifacts, migration/seed instructions, and generated tests.
  * Link the pull request, artifact, or evidence before moving to **In Review**; move to **Done** after reviewer acceptance.

### Task 2: Mermaid C4 Level 2 (Containers) & Level 3 (Backend Components)
* **Source:** `PA4 §C`
* **Scope & Deliverables:**
  * Produce **Mermaid C4 Level 2** for the running system and **Mermaid C4 Level 3** for the key backend components.
  * Explain each container's responsibility, technology, and communication protocols.
  * Explain each backend component's responsibility and relationships, using actual API/business logic, persistence, and the most important **F3 / F5 / F7** paths.
  * Provide **Võ Mỹ Ngọc** and **Hoàng Cao Phong** with exact container names and interfaces for their frontend and deployment diagrams.
* **Acceptance Criteria:**
  * Both diagrams render cleanly and match the integrated submission commit and the other architecture sections.
  * Link the pull request, artifact, or evidence before moving to **In Review**; move to **Done** after reviewer acceptance.

### Task 3: Narrated PA4 Demo Video (F5 & F7)
* **Source:** `PA4 §E`
* **Scope & Deliverables:**
  * Once the integrated flow is reviewable, record a narrated demo covering each implemented feature in both groups (**F5** and **F7**) and showing persistence and key handoffs across the actual UI, API, and database.
  * Coordinate presenters with the feature owners (**Nguyễn Trung Kiên** & **Lương Thiện Nhân**).
  * Upload to YouTube as **Unlisted** or **Public** and provide **Hoàng Cao Phong** with the URL and chapter markers for the submission `README`.
* **Acceptance Criteria:**
  * Reviewer can play the YouTube link and match the demonstrated behavior directly to the submission revision.
  * Link the pull request, artifact, or evidence before moving to **In Review**; move to **Done** after reviewer acceptance.

---

## 2. Tasks Reviewed by Nguyễn Trung Kiên

**Owner:** Lương Thiện Nhân | **Reviewer:** Nguyễn Trung Kiên

### Review 1: F7 Partner Dashboard & Availability Settings (`UC-P04` / `UC-P05`)
* **Source:** `PA4 §E` and `PA3 F7 model`
* **Scope & Responsibilities to Verify:**
  * Confirm the proposed F7 scope at Sprint Planning and resolve/record the **F6 event-queue dependency** against the agreed F7 scope.
  * Lead the complete **F7 Spec Kit workflow** and retain the generated tests.
  * Build the partner dashboard and availability settings across UI, API, and PostgreSQL, including **opening hours**, **capacity**, **blocked slots**, and **persistent queues** (`UC-P04` / `UC-P05`).
  * Agree fixture/API ownership and **atomic reservation-capacity checks** with **Kiên**, and share the dashboard interface with **Duy**.
* **Acceptance Criteria:**
  * Saved availability survives reload and drives F5 slot lookup; dashboard uses persisted data; capacity updates behave correctly under conflicting requests.
  * Commit `spec.md`, `plan.md`, `tasks.md`, and generated tests; review linked PR/evidence before Done.

### Review 2: PA3 TA Feedback & `UC-Partner-Admin.md` Reconciliation
* **Source:** `PA4 §A` and `PA3 UC-Partner-Admin`
* **Scope & Responsibilities to Verify:**
  * Apply relevant PA3 TA feedback to `UC-Partner-Admin.md` and affected prototypes.
  * Coordinate IDs with **Võ Mỹ Ngọc**.
  * Reconcile availability settings, partner queues, reservation decisions/cancellations, attendance, and admin investigation with the actual PA4 implementation.
  * Verify affected alternative flows and send per-document deltas to **Ngọc** for `Changes.md`.
* **Acceptance Criteria:**
  * Each changed flow traces to the master model, TA feedback where applicable, and actual role/state behavior; review linked PR/evidence before Done.

---

## 3. Sprint Coordination & Handoff Checklist

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Dependency / Handoff | Counterpart(s) | Topic to Align | Status |
| :--- | :--- | :--- | :---: |
| Sprint Planning & Scope Lock | Toàn nhóm | Confirm F5 & F7 scope (PA3 Project Plan §3.1) and F6 event-queue boundary | [ ] |
| Role / Session & API Contracts | Võ Mỹ Ngọc, Trương Khánh Duy | Customer, Partner, and Admin auth/role dependencies before API handoff | [ ] |
| Atomic Capacity & Slot Lookup | Lương Thiện Nhân | Shared availability, blocked slots, capacity locking between F5 & F7 | [ ] |
| C4 Container Names & Interfaces | Võ Mỹ Ngọc, Hoàng Cao Phong | Consistent container names/protocols across C4 L2/L3, frontend & deployment | [x] |
| F5 Spec Kit Artifacts (`spec`/`plan`/`tasks`) | Nguyễn Trung Kiên | Draft `src/specs/003-f5-table-reservation/` specifications | [x] |
| F5 Implementation & Tests | Nguyễn Trung Kiên | PostgreSQL migrations/seeds, API implementation, retained `pytest` suite | [x] |
| Review of Nhân's PA4 Tasks | Lương Thiện Nhân | Review F7 implementation/tests and `UC-Partner-Admin.md` reconciliation | [ ] |
| Narrated Demo Video | Lương Thiện Nhân, Hoàng Cao Phong | Record E2E F5 & F7 demo, upload Unlisted/Public YouTube, send URL + chapters | [ ] |

---

## 4. PA4 Deliverables Index (Nguyễn Trung Kiên)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

### 4.1 Spec Kit Artifacts — Functional Group F5 (`src/specs/003-f5-table-reservation/`)
* `src/specs/003-f5-table-reservation/spec.md` — F5 functional specification, reservation state machine, business invariants, and Given–When–Then acceptance scenarios (`FR-5.1`–`FR-5.10`, `FR-7.3`).
* `src/specs/003-f5-table-reservation/plan.md` — Technical architecture plan, PostgreSQL schema extensions (`reservations`, `reservation_status_history`), atomic capacity locking strategy, REST API contracts, and migration/test plan.
* `src/specs/003-f5-table-reservation/tasks.md` — Actionable F5 engineering checklist (`TASK-F5-01` $\rightarrow$ `TASK-F5-08`).

### 4.2 Architecture, AI Usage & Demo Documentation (`docs/weekly-reports/PA4_Week6-7/Kien/`)
* `docs/weekly-reports/PA4_Week6-7/Kien/C4-Architecture-L2-L3.md` — Mermaid C4 Level 2 (Container Diagram) and C4 Level 3 (Backend Component Diagram) plus container/interface handoff table for Võ Mỹ Ngọc and Hoàng Cao Phong (`PA4 §C`).
* `docs/weekly-reports/PA4_Week6-7/Kien/F5-F7-Video-Narration-Script.md` — Draft narrated demo storyboard and YouTube chapter plan for F5 & F7 (`PA4 §E`).
* `docs/weekly-reports/PA4_Week6-7/Kien/AI-Usage-Kien.md` — Individual PA4 AI usage declaration and log (`PA4 §F`).
* `docs/weekly-reports/PA4_Week6-7/Kien/PA4-Tasks.md` — Task ownership, review responsibilities, and coordination checklist.
