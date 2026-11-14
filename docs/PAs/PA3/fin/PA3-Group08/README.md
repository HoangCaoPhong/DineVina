# DineVina PA3 Group 08 Submission Package
**Performed by:** Hoàng Cao Phong and Group 08 | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

This package contains the PA3 Markdown and PDF documents, use-case prototypes, F3 source code and Spec Kit artifacts, AI usage declarations, supplementary meeting minutes prepared from confirmed attendance and artifacts, the narrated-video link and Git log. It was assembled from the current local `dev` branch and member PA3 work as of 14 November 2026.

## Contents
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

- `Project-Plan`, `Vision`, and one `Changes` file answer PA3 Sections A and B.
- `UseCase-Model`, `UC-Customer`, `UC-Partner-Admin`, and `UC-AI` answer Sections C and D. Screens are under `prototype/` and `evidence/`.
- `source/` has React, FastAPI, database models, fixture and Spec Kit artifacts without dependencies or build output.
- The narrated F3 demo is hosted Unlisted at https://youtu.be/zDdyh3pvxeM; playback and public title metadata were verified on 14 November 2026. PA3 §E requires the YouTube link in the submission, so the MP4 is kept outside this ZIP.
- `AI-Usage-Report`, `AI-logs/`, `Weekly-Report`, meeting record, Git log and submission checklist answer Section F and evidence requirements. `PostgreSQL-Local-Verification` records the F3 database check.

## Verification and open submission actions
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Group 08 representative | **Edited by:** Hoàng Cao Phong

`ruff check backend` passed; `pytest -q` returned 25 passed and 2 skipped; `npm run build` passed on 14 November. A local browser smoke test loaded 8 approved API venues and opened a venue detail panel without page errors. A fresh local PostgreSQL 17 run also returned 25 passed and 2 skipped; see `PostgreSQL-Local-Verification`. The skipped tests require a configured remote Supabase project. The group representative confirms instructor acceptance of Trello in place of Jira, but no separate instructor message is attached. An actual Sprint Review record remains to be supplied if a review was held. The two November meeting entries identify their retrospective preparation because no contemporaneous notes were kept.
