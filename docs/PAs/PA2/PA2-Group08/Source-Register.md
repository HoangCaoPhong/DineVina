# DineVina - PA2 Source and Integration Register
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

**Cut-off:** 31 October 2026. **Branch:** `research/PA2_final`. **Input HEAD:** `22d4d1e` (full hash in evidence). No commit or push is performed by this packaging session.

## 1. Source map
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

| Source | Evidence / role in package |
| --- | --- |
| Course PA1-PA5 briefs and Weekly Reports | Required progression, PA2 rubric, four ceremonies, attribution, source/PDF/ZIP formats |
| PA2 Vision template/example and plan template | Vision section structure; RUP phases superseded by the explicit Scrum instructions |
| Week1 member sources, PA1 survey and PA1 meeting archive | Stable project scope, three actor types, nine groups, dated comparison evidence and the 9/16 October ceremony history copied under `evidence/pa1-meeting-history/` |
| Phong Project Plan (`bbaf7a5`, merged through `6ac347b`) | Plan, risks, schedule and original board image |
| Ngọc Vision (`9010a8e`, merged through `86c37a0`) | Introduction, positioning and core feature descriptions |
| Nhân pipeline (`7066f9a`, merged through `f3e5ff7`) | Stakeholders, responsibilities and target end-to-end flow |
| Duy AI contribution (`07cbae3`, merged through `510aeb9`) | AI capabilities, two workflows, feasibility and measurable quality proposals |
| Kiên technical sources (`55457c3`, `7948778`, `93fbd23`; merged on `dev` through `22d4d1e`) | Committed src artifacts, Product Overview/NFRs, training log and AI coding research |
| Notion draft, inspected 31 October | PA2 work allocation dated 23 October and reviewer rotation; copied into the evidence archive |
| Group-leader confirmation on 31 October | Sprint 2 ran 19–31 October; all five members attended the 23 October weekly check-in at 21:30–22:00, the 29 October weekly check-in, and the 31 October Review at 21:30–22:00; instructor permits Trello; tutorial completion and reviewer approval were also confirmed. Individual spoken answers were summarized from member artifacts rather than transcribed. |
| Trello connector | Current card fields, assigned members, status, internal due dates and descriptions |
| GitHub connector | Repository identity, default branch and point-in-time visibility; repository is public at inspection, while PA1 asks for private mode |

## 2. Integration decisions
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

All five contributions are used, replacing the older package's outdated claim that Nhân/Duy files were empty. Review names follow the team allocation and do not constitute retrospective signatures. This integration selects React/TypeScript from the actual checkout, retains a reservation marketplace rather than food-order checkout, keeps RAG/OCR optional and makes NFR thresholds acceptance targets. Capacity confirmation depends on authoritative persistent transactions; an outage never silently creates independent memory-only bookings.

The project constitution uses `PENDING_CONFIRMATION`, `DECLINED` and actor-specific cancellation states, while some design sources use `AWAITING_CONFIRMATION`, `REJECTED` and `CANCELLED`. Product-facing labels in this package are Requested, Confirmed, Declined and Cancelled. The API schema must supply the exact technical enum mapping before implementation; supporting source artifacts are copied unchanged so their provenance is preserved.

The source reports an eight-test Windows prototype and a Supabase/GCP branch. The checked branch contains the original health-only scaffold. Local validation reports only the tests/build actually run here. No production readiness or load-test pass is inferred from source prose.

## 3. External and historical records
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The live Trello board was recaptured in Chrome on 31 October with the pointer outside the captured area. The 31 October JSON export is a separate connector snapshot and is labeled as data. The team-confirmed sprint window differs from 5–6 November due dates retained on several Trello cards; those card dates do not extend PA2. Ceremony records identify confirmed attendance and time details separately from work summaries derived from artifacts.

The course specifies two weekly Scrum meetings and one Planning/Review. The archive contains the 23 October allocation and first weekly check-in, 29 October second check-in, and 31 October Review. The Planning work record organizes the allocation and priority decisions; a separate pre-sprint meeting transcript is not included. Course upload receipt is separate from local packaging. Packaging validity and academic evidence completeness are distinct checks.
