# Spec Kit Training - Nguyễn Trung Kiên

* **Task:** `[PA2] Spec Kit Training - Kien`
* **Owner:** Nguyễn Trung Kiên (`ntkien2418@clc.fitus.edu.vn`)
* **Reviewer:** Hoàng Cao Phong (`hoangcaophong.works@gmail.com`)
* **Proposed Due:** 30 Oct 2026
* **Status:** In Progress
* **Tool / Repository:** [GitHub Spec Kit (github/spec-kit)](https://github.com/github/spec-kit)

---

## 1. Overview & Setup

Spec Kit is an open-source toolkit developed by GitHub for **Spec-Driven Development (SDD)** with AI coding agents (GitHub Copilot, Claude Code, Gemini CLI, etc.). It establishes specifications, architecture plans, and fine-grained task breakdowns before any implementation code is generated.

### Installation Record
* **Date:** 25 Oct 2026
* **Environment:** Windows, Python 3.13.3, `uv` tool
* **Command executed:**
  ```powershell
  python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
  ```
* **CLI Verification:**
  ```powershell
  specify --version
  ```

---

## 2. Tutorial Walkthrough & Steps

| Step # | Date | Tutorial Module / Action | Description & Execution Details | Evidence / Screenshot Link |
|---|---|---|---|---|
| 1 | 25/10/2026 | Environment Setup & CLI Installation | Installed `specify-cli` via `uv` tool from GitHub official repo. | *(Add link/screenshot)* |
| 2 | | Project Initialization (`specify init`) | Initialized Spec Kit workspace with AI agent configuration. | *(Add link/screenshot)* |
| 3 | | Establishing Constitution (`/speckit-constitution`) | Defined core project guardrails, non-negotiables, and conventions. | *(Add link/screenshot)* |
| 4 | | Feature Specification (`/speckit-specify`) | Authored specification for sample feature adhering to SDD workflow. | *(Add link/screenshot)* |
| 5 | | Technical Plan & Tasks (`/speckit-plan`, `/speckit-tasks`) | Generated architectural plan (`plan.md`) and actionable task list (`tasks.md`). | *(Add link/screenshot)* |
| 6 | | Implementation & Verification | Verified task execution with AI coding assistant against initial specs. | *(Add link/screenshot)* |

---

## 3. Detailed Step Logs

### Step 1: CLI & Environment Setup
* **Date:** 25 October 2026
* **Actions Taken:**
  * Installed `specify-cli` (v1.2.4.dev0) via `python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`.
  * Verified CLI executable at `C:\Users\ADMIN\.local\bin\specify.exe`.
  * Verified tool integration status with `specify check` (Antigravity & Gemini CLI detected as available).
* **CLI Evidence:**
  ```text
  $ specify version
  GitHub Spec Kit - Spec-Driven Development Toolkit
  CLI Version    1.2.4.dev0
  Python         3.13.3
  Platform       Windows AMD64

  $ specify check
  Checking for installed tools...
  ├── ● Antigravity (available)
  ├── ● Gemini CLI (available)
  Specify CLI is ready to use!
  ```

### Step 2: Workspace Initialization
* **Date:** *(To be filled)*
* **Actions Taken:**
  * *(Describe commands executed, e.g., `specify init demo-app`)*
* **Evidence:**
  * *(Add link/image)*

### Step 3: Spec-Driven Development Workflow
* **Date:** *(To be filled)*
* **Actions Taken:**
  * Constitution creation:
  * Feature Specification (`spec.md`):
  * Architectural Plan (`plan.md`):
  * Task Breakdown (`tasks.md`):
* **Evidence:**
  * *(Add link/image)*

---

## 4. Key Lessons Learned

1. **Spec-Driven vs. Vibe Coding:**
   * *(Record your insights on how Spec Kit structures AI-assisted workflows compared to unstructured prompt-and-code approaches)*
2. **Deterministic Task Breakdowns:**
   * *(Observations on task breakdown granularity and reproducibility)*
3. **Integration with Project DineVina:**
   * *(How Spec Kit will be applied to DineVina PA2+ requirements, e.g., FastAPI backend, database schemas, frontend integration)*

---
