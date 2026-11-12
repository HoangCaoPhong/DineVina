# PA3 Narrated Demo Video Script & Recording Guide (Functional Group F3)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Trello Task**: [Video demo có thuyết minh](https://trello.com/c/QQkI3QEy)  
**Target Duration**: 3:30 – 5:00 minutes  
**Hosting Requirement**: YouTube (`Public` or `Unlisted`, verified in an Incognito browser window before submission)  
**Scope Demonstrated**: Functional Group F3 (**5.3 Restaurant Discovery and Venue Details**) running end-to-end across React UI $\rightarrow$ FastAPI Backend $\rightarrow$ PostgreSQL Database, traceable to Spec Kit artifacts (`src/specs/002-f3-venue-discovery/`).

---

## 1. Pre-Recording Setup Checklist

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

Before pressing Record in OBS Studio / Windows Snipping Tool:
1. **Start the Full Stack (Docker Compose or Local Dev)**:
   * **Option A (Docker Compose with PostgreSQL 17)**:
     ```powershell
     docker compose up --build -d
     ```
   * **Option B (Local FastAPI + Vite Dev Servers)**:
     ```powershell
     # Terminal 1 (Backend on port 8000)
     cd backend
     python -m uvicorn app.main:app --reload --port 8000

     # Terminal 2 (Frontend on port 5173)
     cd frontend
     npm run dev
     ```
2. **Open Browser Tabs Ready for Demo**:
   * **Tab 1**: DineVina React Frontend (`http://localhost:5173`) with Chrome DevTools (`F12` $\rightarrow$ **Network** tab open to show real `/api/venues` requests).
   * **Tab 2**: FastAPI Swagger UI (`http://localhost:8000/docs`) showing `/api/health`, `/api/venues`, `/api/venues/filters`, and `/api/venues/{venue_id}`.
   * **VS Code Window**: Showing `src/specs/002-f3-venue-discovery/spec.md`, `backend/app/main.py`, `backend/app/models.py`, and a terminal ready to run `python -m pytest -v`.

---

## 2. Scene-by-Scene Storyboard & Narration Script

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

### Scene 1: Introduction & Spec Kit Traceability (0:00 – 0:45)
* **On-Screen Action**:
  * Show VS Code with `src/constitution.md` and `src/specs/002-f3-venue-discovery/spec.md`, `plan.md`, and `tasks.md`.
  * Briefly scroll through the 3 User Stories (`US-F3-01` Browse & Search, `US-F3-02` Multi-Attribute Filtering, `US-F3-03` Venue Details & Categorized Menu).
* **Narration (Vietnamese)**:
  > *"Xin chào thầy và các bạn. Em là Nguyễn Trung Kiên, đại diện Nhóm 08 trình bày bản demo cho đồ án PA3 của hệ thống đặt bàn nhà hàng thông minh DineVina. Trong Sprint 3 này, nhóm em triển khai hoàn chỉnh End-to-End cho Nhóm chức năng F3: Khám phá nhà hàng và Xem chi tiết địa điểm (Restaurant Discovery and Venue Details).*
  > *Đầu tiên, tuân thủ quy trình Spec-Driven Development với Spec Kit, nhóm đã xây dựng đầy đủ bộ tài liệu tại thư mục `src/specs/002-f3-venue-discovery/` gồm `spec.md`, `plan.md` và `tasks.md`, định nghĩa rõ 3 User Stories cùng ràng buộc cốt lõi: API công khai chỉ trả về các nhà hàng đã được Admin phê duyệt (`status = 'approved'`) và gắn nhãn minh bạch dữ liệu mẫu `Sample Data`."*
* **Narration (English Option)**:
  > *"Hello Professor and everyone. I am Nguyễn Trung Kiên, presenting Group 08's PA3 narrated demo for DineVina. In Sprint 3, our team implemented Functional Group F3 — Restaurant Discovery and Venue Details — end-to-end across our React frontend, FastAPI backend, and PostgreSQL database. Starting in VS Code under `src/specs/002-f3-venue-discovery/`, we authored our Spec Kit specification (`spec.md`), architecture plan (`plan.md`), and task breakdown (`tasks.md`), enforcing that public discovery endpoints expose only administrator-approved venues."*

---

### Scene 2: PostgreSQL Database Schema, Fixture Seeding & Automated Pytest Suite (0:45 – 1:40)
* **On-Screen Action**:
  * Open `backend/app/models.py` and `backend/app/fixtures/f3_venues_fixture.json`. Point out the 8 approved Ho Chi Minh City venues (`v-hcmc-001` to `v-hcmc-008`) and the 3 unapproved moderation test records (`v-unapproved-001` pending, `v-unapproved-002` returned, `v-unapproved-003` rejected).
  * Run `python -m pytest -v` in the VS Code terminal so all 10 tests pass on screen.
* **Narration (Vietnamese)**:
  > *"Tại tầng Backend và Cơ sở dữ liệu, em đã thiết kế hai bảng quan hệ `venues` và `dishes` bằng SQLAlchemy 2.0 kết nối với PostgreSQL. Bộ dữ liệu mẫu trong `f3_venues_fixture.json` gồm tổng cộng 11 nhà hàng tại TP. Hồ Chí Minh: trong đó có 8 nhà hàng đã được duyệt (`status = 'approved'`) kèm thực đơn chi tiết, và 3 nhà hàng chưa được duyệt ở các trạng thái `pending`, `returned`, `rejected` để kiểm chứng cơ chế bảo mật lọc dữ liệu.*
  > *Khi chạy bộ kiểm thử tự động `pytest -v`, cả 10 kịch bản kiểm thử tích hợp đều vượt qua 100%, xác nhận rằng cơ sở dữ liệu chứa đủ 11 bản ghi nhưng API công khai chỉ trả về đúng 8 nhà hàng hợp lệ."*
* **Narration (English Option)**:
  > *"In our backend layer, `backend/app/models.py` defines the `venues` and `dishes` relational tables using SQLAlchemy 2.0 backed by PostgreSQL. Our validated fixture seeds 11 total records: 8 approved Ho Chi Minh City venues with full categorized menus, plus 3 unapproved venues in `pending`, `returned`, and `rejected` states. Running `python -m pytest -v` executes 10 integration tests confirming database seeding, multi-attribute filtering, and strict isolation of unapproved venues."*

---

### Scene 3: FastAPI Swagger UI & Moderation Guardrail Verification (1:40 – 2:30)
* **On-Screen Action**:
  * Switch to Browser Tab 2 (`http://localhost:8000/docs`).
  * Execute `GET /api/venues/filters` $\rightarrow$ show `total_approved_venues: 8`, `districts`, `cuisines`, and `amenities`.
  * Execute `GET /api/venues/{venue_id}` with `v-hcmc-001` $\rightarrow$ show `200 OK` and grouped `menu_categories`.
  * Execute `GET /api/venues/{venue_id}` with `v-unapproved-001` $\rightarrow$ show `404 Not Found`.
* **Narration (Vietnamese)**:
  > *"Tiếp theo trên giao diện Swagger OpenAPI tại cổng 8000, khi gọi endpoint `GET /api/venues/filters`, hệ thống truy vấn trực tiếp từ cơ sở dữ liệu và tổng hợp danh sách các Quận, loại hình ẩm thực, tiện ích và khoảng ngân sách từ 8 nhà hàng đã duyệt.*
  > *Khi truy vấn chi tiết nhà hàng `v-hcmc-001` (Nhà Hàng Việt Xưa Sài Gòn), API trả về mã `200 OK` cùng thực đơn đã được nhóm theo từng danh mục Khai vị, Món chính, Tráng miệng. Ngược lại, nếu cố tình truy cập mã nhà hàng đang chờ duyệt `v-unapproved-001`, API lập tức chặn lại và trả về mã `404 Not Found`."*
* **Narration (English Option)**:
  > *"In FastAPI's OpenAPI documentation at port 8000, calling `GET /api/venues/filters` dynamically aggregates distinct districts, cuisines, amenities, and budget bounds from the 8 approved venues. Fetching `GET /api/venues/v-hcmc-001` returns HTTP 200 with full venue metadata and categorized menu dishes, whereas requesting the unapproved venue `v-unapproved-001` is blocked with HTTP 404 Not Found."*

---

### Scene 4: End-to-End Customer Flow on the React UI (2:30 – 4:15)
* **On-Screen Action**:
  * Switch to Browser Tab 1 (`http://localhost:5173`) with the Network tab visible on the side.
  * Show the initial list of 8 approved restaurants and their visible `Sample Data` badges.
  * **Action 1 (Keyword Search)**: Type `"Phở bò Wagyu"` or `"Dimsum"` into the search bar $\rightarrow$ point out the live `GET /api/venues?q=...` network call and the updated restaurant cards.
  * **Action 2 (Multi-Attribute Filter)**: Select District = `Quận 1`, Party Size = `40` guests, and Budget $\le 500,000\text{ VNĐ}$ $\rightarrow$ show how the list narrows down to matching venues in District 1 (`Nhà Hàng Việt Xưa Sài Gòn` and `Cung Đình Dimsum`).
  * **Action 3 (Empty State & Reset)**: Enter a keyword with no match (e.g., `"Sushi Quận 1"`) to show the clean empty state, then reset filters.
  * **Action 4 (Venue Detail & Menu Inspection)**: Click on **Nhà Hàng Việt Xưa Sài Gòn** (`v-hcmc-001`) $\rightarrow$ show the detail view populated from `GET /api/venues/v-hcmc-001`: address, opening hours, seating capacity (`120` guests), amenities (`Phòng riêng`, `Chỗ đậu ô tô`, `Có máy chiếu`), available booking time slots, and the categorized menu with VND prices.
* **Narration (Vietnamese)**:
  > *"Bây giờ chúng ta kiểm chứng luồng trải nghiệm thực tế của khách hàng trên giao diện React kết nối trực tiếp với FastAPI và PostgreSQL. Ngay khi tải trang, giao diện hiển thị 8 nhà hàng đã được duyệt cùng nhãn `Sample Data` rõ ràng.*
  > *Khi khách hàng tìm kiếm từ khóa món ăn như 'Phở bò Wagyu' hoặc kết hợp bộ lọc Khu vực 'Quận 1', sức chứa đoàn 40 khách và ngân sách dưới 500.000đ/người, giao diện gửi request `GET /api/venues` xuống Backend và trả về đúng 2 nhà hàng thỏa mãn mọi tiêu chí.*
  > *Khi nhấn vào xem chi tiết 'Nhà Hàng Việt Xưa Sài Gòn', ứng dụng gọi `GET /api/venues/v-hcmc-001` để hiển thị đầy đủ địa chỉ, giờ mở cửa, sức chứa 120 khách, danh sách tiện ích phòng riêng, các khung giờ đặt bàn khả dụng và toàn bộ thực đơn chia theo từng nhóm món ăn với giá niêm yết VNĐ. Điều này chứng minh luồng F3 đã hoạt động thông suốt từ Giao diện người dùng xuống API và Cơ sở dữ liệu quan hệ. Em xin cảm ơn thầy và các bạn đã theo dõi!"*
* **Narration (English Option)**:
  > *"Finally, on the React frontend connected live to our FastAPI backend, we see all 8 approved venues with clear Sample Data labels. When a customer searches by dish keyword or filters by District 1, party size of 40 guests, and budget under 500,000 VND, the UI triggers `GET /api/venues` and renders the exact matching venues. Clicking 'Nhà Hàng Việt Xưa Sài Gòn' invokes `GET /api/venues/v-hcmc-001`, displaying its operating hours, 120-seat capacity, private room amenities, reservation slots, and categorized menu items fetched directly from PostgreSQL. Thank you for watching Group 08's PA3 demo!"*

---

## 3. Post-Recording Verification & `Readme.md` Template

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

After uploading the recorded `.mp4` file to YouTube:
1. Set visibility to **Unlisted** (Không công khai) or **Public** (Công khai) — **NEVER Private** (Riêng tư).
2. Copy the YouTube URL and open it in an **Incognito / Private Browser Window** without signing into Google to confirm it plays immediately.
3. Paste the verified link into the submission `Readme.md` using the block below:

```markdown
## Narrated Demo Video (PA3 — Functional Group F3)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

* **YouTube Link (Unlisted/Public)**: [DineVina PA3 — Functional Group F3 End-to-End Demo](https://youtu.be/REPLACE_WITH_ACTUAL_VIDEO_ID)
* **Demonstrated Scope**: Spec Kit artifacts (`src/specs/002-f3-venue-discovery/`), PostgreSQL schema & validated HCMC restaurant fixture seeding, FastAPI discovery/filter/detail endpoints (`/api/venues`, `/api/venues/filters`, `/api/venues/{venue_id}`), approved-only moderation guardrail (`404` on unapproved venues), and live React UI integration.
```
