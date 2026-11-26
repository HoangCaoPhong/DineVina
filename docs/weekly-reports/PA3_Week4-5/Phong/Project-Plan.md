# DineVina - Project Plan (PA3 revision)
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (assigned; approval pending) | **Edited by:** Hoàng Cao Phong

**Group 08 · Version 2.1 draft · 13 November 2026**

This revision uses the PA2 submitted [Project Plan](../../../PAs/PA2/PA2-Group08/Project-Plan.md), the PA3 assignment, the current PA3 Trello allocation and the instructor feedback screenshots supplied by Phong on 13 November 2026. The PA2 comment calls for a plan covering every project sprint, followed by detailed work for the upcoming sprint, and notes that AI-usage description was too brief. The PA1 comment calls for alternative and exceptional flows, beyond the happy path. Section 3 and the PA3 acceptance gates respond to these comments. Phong's personal AI declaration is recorded separately; the team AI report still needs each member's genuine details. A reviewer's name in an attribution line identifies the assigned reviewer, not completed review.

## 1. Purpose and scope
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

DineVina is a responsive web marketplace for restaurant discovery, table reservation requests and event inquiries. Customers inspect approved venues and send requests; partners maintain listings and respond; administrators review submitted venue information. The nine product groups remain F1 accounts/profiles, F2 onboarding, F3 discovery/details, F4 menus, F5 table requests, F6 event inquiries/proposals, F7 availability/partner dashboard, F8 promotions/editorial content and F9 intelligent assistance. Payment processing, POS, inventory, accounting and native mobile apps remain outside the planned product.

PA3 must revise the Plan and Vision, document the changes in one `Changes.md`, model every functional requirement as Mermaid use cases, specify every diagrammed use case with matching prototype screenshots, and implement **at least one** complete functional group with Spec Kit, UI, API/logic and persistent data. F3 is the proposed PA3 group on the board; the planning meeting file is a proposal rather than proof of a held decision. Acceptance of F3 as the sprint commitment requires recorded team confirmation. The remaining product groups are roadmap work, not PA3 implementation claims.

## 2. Team and decision process
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

| Member | PA3 responsibility | Primary handoff |
| --- | --- | --- |
| Phong | Plan v2, one Changes file, package integration and evidence checks; coordinate meetings | Plan/PDF and packaging record to Ngọc |
| Ngọc | Vision v2, Vision-to-use-case matrix and Mermaid model, customer specifications/prototypes | Vision delta to Phong; IDs and model to all spec owners |
| Nhân | Partner/admin specifications/prototypes, approved venue fixture, Weekly Report and ceremony evidence | Fixture/field dictionary to Kiên; meeting evidence to Phong |
| Kiên | F3 Spec Kit/API/database, narrated demo and YouTube link | API contract to integration team; source, artifacts and video to Phong |
| Duy | F9 specifications/prototypes and F3 end-to-end validation | Test evidence and defects to Kiên and Phong |

The owner writes and verifies each deliverable; the named reviewer checks it independently. Trello card membership includes owners and reviewers, so membership alone does not prove ownership or approval. The Product Owner resolves requirement and scope decisions, and the team records actual meeting date, attendance and decisions. Work moves to In Review with artifact evidence; Done follows reviewer acceptance.

## 3. Whole-project sprint plan and upcoming sprint detail
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

The feedback on PA2 asked for the **whole-project sprint plan first**, then detailed tasks for the sprint about to start. The table below covers PA1-PA5 in sequence. PA1 and PA2 rows summarize past baselines; PA3-PA5 rows are forward plans, not implementation claims. PA3 and PA4 briefs each specify 2-3 weeks. Exact PA3-PA5 course dates and the PA5 demo date remain unverified, so later windows are milestones relative to course announcements.

### 3.1 Five-sprint roadmap
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

| Sprint / window | Planned feature and documentation scope | Exit checkpoint / carry-over |
| --- | --- | --- |
| 1 / PA1, 9-17 Oct 2026 (historical) | Proposal, competitor survey, F1-F9 product grouping, team contract, board and repository setup | PA1 baseline; instructor's alternative/exceptional-flow comment enters later use-case work |
| 2 / PA2, 19-31 Oct 2026 (historical, team-confirmed) | Initial Plan and Vision, F1-F9 descriptions, API/data contracts, Spec Kit setup, Scrum/AI evidence | B1 contracts/scaffold; PA2 feedback carried into this Plan revision |
| 3 / PA3, course window pending (2-3 weeks) | Revise Plan/Vision; model and specify all Vision use cases with prototype screens; implement one complete group, proposed F3 discovery/details, with Spec Kit, UI/API/database; narrated demo | B2: one demonstrated persistent group; reviewed Markdown/PDF, Changes, reports and ZIP. Unfinished use-case or integration work blocks acceptance |
| 4 / PA4, next course window pending (2-3 weeks) | Revise use cases from PA3 feedback; document C4 context, container, frontend/backend components and deployment; add two complete groups, proposed F5 reservation requests and F7 availability/dashboard | B3: two *additional* full-stack groups with Spec Kit artifacts, generated tests and narrated demos; update diagrams to actual code |
| 5 / PA5, final course window pending | Complete remaining agreed F1-F9 groups, including F2/F4/F6/F8/F9 where unfinished; review/refine generated tests; design at least 50 cases across at least five use cases; execute, log defects, reflect and rehearse all-member live demo | B4: all agreed groups and 2-3 complete workflows demonstrable; final PA1-PA5 source/document package |

The proposed feature order keeps F3 as PA3's minimum complete group and F5/F7 as PA4's two additional groups. F1, F2, F4, F6, F8 and F9 must be estimated and scheduled before PA5 rather than assumed to fit automatically. At each Sprint Planning, record capacity, owner, reviewer and a new target for any carried item; Ngọc approves requirement priority and core scope changes. A new feature is accepted only with its specified UI, logic/API and persisted data where applicable. Optional RAG/OCR stay outside the committed nine-group baseline unless approved through change control.

### 3.2 Sprint 3 task sequence
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

PA3 specifies 2-3 weeks. A course deadline and actual Sprint 3 start date were not verified in the inspected materials. Relative days below are planning targets from the team's confirmed start. Owners and reviewers reflect the current Trello cards; reviewers do not inherit implementation ownership.

| ID / target | Work and acceptance evidence | Owner / reviewer | Dependency |
| --- | --- | --- | --- |
| P3-01 / days 1-2 | Record actual Planning date, attendance, F3 decision, scope, deadline and each member's capacity; enter the instructor comments in this revision | Phong coordinates / Ngọc | Course dates and team decision |
| P3-02 / days 2-5 | Plan v2 and one Changes file with separate Plan/Vision deltas; Vision v2 covers requirements, competitors and user environment | Phong (Plan/Changes), Ngọc (Vision) / each other | PA2 baseline and instructor feedback |
| P3-03 / days 3-6 | Mermaid model and matrix trace every Vision functional requirement to a use-case ID | Ngọc / Phong | Vision v2 |
| P3-04 / days 4-9 | Customer, partner/admin and F9 use-case specifications and prototype screenshots; enumerate basic, alternative and exceptional flows | Ngọc, Nhân, Duy / assigned reviewers | Shared model and IDs |
| P3-05 / days 3-9 | Approved F3 venue fixture, Spec Kit spec/plan/tasks, API/database, UI integration | Nhân, Kiên, Phong / assigned reviewers | Confirmed F3 scope and field/API contract |
| P3-06 / days 10-12 | Validate approved/unapproved visibility, filters, empty result, invalid input, API failure, persistence and browser flow; log revision and defects | Duy / Nhân | P3-05 integrated build |
| P3-07 / days 1-14 | Record genuine weekly Scrum, Sprint Review and board evidence; gather detailed member AI-use logs | Nhân / Kiên | Actual meetings and each member's record |
| P3-08 / days 13-14 proposed | Record narrated working demo and publish/check YouTube link | Kiên / Duy | P3-06 working flow |
| P3-09 / after all inputs | Integrate English Markdown/PDF, section attribution, Git log and source/Spec Kit artifacts; verify ZIP listing and extraction | Phong / Ngọc | P3-02 through P3-08 |

P3-05 lists Phong's UI integration because it remains a board dependency; Phong's current personal work request excludes that task. The team must handle that dependency separately. P3-09 cannot be accepted before owners provide their actual artifacts and the reviewer checks the package.

Weekly Scrum meetings are recorded when held, with participants, progress, impediments, decisions and actions. The [planning document](../../../meeting-minutes/PA3/PA3-Planning-Meeting-and-Work-Allocation.docx) provides an agenda and proposed allocations; it is not meeting evidence.

## 4. PA3 deliverable and acceptance register
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

| Deliverable | Owner / reviewer | Acceptance |
| --- | --- | --- |
| Project Plan v2 and `Changes.md` | Phong / Ngọc | Actual PA2 feedback addressed when supplied; explicit PA2-to-PA3 deltas for Plan and Vision; English Markdown and rendered PDF |
| Vision v2 | Ngọc / Phong | Functional and nonfunctional requirements, competitors/alternatives and user environments; delta supplied for same Changes file |
| Use-case model | Ngọc / Phong | Mermaid diagrams with actors, use cases and applicable include/extend/generalization; every Vision functional requirement traced |
| Every use-case specification and prototype | Ngọc, Nhân, Duy / assigned reviewers | ID/name, actors, description, preconditions, numbered basic flow, all identified alternative flows, postconditions, special requirements and screenshots for each involved screen |
| F3 full-stack group, if team confirms | Kiên (API/DB), Nhân (fixture), Phong (UI integration), Duy (validation) / assigned reviewers | Spec Kit spec/plan/tasks; live UI/API/persistent approved venue data; loading, empty, invalid and API failure behavior; reproducible smoke evidence |
| Narrated demo | Kiên / Duy | Actual working group shown with narration; YouTube Unlisted/Public URL plays and agrees with code |
| Sprint and AI evidence | Nhân coordinates / Kiên | Actual Planning, weekly Scrum and Review records; genuine board screenshots; each member's AI-use declaration and detailed log if used |
| Submission package | Phong / Ngọc | English Markdown and PDF, contributor line immediately after each section heading, source and Spec Kit files, Git log, working video link, `PA3-Group08.zip` integrity and extraction checks; no dependency/build folders |

The PA3 brief asks for Jira screenshots. The PA2 Plan records the team representative's statement that the instructor permits Trello instead. Retain that permission evidence with the PA3 package or confirm the course requirement before submission; Trello screenshots should show real assignments and progress.

The PA1 feedback specifically warns against documenting only a successful path. For each use-case ID, owners must enumerate triggers and outcomes for no matching data, invalid or incomplete input, unauthorized access, unavailable service, rejected/withdrawn request and role/state conflicts wherever relevant. Mark an exception **not applicable with rationale** if it cannot occur. Trace each applicable branch to numbered specification steps and prototype screens, then include it in the review checklist. This is a documentation acceptance gate, not a claim that those cases have already been implemented or tested.

## 5. Risk and response register
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

Probability and impact are team planning judgments, not measured rates. Review triggers at each real Scrum meeting.

| ID | Risk / trigger | Probability / impact | Response and owner |
| --- | --- | --- | --- |
| R1 | Instructor feedback is recorded but a requested Plan correction remains unverified | Medium / High | Map each supplied comment to a changed section and peer-review the result. Phong and Ngọc |
| R2 | Vision F1-F9 and model/spec/prototype IDs diverge | High / High | One traceability matrix, shared IDs and completeness review before export. Ngọc |
| R3 | Prototype screenshots omit alternative or error screens | High / High | Screen checklist per use case; reconcile with every alternative flow. Ngọc, Nhân and Duy |
| R4 | F3 UI/API/fixture contracts diverge or unapproved venues appear publicly | High / High | Freeze field dictionary, approved flag rule and example responses; run negative and persistence smoke checks. Kiên, Nhân and Duy |
| R5 | F3 is presented as complete from code or mock data alone | Medium / High | Require browser-to-API-to-database demonstration and record the tested revision. Kiên and Duy |
| R6 | Ceremony, AI, Git or video evidence is missing | High / High | Collect genuine owner evidence early; track pending items and do not invent records or URLs. Nhân, Kiên and Phong |
| R7 | PDF or ZIP is stale, broken or includes generated/dependency files | Medium / High | Render and inspect every final PDF; list/test/extract ZIP; compare manifest and source revision. Phong |
| R8 | 2-3 week course window differs from proposed 14-day plan | Medium / Medium | Replace relative targets with official deadline and team dates when verified. Phong |

## 6. Change control
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

Only a team decision can change the committed functional group or nine-group product scope. Record the decision, date, affected Vision/use cases, owner and reviewer in Trello and `Changes.md`. B1 is the historical PA2 contract/scaffold baseline; B2/B3/B4 are planned PA3/PA4/PA5 checkpoints in Section 3. A checkpoint requires actual evidence before it can be called complete. Optional RAG/OCR are separate from the primary F9 recommender and do not replace required PA3 work.

## 7. References and unresolved inputs
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc (pending) | **Edited by:** Hoàng Cao Phong

- Course `docs/PAs/PA3/PA3-2026.pdf`, Sections A-F and Submission Guidelines.
- Submitted PA2 `docs/PAs/PA2/PA2-Group08/Project-Plan.md` and `Vision.md`.
- [PA3 Trello board](https://trello.com/b/cE6KYEGR/dinevina-group-08-scrum-board), inspected 13 November 2026.
- PA3 planning agenda in `docs/meeting-minutes/PA3/` (proposed; not a held-meeting record).
- Instructor feedback screenshots supplied in this conversation on 13 November 2026: PA1 alternative/exceptional-flow comment and PA2 full-sprint/next-sprint/AI-usage comment. Original image files are not stored in the inspected checkout.
- Course `docs/PAs/PA4/PA4-2026.pdf` and `docs/PAs/PA5/PA5-2026.pdf` for later sprint deliverables.
- Outstanding: Vision v2 delta, confirmed sprint dates, course deadline, instructor permission evidence for Trello, final review decisions and other owners' artifacts.
