# DineVina Constitution

**Version:** 0.1.0 | **Ratified:** Pending team approval | **Last amended:** 2026-10-23

## Core principles

### I. Visible, truthful booking states

A submitted table request is not a confirmed booking. The system must store and display explicit requested, confirmed, declined and cancelled states, including the actor and time of each transition. Event inquiries use a separate negotiation flow with a recorded proposal and customer decision.

### II. Verified venue information

Only approved venue records may appear in public discovery or recommendations. Partners are responsible for their own menu, price, capacity and offer data; the platform must validate required fields and expose meaningful update information. Demo data must be visibly labeled as sample data.

### III. Customer and partner value first

Implement a complete customer-to-partner request path before expanding optional features. Each feature must have an identified user, acceptance criteria, and a testable result. Search and filters remain available if personalized ranking is unavailable.

### IV. Privacy and access control

Collect only information needed to handle a request. Do not commit credentials, private customer records or uploaded sensitive material. Enforce role permissions on the server and review any public data exposure before release.

### V. Reproducible quality

Every product build records its source revision, included behavior and known gaps. Run backend lint/tests, frontend production build and a browser smoke test for changed user flows. Review data migrations and cross-service contract changes before integration.

## Technical constraints

The current web stack is React with TypeScript, FastAPI and PostgreSQL. Keep application code in the existing `frontend/` and `backend/` folders; `src/.specify/` holds planning artifacts. Architecture changes require a short decision record. Targets in the Vision are proposals until measured in a named test environment.

## Work and review process

Use one accountable owner and a different reviewer for each Trello task. Record actual dates, blockers and evidence as work occurs. Develop on focused branches, review changes before integration, and keep the Sprint 2 plan synchronized with the board. Do not report a planned feature, meeting or training session as complete without evidence.

## Governance

The team reviews this constitution during Sprint Planning and records approval or requested changes in the meeting minutes. Changes require a documented reason, a reviewer, and an updated version/date. This draft does not imply group ratification.
