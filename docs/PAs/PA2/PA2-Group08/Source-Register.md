# DineVina - PA2 Source and Integration Register
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

**Cut-off:** 31 October 2026. **Branch:** `research/PA2_final`. **Repository HEAD at this packaging pass:** `3565d14db35036cc143143d2b52013a1e52ecbba`. The package was committed at this revision; edits made in this pass remain local until separately published.

## 1. Source map
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

| Source | Evidence / role in package |
| --- | --- |
| Course PA1-PA5 briefs and Weekly Reports | Required progression, PA2 rubric, four ceremonies, attribution, source/PDF/ZIP formats |
| PA2 Vision template/example and plan template | Vision section structure; RUP phases superseded by the explicit Scrum instructions |
| Week1 member sources, PA1 survey and PA1 meeting archive | Stable project scope, three actor types, nine groups, dated comparison evidence and the 9/16 October ceremony history copied under `evidence/pa1-meeting-history/` |
| Phong Project Plan (`bbaf7a5`, merged through `6ac347b`) | Plan, risks, schedule and original board image |
| Ngọc Vision (`9010a8e`, merged through `86c37a0`) | Introduction, positioning and core feature descriptions |
| Nhân pipeline (`7066f9a`, later updated at `4f05f95` on `chores/sumary-PA2`) | Stakeholder needs, Ho Chi Minh City environment, self-booking, manual partner confirmation, PasGo/Eatigo comparison and target flow |
| Nhân personal PA2 records (`4f05f95`) | [Spec Kit training report](evidence/Nhan-Spec-Kit-Training.md), [AI-use declaration](evidence/Nhan-AI-Usage.md) and Microsoft Learn achievement screenshot; package copies use local evidence paths |
| Duy AI contribution (`07cbae3`, merged through `510aeb9`) | AI capabilities, two workflows, feasibility and measurable quality proposals |
| Kiên technical sources (`55457c3`, `7948778`, `93fbd23`; merged on `dev` through `22d4d1e`) | Committed src artifacts, Product Overview/NFRs, training log and AI coding research |
| Notion draft, inspected 31 October | PA2 work allocation dated 23 October and reviewer rotation; copied into the evidence archive |
| Group-leader confirmation on 31 October | Sprint 2 ran 19–31 October; all five members attended the 23 October weekly check-in at 21:30–22:00, the 29 October weekly check-in, and the 31 October Review at 21:30–22:00; instructor permits Trello; tutorial completion and reviewer approval were also confirmed. Individual spoken answers were summarized from member artifacts rather than transcribed. |
| Trello connector | Current card fields, assigned members, status, internal due dates and descriptions |
| GitHub connector | Repository identity, default branch and point-in-time visibility; repository is public at inspection, while PA1 asks for private mode |

Nhân's personal training and AI-use records were read from [commit `4f05f95`](https://github.com/HoangCaoPhong/DineVina/commit/4f05f95f2edb1835d1fd6db39e189fb887fc7758) on `chores/sumary-PA2`. The packaged AI-use record matches Nhân's `Nhan_StakeHolders/ai_usage.md` content, with package-local output paths adjusted.

## 2. Integration decisions
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

All five contributions are used. Nhân's 31 October update on `chores/sumary-PA2` adds his individual training and AI-use records; the module screenshot is byte-identical to `evidence/speckit_evidence.png` already in this package. The member report and AI-use record have only their package-local evidence paths adjusted. Review names follow the team allocation and do not constitute retrospective signatures. This integration selects React/TypeScript from the actual checkout, retains a reservation marketplace rather than food-order checkout, keeps RAG/OCR optional and makes NFR thresholds acceptance targets. Capacity confirmation depends on authoritative persistent transactions; an outage never silently creates independent memory-only bookings.

The project constitution uses `PENDING_CONFIRMATION`, `DECLINED` and actor-specific cancellation states, while some design sources use `AWAITING_CONFIRMATION`, `REJECTED` and `CANCELLED`. Product-facing labels in this package are Requested, Confirmed, Declined and Cancelled. The API schema must supply the exact technical enum mapping before implementation; supporting source artifacts are copied unchanged so their provenance is preserved.

The source reports an eight-test Windows prototype and a Supabase/GCP branch. The checked branch contains the original health-only scaffold. Local validation reports only the tests/build actually run here. No production readiness or load-test pass is inferred from source prose.

## 3. External and historical records
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The live Trello board was recaptured in Chrome on 31 October with the pointer outside the captured area. The 31 October connector snapshots are labeled as data; `trello-current-2026-10-31.json` records the board after the calendar correction. Eight Trello card due fields that had extended into 2–6 November were aligned to the 31 October sprint close. Their original values remain in Trello comments and the earlier connector export. Ceremony records identify confirmed attendance and time details separately from work summaries derived from artifacts.

The course specifies two weekly Scrum meetings and one Planning/Review. The archive contains the 23 October allocation and first weekly check-in, 29 October second check-in, and 31 October Review. The Planning work record organizes the allocation and priority decisions; a separate pre-sprint meeting transcript is not included. Course upload receipt is separate from local packaging. Packaging validity and academic evidence completeness are distinct checks.
