# DineVina · PA2 Project Plan and Phong's work record
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

**Group 08 · working version 1.0 · 29 October 2026**  
**Source of assignment:** PA2 allocation image supplied by the team: Phong owns the complete Project Plan, Sprint Schedule, Risk Management, Weekly Report and submission integration. This file is an English Markdown working draft; it does not claim that a meeting, review, build, training session or submission has happened without evidence.

## 1. Introduction
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

DineVina is a responsive restaurant discovery and reservation-request platform. Customers find venues and send table requests or event inquiries; restaurant partners manage listings and respond; administrators review venue information. This initial PA2 plan defines scope, people, risks, five Scrum sprints, the next sprint's assignments and dates, build checkpoints, reporting and submission controls. It will be revised in PA3 after teaching-assistant feedback. The course's RUP template phases are not used because PA2 explicitly requires Scrum.

## 2. Project overview
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

### 2.1 Goals and success criteria
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

1. Help a customer discover a suitable restaurant from searchable, approved venue information and inspect its menu and conditions.
2. Let a customer submit a table reservation request and distinguish **requested**, **confirmed**, **declined** and **cancelled** states. A request is never represented as a confirmed booking before partner confirmation.
3. Give a partner a clear queue for listing updates, availability, reservation requests and event inquiries.
4. Demonstrate an explainable recommendation baseline using only approved venue data, with a manual search/filter fallback.
5. Produce a tested, traceable increment at each planned build checkpoint, with limitations documented rather than hidden.

### 2.2 Scope, deliverables and assumptions
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

The planned functional groups are accounts and profiles; venue onboarding; discovery and details; menus; table requests; event inquiries and proposals; availability and partner dashboard; promotions and editorial content; and intelligent assistance. Native mobile apps, payment processing, POS, inventory and accounting are outside the current scope. Event inquiries are a negotiation flow, not table reservations.

PA2 deliverables are the initial Project Plan and Vision in English Markdown and PDF, Spec Kit files under `src/`, individual tutorial evidence, AI usage declaration and log, weekly meeting report, board screenshots, Git log and the `PA2-Group08.zip` package. Coding and self-training may be scheduled as Scrum tasks, but a planned feature is not an implemented feature. The repository's PA2 working package is at `docs/PAs/PA2/fin_PA2/`; this Phong folder records his assigned contribution and integration controls.

Planning assumptions: five members remain available; the team can use GitHub and Trello; restaurant data may initially be clearly marked samples; publication and personal-data policy need team agreement. The 24 October–6 November PA2 window and card dates below are **proposed targets**, because the course deadline and actual Sprint Planning decisions have not been verified. Confirm them with the team and update the board and this document together.

## 3. Project organization
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

| Member | Scrum role and primary work in the current plan |
| --- | --- |
| Hoàng Cao Phong | Leader/Scrum Master; full Project Plan, schedule, risk register, weekly report integration, submission integration; coordination and review of technical evidence. |
| Võ Mỹ Ngọc | Product Owner; Vision, requirements and UX; reviewer of Phong's deliverables. |
| Lương Thiện Nhân | Venue/menu data; records the two Scrum meeting minutes for Phong to integrate into the weekly report. |
| Nguyễn Trung Kiên | API, persistence, authentication, integration build and tests. |
| Trương Khánh Duy | Recommendation baseline and evaluation. |

Each task has one accountable performer and a different reviewer. A Trello membership assignment identifies the performer; the reviewer is recorded in the card description until the team establishes a review convention. The Product Owner prioritizes backlog items with the team. Work moves through `Sprint To Do → In Progress → In Review → Done` only as evidence supports it. Changes should be reviewed into `dev` and promoted to `main` through the team's normal GitHub review process.

## 4. Risk management
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Probability and impact are planning judgments (Low/Medium/High), not measured frequencies. At each weekly Scrum, Phong checks triggers, records an owner and action in Trello, and revises this register. The Product Owner accepts scope changes; technical owners verify the relevant mitigation.

| ID | Risk and trigger | Probability / impact | Prevention and response | Owner / review |
| --- | --- | --- | --- | --- |
| R1 | A member misses a check-in or a task's proposed date. | Medium / High | Ask for an early status update; split critical work, record a new owner/date and reduce Sprint 2 scope before the deadline. | Phong / Ngọc |
| R2 | Venue or menu records are incomplete, unapproved or inconsistent. | High / High | Nhân defines required fields and validation; label sample records; block unapproved venues from search and recommendation output. | Nhân / Kiên |
| R3 | The nine feature groups exceed the available sprint capacity. | High / High | Ngọc prioritizes the customer search → request → partner response path; defer promotions and advanced assistance if the first build slips. | Ngọc / Phong |
| R4 | UI, API and database contracts diverge at integration. | Medium / High | Kiên publishes request/response shapes, status transitions and migration notes; run tests and an integration smoke check before the review. | Kiên / Phong |
| R5 | A request is displayed as confirmed or private customer data is exposed. | Medium / High | Use explicit state transitions, role checks and minimum necessary data; review negative cases before a demo. | Kiên / Ngọc |
| R6 | Tutorial, meeting, board or AI-use evidence is missing at packaging. | High / Medium | Keep a submission matrix, ask members for genuine records at each Scrum, capture dated screenshots and export the final Git log near submission. Never manufacture evidence. | Phong / Ngọc |
| R7 | A PDF or ZIP is unreadable, stale, or omits a required file. | Medium / High | Render from reviewed Markdown, inspect PDF pages, check the ZIP file list and extraction test, and record the exact revision packaged. | Phong / Ngọc |

Escalation rule: a High-impact risk with an active trigger is raised at the next Scrum check-in or immediately if it blocks the build. Record the decision, assignee and next check date on the relevant Trello card. An unresolved release or submission blocker stays open in the final checklist.

## 5. Scrum plan and sprint schedule
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

The instructor recommends five sprints of roughly 2–3 weeks, one per PA. Exact PA3–PA5 calendar dates depend on course announcements and will be set at each Sprint Planning. The PA2 target window is proposed, not a confirmed deadline.

| Sprint | Target window | Outcome and acceptance checkpoint |
| --- | --- | --- |
| Sprint 1 / PA1 | 9–17 Oct 2026 (prior work) | Proposal, competitor survey, team contract and process/repository setup. Do not infer completion of ceremonies from board placement alone. |
| Sprint 2 / PA2 | 24 Oct–6 Nov 2026 (proposed) | Initial Plan and Vision, Spec Kit and training records, usage and weekly reports; reviewed data/API contracts and B1 integration prototype. |
| Sprint 3 / PA3 | Next course window, to be announced | Revise Plan/Vision from feedback; use cases; accounts, onboarding and discovery slice; B2. |
| Sprint 4 / PA4 | Next course window, to be announced | Architecture, availability, table-request and event-inquiry integration; B3. |
| Sprint 5 / PA5 | Final course window, to be announced | Recommendation pilot, system/regression checks, documented deferred scope and complete feature demo on B4. |

### 5.1 Detailed Sprint 2 backlog
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

These are target dates from the existing working plan and Trello descriptions, not evidence of completed work. Past targets need explicit rescheduling at the next team check-in. The allocation image makes Phong accountable for the **integrated weekly report**; Nhân remains the proposed minute-taker for the two Scrum meetings.

| ID | Task and acceptance result | Performer | Reviewer | Proposed due (local) | Trello |
| --- | --- | --- | --- | --- | --- |
| P2-01 | Sprint Planning: actual attendance, goal, scope, assignments, dates and decisions recorded. | Phong | Ngọc | 24 Oct | [Card](https://trello.com/c/qIeNe7Ff/26-pa2-sprint-planning-tonight-minutes) |
| P2-02 | Complete Project Plan: scope, organization, risks, five sprints, detailed PA2 tasks and build plan; reviewed Markdown/PDF. | Phong | Ngọc | 30 Oct (revised proposal) | [Card](https://trello.com/c/XEw1Ez1p/21-pa2-project-plan) |
| P2-03 | Vision: position, stakeholders, nine feature paragraphs, workflows and measurable quality requirements; reviewed Markdown/PDF. | Ngọc | Nhân | 30 Oct | [Card](https://trello.com/c/yKrHhDLc/22-pa2-vision-document) |
| P2-04 | Initialize Spec Kit under `src/`, prepare constitution and verify generated Markdown; collect training register. | Phong | Kiên | 30 Oct (revised proposal) | [Card](https://trello.com/c/sr54a5Ig/23-pa2-spec-kit-setup-training) |
| P2-05 | Each member completes the official Spec Kit tutorial and supplies a genuine dated learning record. | Each member, individual cards | Different member | 30 Oct | [Phong](https://trello.com/c/ed6FonQx/37-pa2-spec-kit-training-phong) and four peer cards |
| P2-06 | Venue/menu data fields, validation rules and labeled sample records reviewed. | Nhân | Kiên | 31 Oct | [Card](https://trello.com/c/5P6lzQLJ/27-pa2-venue-and-menu-data-contract) |
| P2-07 | Discovery and reservation API shapes, states and scenarios reviewed. | Kiên | Ngọc | 2 Nov | [Card](https://trello.com/c/NTsppxiL/28-pa2-discovery-and-reservation-api-contract) |
| P2-08 | Recommendation eligibility, ranking baseline, fallback and offline evaluation cases reviewed. | Duy | Phong | 2 Nov | [Card](https://trello.com/c/Zn4Yltxp/29-pa2-recommendation-baseline-and-evaluation) |
| P2-09 | First weekly Scrum: real member reports, obstacles, actions and dated minutes. | Nhân | Phong | 30 Oct | [Card](https://trello.com/c/ghXX7Icx/30-pa2-scrum-meeting-1-minutes) |
| P2-10 | Second weekly Scrum: same evidence plus revised dates where needed. | Nhân | Phong | 5 Nov | [Card](https://trello.com/c/4PT0Ydmy/31-pa2-scrum-meeting-2-minutes) |
| P2-11 | Integration build: revision, test/build results, browser check and known gaps. | Kiên | Phong | 4 Nov | [Card](https://trello.com/c/mOAsL53w/35-pa2-integration-build-and-tests) |
| P2-12 | Sprint Review/retrospective: actual demo, feedback, causes, lessons and actions. | Ngọc | Phong | 6 Nov | [Card](https://trello.com/c/xZPpe4D7/32-pa2-sprint-review-and-retrospective) |
| P2-13 | Integrated Weekly Report with linked minutes and genuine dated board screenshots. | Phong | Ngọc | 6 Nov | [Card](https://trello.com/c/MOAReCbM/33-pa2-weekly-report-and-trello-evidence) |
| P2-14 | Collect verified AI-use entries and export final Git history. | Phong | Ngọc | 6 Nov | [Card](https://trello.com/c/1GENoiql/34-pa2-usage-report-and-git-log) |
| P2-15 | Review PDFs and evidence, package and verify `PA2-Group08.zip`. | Phong | Ngọc | 6 Nov | [Card](https://trello.com/c/azebtYam/36-pa2-final-pdf-and-submission-package) |

### 5.2 Build and test checkpoints
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Four tested builds are planned after the PA1 scaffold. **B1 (end of PA2):** data/API contract prototype and integration baseline. **B2 (end of PA3):** accounts/onboarding/discovery slice. **B3 (end of PA4):** request and event workflow integration. **B4 (before PA5 final demo):** prioritized features and full customer-to-partner demonstration. For each build, record commit SHA, included behavior, test commands/results, frontend build, manual browser smoke path and known limitations. A successful compile alone does not certify a working product flow.

## 6. Weekly Report · working record
**Performed by:** Hoàng Cao Phong (integration) | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

The course requires one Sprint Planning, two weekly Scrum meetings and one Sprint Review/retrospective per sprint. The two Scrum meetings share this document. The status below is based on the files and board available on 29 October; absence of evidence is recorded as **unverified**, not as an assertion that a meeting did not occur. Add actual minutes only after checking participants or recordings.

### 6.1 Sprint Planning
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Planned for 24 October at 21:30 ICT; [agenda](../../../PAs/PA2/fin_PA2/Meeting-Plan-2026-10-24.md) exists. **Actual date/time, attendance and decisions: unverified.** The [planning card](https://trello.com/c/qIeNe7Ff/26-pa2-sprint-planning-tonight-minutes) remains in Sprint To Do. When the actual minutes are provided, record sprint goal, priority, each task's owner/reviewer/due date, build scope, risks, decisions and action owners here.

### 6.2 Weekly Scrum 1
**Performed by:** Hoàng Cao Phong (integration of Nhân's minutes) | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Target: 30 October. [Minute-taking card](https://trello.com/c/ghXX7Icx/30-pa2-scrum-meeting-1-minutes). The minute-taker should record for each of Phong, Ngọc, Nhân, Kiên and Duy: (1) work completed since the prior week, (2) work planned until the next week and (3) issues/obstacles. Record action items with owner and date, then a short meeting summary. Phong integrates the verified record here.

### 6.3 Weekly Scrum 2
**Performed by:** Hoàng Cao Phong (integration of Nhân's minutes) | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Target: 5 November. [Minute-taking card](https://trello.com/c/4PT0Ydmy/31-pa2-scrum-meeting-2-minutes). Use the same five-member, three-question format. Include changed due dates, current risks, actions and summary only when verified.

### 6.4 Sprint Review and retrospective
**Performed by:** Hoàng Cao Phong (report integration; meeting owner Ngọc) | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Target: 6 November. [Review card](https://trello.com/c/xZPpe4D7/32-pa2-sprint-review-and-retrospective). Record attendance, demonstrated revision, accepted/unfinished work, stakeholder feedback, what went well, what went wrong, problems and causes, what to change next sprint and lessons learned. Link the build evidence and actions.

### 6.5 Evidence and board snapshot
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Before the 29 October alignment, the PA2 board showed 16 cards in Sprint To Do and three in In Progress. After assigning the integrated Weekly Report to Phong and moving his two active documents, it showed **14 in Sprint To Do, five in In Progress, zero in In Review and zero in Done**. The five In Progress cards were Kiên's API contract, integration build and individual training, plus Phong's Project Plan and Weekly Report. This is a point-in-time planning snapshot, not a productivity claim. The [dated board screenshot](evidence/trello-board-2026-10-29.png) shows assignments and board status at capture time; the [live board](https://trello.com/b/cE6KYEGR/dinevina-group-08-scrum-board) contains the task links above. Later progress screenshots, actual meeting minutes and the final Git log are still needed for the submitted Weekly Report.

## 7. Submission integration and release gate
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

Phong coordinates the final package; the owners of Vision, build, tutorials and meetings must provide and verify their own work. The current `docs/PAs/PA2/fin_PA2/` folder contains working Markdown and draft PDFs, but a reviewed final archive has not been verified. Do not submit a ZIP assembled from unreviewed or missing evidence.

| Gate | Required artifact / check | Status on 29 Oct |
| --- | --- | --- |
| G1 | Final Project Plan and Vision in English Markdown; section attribution immediately after each header; Mermaid source in Vision. ding |
| G2 | PDFs rendered from the final reviewed Markdown; inspect each page and diagrams. 
| G3 | `src/.specify/` constitution and other generated Spec Kit Markdown. 
| G4 | Individual training evidence from all five members. 
| G5 | AI-use declaration and detailed, truthful usage log where applicable. 
| G6 | Actual Planning, two Scrums and Review minutes; dated Trello assignment/progress screenshots. 
| G7 | Final Git log including the packaged revision; record any outstanding reviews. | Refresh near packaging. |
| G8 | `PA2-Group08.zip` with a top-level `PA2-Group08/` directory; inspect file list and run archive integrity test. | Not created/verified. |
| G9 | Mỹ Ngọc reviews Phong's sections; group confirms deadline and submission destination; upload receipt retained. 

Packaging sequence: gather verified peer artifacts → reconcile Trello dates/status → obtain section reviews → regenerate PDFs → inspect pages → export Git log → create the named top-level directory and ZIP → test extraction and compare against the matrix → submit at the confirmed destination → retain receipt. The proposed 6 November target is a planning assumption until confirmed by the course team.

## References
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc  | **Edited by:** Hoàng Cao Phong

- [PA2 assignment](../../../PAs/PA2/PA2-2026.pdf) and [Weekly Reports instructions](<../../../PAs/Weekly Reports.pdf>).
- [PA2 working Project Plan](../../../PAs/PA2/fin_PA2/Project-Plan.md), [Weekly Report](../../../PAs/PA2/fin_PA2/Weekly-Report.md) and [submission checklist](../../../PAs/PA2/fin_PA2/Submission-Checklist.md).
- [PA1 baseline](../../PA1_Week1-2/fin_PA1/PA1-Report.md) and [DineVina Trello board](https://trello.com/b/cE6KYEGR/dinevina-group-08-scrum-board).
