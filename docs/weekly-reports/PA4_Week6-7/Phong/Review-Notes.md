# DineVina PA4 | Phong's review notes
**Performed by:** OpenAI Codex on behalf of Hoàng Cao Phong | **Reviewed by:** Pending (Hoàng Cao Phong) | **Edited by:** OpenAI Codex

## Use-case model, customer specification and Changes.md
**Performed by:** OpenAI Codex on behalf of Hoàng Cao Phong | **Reviewed by:** Pending (Hoàng Cao Phong) | **Edited by:** OpenAI Codex

Reviewed Ngọc's [research branch snapshot `e9bdf71`](https://github.com/HoangCaoPhong/DineVina/tree/e9bdf71315c6eca22510477727bf0a87e8b56abf/docs/weekly-reports/PA4_Week6-7/Ngoc) for [Trello #48](https://trello.com/c/VnzalQSh). All 63 distinct prototype links in the customer specification resolved to files in the same revision. `Changes.md` identifies the PA3 baseline and describes customer changes to F3 filtering and F5 availability, retries and cancellation. The model distinguishes specified behavior, implementation and prototype coverage.

**Before acceptance:** Map actual TA feedback to the revised sections and add Nhân's partner/admin and Duy's AI changes to the same `Changes.md`. Confirm each F5 implementation note against the integrated routes and shipped UI. Treat the state and capacity rules as design until the corresponding checks pass in the integrated build.

## Frontend Level 3 diagram
**Performed by:** OpenAI Codex on behalf of Hoàng Cao Phong | **Reviewed by:** Pending (Hoàng Cao Phong) | **Edited by:** OpenAI Codex

Reviewed [Ngọc's frontend component diagram](https://github.com/HoangCaoPhong/DineVina/blob/e9bdf71315c6eca22510477727bf0a87e8b56abf/docs/weekly-reports/PA4_Week6-7/Ngoc/C4-Frontend-Components.md) for [Trello #67](https://trello.com/c/T7zlM0f1). The F3 list and detail arrows correspond to `App` and `VenueDetailModal`. The baseline diagram identifies demo components and the Nginx and Vite proxy paths.

**Before acceptance:** Use the complete Level 2 labels `Web Application Container` and `API Server Container`. Update the diagram for the integrated booking components, `reservationApi.ts`, the partner queue and actual F5/F7 interactions. Ngọc's [F5 feature branch](https://github.com/HoangCaoPhong/DineVina/tree/d336a24069db2fe8df6f95fb6402abc1043bd7d9) includes an API client and browser cases. The inspected [Kiên feature tip `6a2a9c4`](https://github.com/HoangCaoPhong/DineVina/blob/6a2a9c4f2390e556b0398a4e33963fbf21fee6b2/backend/app/main.py) lacks F5 routes in the FastAPI entry point. Validate the UI against the revision that exposes the actual routes before recording integration success.
