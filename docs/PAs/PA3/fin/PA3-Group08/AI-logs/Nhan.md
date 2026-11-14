# AI Usage Record - Nhân
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

**Project:** DineVina - Smart Restaurant Reservation and Event Booking Marketplace  
**Member:** Lương Thiện Nhân (Data Management, Partner/Admin Use Cases, and Scrum/Reporting Lead; Student ID: 24127475)  
**Sprint:** PA3  
**Tool:** Antigravity (Gemini)  
**Declaration:** Generative AI was used to draft partner/administrator use-case specifications, generate HTML/CSS UI prototype screens rendered via headless Chrome, build and validate the F3 PostgreSQL sample fixture and smoke tests, and structure the PA3 Scrum and Weekly Report integration records without fabricating unverified meeting events. Nhân reviewed all outputs against `PA3-2026.pdf`, `UseCase-Model.md`, `Vision.md`, and repository sources, and remains responsible for the final content.

## Usage log
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

| Date | Tool | Material supplied | Purpose | Result | Human verification |
| --- | --- | --- | --- | --- | --- |
| 14 November 2026 | Antigravity (Gemini) | `PA3-2026.pdf`, `origin/research/Ngoc_PA3` (`UseCase-Model.md`, `UC-Customer.md`, `Vision.md`) | Draft RUP-compliant specifications for all 16 Partner Staff and Administrator use cases (`UC-P01`–`UC-P12`, `UC-A01`–`UC-A04`) | Created `UC-Partner-Admin.md` with basic flows, all alternative flows, preconditions, postconditions, and NFR references | Nhân verified 1-to-1 ID alignment with Ngọc's `UseCase-Model.md` and FR/NFR coverage |
| 14 November 2026 | Antigravity (Gemini) + Headless Chrome | `UC-Partner-Admin.md`, `UC-C01-Main-register.png` visual reference | Generate consistent HTML/CSS UI prototype screens and render PNGs for every basic and alternative flow | Rendered 65 PNG screens under `prototype/` with 1-to-1 filename verification | Nhân inspected rendered screens and verified 65 referenced = 65 files with zero missing or extra files |
| 14 November 2026 | Antigravity (Gemini) | PA2 Vision F3, `Discovery-and-Reservation-API-Contract.md` | Author F3 field dictionary, 15 labeled HCMC venues (12 approved + 3 unapproved), 30 menu items, PostgreSQL seed SQL, and smoke tests | Created `F3-Data-Dictionary.md`, `venues_sample.json`, `schema_and_seed.sql`, `validate_fixture.py`, `test_f3_fixture.py` | Executed validation and all 7 smoke tests (`python3`), confirming unapproved exclusion and filter behavior |
| 14 November 2026 | Antigravity (Gemini) | `Weekly Reports.pdf`, `PA3-Tasks.md` (5 members), `origin/research/Ngoc_PA3`, `origin/research/PA3-Phong` | Structure PA3 Scrum minutes, Weekly Report, and 5-member AI-usage integration without fabricating unrecorded meetings | Created `Scrum-Meetings-PA3.md`, `Weekly-Report-PA3.md`, `AI-Usage-Report-PA3.md` with explicit `[PENDING]` markers for unconfirmed items | Nhân verified that only observed repo facts and member-submitted AI logs were included |

## Supported outputs
**Performed by:** Lương Thiện Nhân | **Reviewed by:** Nguyễn Trung Kiên | **Edited by:** Lương Thiện Nhân

- `docs/weekly-reports/PA3_Week4-5/Nhan/UC-Partner-Admin.md`
- `docs/weekly-reports/PA3_Week4-5/Nhan/prototype/` (65 prototype screens)
- `docs/weekly-reports/PA3_Week4-5/Nhan/F3-Data-Dictionary.md`
- `docs/weekly-reports/PA3_Week4-5/Nhan/f3-fixture/` (`venues_sample.json`, `schema_and_seed.sql`, `validate_fixture.py`, `test_f3_fixture.py`)
- `docs/weekly-reports/PA3_Week4-5/Nhan/Scrum-Meetings-PA3.md`
- `docs/weekly-reports/PA3_Week4-5/Nhan/Weekly-Report-PA3.md`
- `docs/weekly-reports/PA3_Week4-5/Nhan/AI-Usage-Nhan.md`
- `docs/weekly-reports/PA3_Week4-5/Nhan/AI-Usage-Report-PA3.md`
