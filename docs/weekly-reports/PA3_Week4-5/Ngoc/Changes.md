# PA3 Changes from PA2 - Vision Document
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Hoàng Cao Phong | **Edited by:** Võ Mỹ Ngọc

This section lists every change between the submitted PA2 `Vision.md` (version 1.0, 31 October 2026) and the PA3 `Vision.md` (version 2.0, 13 November 2026). It is the Vision section of the single PA3 `Changes.md`.

The PA2 instructor feedback concerned the Project Plan and the AI-usage report; it contained no comment on the Vision Document. The Vision changes below therefore respond to PA3 Section B, which asks for detailed functional and non-functional requirements, alternatives and competitors, and user environments.

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
| 4.1 Product Perspective | PostgreSQL described as "planned"; note about a separate Supabase/GCP prototype branch and Git evidence | PostgreSQL stated as the persistent store; the prototype-branch note is removed | PostgreSQL is used by the PA3 implementation; the note described evidence, not the product |
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
