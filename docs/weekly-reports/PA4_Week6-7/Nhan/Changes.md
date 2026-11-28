# DineVina PA4 Changes — Partner/Admin Specification and F7

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

This file is the Partner/Admin section prepared for the single shared PA4 `Changes.md`. The baseline is the submitted PA3 package in `docs/PAs/PA3/fin/PA3-Group08/`. No standalone TA feedback file was present in the repository when this revision was prepared, so the revision is driven by the PA4 scope, reviewer notes in the PA4 task allocation, and inconsistencies found between PA3 specifications and the F5/F7 implementation contract. If the exact TA feedback is supplied later, map each item to the rows below before final submission.

## 1. Partner/Admin Use-Case Specification

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Section or use case | Change from PA3 | Basis |
| --- | --- | --- |
| Document control | Added PA4 revision metadata, scope boundaries, implementation references, and a feedback/consistency remediation matrix. | PA4 §A requirement to revise the PA3 specification and document changes. |
| Actor and permission model | Added an explicit permission matrix for Guest, Customer, Partner Staff, Administrator, and System Scheduler actions. Replaced ambiguous “partner” wording with `partner_staff` ownership scope. | PA3 reviewer concern that actor authority and ownership were implicit; PA4 header-based actor contract. |
| State models | Added canonical lifecycle tables for venue onboarding/publication, reservation requests, event inquiries, content moderation, availability rules, and blocked slots. | PA3 flows used state names but did not define legal transitions in one place. |
| `UC-P04` Manage Availability | Split weekly operating hours, default slot capacity, and blocked slots into separate persistent concepts. Added validation for overlapping blocks, past slots, inactive venues, and conflicts with confirmed reservations. Clarified that updates are transactional and immediately affect later slot calculations. | F7 implementation scope (`FR-7.1`, `FR-7.3`) and atomic-capacity feedback. |
| `UC-P05` View Partner Dashboard | Defined summary metrics, queue fields, filter/sort behavior, pagination limits, empty/error states, and venue ownership filtering. Clarified that the dashboard is a read model over persisted reservations/event inquiries rather than local UI state. | F7 implementation scope (`FR-7.2`) and persistent-queue feedback. |
| `UC-P06` Decide Reservation Request | Clarified the atomic confirm transaction, active capacity-holding states, response-window expiry, mandatory decline reason, and no partial capacity deduction on failure. | F5/F7 integration contract and `FR-7.3`. |
| `UC-P11` Cancel Confirmed Reservation | Clarified that restaurant-side cancellation releases capacity atomically and requires an operational reason. | Reservation state consistency review. |
| `UC-P12` Record Reservation Attendance | Clarified legal transitions into `Completed` and `No-show`, including the check-in window and 30-minute grace period. | Reservation lifecycle consistency review. |
| `UC-A01`–`UC-A03` Admin moderation | Normalized admin decision states, mandatory reason requirements, audit metadata, and the difference between `Returned`, `Suspended`, and `Rejected`. | PA3 role/state ambiguity. |
| `UC-A04` Investigate Support Case | Clarified that administrator access is read-only audit/support access unless a separate moderation action is invoked. Added cross-feature search criteria and privacy constraints. | PA3 feedback/consistency remediation and support-audit boundary. |
| Prototype references | Reused validated PA3 screens where behavior did not change and added PA4-specific references for availability/dashboard states. | PA4 submission evidence requirement. |

## 2. F7 Spec Kit Artifacts

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Artifact | Change from PA3 | Basis |
| --- | --- | --- |
| `src/specs/004-f7-availability-partner-dashboard/spec.md` | New PA4 artifact defining F7 scope, actors, data entities, API behavior, state invariants, and acceptance scenarios. | PA4 §E Spec Kit workflow. |
| `src/specs/004-f7-availability-partner-dashboard/plan.md` | New PA4 artifact describing schema, service decomposition, API contracts, concurrency strategy, migration plan, and verification plan. | PA4 §E Spec Kit workflow. |
| `src/specs/004-f7-availability-partner-dashboard/tasks.md` | New PA4 artifact converting the plan into small implementation and test tasks. | PA4 §E Spec Kit workflow. |
| `backend/tests/test_f7_availability_dashboard.py` | New executable tests generated from the Spec Kit acceptance scenarios. | PA4 §E generated-test evidence. |

## 3. Implementation Notes for Final Team Integration

**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

* F7 uses the same active reservation capacity-holding states as F5: `Pending confirmation` and `Confirmed`.
* The PA4 demo uses header-based actor context (`X-User-Id`, `X-User-Role`, `X-Partner-Venues`) until the shared production authentication module is integrated.
* Event inquiries are represented as a persisted dashboard queue read model for F7. Full event proposal behavior remains the F6 scope and is not claimed as implemented by F7.
* The final team package should merge this file as one section of the single PA4 `Changes.md`; do not submit multiple competing team-level change logs.
