# PA4 — Lương Thiện Nhân

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

---

## 1. Tasks Owned by Lương Thiện Nhân

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

### Task 1: Revised Partner/Admin Use-Case Specification

* **Source:** `PA4 §A` and the PA3 `UC-Partner-Admin.md` baseline.
* **Scope and deliverables:**
  * Revise Partner Staff and Administrator flows, lifecycle states, ownership checks, and role permissions.
  * Reconcile the specification with the PA4 F5/F7 implementation scope, especially atomic capacity checks, blocked slots, response deadlines, dashboard queues, and admin audit access.
  * Update or reuse prototype evidence for every basic and alternative flow that remains in scope.
  * Provide a merge-ready `Changes.md` section for the shared PA4 change log.
* **Acceptance criteria:**
  * Every Partner/Admin use case has a clear actor, permission precondition, state transition, failure behavior, and postcondition.
  * `UC-P04` and `UC-P05` match the implemented F7 availability settings and partner dashboard.
  * The document is available in Markdown and PDF, with prototype images included in the package.

### Task 2: F7 — Availability & Partner Dashboard (Full-stack)

* **Source:** `PA4 §E`, `FR-7.1`–`FR-7.3`, `UC-P04`, and `UC-P05`.
* **Scope and deliverables:**
  * Implement persistent weekly operating hours, default slot capacity, and blocked slots.
  * Calculate public slot availability from operating hours, blocked slots, venue capacity, and active reservation holds.
  * Implement a partner dashboard with summary cards, reservation queues, event-inquiry queues, status/date filters, and pagination metadata.
  * Enforce partner ownership using the PA4 header-based actor contract until the shared authentication module is integrated.
  * Provide PostgreSQL migration SQL, idempotent seed data, React management screens, and tests.
* **Acceptance criteria:**
  * Availability changes survive API/browser reload and affect subsequent slot availability reads.
  * A blocked slot cannot silently overlap confirmed reservations; the API returns a conflict with affected booking identifiers.
  * Capacity calculation is transactional and never reports negative remaining capacity.
  * Partner users can only read or mutate venues listed in their authorized venue scope.

### Task 3: Spec Kit Artifacts — F7

* **Source:** `PA4 §E` Spec Kit workflow requirement.
* **Scope and deliverables:**
  * Maintain `src/specs/004-f7-availability-partner-dashboard/spec.md`.
  * Maintain `src/specs/004-f7-availability-partner-dashboard/plan.md`.
  * Maintain `src/specs/004-f7-availability-partner-dashboard/tasks.md`.
  * Retain generated/derived test coverage in `backend/tests/test_f7_availability_dashboard.py` and frontend verification evidence where feasible.
* **Acceptance criteria:**
  * Spec, plan, tasks, implementation, and tests use the same API names, state names, and business invariants.
  * The artifacts are committed on the research/docs branch; executable code and tests are committed on the implementation branch.

---

## 2. Coordination and Review Checklist

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Dependency / handoff | Counterpart | Topic | Status |
| --- | --- | --- | :---: |
| Atomic capacity contract | Nguyễn Trung Kiên | F5 reservation holds and F7 slot-capacity calculation must use the same active states (`Pending confirmation`, `Confirmed`). | [x] |
| Partner dashboard queue shape | Trương Khánh Duy | Dashboard must expose stable reservation/event queue fields for staff screens. | [ ] |
| Use-case ID consistency | Võ Mỹ Ngọc | Partner/Admin IDs must remain aligned with the master use-case model. | [ ] |
| Demo video handoff | Nguyễn Trung Kiên, Hoàng Cao Phong | F7 demo segment: edit availability, reload persistence, block slot, inspect dashboard. | [ ] |
| Final `Changes.md` merge | Võ Mỹ Ngọc / Hoàng Cao Phong | Merge the Partner/Admin section into the single PA4 `Changes.md`. | [ ] |

---

## 3. Branch and Commit Plan

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Branch | Purpose | Planned commit slices |
| --- | --- | --- |
| `research/PA4_Nhan` | Documentation-only branch | revision baseline, revised use cases, Spec Kit artifacts, prototype/PDF evidence |
| `feat/PA4_F7_Nhan` | Implementation branch | database models/migration, backend APIs, seed data, backend tests, React availability UI, React dashboard UI, frontend verification |

This split keeps documentation review independent from implementation review while preserving traceability through shared requirement and API names.
