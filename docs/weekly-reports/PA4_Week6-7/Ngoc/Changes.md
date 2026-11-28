# DineVina PA4 Changes from PA3
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Pending (assigned to Hoàng Cao Phong) | **Edited by:** Võ Mỹ Ngọc

This is the shared PA4 change log. The baseline is the submitted PA3 package in `docs/PAs/PA3/fin/PA3-Group08/`. The current entries cover the files revised or created on `research/PA4_Ngoc`. They reflect a review of the Vision, specifications and source code. TA feedback was unavailable when this revision was prepared.

## 1. Use-Case Model
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Pending (assigned to Hoàng Cao Phong) | **Edited by:** Võ Mỹ Ngọc

| Section | Change from PA3 | Basis |
| --- | --- | --- |
| Relationships | Explained the selected-slot capacity check used by reservation submission, partner confirmation and the F6 booking design. Clarified the Cancel and Respond extension conditions. | Customer and Partner/Admin specifications, plus the F5/F6 scope in the Vision. |
| Traceability matrix | Added UC-C05 to approved-venue coverage (FR-2.4). Mapped FR-7.3 to the booking operations that change state using the UC-C08 A4 capacity decision. Described the matrix as coverage of specified behavior. | Approved-only F3 detail endpoint, Vision and the shared capacity-check flow. |
| Use-case diagrams | Labelled the two F9 candidate use cases in the figures. Added attribution to the model subsections. | F9 requirement and catalogue labels, PA4 submission instructions. |
| Implementation coverage | Added code-backed F3 notes, the F5 reference-commit distinction, F7 dependencies and the status of the wider product scope. | Research baseline `4072ede`, Kiên's Spec Kit at `ccc6c81`, route-bearing code at `b02d80b` and inspected feature tip `6a2a9c4`. |

## 2. Guest and Customer Use-Case Specification
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Pending (assigned to Hoàng Cao Phong) | **Edited by:** Võ Mỹ Ngọc

| Use case or section | Change from PA3 |
| --- | --- |
| Revision and API references | Added PA4 revision history, implementation scope, reference endpoints, ICT time handling and the current state of customer identity handling. |
| UC-C04–C05 · Discovery | Recorded the filters the React code actually sends, visible pagination and filter gaps, and search and detail error behavior. Documented the generic public 404 for missing or unapproved venues. |
| UC-C08 · Availability | Distinguished the public slot snapshot from the atomic booking check. Added the venue-unavailable path, disabled past and unbookable slots, and noted that the reference can expire stale holds during reads. |
| UC-C09 · Submission | Clarified the contact fields, the response deadline, API-provided slot suggestions, retry with a stable idempotency key and the difference between a rejected write and an unknown outcome. Added the unavailable venue or slot path. |
| UC-C10 · Tracking | Separated the reservation history from the F6 event-inquiry design. Clarified the two deadlines, cancellation eligibility, the unavailable-detail path and expiry during reservation reads. |
| UC-C11 · Cancellation | Clarified ownership, exact cutoff behavior and the mandatory reason. Added blank-reason validation, refresh after a competing state change or lost response, and clarified the rejection postcondition. |
| Customer prototype | Updated availability, reservation form, request confirmation, reservation detail, cancellation form, cutoff and missing-reason screens. Reused the other referenced PA3 prototype images in the PA4 package. |

## 3. Frontend Component Diagram
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Pending (assigned to Hoàng Cao Phong) | **Edited by:** Võ Mỹ Ngọc

Added a C4 Level 3 view for the Web Application container. It maps actual React components, their responsibilities and the calls to the FastAPI server, including the Nginx and Vite proxy paths. It shows the current local reservation and workspace components. The document identifies which details need to be verified after PA4 integration.

## 4. Team integration
**Performed by:** Võ Mỹ Ngọc | **Reviewed by:** Pending (assigned to Hoàng Cao Phong) | **Edited by:** Võ Mỹ Ngọc

Add separate subsections for the revised Partner/Admin and AI documents once those revisions are available, using their authors' changes and attribution. Recheck the use-case and architecture implementation notes against the F5/F7 submission commit before exporting the final team package.
