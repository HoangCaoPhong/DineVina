# PA4 Section F – Individual AI Usage Report & Log (Trương Khánh Duy)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy

---

## 1. AI Usage Summary

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy

In compliance with PA4-2026 Section F and `Coderules.md`, generative AI (Google Gemini) was used as a coding, QA-structuring, and documentation assistant during Sprint 4 (PA4). All generated TypeScript/React modules, API contract mappings, test matrices, and revised use-case specifications were manually inspected, executed against the live FastAPI backend, verified with CI checks (`ruff`, `pytest`, `npm run build`), and committed by the responsible member. No real customer data, secrets, or `.env` credentials were shared with any AI tool.

---

## 2. Detailed AI Usage Log (PA4 – Week 6–7)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy

| Date | Tool Used | PA4 Deliverable | Prompt / Assistance Summary | Human Verification, Debugging & Editing |
| :--- | :--- | :--- | :--- | :--- |
| **27/11/2026** | **Google Gemini** | **Section E – F5 Partner Decisions & Admin History UI** (`feat/PA4_F5_Duy`) | Analyzed Kiên's F5 backend schemas/routes (`4d5b0e5`) and Ngọc's `WorkspaceModal` structure to scaffold `staffReservationApi.ts`, `PartnerReservations.tsx`, `AdminReservations.tsx`, and `staffReservations.css`. | Resolved port-8000 conflict and detached worktree setup; tested live Partner confirmation on `DV-F50002`, Admin read-only audit log on `DV-F50001`, and `403 FORBIDDEN_VENUE` / `403 FORBIDDEN_ROLE` probes; verified `ruff check backend`, `pytest` (`25 passed, 2 skipped`), and `npm run build` (`512ms`); captured 3 UI screenshots and opened PR `feat/PA4_F5_Duy -> dev`. |
| **27/11/2026** | **Google Gemini** | **Section E – QA Inspection & Defect Reporting** | Audited diffs across `origin/feat/PA4_F5_Kien` and `origin/feat/PA4_F5_Ngoc` to verify endpoint contracts and merge safety. | Identified that commit `6a2a9c4` on `feat/PA4_F5_Kien` dropped F5 endpoints from `backend/app/main.py` compared to `4d5b0e5`; flagged defect `DEF-PA4-01` directly to Backend Engineer before team merge. |
| **28/11/2026** | **Google Gemini** | **Section A – Revised AI Use-Case Specification (`F9`)** (`research/PA4_Duy`) | Assisted in revising PA3 Group F9 specification to reflect PA4 SQLAlchemy/F5 contracts, updated Mermaid integration diagram, added `AF-6` / `AF-7` guardrails, and clarified PA5 target status. | Verified all use-case IDs, NFR thresholds, prototype image paths (`evidence/UC_F9_*.png`), and ensured zero unimplemented AI features are claimed as completed. |
| **28/11/2026** | **Google Gemini** | **Section E – Integration & Generated Tests Verification Report** (`research/PA4_Duy`) | Structured verification matrices mapping 14 F5 generated tests, 27 F3 regression tests, and 5 live E2E UI scenarios with evidence references. | Executed commands locally in `.venv`, confirmed actual pass/skip counts, attached real screenshots, and documented F7 verification honestly as pending branch merge. |
