# PA3 Narrated Demo Video Script & Recording Guide (Functional Group F3)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Trello Task**: [Video demo có thuyết minh](https://trello.com/c/QQkI3QEy)  
**Recommended Duration**: 3:00 – 4:30 minutes (PA3 imposes no hard duration limit; focus clearly on working full-stack features)  
**Hosting Requirement**: YouTube (`Unlisted` or `Public`, verified in an Incognito browser window before submission)  
**Scope Demonstrated**: Functional Group F3 (**5.3 Restaurant Discovery and Venue Details** — `UC-C04`, `UC-C05`, `UC-C06`) running end-to-end across React UI $\rightarrow$ FastAPI Backend $\rightarrow$ PostgreSQL / Supabase Cloud Database, traceable to Spec Kit artifacts (`src/specs/002-f3-venue-discovery/`).

---

## 1. Pre-Recording Setup Checklist

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

Before pressing Record in Windows Snipping Tool (`Win + Shift + R`) or OBS Studio:
1. **Verify Both Local Servers Are Running** (on demo branch `demo/PA3_Kien_Video_Supabase`):
   * **Backend (port `8000`)**:
     ```powershell
     python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
     ```
   * **Frontend (port `5173`)**:
     ```powershell
     npm --prefix frontend run dev
     ```
2. **Prepare 3 Windows / Tabs Before Recording**:
   * **VS Code Window**: Open [spec.md](src/specs/002-f3-venue-discovery/spec.md), [plan.md](src/specs/002-f3-venue-discovery/plan.md), [tasks.md](src/specs/002-f3-venue-discovery/tasks.md), and [models.py](backend/app/models.py); pre-type `python -m pytest -v` in the bottom terminal.
   * **Browser Tab 1**: FastAPI Swagger UI (`http://127.0.0.1:8000/docs`), pressed `F5`.
   * **Browser Tab 2**: DineVina React Frontend (`http://localhost:5173`), pressed `F5`, optionally with Chrome DevTools (`F12` $\rightarrow$ **Network**) ready to show live `/api/venues` calls.
   * **Browser Tab 3 (Optional)**: Supabase Dashboard $\rightarrow$ Table Editor (`venues`, `menu_categories`, `dishes`).

---

## 2. Scene-by-Scene Storyboard & Narration Script

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

### Scene 1: Introduction & Spec Kit Overview (0:00 – 0:25)
* **On-Screen Action**:
  * Start in VS Code and click briefly through `src/specs/002-f3-venue-discovery/spec.md`, `plan.md`, and `tasks.md` (15–20 seconds total — no need to read line by line).
* **Narration (Vietnamese)**:
  > *"Xin chào thầy và các bạn. Em là Nguyễn Trung Kiên, đại diện Nhóm 08 trình bày video demo đồ án PA3 cho hệ thống đặt bàn nhà hàng DineVina. Trong Sprint 3, nhóm em triển khai End-to-End cho Nhóm chức năng F3: Khám phá nhà hàng và Xem chi tiết địa điểm (`UC-C04`, `UC-C05`, `UC-C06`). Tuân thủ quy trình Spec Kit, nhóm đã tạo đầy đủ 3 file `spec.md`, `plan.md` và `tasks.md` tại `src/specs/002-f3-venue-discovery/` với ràng buộc API công khai chỉ trả về nhà hàng đã được Admin duyệt (`status = 'approved'`)."*
* **Narration (English Option)**:
  > *"Hello Professor and everyone. I am Nguyễn Trung Kiên from Group 08, presenting our PA3 end-to-end demo for DineVina's Functional Group F3 — Restaurant Discovery and Venue Details (`UC-C04`, `UC-C05`, `UC-C06`). Following Spec Kit, we authored `spec.md`, `plan.md`, and `tasks.md` under `src/specs/002-f3-venue-discovery/`, enforcing that public endpoints return only administrator-approved venues."*

---

### Scene 2: Database Schema, Supabase Rollout & Automated Pytest Suite (0:25 – 1:15)
* **On-Screen Action**:
  * Show `backend/app/models.py` (`VenueModel`, `DishModel`) and `backend/app/fixtures/f3_venues_fixture.json`.
  * Press `Enter` in the VS Code terminal to run `python -m pytest -v` and wait for **`27 passed`** (green).
* **Narration (Vietnamese)**:
  > *"Ở tầng Backend và Cơ sở dữ liệu, em thiết kế bảng quan hệ nhà hàng và món ăn bằng SQLAlchemy 2.0 và đồng bộ trực tiếp lên Supabase PostgreSQL. Bộ fixture gồm 11 nhà hàng tại TP.HCM: 8 nhà hàng đã duyệt kèm 21 món ăn phân danh mục, và 3 nhà hàng chưa duyệt (`pending`, `returned`, `rejected`) để kiểm thử bảo mật. Khi chạy bộ kiểm thử tự động `python -m pytest -v`, toàn bộ **27 test cases** đều pass 100%, bao gồm cả 2 bài test xác minh dữ liệu rollout của nhóm trên Supabase Cloud và hợp đồng API `/api/v1/restaurants/*`."*
* **Narration (English Option)**:
  > *"In the backend layer, `backend/app/models.py` defines relational venue and dish tables using SQLAlchemy 2.0 synced to Supabase PostgreSQL. Running `python -m pytest -v` passes all 27 automated tests, covering search, multi-attribute filtering, unapproved-venue isolation, `/api/v1/restaurants/*` contract aliases, and live Supabase rollout integrity."*

---

### Scene 3: FastAPI Swagger UI & Guardrail Verification (1:15 – 2:05)
* **On-Screen Action**:
  * Switch to **Browser Tab 1 (`http://127.0.0.1:8000/docs`)**:
    1. Execute `GET /api/supabase-status` $\rightarrow$ point out `enabled: true`, `f3_venues_total: 11`, `f3_venues_approved: 8`, `f3_dishes: 21`, and `total_venues_in_supabase: 29`.
    2. Execute `GET /api/venues/filters` $\rightarrow$ show `total_approved_venues: 8`, `districts`, `cuisines`, and `amenities`.
    3. Execute `GET /api/venues/{venue_id}` with `v-hcmc-001` $\rightarrow$ show `200 OK` and grouped `menu_categories`.
    4. Execute `GET /api/venues/{venue_id}` with `v-unapproved-001` $\rightarrow$ show `404 Not Found`.
* **Narration (Vietnamese)**:
  > *"Trên giao diện Swagger OpenAPI tại cổng 8000, endpoint `GET /api/supabase-status` xác nhận 11 nhà hàng và 21 món ăn F3 đã được đồng bộ lên Supabase cùng 29 bản ghi của cả nhóm. Khi gọi `GET /api/venues/filters`, hệ thống tổng hợp danh sách quận, ẩm thực, tiện ích và khoảng giá từ đúng 8 nhà hàng đã duyệt.*
  > *Khi truy vấn `GET /api/venues/v-hcmc-001`, API trả về `200 OK` cùng thực đơn chia danh mục. Ngược lại, khi thử truy cập nhà hàng chưa duyệt `v-unapproved-001`, API chặn lại với mã `404 Not Found`."*
* **Narration (English Option)**:
  > *"In Swagger UI at port 8000, `GET /api/supabase-status` confirms live Supabase Cloud synchronization with 29 total team venues. `GET /api/venues/filters` aggregates metadata from the 8 approved venues, `GET /api/venues/v-hcmc-001` returns HTTP 200 with categorized menu dishes, and requesting `v-unapproved-001` is blocked with HTTP 404 Not Found."*

---

### Scene 4: End-to-End Customer Flow on the React UI (2:05 – 3:45)
* **On-Screen Action**:
  * Switch to **Browser Tab 2 (`http://localhost:5173`)**:
    1. **Browse (`UC-C04`)**: Scroll through the initial 8 approved restaurants and point out the clean UI connected live to FastAPI (`"Dữ liệu trực tiếp từ FastAPI + PostgreSQL"`).
    2. **Keyword Search (`UC-C04`)**: Type `"Phở bò Wagyu"` (or `"Dimsum"`) in the search bar $\rightarrow$ show live filtered results, then clear the text.
    3. **Multi-Attribute Filters (`UC-C04`)**: Select `Khu vực = Quận 1`, `Giá trung bình = 200K – 400K`, and `Phòng riêng = Có phòng riêng` (and optionally open `☷ Bộ lọc khác` to show `Tiện ích` / `Sắp xếp`).
    4. **Empty State Alternative Flow (`UC-C04-A3`)**: Type an unmatched query such as `"Sushi Quận 1"` to show the clean empty state, then click **`Xóa tất cả`** to reset.
    5. **Venue Details & Categorized Menu (`UC-C05`, `UC-C06`)**: Click **Nhà Hàng Việt Xưa Sài Gòn** (`v-hcmc-001`) $\rightarrow$ show address, opening hours (`10:00 - 22:00`), capacity (`120 khách`), amenities, available booking slots, and categorized menu items with VND prices.
* **Narration (Vietnamese)**:
  > *"Cuối cùng trên giao diện React kết nối trực tiếp với FastAPI, chúng ta thực hiện Use Case `UC-C04`: ngay khi tải trang, hệ thống hiển thị đúng 8 nhà hàng đã được duyệt. Khi tìm kiếm theo tên món như 'Phở bò Wagyu' hoặc kết hợp bộ lọc Khu vực 'Quận 1', mức giá '200K – 400K' và 'Có phòng riêng', giao diện gửi request `GET /api/venues` xuống Backend và lọc ra đúng các nhà hàng phù hợp.*
  > *Ở luồng ngoại lệ `UC-C04-A3`, khi nhập từ khóa không có kết quả như 'Sushi Quận 1', hệ thống hiển thị thông báo trống rõ ràng và cho phép nhấn 'Xóa tất cả' để khôi phục.*
  > *Tiếp theo, thực hiện Use Case `UC-C05` và `UC-C06`, khi bấm vào 'Nhà Hàng Việt Xưa Sài Gòn', ứng dụng gọi `GET /api/venues/v-hcmc-001` để hiển thị đầy đủ địa chỉ, giờ mở cửa, sức chứa 120 khách, tiện ích phòng riêng, khung giờ đặt bàn và toàn bộ thực đơn chia theo danh mục món ăn. Điều này chứng minh luồng F3 đã hoạt động hoàn chỉnh từ UI đến API và Database. Em xin cảm ơn thầy và các bạn đã theo dõi!"*
* **Narration (English Option)**:
  > *"Finally on the live React frontend, `UC-C04` renders all 8 approved venues directly from FastAPI. Searching by dish name such as 'Phở bò Wagyu' or combining District 1, 200K–400K budget, and Private Room filters updates the list dynamically. Entering an unmatched query demonstrates the `UC-C04-A3` empty state before clicking 'Xóa tất cả' to reset. Opening 'Nhà Hàng Việt Xưa Sài Gòn' invokes `UC-C05` and `UC-C06` via `GET /api/venues/v-hcmc-001`, displaying capacity, amenities, available slots, and categorized VND menu dishes. Thank you for watching!"*

---

## 3. Post-Recording Verification & `Readme.md` Template

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

After uploading the recorded `.mp4` file to YouTube:
1. Set visibility to **Unlisted** or **Public** — **NEVER Private**.
2. Open the YouTube URL in an **Incognito / Private Browser Window** without signing in to confirm playback works immediately.
3. Paste the verified link into the submission `Readme.md` using the block below:

```markdown
## Narrated Demo Video (PA3 — Functional Group F3)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

* **YouTube Link (Unlisted/Public)**: [DineVina PA3 — Functional Group F3 End-to-End Demo](https://youtu.be/REPLACE_WITH_ACTUAL_VIDEO_ID)
* **Demonstrated Scope**: Spec Kit artifacts (`src/specs/002-f3-venue-discovery/`), PostgreSQL & Supabase Cloud synchronization, 27 automated Pytest integration checks, FastAPI discovery/filter/detail endpoints (`/api/venues`, `/api/v1/restaurants/*`, `/api/venues/filters`, `/api/venues/{venue_id}`), approved-only moderation guardrail (`404` on unapproved venues), and live React UI integration (`UC-C04`, `UC-C05`, `UC-C06`).
```
