# PA3 Deliverables: Group F9 Use-Case Specifications & Group F3 End-to-End Validation

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

*(Review & Remediation Note: Coordinated IDs, Mermaid relationships, missing alternative-flow prototype screens, and `origin/dev` `91944a5` PostgreSQL F3 smoke verification updated during PR review by Lương Thiện Nhân.)*

---

## 1. Traceability & Scope Notice (F9 Vision to Use-Case Mapping)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

In accordance with [Vision.md](../Ngoc/Vision.md) (v2.0, `FR-9.1`–`FR-9.5`), [UseCase-Model.md](../Ngoc/UseCase-Model.md), and PA3 scope boundaries, Group 9 (**Intelligent Assistance**) consists of one primary AI capability and two optional candidate slices. None of the F9 use cases are claimed as implemented in the PA3 functional build (which implements Group F3: Restaurant Discovery and Venue Details).

| Vision FR ID | Authoritative Use-Case ID | Use-Case Name | Primary Actor | Delivery Status in PA3 | Legacy Prototype Tab Label |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`FR-9.1` – `FR-9.3`** *(+ `FR-2.4`)* | **`UC-AI01`** | Get Explainable Recommendations | **Guest** *(inherited by Customer)* | **Primary AI Slice** (Specified & Prototyped in PA3; targeted for Sprint 4 implementation) | `UC-F9-01` |
| **`FR-9.4`** | **`UC-AI02`** | Ask Menu and Policy Assistant *(candidate)* | **Guest** *(inherited by Customer)* | **Optional Candidate Slice (RAG)** (Specified & Prototyped for traceability; not implemented) | `UC-F9-02` |
| **`FR-9.5`** | **`UC-AI03`** | Digitize Menu from Image *(candidate)* | **Partner Staff** | **Optional Candidate Slice (OCR)** (Specified & Prototyped for traceability; not implemented) | `UC-F9-03` |

### 1.1. F9 Sub-System Use-Case Diagram (Mermaid)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

*(Aligned 1:1 with the master F1–F9 [UseCase-Model.md](../Ngoc/UseCase-Model.md) maintained by Võ Mỹ Ngọc.)*

```mermaid
flowchart LR
    Guest["Guest"]
    Customer["Customer"]
    Partner["Partner Staff"]
    Customer -->|"«generalization»"| Guest

    subgraph DV["DineVina — Group F9 & Connected Core (F3 / F4)"]
        C04(["UC-C04 Search and Filter Restaurants"])
        C05(["UC-C05 View Restaurant Details"])
        C06(["UC-C06 View Menu"])
        P03(["UC-P03 Manage Menu"])
        AI01(["UC-AI01 Get Explainable Recommendations"])
        AI02(["UC-AI02 Ask Menu and Policy Assistant (candidate)"])
        AI03(["UC-AI03 Digitize Menu from Image (candidate)"])
    end

    Guest --- C04
    Guest --- C05
    Partner --- P03

    AI01 -. "«extend»" .-> C04
    C06 -. "«extend»" .-> C05
    AI02 -. "«extend»" .-> C05
    AI03 -. "«extend»" .-> P03
```

---

## 2. Primary Use-Case Specification: `UC-AI01`

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

### 2.1. `UC-AI01`: Get Explainable Recommendations (Primary Slice)

* **Use-Case ID:** `UC-AI01` *(Maps to Vision `FR-9.1`, `FR-9.2`, `FR-9.3`, `FR-2.4`; extends `UC-C04`; legacy draft tab `UC-F9-01`)*
* **Use-Case Name:** Get Explainable Recommendations
* **Actor(s):** Guest (Primary Actor; inherited by signed-in Customer via `«generalization»`)
* **Description:** A guest or customer states their dining context (party size, date, time, budget range, preferred cuisine, and special occasion/amenities) to receive a ranked list of eligible, administrator-approved restaurants. Each recommended venue displays a transparent justification badge grounded strictly in verified restaurant and menu attributes, while standard manual search filters (`UC-C04`) remain accessible at all times as the fallback.
* **Preconditions:**
  1. The guest is accessing the DineVina web platform on a desktop or mobile browser.
  2. The PostgreSQL database contains administrator-approved restaurant profiles (`status = 'approved'`) with structured operating hours, seating capacity, price ranges, cuisine tags, and menu items.
  3. The guest has granted session consent (`PRIV-01`) for DineVina to process their stated dining preferences for recommendation ranking.
* **Basic Flow (Main Success Scenario):**
  1. The guest navigates to the DineVina Discovery page (`UC-C04`) and opens the **"Find with AI Recommender"** panel (or enters preferences in the Smart Match bar).
  2. The system displays the structured preference input form requesting: **Party Size**, **Date**, **Time Slot**, **Budget per Person (VND)**, **Preferred Cuisine(s)**, and **Occasion / Required Amenities** (e.g., *Private Room*, *Anniversary*, *Car Parking*, *Kids' Area*).
  3. The guest fills in the required parameters (Party Size, Date, Time) along with optional preference tags, confirms session preference usage consent, and clicks **"Get Recommendations"**.
  4. The system validates the input fields and executes the **Deterministic Eligibility Filter**, excluding any restaurant that is unapproved (`status != 'approved'`), closed at the requested date/time, or unable to accommodate the requested party size.
  5. The system scores and ranks the remaining eligible venues using the **Multi-Attribute Preference Ranking Engine** (evaluating cuisine match, budget overlap, and requested occasion/amenity tags).
  6. For the top-ranked venues, the system generates **Explainable Reason Badges** citing only verified database attributes (e.g., *"96% Match: Matches Vietnamese/BBQ preference • Fits 200k–400k VND budget • Verified Private Room for up to 12 guests"*).
  7. The system renders the ranked list of recommended restaurant cards, displaying each venue's summary, verified price range, available time slots, and its Explainable Reason Badge.
  8. The guest clicks on a recommended restaurant card to inspect the full venue profile (`UC-C05: View Restaurant Details`) and proceed toward a table reservation request (`UC-C09`).
* **Alternative Flows:**
  * **AF-1: Zero Exact Matches Found – Relaxed Criteria Suggestion (At Step 4 or Step 5):**
    1. If no approved venue satisfies all strict and soft constraints simultaneously, the system identifies which non-critical constraint (e.g., specific cuisine tag or exact budget tier) caused the empty result while preserving hard capacity and `'approved'` status rules.
    2. The system displays an **"Exact Match Not Found – Closest Verified Alternatives"** banner explaining which preference was relaxed.
    3. The guest either selects one of the relaxed alternatives (resuming at Basic Flow Step 8) or clicks **"Switch to Manual Filters"** to adjust criteria manually (`UC-C04`).
  * **AF-2: No Approved Venues Available for Party Size / Date-Time (At Step 4):**
    1. If zero approved venues can accommodate the requested party size or time slot across the platform, the system displays a clear empty-state message: *"No verified restaurants have available capacity for [Party Size] guests at [Time] on [Date]."*
    2. The system provides quick-action chips to shift the time slot by ±1 hour or switch to the **Event Inquiry workflow** (`UC-C12`) for large banquets.
  * **AF-3: AI Explanation Service Timeout or API Failure – Deterministic Template Fallback (At Step 6):**
    1. If the external LLM formatting service exceeds the 2.5-second latency threshold or returns an error, the system automatically triggers the **Deterministic Rule-Based Template Generator** within `< 500 ms`.
    2. The system renders the ranked venue cards using structured attribute badges (e.g., `✓ Approved Venue | ✓ Capacity: Up to 120 | ✓ Price: 250k–500k VND`) without interrupting the guest's session.
  * **AF-4: Invalid or Past Date/Time Input (At Step 4):**
    1. If the guest selects a date/time in the past or enters a party size ≤ 0, the system highlights the invalid input field in red with an inline validation message (*"Please select a future dining time and a valid party size of at least 1 guest"*).
    2. The use case returns to Basic Flow Step 2.
  * **AF-5: Guest Declines Preference Consent or Bypasses AI (At Step 2 or Step 3):**
    1. If the guest unchecks preference consent (`PRIV-01`) or clicks **"Use Standard Search Filters Instead"**, the system immediately closes the AI panel and redirects the guest to standard multi-attribute search (`UC-C04`) with zero preference tracking.
* **Postconditions:**
  * *Success Postcondition:* The guest views a ranked list of administrator-approved restaurants (`status = 'approved'`) capable of serving their party size/time, each paired with a 100% database-grounded explanation badge.
  * *Fallback Postcondition:* On zero matches, timeouts, or declined consent, the guest is smoothly guided to relaxed verified alternatives or manual discovery filters (`UC-C04`) without encountering raw system errors or unverified claims.
* **Special Requirements (Quantifiable Non-Functional Requirements):**
  * **NFR-AI-01 (Latency, aligned with `PERF-01`/`PERF-03`):** End-to-end recommendation ranking and explanation rendering must complete in **`< 2.5 seconds`** for 95% of requests under 50 concurrent users.
  * **NFR-AI-02 (Factual Grounding):** **100%** of facts displayed in Explainable Reason Badges (price range, cuisine, capacity, amenities) must match verified PostgreSQL columns; hallucinating unverified amenities is strictly prohibited.
  * **NFR-AI-03 (Fallback Speed):** Automatic fallback to deterministic attribute templates or `UC-C04` manual filters must execute in **`< 500 milliseconds`**.
  * **NFR-AI-04 (Privacy, aligned with `PRIV-01`):** Session preferences require explicit input/consent; no personal identifiers are sent to external model training or committed in fixtures.

#### UI Prototype Screens for `UC-AI01` *(All Basic & Alternative Flows Covered)*

* **Screen 1 (`UC-AI01` Basic Flow Steps 1–3):** Smart Preference Input & Consent Panel *(prototype tab label `UC-F9-01` maps to `UC-AI01`)*.

![UC-AI01 Screen 1: AI Preference Input Form](evidence/UC_F9_01_Input_Panel.png)

* **Screen 2 (`UC-AI01` Basic Flow Steps 6–8):** Ranked Venue Results with Explainable Reason Badges.

![UC-AI01 Screen 2: Explainable Recommendation Results](evidence/UC_F9_01_Ranked_Results.png)

* **Screen 3 (`UC-AI01` Alternative Flows `AF-1` & `AF-2`):** Zero Exact Match Banner, Relaxed Alternatives & Capacity Empty State with Manual Filter Fallback (`UC-C04`).

![UC-AI01 Screen 3: AF-1 and AF-2 Empty Match and Fallback](evidence/UC_F9_01_Fallback_Empty_State.png)

* **Screen 4 (`UC-AI01` Alternative Flow `AF-3`):** AI Summary Timeout Fallback Rendering Deterministic Database-Grounded Badges (`< 500 ms`).

![UC-AI01 Screen 4: AF-3 Deterministic Template Fallback](evidence/UC_AI01_AF3_Timeout_Template_Fallback.png)

* **Screen 5 (`UC-AI01` Alternative Flows `AF-4` & `AF-5`):** Inline Red Validation Error (`AF-4`) and Consent-Declined Zero-Tracking Bypass to `UC-C04` (`AF-5`).

![UC-AI01 Screen 5: AF-4 Validation and AF-5 Consent Bypass](evidence/UC_AI01_AF4_AF5_Validation_And_Consent.png)

---

## 3. Optional Candidate Slice Specifications (Retained from Vision for Traceability)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

> **Implementation Boundary Notice:** The following two use cases (`UC-AI02` and `UC-AI03`) represent **optional candidate slices** documented in [Vision.md](../Ngoc/Vision.md) (`FR-9.4` and `FR-9.5`) and [UseCase-Model.md](../Ngoc/UseCase-Model.md). They are specified and prototyped here to maintain complete Vision-to-Use-Case traceability required by PA3 Sections C & D, and **must not be presented or interpreted as implemented features in the current PA3 build**.

### 3.1. `UC-AI02`: Ask Menu and Policy Assistant *(Optional Candidate Slice – RAG)*

* **Use-Case ID:** `UC-AI02` *(Maps to Vision `FR-9.4` – Optional Candidate Slice; extends `UC-C05`; legacy draft tab `UC-F9-02`)*
* **Use-Case Name:** Ask Menu and Policy Assistant
* **Actor(s):** Guest (Primary Actor; inherited by signed-in Customer via `«generalization»`)
* **Description:** While viewing an approved restaurant's detail page (`UC-C05`), a guest asks natural-language questions about menu ingredients, dietary/allergy suitability, corkage fees, parking, or cancellation rules. The assistant retrieves information strictly from that venue's verified profile, menu records (`UC-C06`), and policy documents, returning an answer with explicit source citations.
* **Preconditions:**
  1. The guest is viewing an approved restaurant detail page (`UC-C05`, `status = 'approved'`).
  2. The restaurant has published verified menu items (`UC-C06`) and venue policy records in PostgreSQL.
* **Basic Flow (Main Success Scenario):**
  1. On the Venue Detail page (`UC-C05`), the guest clicks the **"Ask Venue AI Assistant"** widget (or selects a suggested question chip such as *"What is the cancellation grace period?"* or *"Are there vegetarian options under 200k?"*).
  2. The system opens a contextual Q&A drawer scoped strictly to the currently viewed restaurant.
  3. The guest types a question and submits it.
  4. The system retrieves matching text segments exclusively from that restaurant's verified PostgreSQL records (approved menu items, amenity flags, and house rules).
  5. The system generates a concise answer grounded in the retrieved records and appends clickable **Source Citation Badges** (e.g., `[Source: Verified Venue Policy - Section 3]` or `[Source: Verified Amenities - Parking]`).
  6. The guest reviews the cited information and proceeds toward a reservation request (`UC-C09`) or event inquiry (`UC-C12`).
* **Alternative Flows:**
  * **AF-1: Information Not Present in Verified Venue Records (Strict Abstention at Step 4):**
    1. If the guest asks about a detail not recorded in the restaurant's verified data (e.g., custom allergen preparation), the system refuses to guess or hallucinate.
    2. The assistant displays a transparent abstention notice directing the guest to include the question in Special Request notes / Event Inquiry, paired with a **"Copy question to Booking Request Note"** button.
  * **AF-2: Out-of-Scope or Cross-Venue Query (At Step 3):**
    1. If the guest enters a prompt unrelated to dining or outside the current venue, the assistant restricts the scope: *"I can only answer questions based on [Venue Name]'s verified menu, amenities, and booking policies."*
  * **AF-3: RAG Service Unavailable (At Step 4):**
    1. If the assistant service is offline or times out, the widget displays an error notice directing the guest directly to the static **Thực đơn (`UC-C06`)** and **Venue Info / Rules (`UC-C05`)** tabs on the page.
* **Postconditions:**
  * The guest receives either a 100% source-cited answer from verified venue data or an explicit abstention / static-tab fallback notice without any unverified claims.
* **Special Requirements:**
  * **Zero Hallucination Rule (`PRIV-01` / Safety):** The assistant must never state an unverified allergen, price, or policy rule as fact.

#### UI Prototype Screens for `UC-AI02` *(Optional Candidate Slice — Basic & All Alternative Flows)*

* **Screen 6 (`UC-AI02` Basic Flow & `AF-1` Abstention):** Contextual Venue Q&A Drawer showing (a) a cited answer from verified policy/amenity records and (b) an explicit abstention response when allergen data is unverified *(prototype tab label `UC-F9-02` maps to `UC-AI02`)*.

![UC-AI02 Screen 6: RAG Assistant Cited Answer and AF-1 Abstention](evidence/UC_F9_02_RAG_Assistant_States.png)

* **Screen 7 (`UC-AI02` Alternative Flows `AF-2` & `AF-3`):** Out-of-Scope Query Rejection (`AF-2`) and RAG Service Offline Fallback to Static `UC-C06`/`UC-C05` Tabs (`AF-3`).

![UC-AI02 Screen 7: AF-2 Scope Restriction and AF-3 Offline Fallback](evidence/UC_AI02_AF2_AF3_Scope_And_Offline.png)

---

### 3.2. `UC-AI03`: Digitize Menu from Image *(Optional Candidate Slice – Partner Onboarding)*

* **Use-Case ID:** `UC-AI03` *(Maps to Vision `FR-9.5` – Optional Candidate Slice; extends `UC-P03`; legacy draft tab `UC-F9-03`)*
* **Use-Case Name:** Digitize Menu from Image
* **Actor(s):** Partner Staff (Primary Actor)
* **Description:** During venue onboarding or menu updates, partner staff upload a photograph or PDF of their physical menu inside the Menu Management workspace (`UC-P03`). The system uses Optical Character Recognition (OCR) and structured parsing to extract dish names, categories, descriptions, and prices into an editable draft table, requiring mandatory human review before saving.
* **Preconditions:**
  1. The user is authenticated as **Partner Staff** (`UC-C02`) with an active venue workspace.
  2. The partner is in the Menu Management section (`UC-P03`, Group F4).
* **Basic Flow (Main Success Scenario):**
  1. Partner staff clicks **"Import Menu from Image/PDF (AI OCR Draft)"** inside `UC-P03`.
  2. The system displays an upload modal accepting `.jpg`, `.png`, or `.pdf` files (up to 10 MB).
  3. Partner staff selects and uploads a menu file and clicks **"Extract Menu Draft"**.
  4. The system validates the file format/size, processes the document via the OCR extraction pipeline, and parses detected items into structured draft rows: **Category**, **Dish Name**, **Price (VND)**, and **OCR Confidence**.
  5. The system displays the **Editable OCR Draft Table**, highlighting any low-confidence fields (`Confidence < 80%`) in amber with a verification badge.
  6. Partner staff reviews and edits flagged rows, checks **"I have reviewed and verified all extracted dishes and prices"**, and clicks **"Save Verified Menu Items"**.
  7. The system persists the partner-verified dishes via `UC-P03` into PostgreSQL.
* **Alternative Flows:**
  * **AF-1: Low-Confidence or Illegible Fields Detected (At Step 5–6):**
    1. If extracted rows contain missing prices or low-confidence text, the **"Save Verified Menu Items"** button remains disabled until partner staff manually edits or removes the flagged amber rows and confirms review.
  * **AF-2: Unsupported File Format, Oversized File, or Completely Unreadable Image (At Step 4):**
    1. If the uploaded file exceeds 10 MB, uses an unsupported format, or yields zero readable text, the system displays an error alert: *"Unable to extract menu text from this file. Please upload a clearer JPG/PNG/PDF under 10 MB or add dishes manually."*
    2. No partial/empty draft is saved, and the system provides a direct **"Add Dish Manually (`UC-P03`)"** button.
* **Postconditions:**
  * Extracted menu items are saved to PostgreSQL **only after** explicit human review and confirmation; unreviewed OCR drafts are never published directly to customers.
* **Special Requirements:**
  * **Human-in-the-Loop Governance:** Mandatory `Partner Staff` sign-off on all OCR-extracted dishes and prices before persisting to `UC-P03`.

#### UI Prototype Screens for `UC-AI03` *(Optional Candidate Slice — Basic & All Alternative Flows)*

* **Screen 8 (`UC-AI03` Basic Flow & `AF-1` Low-Confidence Warning):** Editable OCR Draft Table with amber low-confidence verification warning and mandatory human review checkbox *(prototype tab label `UC-F9-03` maps to `UC-AI03`)*.

![UC-AI03 Screen 8: Partner Menu OCR Draft Review Table](evidence/UC_F9_03_OCR_Draft_Review.png)

* **Screen 9 (`UC-AI03` Alternative Flow `AF-2`):** Oversized/Unreadable File Rejection Error & Manual Entry Fallback (`UC-P03`).

![UC-AI03 Screen 9: AF-2 OCR Upload Error and Manual Fallback](evidence/UC_AI03_AF2_OCR_Upload_Error.png)

---

## 4. Group F3 End-to-End Validation & Spec Kit Review Report (PA3 Section E)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

### 4.1. Test Environment, Revision Traceability & Spec Kit Review

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

* **Validated Functional Group:** Group 3 – Restaurant Discovery and Venue Details (`F3`: `UC-C04`, `UC-C05`, `UC-C06`)
* **Backend & Spec Kit Revision Tested:** `origin/dev` (Commit SHA: **`91944a5`**)
* **Integrated React UI Revision Tested:** `origin/demo/PA3_Kien_Video_Supabase` (`e75ae8a`: `frontend/src/App.tsx`, `main.tsx`, `style.css`) proxied cleanly to `origin/dev` FastAPI on port `8000` *(see Defect `DEF-F3-01` regarding `dev` still carrying the Oct-16 placeholder `frontend/src/main.tsx`)*
* **Runtime Stack Verified:**
  * **Frontend:** React + Vite (`http://127.0.0.1:5173`), proxy `/api` $\rightarrow$ `http://127.0.0.1:8000` (`frontend/vite.config.ts`)
  * **Backend:** FastAPI + SQLAlchemy 2.0 + Uvicorn (`http://127.0.0.1:8000`)
  * **Database:** **PostgreSQL 18.6** (`postgresql+psycopg2://dinevina:***@127.0.0.1:55439/dinevina_f3`), initialized via `Base.metadata.create_all()` + `seed_f3_database()` (`backend/app/fixtures/f3_venues_fixture.json`)
* **Automated Test Suite Result (`uv run --extra dev pytest -v` against PostgreSQL 18.6):**
  * **`25 passed, 2 skipped in 1.06s`** across `backend/tests/test_f3_discovery.py` (26 tests) and `backend/tests/test_health.py` (1 test).
  * All 24 FastAPI + SQLAlchemy F3 discovery/filter/guardrail tests and `test_health` **PASSED** against PostgreSQL 18.6.
  * The 2 live Supabase Cloud REST checks (`test_supabase_rollout_venues_and_approval_status_guardrail`, `test_supabase_rollout_menu_categories_and_dishes_integrity`) cleanly reported **`SKIPPED`** because gitignored `.env` Supabase REST credentials (`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`) are not stored in the repository *(see `GAP-F3-01`)*.
* **Spec Kit Artifacts Reviewed Against Implemented Behavior:**
  * Inspected `src/constitution.md`, `src/specs/002-f3-venue-discovery/spec.md` (`US-F3-01`..`US-F3-03`), `plan.md`, and `tasks.md` (`TASK-F3-01`..`07`) against `backend/app/main.py`, `models.py`, `schemas.py`, and `seed.py`.
  * **Alignment Verified:** All endpoints (`GET /api/health`, `GET /api/venues`, `GET /api/venues/filters`, `GET /api/venues/{venue_id}` plus `/api/v1/restaurants/*` aliases) strictly enforce `VenueModel.status == "approved"`, support dish-level keyword search, district/cuisine/budget/party_size/amenity filtering, `422` validation errors (`min_budget > max_budget`, `party_size < 1`, invalid `sort`), and `404` isolation on unapproved or nonexistent venues. *(Per PA3-2026 §E, refining generated Spec Kit tests is not required.)*

### 4.2. End-to-End Smoke Check Matrix (UI ↔ FastAPI ↔ PostgreSQL 18.6)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

| Check ID | Validation Scenario | Layer(s) Tested | Expected Behavior (Spec Kit & F3 Contract) | Observed Result (`dev` `91944a5` + PostgreSQL 18.6) | Status | Evidence Reference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`F3-VAL-01`** | **Approved vs. Unapproved Venue Visibility** | PostgreSQL 18.6 $\rightarrow$ FastAPI $\rightarrow$ React UI | Only venues with `status = 'approved'` (8 fixtures) appear in public UI/API discovery; unapproved fixtures (`v-unapproved-001` `pending`, `002` `returned`, `003` `rejected`) are excluded. | Discovery UI renders **`8 nhà hàng đã duyệt`** (`8 kết quả`), including *An Nhiên Garden*, *Sakura Izakaya*, *Nhà Hàng Việt Xưa Sài Gòn*; zero unapproved records appear (`hasUnapproved: false`) and `GET /api/venues/v-unapproved-001` returns HTTP **`404`**. | **PASS** | [F3_Test1_Approved_Visibility.png](evidence/F3_Test1_Approved_Visibility.png) |
| **`F3-VAL-02`** | **Multi-Attribute Filter Correctness & Venue Details** | React UI $\leftrightarrow$ FastAPI Query Params $\leftrightarrow$ PostgreSQL | Filtering by district and amenity (`district=Quận 1`, `amenity=Phòng riêng`) returns matching approved venues; opening detail renders categorized dishes (`UC-C05`, `UC-C06`). | UI filters cleanly to **`2 kết quả`** (*Nhà Hàng Việt Xưa Sài Gòn*, *Cung Đình Dimsum & Vịt Quay Bắc Kinh*). Opening *Nhà Hàng Việt Xưa Sài Gòn* $\rightarrow$ `Thực đơn (4)` displays all 4 PostgreSQL dishes (*Gỏi cuốn tôm thịt truyền thống*, *Phở bò Wagyu hầm thảo mộc*, *Cá bông lau kho tộ miền Tây*, *Chè hạt sen nhãn nhục cung đình*). | **PASS** | [F3_Test2_Filter_And_Venue_Details.png](evidence/F3_Test2_Filter_And_Venue_Details.png) |
| **`F3-VAL-03`** | **Empty Search Results & API Error / Guardrail States** | React UI $\leftrightarrow$ FastAPI Error Handlers (`404` / `422`) | Zero-match search shows an actionable empty state without crashing; unapproved detail IDs return `404`; invalid filter ranges return `422`. | Searching `q="zzzz"` renders **`0 kết quả`** with empty notice *"Chưa tìm thấy lựa chọn phù hợp"* + *"Xóa bộ lọc"*. Direct API checks return **`HTTP 404 Not Found`** for `/api/venues/v-unapproved-001` and **`HTTP 422 Unprocessable Content`** for `min_budget=500000&max_budget=100000`. | **PASS** | [F3_Test3_Empty_And_Error_States.png](evidence/F3_Test3_Empty_And_Error_States.png) |
| **`F3-VAL-04`** | **Automated Backend Suite & PostgreSQL Persistence** | PostgreSQL 18.6 (`psql`) $\leftrightarrow$ SQLAlchemy $\leftrightarrow$ `pytest` | Fixture rows persist relationally in `venues` and `dishes` with status counts preserved; automated F3 test suite passes against PostgreSQL. | `uv run --extra dev pytest -v` executes against PostgreSQL 18.6: **`25 passed, 2 skipped in 1.06s`**. Direct `psql` queries verify `venues` counts (`approved: 8`, `pending: 1`, `returned: 1`, `rejected: 1`) and `total_dishes: 21`. | **PASS** *(2 Supabase REST tests skipped w/o `.env`)* | [F3_Test4_PostgreSQL_Persistence.png](evidence/F3_Test4_PostgreSQL_Persistence.png) |

#### F3 Validation Evidence Screenshots

* **Evidence 1 (`F3-VAL-01`):** Approved Venue Discovery Catalog (`8 kết quả`, excluding `v-unapproved-001..003`).

![F3 Test 1: Approved Venue Visibility on dev + PostgreSQL 18.6](evidence/F3_Test1_Approved_Visibility.png)

* **Evidence 2 (`F3-VAL-02`):** Multi-Attribute Filtering (`Quận 1` + `Phòng riêng`) & Venue Detail Categorized Menu (`Nhà Hàng Việt Xưa Sài Gòn`, 4 PostgreSQL dishes).

![F3 Test 2: Filter Correctness and Categorized Menu Modal](evidence/F3_Test2_Filter_And_Venue_Details.png)

* **Evidence 3 (`F3-VAL-03`):** UI Zero-Match Empty State (`q="zzzz"`) paired with Real FastAPI `404` & `422` Guardrail Responses.

![F3 Test 3: UI Empty State and API 404/422 Error Responses](evidence/F3_Test3_Empty_And_Error_States.png)

* **Evidence 4 (`F3-VAL-04`):** `pytest -v` Execution (`25 passed, 2 skipped in 1.06s`) & Direct `psql` Persistence Verification (`8 approved / 3 unapproved / 21 dishes`).

![F3 Test 4: Automated Pytest Suite and PostgreSQL 18.6 Persistence](evidence/F3_Test4_PostgreSQL_Persistence.png)

### 4.3. Defects Logged, Known Gaps & Follow-Up Actions for Sprint Review

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

| Item ID | Category | Severity / Status | Description & Observed Behavior | Resolution / Follow-Up Plan |
| :--- | :--- | :--- | :--- | :--- |
| **`DEF-F3-01`** | Branch Integration Defect (`dev` Frontend Placeholder) | **Open on `dev` (`91944a5`)** | While `origin/dev` contains the complete F3 backend & Spec Kit artifacts (PR #28), `dev:frontend/src/main.tsx` still renders the Oct-16 initialization placeholder (*"Đây là trang khởi tạo"*, calling only `/api/health`). The integrated F3 React discovery UI (`frontend/src/App.tsx`) currently resides on `origin/demo/PA3_Kien_Video_Supabase` (`e75ae8a`). | Merge `frontend/src/App.tsx`, `main.tsx`, and `style.css` from `origin/demo/PA3_Kien_Video_Supabase` into `dev` (or run demo from that consolidated branch) so `dev` serves full UI + API + DB out of the box. |
| **`GAP-F3-01`** | Environment / Live Supabase Rollout Tests | **Environment Note** | `test_supabase_rollout_venues_and_approval_status_guardrail` and `test_supabase_rollout_menu_categories_and_dishes_integrity` skip cleanly when `.env` lacks `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. | Provide local `.env` with team Supabase REST credentials when verifying the full 27/27 Supabase Cloud rollout run (database seeding for `ynyouuzfhivkbvsetudk` was applied separately by Nhân via Supabase MCP). |
| **`GAP-F3-02`** | Known Scope Boundary (F3 vs. F9) | **Planned for PA4** | Group F3 implements deterministic SQL/API search & filtering; explainable AI recommendation (`UC-AI01`) is specified and prototyped in PA3 and intentionally unimplemented in this build. | Integrate `UC-AI01` recommendation ranking with `/api/venues` in Sprint 4 (PA4). |

### 4.4. Narrated Demo Readiness Checklist (Aligned with `dev` `91944a5` & Port `8000`)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

1. **Backend Startup Command (Port `8000`):**
   `DATABASE_URL="postgresql+psycopg2://..." uv run uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000`
2. **Frontend Startup Command (Port `5173`, proxying `/api` $\rightarrow$ `127.0.0.1:8000`):**
   `npm --prefix frontend run dev` *(requires integrated `App.tsx` per `DEF-F3-01`)*
3. **Automated Backend Verification:**
   `uv run --extra dev pytest -v` (`25 passed, 2 skipped` locally against PostgreSQL; `27 passed` when `.env` Supabase REST credentials are configured)
4. **Demo Flow Verified:** Show Spec Kit artifacts (`src/specs/002-f3-venue-discovery/`) $\rightarrow$ Show PostgreSQL `venues`/`dishes` persistence & `pytest` $\rightarrow$ Show Swagger `404` on `v-unapproved-001` and `422` on invalid budget $\rightarrow$ Show Discovery UI (`8 nhà hàng đã duyệt`), filter (`Quận 1` + `Phòng riêng`), open *Nhà Hàng Việt Xưa Sài Gòn* categorized menu, and trigger `q="zzzz"` empty state.

---

## 5. AI Usage Report – Sprint 3 (PA3)

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

### 5.1. Declaration of AI Tool Usage

**Performed by:** Trương Khánh Duy | **Reviewed by:** Lương Thiện Nhân | **Edited by:** Trương Khánh Duy, Lương Thiện Nhân

In compliance with the course AI usage guidelines (PA3-2026 Section F), AI tools were used during Sprint 3 as an engineering and documentation assistant for structuring Group F9 Use-Case Specifications, generating UI prototype screens, and organizing Group F3 End-to-End Validation verification. All outputs were manually reviewed, verified against the codebase/Spec Kit artifacts, and edited by the responsible members.

| Date | Member | AI Tool Used | Task / Deliverable | Prompt Summary & Purpose | Human Verification & Editing Applied |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **14/11/2026** | Trương Khánh Duy | **Gemini** | `[PA3] AI F9 use-case specifications` | Drafted initial 8-field RUP use-case specifications and Mermaid relationship diagram aligned with PA2 Vision F9. | Drafted initial specs and separated optional RAG/OCR slices from implemented features; submitted for peer review. |
| **14/11/2026** | Trương Khánh Duy | **v0.dev / Gemini** | `[PA3] AI F9 UI Prototypes` | Generated initial responsive 5-tab UI prototype screens (`UC_F9_01..03`) covering preference input, ranked results, zero-match fallback, RAG abstention, and OCR draft review. | Inspected layouts and captured initial 5 prototype screenshots in `evidence/`. |
| **14/11/2026** | Trương Khánh Duy | **Gemini** | `[PA3] F3 end-to-end validation draft` | Structured the initial smoke-check matrix (`F3-VAL-01` to `F3-VAL-04`), defect table, and narrated demo checklist. | Initial draft tested against an earlier demo branch (`demo/supabase-integration` `62a1282`), flagged during peer review to be re-run against `dev`. |
| **14/11/2026** | Lương Thiện Nhân | **Antigravity AI** | `[PA3] Peer Review Remediation for Duy Deliverables` | Audited Duy's PR #25 and unmerged PR #29 (`72b87d2`) against Ngọc's `UseCase-Model.md`, Kiên's `dev` F3 implementation (`91944a5`), and PA3 §§C–E; generated missing AF prototype screens (`UC_AI01_AF3`, `UC_AI01_AF4_AF5`, `UC_AI02_AF2_AF3`, `UC_AI03_AF2`) and re-executed F3 smoke tests against PostgreSQL 18.6 + FastAPI (`8000`) + integrated F3 React UI. | Manually cross-checked every UC ID (`UC-AI01..03`, `UC-C04..06`, `UC-P03`) and `«extend»` arrow against `UseCase-Model.md`; verified `25 passed, 2 skipped` in `pytest -v`, `psql` table counts (`8 approved / 3 unapproved / 21 dishes`), HTTP `404`/`422` responses, and visually inspected all 8 new/updated PNGs before committing. |
