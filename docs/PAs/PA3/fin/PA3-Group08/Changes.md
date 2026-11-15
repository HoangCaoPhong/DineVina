# PA3 Changes from PA2
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

**Group 08 · Integrated revision · 14 November 2026**

This is the single PA3 change register for both revised documents, as required by PA3 Sections A-B. The baseline is the submitted PA2 `Project-Plan.md` version 1.1 and `Vision.md` version 1.0 in `docs/PAs/PA2/PA2-Group08/`. On 13 November 2026, Phong supplied screenshots of the instructor's PA1 and PA2 comments. The PA2 Plan comment asks for a plan for **all project sprints**, followed by detailed work for the **upcoming sprint**, and says the AI-usage description was too brief. The PA1 comment asks for alternative/exceptional flows beyond the happy path. The screenshot text is transcribed by meaning here; the original image files were supplied in conversation, not saved in this checkout. Ngọc's PA3 Vision revision and its detailed change entries are integrated in Section 2 of this package.

## 1. Project Plan
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

| PA2 section | PA3 change in `Project-Plan.md` v2.0 | Reason / status |
| --- | --- | --- |
| Introduction and scope | Reframe the plan around PA3 Sections A-F; keep F1-F9 product scope and identify F3 as the selected single complete group | PA3 requires one end-to-end group; revised and reviewed |
| Organization | Replace PA2 role narrative with current PA3 owner/handoff table; distinguish card members from owner and reviewer | Current Trello allocation; revised and reviewed |
| Risks | Replace the PA2 risk register with PA3 triggers for feedback, use-case traceability, prototypes, F3 contracts and evidence | Current sprint risks; revised and reviewed |
| Whole-project sprint plan | Add a five-sprint roadmap covering PA1-PA5, planned feature groups, deliverables, exit checkpoints and carry-over rules | **Direct response to PA2 Plan comment**; revised and reviewed, future dates pending |
| Detailed upcoming Sprint 3 plan | Add task IDs P3-01 through P3-09 with acceptance evidence, owners, reviewers, dependencies and relative targets | **Direct response to PA2 Plan comment**; revised and reviewed, team dates pending |
| Delivery controls | Add an acceptance register for use-case model, every specification/prototype, Spec Kit, full-stack proof, video, reports and ZIP | PA3 Sections C-F and submission guidelines; revised and reviewed |
| Alternative/exceptional flows | Add a per-use-case branch inventory and traceability gate with concrete applicable failure conditions | Response to PA1 instructor comment within Phong's planning/acceptance scope; actual specifications remain with their owners |
| AI-use record | Expand Phong's AI log with task purpose, inputs, output paths, verification and limitations; require genuine detailed entries from other members | Response to PA2 AI-usage comment within Phong's document/package scope |
| Build checkpoints | Clarify B2 as **one** complete group, with F3 selected, while keeping B3/B4 as roadmap targets | Avoid treating planned F1/F2/F3 slices as implemented; revised and reviewed |
| Instructor-feedback response | Add source comments to Plan introduction and references, implement schedule/detail/flow gates and update this register | Supplied screenshots addressed in the PA3 revision; team review reported complete |

The group representative confirms the PA3 Plan and this change register were reviewed for submission. No separate signed approval or review date was supplied, so the attribution records the reviewer without inventing either.

## 2. Vision Document
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

### 2.1 Changes by Section
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

| Vision section | PA2 (version 1.0) | PA3 (version 2.0) | Reason |
| --- | --- | --- | --- |
| Header, Revision History, Table of Contents | Version 1.0 | Version 2.0 with a new revision entry; table of contents updated to the new section names | Record the revision |
| 1. Introduction | Detailed behavior deferred to "use-case model, supplementary specifications, and product backlog" | Detailed behavior is specified in the Use-Case Model and the use-case specifications | These documents now exist in PA3 |
| 1.1 References | PA1 report, PA2 brief, Vision template and example | Adds PA3 brief, Discovery and Reservation API Contract, Use-Case Model and WCAG 2.2; merges template and example into one row | Cite every source used by version 2.0 |
| 3.2 User Summary | Customer, partner staff, administrator | Adds the **Guest** user (browses without signing in); the Customer row now covers request submission and tracking | Align users with the actors of the Use-Case Model |
| 3.3 User Environment | One paragraph covering all users | Table comparing Guest/Customer, Partner Staff and Administrator by devices, connectivity, access and sign-in, location, typical tasks, identity and privacy; new *Platform environment* paragraph with minimum browser versions, Indochina Time, Vietnamese phone-number format and 07:00-23:00 ICT service hours | PA3 Section B asks for detailed user environments; details taken from the PA2 stakeholder and product-overview contributions |
| 3.5 Alternatives and Competition | Two-row table (PasGo, Eatigo) | **3.5.1** compares PasGo, Eatigo and DineVina across seven criteria (narrowing choices, venue information, starting a booking, request status, group events, offers, strengths to learn from); **3.5.2** describes four manual workarounds (websites and social pages, phone and messages, reservation books and spreadsheets, manual shortlists) with their limitations and DineVina responses; survey limits are stated | PA3 Section B asks for detailed alternatives and competitors; content taken from the PA1 survey and Section 3.4 workarounds |
| 4.1 Product Perspective | PostgreSQL described as "planned"; note about a separate Supabase/GCP prototype branch and Git evidence | PostgreSQL named as the intended deployment store, with SQLAlchemy F3 persistence and local SQLite checks stated separately; the prototype-branch note is removed | Avoid claiming a verified PostgreSQL run from architecture configuration alone; separate the product target from local PA3 test evidence |
| 4.2 Assumptions and Dependencies | Planning defaults credited to an individual contribution | Same defaults without the contributor note | Keep the document focused on the product |
| 5. Product Features | Nine paragraph descriptions, no requirement IDs | Renamed *Product Features and Functional Requirements*; each group shows its priority (MVP or Next) and a table of identified requirements, **44 in total (FR-1.1 to FR-9.5)** using the same IDs as the Use-Case Model | PA3 Section B asks for detailed functional requirements; PA3 Section C requires the use cases to cover them |
| 5.5 Table Reservation Requests | Request, confirm or decline, cancel within policy | FR-5.1 to FR-5.10 follow the reservation states of the API contract: cancellation only for confirmed reservations at least 2 hours before the reserved time, *Expired* after 30 minutes without an answer, *Cancelled by restaurant*, *Completed* and *No-show* | Align the Vision with the agreed API contract |
| 5.9 Intelligent Assistance | Primary and candidate slices described in text | Adds FR-9.1 to FR-9.5; FR-9.4 and FR-9.5 are marked *(candidate)* | Make F9 requirements traceable |
| 5.10 Key User Workflows | Introduction names the contributors whose paths are combined | Introduction states how the core features combine | Keep the document focused on the product |
| 5.10 Workflow 1 | State named *Requested*; outcomes Confirmed or Declined | State named *Pending confirmation*; adds the *Expired* outcome when the partner does not answer within 30 minutes | Use the API contract state names |
| 6. Non-Functional Requirements | One table of 18 requirements; introduction mentions consolidating two contributions | Grouped into Performance, Security, Reliability, Standards and Platform, Accessibility, and Intelligent Assistance and Privacy; each requirement gains an *Applies to* column naming the functional groups; introduction explains the new column | PA3 Section B asks for detailed non-functional requirements |
| 6.2 Security | SEC-01 to SEC-03 | SEC-01 adds the HTTP-to-HTTPS redirect; new **SEC-04** requires strict role separation with `403 Forbidden` for a customer calling a partner or administrator operation | Taken from the PA2 product-overview contribution |
| 6.4 Standards and Platform | PLAT-01 lists browsers without versions | PLAT-01 names Chrome 110+, Firefox 110+, Safari 16+ and Edge 110+ | Taken from the PA2 product-overview contribution |
| 6.3 Reliability | REL-04 service hours without time zone; REC-01 listed last | REL-04 states 07:00-23:00 ICT; REC-01 grouped under Reliability | Clarify the target and grouping |
| 7. Traceability and References | Paths to individual source files | References to the source documents; traceability to use cases stated through the Use-Case Model | Source files are working evidence, not part of the product description |
| Attribution lines | PA2 performers and reviewers | Original performers kept; *Edited by* set to Võ Mỹ Ngọc for every revised section; Hoàng Cao Phong as reviewer of the revised sections | Record who revised the document |

### 2.2 Unchanged Content
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

Sections 2.1 Problem Statement, 2.2 Product Position Statement, 3.1 Stakeholder Summary, 3.4 Summary of Key Stakeholder or User Needs, the feature descriptions of Sections 5.1 to 5.9, and Workflow 2 keep their PA2 wording. All 18 non-functional requirements of version 1.0 keep their IDs and target values; only SEC-01, PLAT-01 and REL-04 gain the details listed above, and SEC-04 is new.

### 2.3 PA3 integration clarification
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

The final PA3 review clarified that Section 4.1 distinguishes PostgreSQL as the deployment target from the database used in each verification run. Section 5 and its workflows now identify F1–F9 as product requirements and planned cross-sprint behavior, while only the F3 discovery increment is presented as implemented in PA3. This wording prevents the Vision from implying that reservation, event or F9 capabilities were already delivered.
