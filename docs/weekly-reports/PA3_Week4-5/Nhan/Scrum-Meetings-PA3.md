# DineVina - PA3 Scrum Meetings & Ceremonies Record
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

**Group 08 | Sprint:** PA3 (Week 4–5) | **Chair / Coordinator:** Hoàng Cao Phong | **Scribe:** Lương Thiện Nhân

> **Record Integrity Notice:** Per `PA3-2026` §F and `Weekly Reports.pdf`, this single document records Sprint Planning, two Weekly Scrum check-ins, and the Sprint Review / Retrospective. Verifiable task assignments, Trello card links, and repository branch dates are recorded directly from `docs/weekly-reports/PA3_Week4-5/*/PA3-Tasks.md` and Git history. Live meeting dates, attendance, and spoken answers not yet supplied by the meeting chair (Hoàng Cao Phong) are marked **`[PENDING TEAM CONFIRMATION]`** and are **never fabricated retrospectively**.

---

## 1. Sprint Planning Meeting (PA3)
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- **Date & Time:** `[PENDING TEAM CONFIRMATION — confirm actual date held between 31 Oct and 5 Nov 2026]`
- **Chair:** Hoàng Cao Phong
- **Team Members Present:** `[PENDING TEAM CONFIRMATION]`
- **Team Members Absent:** `[PENDING TEAM CONFIRMATION]`

### 1.1 Prioritized PA3 Scope & Assignments (Verified from `PA3-Tasks.md`)

| Member | Assigned PA3 Tasks & Trello Cards | Reviewer |
| --- | --- | --- |
| **Hoàng Cao Phong** | 1. Project Plan v2 & single `Changes.md` ([Trello](https://trello.com/c/AjIkCTWE))<br>2. F3 React UI & API integration ([Trello](https://trello.com/c/8MAdNUY5))<br>3. Final `PA3-Group08.zip` packaging ([Trello](https://trello.com/c/vEtnrBbc)) | Võ Mỹ Ngọc |
| **Võ Mỹ Ngọc** | 1. Vision v2 & Vision `Changes.md` entries ([Trello](https://trello.com/c/4628c162))<br>2. Mermaid Use-Case Model & F1–F9 traceability<br>3. Customer Use-Case Specs (`UC-C01`–`UC-C13`) & prototypes | Hoàng Cao Phong |
| **Lương Thiện Nhân** | 1. Scrum meetings, Weekly Report, Trello screenshots & 5-member AI-usage integration ([Trello](https://trello.com/c/iFSrPTYX))<br>2. Partner/Admin Use-Case Specs (`UC-P01`–`UC-P12`, `UC-A01`–`UC-A04`) & prototypes ([Trello](https://trello.com/c/BHa5dcOc))<br>3. F3 sample venue/menu fixture & data contract ([Trello](https://trello.com/c/vVzI76Ns)) | Nguyễn Trung Kiên |
| **Nguyễn Trung Kiên** | 1. F3 Spec Kit (`spec`/`plan`/`tasks`), FastAPI & PostgreSQL discovery API ([Trello](https://trello.com/c/ociR28Qz))<br>2. Narrated YouTube demo video ([Trello](https://trello.com/c/QQkI3QEy)) | Trương Khánh Duy |
| **Trương Khánh Duy** | 1. F9 AI Use-Case Specs & prototypes (`UC-AI01`–`UC-AI03`) ([Trello](https://trello.com/c/IMR3CsWP))<br>2. F3 UI–API–PostgreSQL integration & demo readiness check ([Trello](https://trello.com/c/zM75IB3F)) | Lương Thiện Nhân |

- **Actions:** Each owner works on a dedicated PA3 branch (`research/Ngoc_PA3`, `research/PA3-Phong`, `research/PA3_Duy`, `research/PA3_Nhan`, etc.) and moves Trello cards to **In Review** for their assigned peer reviewer before marking **Done**.

---

## 2. Weekly Scrum Meeting 1
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- **Date & Time:** `[PENDING TEAM CONFIRMATION]`
- **Chair:** Hoàng Cao Phong
- **Team Members Present:** `[PENDING TEAM CONFIRMATION]`
- **Team Members Absent:** `[PENDING TEAM CONFIRMATION]`

### Member Status Reports (3 Scrum Questions)

- **Hoàng Cao Phong**
  - *Completed since last week:* `[PENDING TEAM CONFIRMATION]` (Observed in `origin/research/PA3-Phong`: drafted Project Plan v2, `Changes.md` for Plan, `Git-Log-Snapshot.txt`, `AI-Usage-Phong.md`, `Submission-Readiness.md` by 13 Nov 2026)
  - *To-do until next week:* `[PENDING TEAM CONFIRMATION]` (F3 React UI integration and final `PA3-Group08.zip` packaging)
  - *Issues / Obstacles:* `[PENDING TEAM CONFIRMATION]` (Noted in `Submission-Readiness.md`: awaiting Vision v2, F3 backend, demo video, and team AI/Scrum inputs)
- **Võ Mỹ Ngọc**
  - *Completed since last week:* `[PENDING TEAM CONFIRMATION]` (Observed in `origin/research/Ngoc_PA3`: `Vision.md`, `Changes.md`, `UseCase-Model.md` with 44 FRs / 32 UCs, `UC-Customer.md`, 62 prototype PNGs, `AI-Usage.md` dated 5–13 Nov 2026)
  - *To-do until next week:* `[PENDING TEAM CONFIRMATION]` (Review Phong's Plan v2 and coordinate UC IDs with Nhân and Duy)
  - *Issues / Obstacles:* `[PENDING TEAM CONFIRMATION]` (Resolved Mermaid dotted-label rendering compatibility on GitHub)
- **Lương Thiện Nhân**
  - *Completed since last week:* `[PENDING TEAM CONFIRMATION]` (Observed on `research/PA3_Nhan` 14 Nov 2026: `UC-Partner-Admin.md`, 65 prototype PNGs, `F3-Data-Dictionary.md`, `f3-fixture/`, `AI-Usage-Nhan.md`)
  - *To-do until next week:* Collect remaining team AI-usage logs, live Trello screenshots, and Phong's confirmed Scrum/Review dates
  - *Issues / Obstacles:* Local environment had no running PostgreSQL daemon; SQL seed validated structurally and via Python smoke suite, pending live PostgreSQL load with Kiên
- **Nguyễn Trung Kiên**
  - *Completed since last week:* `[PENDING TEAM CONFIRMATION]`
  - *To-do until next week:* `[PENDING TEAM CONFIRMATION]` (F3 Spec Kit + FastAPI/PostgreSQL API + narrated demo video)
  - *Issues / Obstacles:* `[PENDING TEAM CONFIRMATION]`
- **Trương Khánh Duy**
  - *Completed since last week:* `[PENDING TEAM CONFIRMATION]` (Observed in `origin/research/PA3_Duy`: 5 F9 prototype PNGs under `docs/weekly-reports/PA3_Week4-5/Duy/evidence/`)
  - *To-do until next week:* `[PENDING TEAM CONFIRMATION]` (F9 specs and F3 UI–API–DB smoke verification)
  - *Issues / Obstacles:* `[PENDING TEAM CONFIRMATION]`

- **Actions:** `[PENDING TEAM CONFIRMATION]`
- **Summary:** `[PENDING TEAM CONFIRMATION]`

---

## 3. Weekly Scrum Meeting 2
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- **Date & Time:** `[PENDING TEAM CONFIRMATION]`
- **Chair:** Hoàng Cao Phong
- **Team Members Present:** `[PENDING TEAM CONFIRMATION]`
- **Team Members Absent:** `[PENDING TEAM CONFIRMATION]`

### Member Status Reports (3 Scrum Questions)

- **Hoàng Cao Phong:** *Completed / To-do / Issues:* `[PENDING TEAM CONFIRMATION]`
- **Võ Mỹ Ngọc:** *Completed / To-do / Issues:* `[PENDING TEAM CONFIRMATION]`
- **Lương Thiện Nhân:** *Completed / To-do / Issues:* `[PENDING TEAM CONFIRMATION]`
- **Nguyễn Trung Kiên:** *Completed / To-do / Issues:* `[PENDING TEAM CONFIRMATION]`
- **Trương Khánh Duy:** *Completed / To-do / Issues:* `[PENDING TEAM CONFIRMATION]`

- **Actions:** `[PENDING TEAM CONFIRMATION]`
- **Summary:** `[PENDING TEAM CONFIRMATION]`

---

## 4. Sprint Review & Retrospective Meeting (PA3)
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- **Date & Time:** `[PENDING TEAM CONFIRMATION]`
- **Chair:** Hoàng Cao Phong
- **Team Members Present:** `[PENDING TEAM CONFIRMATION]`

### Retrospective Discussion (Per `Weekly Reports.pdf`)

1. **What went well:** `[PENDING TEAM CONFIRMATION]`
2. **What went wrong:** `[PENDING TEAM CONFIRMATION]`
3. **What problems occurred and what caused them:** `[PENDING TEAM CONFIRMATION]`
4. **What can be done differently in the next sprint (PA4) to improve:** `[PENDING TEAM CONFIRMATION]`
5. **What lessons we could learn:** `[PENDING TEAM CONFIRMATION]`
