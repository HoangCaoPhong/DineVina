# Eatigo interface capture provenance

**Survey owner:** Lương Thiện Nhân  
**Document reviewer:** Nguyễn Trung Kiên  
**Repository check:** 17 October 2026

The five Eatigo PNGs in this directory were copied byte for byte from the team's [DineVina `dev` branch](https://github.com/HoangCaoPhong/DineVina/tree/dev/docs/weekly-reports/Week1/Nhan-ExistingAppSurvey). Nhân added them in commit [`cd283ca`](https://github.com/HoangCaoPhong/DineVina/commit/cd283ca8faf53d1e16f8f1dad64da1467bf35fd5), merged to `dev` through [PR #9](https://github.com/HoangCaoPhong/DineVina/pull/9). At the read-only check, `origin/dev` was `c8069506554a04a31e44326f723e69fab0e95737`, while `origin/main` was `c1abac9451cfbece8790ea2495d422b766b64006`. The Eatigo commit was an ancestor of `dev` and not an ancestor of `main`.

| Screenshot | What is directly visible |
| --- | --- |
| `Eatigo_HomePage.png` | Pattaya location, date/time/party-size search, venue promotions. |
| `Eatigo_SearchFilter.png` | Price, discount, rating, and cuisine filters; restaurant cards with half-hour discounts. |
| `Eatigo_VenueDiscountChart.png` | Venue details, party/date fields, time-slot badges, and a review panel marked “AI Summary.” |
| `Eatigo_BookingModal.png` | Login or registration modal after a slot is selected. |
| `Eatigo_SpecialConditions_FUP.png` | Venue special conditions, cancellation-policy entry, and FAQ. |

The screenshots show a Thailand browsing session. They do not prove Vietnam availability, a completed reservation, the internal implementation of Eatigo's AI summary, or the exact date on which the pages were captured. The commit date confirms when these files entered the team branch, not when the browser screenshots were taken. No customer credentials or booking confirmation are included.
