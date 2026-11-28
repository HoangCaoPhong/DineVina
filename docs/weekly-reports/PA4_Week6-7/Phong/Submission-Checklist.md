# DineVina PA4 | Submission assembly and verification
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

## Package inputs and status
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

Target archive is `PA4-Group08.zip`, with a single top-level `PA4-Group08/`. The submitted PA3 ZIP supplies a layout baseline for reports, evidence, AI logs, prototypes and source. The [PA4 brief](../../../PAs/PA4/PA4-2026.pdf) and [Trello #53](https://trello.com/c/ZL0C3izy) define this sprint's contents.

| PA4 section | Required input | Observed handoff or gate |
| --- | --- | --- |
| A · Revised use cases | Updated model and customer, partner/admin and AI specifications. One `Changes.md` must compare each revised document with PA3 and trace actual TA feedback. Include affected prototype evidence. | Ngọc's [draft and Changes.md](https://github.com/HoangCaoPhong/DineVina/tree/e9bdf71315c6eca22510477727bf0a87e8b56abf/docs/weekly-reports/PA4_Week6-7/Ngoc) are available. Collect actual TA feedback, [Nhân's partner/admin deltas](https://trello.com/c/66D0xYto) and [Duy's AI deltas](https://trello.com/c/DksPbm81). |
| B–D · Architecture | Tech stack, C4 Level 1 and Level 2, frontend and backend Level 3, and deployment. Each diagram needs its written explanation. | [Level 1](System-Context.md) and [deployment](Deployment.md) cover the local branch. [Kiên's Level 2/backend Level 3](https://github.com/HoangCaoPhong/DineVina/blob/ccc6c81e97e24fc4e35503b379578fb4d7e265fc/docs/weekly-reports/PA4_Week6-7/Kien/C4-Architecture-L2-L3.md) and [Ngọc's frontend Level 3](https://github.com/HoangCaoPhong/DineVina/blob/e9bdf71315c6eca22510477727bf0a87e8b56abf/docs/weekly-reports/PA4_Week6-7/Ngoc/C4-Frontend-Components.md) are branch-specific drafts. Reconcile all views to the same revision, services and protocols. |
| E · Source and Spec Kit | Complete runnable source, database initialization, both PA4 spec/plan/tasks sets and each group's generated tests. | F5 artifacts and backend tests are visible on the [Kiên feature branch](https://github.com/HoangCaoPhong/DineVina/tree/6a2a9c4f2390e556b0398a4e33963fbf21fee6b2). F5 customer UI and browser tests are visible on the [Ngọc feature branch](https://github.com/HoangCaoPhong/DineVina/tree/d336a24069db2fe8df6f95fb6402abc1043bd7d9). Collect the [F7 artifacts](https://trello.com/c/PXyxjXir) and [integrated runtime evidence](https://trello.com/c/HgJWgFM5). |
| E · Demo | Narrated F5/F7 video, verified public or unlisted YouTube URL in the package README, and the revision demonstrated. | [Kiên's demo card](https://trello.com/c/rFVZQgcm) had no video link at review. Open the supplied URL in a signed-out browser and check the narration and demo coverage. |
| F · AI Usage Report | Team AI declaration and five member records. Include detailed logs wherever AI was used. | [Working AI Usage Report](AI-Usage-Report.md) points to two team logs and records Phong's session. Obtain remaining or updated logs. |
| F · Weekly Report | Record actual Planning, both weekly Scrums and Sprint Review, with assignments and progress screenshots. | Collect the [Weekly Report handoff](https://trello.com/c/Kg3a5yHZ). The rubric requests Jira. Confirm permission for Trello evidence if the team uses the board for submission. [Meeting instructions](../../../PAs/Weekly%20Reports.pdf) |
| Submission evidence | Git log, setup and demo instructions, working internal links and verified Markdown/PDF pairs. | Generate the Git log for the actual source revision. Include commit SHA and test environment in the README and runtime evidence. Render the complete package after collecting inputs. |

## Integrated source and runtime checks
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

1. Record the integrated source SHA and demo configuration. Export the source from that SHA into a clean staging directory. Retain lockfiles, manifests, migrations, seeds, setup instructions, tests and required Spec Kit source. Exclude environment secrets, dependency installs, virtual environments, build output, local DB files and caches.
2. Run the shipped install and startup instructions against a fresh database. Record the F3 browser search and detail regression, the F5 availability → request → partner decision → customer history path and the F7 settings → persisted queue → changed availability path. Capture error cases, role checks, capacity conflicts and any F6 dependency limits. Use the [integration card](https://trello.com/c/HgJWgFM5) for final outcomes.
3. Compare L1 external systems, L2 names, both L3 views and deployment with the integrated code and observed runtime, including any configured Supabase sync. Review whether every feature named in the video can be demonstrated from the archived source.
4. Export English Markdown and corresponding PDFs. Put `Performed by`, `Reviewed by` and `Edited by` immediately after each section heading. Record actual reviewer acceptance when available. Inspect Mermaid readability, PDF page layout, prototype images and links from the staged package.

## Archive checks
**Performed by:** Hoàng Cao Phong | **Reviewed by:** Võ Mỹ Ngọc | **Edited by:** Hoàng Cao Phong

Run from the directory containing the assembled `PA4-Group08/` after the package inputs are complete.

```bash
python3 -m zipfile -c PA4-Group08.zip PA4-Group08
unzip -t PA4-Group08.zip
unzip -Z1 PA4-Group08.zip | cut -d/ -f1 | sort -u
qa_dir=$(mktemp -d)
unzip -q PA4-Group08.zip -d "$qa_dir"
sha256sum PA4-Group08.zip
```

Confirm the listing has exactly one root, `PA4-Group08`. Open the extracted README, start the archived source from its instructions, check local links and verify excluded files are absent. Record the archive size, SHA-256, source SHA and verification outcomes in the team handoff. Compare the ZIP size with the course portal limit when it is confirmed.

**Current result:** no final PA4 ZIP was assembled. The local `research/Phong` revision and the observed branch handoffs cannot yet supply a common F5/F7 revision, complete team declarations, sprint evidence or a verified video URL.
