# PA3 — Nguyễn Trung Kiên

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

**Reviewer cho các việc dưới đây:** Trương Khánh Duy.

- [F3 Spec Kit, API và database](https://trello.com/c/ociR28Qz): tạo spec/plan/tasks; làm API tìm kiếm, lọc và chi tiết nhà hàng bằng FastAPI với PostgreSQL; chỉ trả dữ liệu đã duyệt; phối hợp UI của Phong và fixture của Nhân.
- [Video demo có thuyết minh](https://trello.com/c/QQkI3QEy): quay luồng F3 chạy xuyên UI–API–DB, tải YouTube Unlisted/Public và kiểm link phát; nội dung phải khớp source và use-case.

**Bàn giao:** source, Spec Kit artifacts, kết quả chạy và link video; chuyển In Review cho Duy trước khi Done.

---

## Tổng hợp Sản phẩm Bàn giao (PA3 Deliverables Index — Nguyễn Trung Kiên)

**Performed by:** Nguyễn Trung Kiên | **Reviewed by:** Trương Khánh Duy | **Edited by:** Nguyễn Trung Kiên

### 1. Spec Kit Artifacts (Nhóm chức năng F3 — `5.3 Restaurant Discovery and Venue Details`)
- `src/constitution.md` (v1.1.0 — Bổ sung ràng buộc PostgreSQL, chỉ trả nhà hàng `status == "approved"` và gắn nhãn `Sample Data`).
- `src/specs/002-f3-venue-discovery/spec.md` (Đặc tả 3 User Stories `US-F3-01`, `US-F3-02`, `US-F3-03` kèm kịch bản nghiệm thu Given-When-Then).
- `src/specs/002-f3-venue-discovery/plan.md` (Kiến trúc phân tầng FastAPI + SQLAlchemy 2.0 + PostgreSQL và bảng hợp đồng REST API).
- `src/specs/002-f3-venue-discovery/tasks.md` (7 tác vụ nguyên tử `TASK-F3-01` $\rightarrow$ `TASK-F3-07`, hoàn thành 100%).

### 2. FastAPI Backend, PostgreSQL Persistence & Validated Fixture
- `backend/app/database.py`: Cấu hình SQLAlchemy 2.0 `engine`, `SessionLocal`, `Base`, `get_db` hỗ trợ `DATABASE_URL` (PostgreSQL 17 trong Docker Compose và tự động fallback SQLite khi chạy `pytest` độc lập).
- `backend/app/models.py`: Mô hình quan hệ `VenueModel` (`venues`) và `DishModel` (`dishes`) có đánh chỉ mục (`index=True`) trên các cột tìm kiếm và lọc.
- `backend/app/schemas.py`: Bộ schema Pydantic v2 (`VenueSummaryOut`, `VenueDetailOut`, `MenuCategoryOut`, `DishOut`, `FilterOptionsOut`, `VenueListResponse`).
- `backend/app/fixtures/f3_venues_fixture.json` & `backend/app/seed.py`: Bộ dữ liệu mẫu gồm **8 nhà hàng đã duyệt (`status = "approved"`)** tại TP. Hồ Chí Minh (21 món ăn chia theo danh mục) và **3 nhà hàng chưa duyệt (`pending`, `returned`, `rejected`)** để kiểm chứng điều kiện chặn dữ liệu chưa duyệt.
- `backend/app/main.py`: Triển khai đầy đủ các endpoint F3:
  - `GET /api/health`
  - `GET /api/venues` (Tìm kiếm từ khóa `q` theo tên quán & món ăn, lọc theo `district`, `cuisine`, `min_budget`, `max_budget`, `party_size`, `amenity`, sắp xếp `sort`, phân trang `page`, `page_size`).
  - `GET /api/venues/filters` (Tổng hợp danh sách Quận, Ẩm thực, Tiện ích, khoảng giá và sức chứa tối đa từ các nhà hàng đã duyệt).
  - `GET /api/venues/{venue_id}` (Lấy chi tiết nhà hàng và thực đơn phân nhóm `menu_categories` theo `id` hoặc `slug`; trả `404 Not Found` nếu nhà hàng chưa được duyệt).

### 3. Kiểm thử Tự động & Báo cáo Kỹ thuật / Kịch bản Video
- `backend/tests/test_f3_discovery.py` & `backend/tests/test_health.py`: **10/10 bài kiểm thử tích hợp (`pytest -v`) PASSED 100%**.
- `docs/weekly-reports/PA3_Week4-5/Kien/F3-Backend-and-Database-Report.md`: Báo cáo kỹ thuật tiếng Anh (kèm sơ đồ Mermaid Sequence & ER Diagram, bảng API Contract và log chạy test) sẵn sàng ghép vào báo cáo tổng PA3.
- `docs/weekly-reports/PA3_Week4-5/Kien/F3-Video-Narration-Script.md`: Kịch bản thuyết minh chi tiết từng phân cảnh (Việt/Anh) và hướng dẫn quay video demo YouTube cho luồng F3.
