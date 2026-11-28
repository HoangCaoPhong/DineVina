# PA4 Narrated Demo Video Script & Chapter Plan (Functional Groups F5 & F7)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Status:** Draft Storyboard & Chapter Outline *(Finalize narration cues and exact live UI selectors after F5 & F7 integration is complete and reviewable)*  
**Hosting Requirement (`PA4 §E`):** YouTube (**Unlisted** or **Public**, verified in an Incognito browser window before submission)  
**Scope Demonstrated:** Functional Group **F5** (Table Reservation Requests & Lifecycle — **Kiên**) and Functional Group **F7** (Partner Dashboard & Availability Settings — **Nhân**) running end-to-end across React UI $\rightarrow$ FastAPI Backend $\rightarrow$ PostgreSQL Database.

---

## 1. Pre-Recording Integration Checklist

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

Before recording the integrated F5 + F7 demo video:
1. Confirm **both** F5 (`src/specs/003-f5-table-reservation/`) and F7 Spec Kit artifacts, backend routes, React UI screens, and PostgreSQL schema/seeds are merged into the reviewable integration commit.
2. Coordinate speaking roles / presenter handoffs between feature owners (**Nguyễn Trung Kiên** for F5 + architecture overview; **Lương Thiện Nhân** for F7 partner availability & queues).
3. Verify persisted PostgreSQL state survives full page reloads and API restarts (zero silent fallback).
4. Record chapter timestamps (`00:00` ...) during editing and send the verified YouTube URL + chapter markers to **Hoàng Cao Phong** for the submission `README.md`.

---

## 2. Planned Video Chapters & Persistence Verification Flows

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

| Chapter | Target Timestamp | Owner / Presenter | Feature & Use Cases | Live UI + API + DB Persistence Actions to Show |
| :--- | :---: | :--- | :--- | :--- |
| **1. Scope & Spec Kit Overview** | `00:00 – 00:35` | Nguyễn Trung Kiên | PA4 §E (`F5` & `F7`) | Show `src/specs/003-f5-table-reservation/` and F7 Spec Kit directory; highlight shared atomic capacity contract and retained `pytest` suite execution (`PASSED`). |
| **2. F7 Availability Settings & Persistence** | `00:35 – 01:35` | Lương Thiện Nhân | `UC-P04` Manage Availability | Sign in as Partner Staff $\rightarrow$ update opening hours, slot capacity, and add a blocked slot $\rightarrow$ reload page to prove PostgreSQL persistence (`UC-P04` basic + conflict warning). |
| **3. F5 Slot Lookup & Customer Request** | `01:35 – 02:35` | Nguyễn Trung Kiên | `UC-C08`, `UC-C09` | Open approved venue as Guest/Customer $\rightarrow$ check availability (reflecting F7 blocked slot & remaining seats) $\rightarrow$ sign in as Customer $\rightarrow$ submit reservation request -> show `Pending confirmation` + 30-min response deadline. |
| **4. F7 Dashboard Queue & F5 Partner Decisions** | `02:35 – 03:45` | Nhân & Kiên | `UC-P05`, `UC-P06`, `UC-P11`, `UC-P12` | Open Partner Dashboard (`UC-P05`) showing persisted pending request $\rightarrow$ confirm one request (`UC-P06` atomic capacity recheck -> `Confirmed`), demonstrate mandatory reason on decline / operational cancel (`UC-P11`), and validate check-in (`UC-P12` -> `Completed`). |
| **5. Customer History, 2h Cutoff & Admin Support** | `03:45 – 04:45` | Nguyễn Trung Kiên | `UC-C10`, `UC-C11`, `UC-A04` | Customer tracks full status history (`UC-C10`) and cancels a $>2\text{h}$ booking (`Cancelled by customer`, capacity released) while `<2h` cutoff blocks and shows restaurant hotline. Switch to Administrator (`UC-A04`) to inspect immutable audit history. |

---

## 3. Submission `README.md` Handoff Block (For Hoàng Cao Phong)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

```markdown
## Narrated Demo Video (PA4 — Functional Groups F5 & F7)

**Presenters:** Nguyễn Trung Kiên (F5) & Lương Thiện Nhân (F7) | **Reviewer:** Trương Khánh Duy

* **YouTube Link (Unlisted/Public):** [DineVina PA4 — F5 & F7 End-to-End Demo](https://youtu.be/REPLACE_WITH_ACTUAL_VIDEO_ID)
* **Chapter Markers:**
  * `00:00` Scope, Spec Kit (F5/F7) & Automated Pytest Verification
  * `00:35` F7 Partner Availability Settings & Reload Persistence (`UC-P04`)
  * `01:35` F5 Slot Availability Lookup & Table Reservation Submission (`UC-C08`, `UC-C09`)
  * `02:35` F7 Partner Dashboard Queue, Atomic Confirmation & Attendance (`UC-P05`, `UC-P06`, `UC-P11`, `UC-P12`)
  * `03:45` F5 Customer History, 2-Hour Cancel Cutoff & Admin Support Audit (`UC-C10`, `UC-C11`, `UC-A04`)
```
