# DineVina Project Overview and PA1 Readiness

**Performed by:** Hoàng Cao Phong (section owner; confirm before submission)  
**Reviewed by:** Võ Mỹ Ngọc
**Edited by:** Pending confirmation

**Project:** DineVina — Smart Restaurant Reservation and Event Booking System  
**Group:** 08  
**Status snapshot:** 16 October 2026

## Project idea and intended users

**Performed by:** Hoàng Cao Phong (section owner; confirm before submission)  
**Reviewed by:** Pending team review  
**Edited by:** Pending confirmation

DineVina is a proposed responsive web application for discovering restaurants, reading menus and promotions, requesting table reservations, and sending event inquiries. Customers need a clear path from finding a suitable venue to understanding whether a booking has been confirmed. Restaurant partners need controlled tools for maintaining listings, menus, availability, and incoming requests. A platform administrator is a planned third actor for onboarding and moderation.

The PA1 proposal describes nine functional groups and an explainable restaurant recommendation feature. Recommendations would use customer preferences and verified venue attributes, with visible reasons for each suggestion. This is a proposed product capability; the repository does not yet implement reservations, partner management, or AI recommendations. The [working product scope](../../../product-scope.md) records the proposed groups and delivery order.

## Current technical starting point

**Performed by:** Hoàng Cao Phong (section owner; confirm before submission)  
**Reviewed by:** Pending team review  
**Edited by:** Pending confirmation

The repository contains a React/TypeScript frontend, a FastAPI backend, Docker Compose configuration, and PostgreSQL configuration. The frontend is an informational scaffold; the API currently exposes `GET /api/health`, backed by one route test. PostgreSQL is configured but is not yet used by the API. Workflow files define CI checks and container publishing, but the presence of workflow files alone does not prove that a remote run has passed or a deployment exists. See the [repository README](../../../../README.md) for startup commands and the [architecture draft](../../../architecture.md) for planned boundaries.

## PA1 readiness and evidence gaps

**Performed by:** Hoàng Cao Phong (section owner; confirm before submission)  
**Reviewed by:** Pending team review  
**Edited by:** Pending confirmation

| PA1 area | Current observable state | Evidence or decision still needed |
| --- | --- | --- |
| Group registration | Group 08 and five members are documented in the repository | Registration form submission confirmation |
| Project proposal | The PA1 DOCX draft and working scope describe the proposed product, actors, nine functional groups, and AI feature | Team review and final Markdown/PDF approval |
| Existing app survey | The PA1 DOCX draft discusses PasGo and Eatigo with captured screens | Team review of the findings and final source/evidence package |
| Team Contract | A role and process draft exists in the PA1 DOCX | Ratification by all members, availability, and final reviewer names |
| Tools and process | A local Git repository and a Trello Scrum board are configured | Real dates, meeting minutes, task screenshots, AI account evidence, and final Git log |

The board records work selected for Sprint 1. A card in **Sprint To Do** is not evidence that its deliverable has been completed. The project team should review the scope and evidence gaps before treating this section as final.

## Sources

**Performed by:** Hoàng Cao Phong (section owner; confirm before submission)  
**Reviewed by:** Pending team review  
**Edited by:** Pending confirmation

- CSC13002, *Project Assignment 1 (PA1-2026)*, course brief.
- DineVina repository: `README.md`, `docs/product-scope.md`, `docs/architecture.md`, and `backend/app/main.py`, inspected on 16 October 2026.
- `docs/ans/PA1-DineVina-Report.docx`, used for proposed product content; its Jira statistics are superseded by the live Trello board snapshot.
