# AI Coding Tools and Account Confirmation — PA1

**Performed by:** Nguyễn Trung Kiên (Backend Engineer; 24127068)  
**Reviewed by:** Hoàng Cao Phong (Scrum Master)  
**Edited by:** Pending confirmation  

**Status snapshot:** 17 October 2026  
**Linked Trello Task:** `[PA1] AI Coding Account – Kien`

---

## 1. Overview and Objectives

In accordance with the course requirements for AI-Integrated Software Engineering (PA1), this document confirms the individual AI coding accounts, foundation models, and developer toolchain configured by **Nguyễn Trung Kiên (Backend Engineer)** for the DineVina project.

To guarantee project sustainability and prevent disruption from quota exhaustion, the setup applies a **pragmatic, tiered model strategy**: prioritizing lightweight, high-efficiency models ("Flash" and "Coder" series) for daily development, while reserving mid-tier models with verified free quota for complex architectural reasoning. All development adheres strictly to the **Human-in-the-loop** principle: the engineer directs prompt context, verifies all generated code, enforces test coverage, and ensures that no API keys or credentials enter version control.

---

## 2. Configured Foundation Models and Provider Accounts

From the verified roster of **141 available models** on Alibaba Cloud Model Studio, the following balanced, quota-efficient models have been selected to optimize cost, speed, and reliability:

| # | Model Code / Identifier | Tier & Category | Allocation / Quota | Role & Practical Value in DineVina |
|---|-------------------------|-----------------|--------------------|------------------------------------|
| 1 | **`qwen3.5-122b-a10b`** | **Mid-Tier (MoE)** | 1M free tokens (Valid to 2027/01/14) | **Primary Anchor:** Active 1M free quota; utilized for initial architectural design, schema drafting, and data modeling. |
| 2 | **`qwen3-coder-flash`** | **Lightweight Coder** | High-throughput Free Tier | **Daily Workhorse:** Lightweight, low-latency model; optimized for FastAPI endpoint generation, Pydantic schemas, and unit test boilerplates. |
| 3 | **`qwen3.6-flash`** / `qwen3.5-flash` | **Lightweight General** | High-throughput Free Tier | **Quick Refactoring:** Technical documentation drafting, data formatting, and rapid syntax correction with minimal token overhead. |
| 4 | **`qwen-plus`** / `qwen3.7-plus` | **Balanced Mid-Tier** | Standard Tier | **Complex Logic Backup:** Handles complex reservation constraints (concurrency state transitions and cancellation cutoffs) requiring deeper reasoning. |
| 5 | **`deepseek-v4.1-flash`** | **Lightweight Logic** | Free Tier | **Algorithm & Edge Cases:** Lightweight Flash variant for testing edge cases, boundary conditions, and reservation lifecycle transitions. |
| 6 | **`text-embedding-v4`** | **Embedding Service** | Standard API Quota | **Semantic Matching:** Generates dense vector embeddings for semantic restaurant discovery and user preference matching. |

### Quota-Conscious Tiered Strategy & Fallback Policy
* **Tier 1 (Daily Workhorse — Token-Efficient):** 80% of daily programming tasks, unit testing, and refactoring use lightweight models like `qwen3-coder-flash` and `qwen3.6-flash`. These models consume minimal tokens, deliver near-instant responses, and prevent quota exhaustion.
* **Tier 2 (Mid-Tier Reasoning):** Uses `qwen3.5-122b-a10b` (leveraging the active 1,000,000 free token quota) or `qwen-plus` for complex data architecture problems, concurrency race conditions, and business state validation.
* **Graceful Degradation:** If Tier 2 quotas near depletion, development workflows seamlessly downgrade 100% to Tier 1 (Flash/Coder) models, preventing any project bottlenecks or downtime.

### Account Verification Status
* **Personal Account Registration:** Confirmed on Alibaba Cloud Model Studio (Quota verified: 141 models accessible).
* **Environment Configuration:** API key exported locally via environment variables (`DASHSCOPE_API_KEY` / `OPENAI_API_BASE`).
* **Secret Protection:** No API keys are written to repository files, shell configuration scripts, or Trello cards.

---

## 3. AI Developer Toolchain

```mermaid
flowchart TD
    Kien([Nguyễn Trung Kiên\nBackend Engineer])

    subgraph Cloud_Models["Alibaba Cloud Model Studio (Quota-Efficient Tiering)"]
        T1["Tier 1: qwen3-coder-flash / qwen3.6-flash\n(80% Daily Coding & Tests - Low Token Cost)"]
        T2["Tier 2: qwen3.5-122b-a10b / qwen-plus\n(Architecture & Concurrency - 1M Free Quota)"]
        T1 -.->|"Graceful Fallback if quota runs low"| T1
    end

    subgraph Toolchain["AI Developer Toolchain"]
        AGY["Google Antigravity / Agentic IDE\n(Fullstack Architecture & Cloud Deployment)"]
        Git["Git Version Control\n(dev branch)"]
    end

    Kien -->|"Interactive prompt, design & review"| AGY
    AGY <-->|"Model Studio API & Agent Engine"| Cloud_Models
    AGY -->|"Verified code, tests & documentation"| Git
```

### 3.1. Primary Developer Environment: Google Antigravity (Agentic Coding IDE)
* **Description:** An autonomous, agentic coding environment equipped with tool-use capabilities, terminal execution, and browser validation.
* **Role in Backend Development:**
  * **Architecture Planning:** Structuring FastAPI backend endpoints for 10 Functional Groups (`backend/app/main.py`).
  * **In-Memory Simulation Store:** Generating simulation stores (`app/store.py`, `app/seed_data.py`) for rapid prototype testing without external database dependencies.
  * **Automated Test Generation:** Designing test suites (`backend/tests/test_reservations.py`, `backend/tests/test_health.py`) achieving 8/8 passing tests under `pytest`.
  * **DevOps & Cloud Deployment:** Configuring remote deployment on Google Cloud VM (Nginx reverse proxy, systemd services, Let's Encrypt SSL on `https://dinevina-demo.duckdns.org/`).

---

## 4. Staged Adoption Across Project Sprints

| Sprint / Stage | Target Deliverables | Selected AI Model / Tool | Expected Practical Value |
|:---------------|:--------------------|:-------------------------|:-------------------------|
| **PA1** *(Current)* | Functional groups report, interactive prototype demo | Antigravity + `qwen3.5-122b-a10b` | Rapid prototype validation, live HTTPS deployment on GCP, weekly documentation. |
| **PA2** | Database schema, Docker Compose, Spec Kit initialization | Antigravity + `qwen3-coder-flash` / `qwen-plus` | Automated generation of SQLAlchemy models, Alembic migrations, PostgreSQL integration tests. |
| **PA3 – PA4** | Core business logic: reservations, capacity locking, cutoff rules | Antigravity + `qwen3-coder-flash` / `deepseek-v4.1-flash` | Implementation of business logic, edge-case validation (preventing double-booking and invalid cancellations). |
| **PA5** | Performance tuning, security review, OpenAPI documentation | Antigravity + `qwen3.6-flash` | Static analysis, vulnerability auditing, comprehensive documentation cleanup. |

---

## 5. Security, Secrets Management, and Guardrails

1. **Credential Isolation:**
   - Model API keys are held strictly in local environment variables.
   - `.gitignore` is updated to include temporary files (`.aider*` and credential patterns) to prevent accidental exposure.
2. **Review Policy (Zero Blind Acceptance):**
   - Every line of AI-generated code is reviewed and executed locally with automated tests (`pytest`) before submitting a Pull Request.
3. **Repository Compliance:**
   - All commits are pushed to feature branches created from `dev`, following conventional commit standards (`docs:`, `feat:`, `fix:`), requiring code review before merging into `dev`.
