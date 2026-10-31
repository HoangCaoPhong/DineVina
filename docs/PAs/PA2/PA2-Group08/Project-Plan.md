# DineVina - Project Plan (PA2)
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

**Group 08 · initial plan · 31 October 2026 · Version 1.1**

Attribution lines identify source contributors, review assignments and editors. The AI usage report records the tools used for consolidation and technical checks. Review assignments do not constitute signed approval.

## 1. Introduction
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

DineVina is a responsive restaurant discovery and reservation-request platform. Customers find venues and send table requests or event inquiries; restaurant partners manage listings and respond; administrators review venue information. This initial PA2 plan defines scope, people, risks, five Scrum sprints, the next sprint's assignments and dates, build checkpoints, reporting and submission controls. It will be revised in PA3 after teaching-assistant feedback. The course's RUP template phases are not used because PA2 explicitly requires Scrum.

## 2. Project overview
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

### 2.1 Goals and success criteria
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

1. Help a customer discover a suitable restaurant from searchable, approved venue information and inspect its menu and conditions.
2. Let a customer submit a table reservation request and distinguish **requested**, **confirmed**, **declined** and **cancelled** states. A request is never represented as a confirmed booking before partner confirmation.
3. Give a partner a clear queue for listing updates, availability, reservation requests and event inquiries.
4. Demonstrate an explainable recommendation baseline using only approved venue data, with a manual search/filter fallback.
5. Produce a tested, traceable increment at each planned build checkpoint, with limitations documented rather than hidden.

### 2.2 Scope, deliverables and assumptions
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The planned functional groups are accounts and profiles; venue onboarding; discovery and details; menus; table requests; event inquiries and proposals; availability and partner dashboard; promotions and editorial content; and intelligent assistance. Native mobile apps, payment processing, POS, inventory and accounting are outside the current scope. Event inquiries are a negotiation flow, not table reservations.

PA2 deliverables are the initial Project Plan and Vision in English Markdown and PDF, Spec Kit files under `src/`, individual tutorial evidence, AI usage declaration and log, weekly meeting report, board screenshots, Git log and the `PA2-Group08.zip` package. Coding and self-training may be scheduled as Scrum tasks, but a feature descriptions define the intended product. The submission package contains the initial project plan, Vision, Spec Kit artifacts, usage and weekly reports, evidence, and PDF exports.

Planning assumptions: five members remain available; the team can use GitHub and Trello; restaurant data may initially be clearly marked samples; publication and personal-data policy need team agreement. The team representative confirms that the instructor permits this group to use Trello instead of Jira. The team-confirmed Sprint 2 / PA2 window is 19–31 October 2026. The Notion allocation and first weekly meeting are dated 23 October; the second weekly meeting is dated 29 October; the Sprint Review was held 31 October. On 31 October, eight Trello due fields were aligned with the sprint close; the card comments retain their earlier board targets and Trello retains its activity history.

## 3. Project organization
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

| Member | Scrum role and primary work in the current plan |
| --- | --- |
| Hoàng Cao Phong | Leader/Scrum Master; full Project Plan, schedule, risk register, weekly report integration, submission integration; coordination and review of technical evidence. |
| Võ Mỹ Ngọc | Product Owner; Vision, requirements and UX; reviewer of Phong's deliverables. |
| Lương Thiện Nhân | Stakeholder/user needs and environment, competition and venue/menu data; designated minute taker for Scrum 1. The current Scrum 2 card is assigned to Phong. |
| Nguyễn Trung Kiên | Product overview, measurable quality requirements, API/persistence design, Spec Kit initialization and integration build. |
| Trương Khánh Duy | AI feature feasibility, two workflow designs, recommendation evaluation and technical peer review. |

Each task has one accountable performer and a different reviewer. A Trello membership assignment identifies the performer; the reviewer is recorded in the card description until the team establishes a review convention. The Product Owner prioritizes backlog items with the team. Work moves through `Sprint To Do → In Progress → In Review → Done` only as evidence supports it. Changes should be reviewed into `dev` and promoted to `main` through the team's normal GitHub review process.

## 4. Risk management
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

Probability and impact are planning judgments (Low/Medium/High), not measured frequencies. At each weekly Scrum, Phong checks triggers, records an owner and action in Trello, and revises this register. The Product Owner accepts scope changes; technical owners verify the relevant mitigation.

| ID | Risk and trigger | Probability / impact | Prevention and response | Owner / review |
| --- | --- | --- | --- | --- |
| R1 | A member misses a check-in or a task's proposed date. | Medium / High | Ask for an early status update; split critical work, record a new owner/date and reduce Sprint 2 scope before the deadline. | Phong / Ngọc |
| R2 | Venue or menu records are incomplete, unapproved or inconsistent. | High / High | Nhân defines required fields and validation; label sample records; block unapproved venues from search and recommendation output. | Nhân / Kiên |
| R3 | The nine feature groups exceed the available sprint capacity. | High / High | Ngọc prioritizes the customer search → request → partner response path; reduce optional RAG/OCR and polish before reducing committed groups. Any approved core scope change must update the Vision and change log. | Ngọc / Phong |
| R4 | UI, API and database contracts diverge at integration. | Medium / High | Kiên publishes request/response shapes, status transitions and migration notes; run tests and an integration smoke check before the review. | Kiên / Phong |
| R5 | A request is displayed as confirmed or private customer data is exposed. | Medium / High | Use explicit state transitions, role checks and minimum necessary data; review negative cases before a demo. | Kiên / Ngọc |
| R6 | Tutorial, meeting, board or AI-use evidence is missing at packaging. | High / Medium | Keep a submission matrix, ask members for genuine records at each Scrum, capture dated screenshots and export the final Git log near submission. Never manufacture evidence. | Phong / Ngọc |
| R7 | A PDF or ZIP is unreadable, stale, or omits a required file. | Medium / High | Render from reviewed Markdown, inspect PDF pages, check the ZIP file list and extraction test, and record the exact revision packaged. | Phong / Ngọc |

Escalation rule: a High-impact risk with an active trigger is raised at the next Scrum check-in or immediately if it blocks the build. Record the decision, assignee and next check date on the relevant Trello card. Release decisions are recorded against the corresponding acceptance evidence.

## 5. Scrum plan and sprint schedule
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The instructor recommends five sprints of roughly 2-3 weeks, one per PA. Exact PA3-PA5 calendar dates depend on course announcements and will be set at each Sprint Planning. The team confirms the PA2 window as 19–31 October; this is the group's sprint calendar, not a statement about the Moodle upload deadline.

The PA2 rhythm was one progress check-in per sprint week: Week 1 (19–25 October) met on 23 October at 21:30–22:00; Week 2 (26–31 October) met on 29 October. The Sprint Review/retrospective took place on 31 October at 21:30–22:00. The meeting archive records attendees, work summaries and follow-up actions.

| Sprint | Target window | Outcome and acceptance checkpoint |
| --- | --- | --- |
| Sprint 1 / PA1 | 9-17 Oct 2026 (prior work) | Proposal, competitor survey, team contract and process/repository setup. PA1 baseline retained as scope input. |
| Sprint 2 / PA2 | 19–31 Oct 2026 (team-confirmed) | Initial Plan and Vision, Spec Kit and training records, usage and weekly reports; reviewed data/API contracts and B1 integration prototype. |
| Sprint 3 / PA3 | Next course window, to be announced | Revise Plan/Vision with Changes.md; complete use-case model/specifications and all corresponding UI prototypes; demonstrate at least one full-stack group with Spec Kit and narrated video; B2. |
| Sprint 4 / PA4 | Next course window, to be announced | Revise use cases with Changes.md; C4 levels 1-3 and deployment diagrams; at least two additional full-stack groups with Spec Kit, generated tests and narrated video; B3. |
| Sprint 5 / PA5 | Final course window, to be announced | All nine groups working on B4; at least 50 test cases across five use cases, execution/bug reports, reflective report and a live demo involving all members; final PA1-PA5 documents and source package. |

### 5.1 Detailed Sprint 2 backlog
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The dates in the last column match the Trello board after the 31 October calendar correction. Earlier due values remain in card comments and the historical connector export. The actual weekly meetings were held on 23 and 29 October. The team uses the source allocation for document responsibilities and the live board for current task ownership.

| ID | Task and acceptance result | Performer | Reviewer | Board due (local) | Trello |
| --- | --- | --- | --- | --- | --- |
| P2-01 | Sprint Planning: actual attendance, goal, scope, assignments, dates and decisions recorded. | Phong | Ngọc | 24 Oct | [Card](https://trello.com/c/qIeNe7Ff/26-pa2-sprint-planning-tonight-minutes) |
| P2-02 | Complete Project Plan: scope, organization, risks, five sprints, detailed PA2 tasks and build plan; reviewed Markdown/PDF. | Phong | Ngọc | 30 Oct (revised proposal) | [Card](https://trello.com/c/XEw1Ez1p/21-pa2-project-plan) |
| P2-03 | Vision: position, stakeholders, nine feature paragraphs, workflows and measurable quality requirements; reviewed Markdown/PDF. | Ngọc | Phong | 30 Oct | [Card](https://trello.com/c/yKrHhDLc/22-pa2-vision-document) |
| P2-04 | Initialize Spec Kit under `src/`, prepare constitution and verify generated Markdown; collect training register. | Kiên | Duy | 30 Oct | [Card](https://trello.com/c/sr54a5Ig/23-pa2-spec-kit-setup-training) |
| P2-05 | Each member completes the official Spec Kit tutorial and supplies a genuine dated learning record. | Five individual cards | Different member | 30 Oct | [Phong](https://trello.com/c/ed6FonQx/37-pa2-spec-kit-training-phong) and four peer cards |
| P2-06 | Venue/menu data fields, validation rules and labeled sample records reviewed. | Nhân | Kiên | 31 Oct | [Card](https://trello.com/c/5P6lzQLJ/27-pa2-venue-and-menu-data-contract) |
| P2-07 | Discovery and reservation API shapes, states and scenarios reviewed. | Kiên | Ngọc | 31 Oct | [Card](https://trello.com/c/NTsppxiL/28-pa2-discovery-and-reservation-api-contract) |
| P2-08 | Recommendation eligibility, ranking baseline, fallback and offline evaluation cases reviewed. | Duy | Phong | 31 Oct | [Card](https://trello.com/c/Zn4Yltxp/29-pa2-recommendation-baseline-and-evaluation) |
| P2-09 | First weekly Scrum: held 23 October; shared minutes cover progress, issues and actions. | Nhân | Phong | 30 Oct | [Card](https://trello.com/c/ghXX7Icx/30-pa2-scrum-meeting-1-minutes) |
| P2-10 | Second weekly Scrum: held 29 October; same shared document records the second week's review. | Phong | Ngọc | 31 Oct | [Card](https://trello.com/c/4PT0Ydmy/31-pa2-scrum-meeting-2-minutes) |
| P2-11 | Integration build: revision, test/build results, browser check and known gaps. | Kiên | Phong | 31 Oct | [Card](https://trello.com/c/mOAsL53w/35-pa2-integration-build-and-tests) |
| P2-12 | Sprint Review/retrospective: held 31 October; outcomes and improvement actions are recorded in the meeting archive. | Ngọc | Phong | 31 Oct | [Card](https://trello.com/c/xZPpe4D7/32-pa2-sprint-review-and-retrospective) |
| P2-13 | Integrated Weekly Report with linked minutes and genuine dated board screenshots. | Phong | Ngọc | 31 Oct | [Card](https://trello.com/c/MOAReCbM/33-pa2-weekly-report-and-trello-evidence) |
| P2-14 | Collect verified AI-use entries and export final Git history. | Phong | Ngọc | 31 Oct | [Card](https://trello.com/c/1GENoiql/34-pa2-usage-report-and-git-log) |
| P2-15 | Review PDFs and evidence, package and verify `PA2-Group08.zip`. | Phong | Ngọc | 31 Oct | [Card](https://trello.com/c/azebtYam/36-pa2-final-pdf-and-submission-package) |

### 5.2 Build and test checkpoints
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

Four tested builds are planned after the PA1 scaffold. **B1 (end of PA2):** data/API contract prototype and integration baseline. **B2 (end of PA3):** accounts/onboarding/discovery slice, with at least one group complete across UI, API and persistence. **B3 (end of PA4):** menus, availability, request and event workflow integration; at least two additional complete groups. **B4 (before PA5 final demo):** all nine functional groups, including promotions and the primary recommender, with full customer-to-partner demonstrations. Optional RAG/OCR remain outside the committed primary slice unless formally added to scope. For each build, record commit SHA, included behavior, test commands/results, frontend build, manual browser smoke path and known limitations. A successful compile alone does not certify a working product flow.


## References
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

- Course *Project Assignment 2 (PA2-2026)* and *Weekly Reports* instructions.
- Group 08 PA1 report and the [PA2 Trello board](https://trello.com/b/cE6KYEGR/dinevina-group-08-scrum-board).
- Source contribution: `research/PA2_Phong_PjPlan`, `docs/weekly-reports/PA2_Week3-4/Phong_PjPlan/phong.md`.

## 6. Detailed upcoming Sprint 3 plan
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The next sprint starts after PA2 review. Relative due days are measured from Sprint 3 day 1; calendar targets are set when the course announces its window. Each item has one performer and a different reviewer. These are planning proposals for the next Sprint Planning and are kept distinct from current committed PA2 cards.

| ID | Task / acceptance result | Performer | Reviewer | Due | Dependency |
| --- | --- | --- | --- | --- | --- |
| P3-01 | Record TA comments and reconcile Plan/Vision changes | Phong | Ngọc | Day 2 | PA2 feedback |
| P3-02 | Describe customer, partner and admin use cases with main/alternative paths | Ngọc | Phong | Day 4 | P3-01 |
| P3-03 | Validate a labeled venue/menu fixture and required-field dictionary | Nhân | Kiên | Day 4 | Data contract |
| P3-04 | Implement customer authentication and server role checks with negative tests | Kiên | Duy | Day 7 | API contract |
| P3-05 | Implement discovery/list/detail vertical slice and browser form integration | Phong | Kiên | Day 9 | P3-03, P3-04 |
| P3-06 | Prepare 30 labeled preference queries and explainable ranker baseline | Duy | Nhân | Day 9 | P3-03 |
| P3-07 | Review mobile layouts and request-state wording against use cases | Ngọc | Nhân | Day 10 | P3-02, P3-05 |
| P3-08 | Run B2 backend tests, frontend build and browser smoke check | Kiên | Phong | Day 12 | P3-04, P3-05 |
| P3-09 | Record Sprint Review, retrospective, AI log and PA3 package | Phong | Ngọc | Day 14 | B2 |

All five students work across specification, implementation and testing. Primary roles indicate leadership rather than exclusive technical ownership. Scope changes enter the backlog with an owner, reviewer, estimate and acceptance criterion before implementation.

## 7. Delivery coverage and course milestones
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

| Build | Planned functional-group coverage | Course deliverable check |
| --- | --- | --- |
| B1 / PA2 | Source/API/data contracts and scaffold validation | Initial Plan/Vision and Spec Kit initialization; no full product claim |
| B2 / PA3 | F1 accounts, F2 onboarding and F3 discovery vertical slices; F3 is the minimum complete group | All use-case specifications/prototype screens, Changes.md, Spec Kit artifacts and narrated demonstration link |
| B3 / PA4 | Add F4 menus, F5 table requests, F6 event proposals and F7 availability/dashboard; F5/F7 are minimum two added groups | C4 context/container/frontend-backend component diagrams, deployment, source and narrated demo; generated tests included |
| B4 / PA5 | Complete F1-F9 including F8 promotions and F9 primary recommender; regression across all groups | At least 5 use cases x 10 test cases, actual results and linked bugs, all-member live demo, reflection and final consistent PA1-PA5 package |

The roadmap targets all nine groups by PA5 rather than carrying unfinished core features into the final demo. Early foundations share one thin data model and avoid optional integrations. Capacity and scope are reviewed at each Scrum; core scope changes require product approval and documented revisions. The source recommendation prototype is a baseline, not a substitute for UI/API/persistence acceptance.

Additional upcoming Sprint 3 documentary tasks, with dates relative to Sprint 3 day 1:

| ID | Acceptance result | Performer | Reviewer | Due |
| --- | --- | --- | --- | --- |
| P3-10 | Mermaid use-case diagrams cover all Vision requirements; every use case has basic/alternative flows and matching prototype screenshots | Ngọc | Nhân | Day 7 |
| P3-11 | Narrated video demonstrates the implemented F3 group and records the course-required YouTube link after team upload | Kiên | Phong | Day 13 |
| P3-12 | One Changes.md records Plan and Vision revisions against PA2; archive excludes dependency/build caches | Phong | Ngọc | Day 14 |
| P3-13 | F3 Spec Kit spec/plan/tasks align UI, API and persistent venue records | Duy | Kiên | Day 3 |

These are proposed next-sprint tasks, not claims that the PA3 artifacts or video already exist.
