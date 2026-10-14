# Contributing

1. Record the task in the team's Scrum board before work starts. Assign one owner and record creation, assignment, and completion dates. Include documentation, research, and self-training tasks.
2. Create a focused branch, for example `feature/restaurant-search` or `docs/pa1-proposal`.
3. Keep API code in `backend/app`, UI code in `frontend/src`, and course deliverables in `docs`. Add tests for implemented behavior.
4. Run `ruff check backend`, `pytest`, and `cd frontend && npm run build` before opening a pull request.
5. Open a pull request to `main`; link the task, describe what changed, include screenshots for UI work, and request another member's review. Keep the Git history and review evidence.
6. Never commit `.env`, credentials, real customer data, uploaded menus, or trained model files. Use `.env.example` to document configuration keys.

Use English for submitted reports as required by the course brief. Add the performer/reviewer/editor line below each report section header, and include Mermaid diagrams where helpful. Save weekly report evidence in `docs/weekly-reports/` or link to the task board with stable references.
