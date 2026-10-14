# DineVina Code Rules

These rules apply to code and technical documentation in this repository. Follow
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the task, branch, pull request and review
workflow. The PA1 report describes the current project scope; planned features
must not be described as implemented until they work and are verified.

## Ownership and collaboration

| Member | Primary focus |
| --- | --- |
| Hoàng Cao Phong (group leader) | Sprint/Jira coordination, AI design and integration; proposed Scrum Master |
| Võ Mỹ Ngọc | Backlog, requirements, acceptance criteria, UX and frontend; proposed Product Owner |
| Trương Khánh Duy | Recommendation experiments, quality evaluation, explanations and failure cases |
| Lương Thiện Nhân | Restaurant data requirements, structure, cleaning and AI input quality |
| Nguyễn Trung Kiên | API, database, authentication, booking and frontend/AI integration |

These are primary areas, not exclusive ownership. Each task has exactly one
accountable owner in Jira; other members can pair, review and test across areas.
The Scrum accountabilities remain proposed until the team ratifies its contract.
Until all members have Jira access, the group leader's board assignments are
provisional and should be reassigned to the actual owners before work starts.

## Code layout and conventions

- Put FastAPI endpoints and domain code in `backend/app/`; put backend tests in
  `backend/tests/`. Keep request validation and business rules out of route-only
  glue where practical.
- Put React/TypeScript UI code in `frontend/src/`. Keep reusable components and
  API calls separate from page-level presentation as the app grows.
- Keep product scope, architecture decisions, reports and evidence in `docs/`.
  Record significant architecture changes in `docs/adr/`.
- Use descriptive names, small focused changes and consistent formatting. Follow
  the existing Python configuration in `pyproject.toml` and TypeScript settings
  in `frontend/tsconfig.json`; do not introduce a second formatter casually.
- Document API request/response shapes and error cases when adding an endpoint.
  Update both frontend and backend together when a shared contract changes.

## Data, AI and security

- Validate input at system boundaries. Treat restaurant availability, prices and
  booking status as authoritative backend data, not frontend assumptions.
- Use migrations when database persistence is introduced; do not silently change
  stored schemas. Keep sample data clearly distinct from real customer data.
- For recommendation work, record dataset provenance, cleaning rules, evaluation
  method and known failure cases. Do not claim measured quality without results.
  Present AI suggestions as suggestions, with an explanation and uncertainty
  where relevant; never invent menu items, prices or available slots.
- Never commit `.env`, API keys, credentials, personal customer data, uploaded
  menus or trained model artifacts. Use `.env.example` for configuration keys.

## Before a pull request

1. Link the Jira task and its acceptance criteria. Update the task with actual
   progress and evidence, including documentation and research work.
2. Add or update tests for changed behavior. For UI changes, include a screenshot
   and check the main flow in the browser.
3. Run `ruff check backend`, `pytest` and `cd frontend && npm run build` for the
   affected project areas. State any check that could not run in the pull request.
4. Request review from another member. Resolve review comments and keep the
   pull request focused before merging to `main`.

For course submissions, write reports in English, keep factual performer/reviewer/
editor attribution, and retain the requested Markdown, PDF, Mermaid and weekly
Scrum evidence in `docs/`.
