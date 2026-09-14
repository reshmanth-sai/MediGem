# 💎 MediGem

> **Multimodal, Offline-First AI Co-Pilot for Rural Healthcare Workers**

[![Built with Gemma](https://img.shields.io/badge/Built_with-Gemma_3_4B-0D9488?style=for-the-badge&logo=google)](https://gemma.dev)
[![Model](https://img.shields.io/badge/Model-Gemma_3_4B-0F766E?style=for-the-badge&logo=google)](https://ollama.com/library/gemma3)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-56_Passed-success.svg?style=for-the-badge)](#-verification--unit-testing)
[![Offline](https://img.shields.io/badge/Offline-100%25_Local-10B981.svg?style=for-the-badge)](#-key-features)

---

## 🏥 The Problem

Over **45% of rural healthcare facilities globally** operate in remote regions with zero or intermittent internet connectivity. Front-line health workers (nurses, community health workers, clinical officers) often evaluate complex medical inputs—such as blood lab reports, 12-lead ECG rhythm strips, prescription scans, and wound photos—without on-site specialist physicians or access to cloud-based AI tools.

---

## 💡 The Solution: MediGem

**MediGem** is an offline-first AI co-pilot powered by **Google Gemma 3 4B** (via local Ollama inference). It ingests multi-format medical inputs, executes OpenCV visual quality checks and Tesseract OCR, fuses clinical context into an immutable reasoning state, and produces structured risk assessments, observation summaries, reasoning transparency cards, and facility referral notes—all while operating **100% offline**.

Crucially, MediGem includes a **Deterministic Emergency Safety Engine** that intercepts acute emergency presentations in `< 0.3ms` *before* calling AI models, blocking LLM inference for high-risk cardiac or stroke cases.

---

## 🏛️ System Architecture

![MediGem System Architecture](docs/diagrams/system_architecture.svg)

```text
┌───────────────────────────┬───────────────────────────────┬───────────────────────────────────────────┐
│ 👤 LEFT SIDEBAR (25%)     │ 📁 CENTER WORKSPACE (35%)     │ 📋 RIGHT RESULTS PANEL (40% PRIMARY FOCUS) │
├───────────────────────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ • Patient Demographics    │ • Image/PDF Upload Workspace  │ • Risk Assessment Badge Card              │
│ • Presenting Symptoms     │ • Demo Preset Gallery (1-Click│ • Clinical Summary (Worker View)          │
│ • Vital Signs Input       │   Lab, ECG, Rx, Wound)        │ • Reasoning Transparency Card             │
│ • Healthcare Worker Notes │ • Execute Analysis Trigger    │ • Analysis Quality & Provenance Card      │
│ • Session History Dropdown│ • Live Stage Progress Tracker │ • Supporting Observation Cards            │
│                           │   (✓ Processing -> ⟳ Gemma)   │ • Patient View & Referral Memorandum      │
│                           │                               │ • Download Exports (txt/json + metadata)  │
└───────────────────────────┴───────────────────────────────┴───────────────────────────────────────────┘
```

---

## 🌟 Key Features

- **100% Offline Local Execution**: Runs locally via Ollama and Gemma 3 4B without cloud API dependencies.
- **Deterministic Emergency Gate**: Intercepts acute emergencies in `< 0.3ms` using 11 rules across 6 categories (CARDIAC, RESPIRATORY, STROKE, SEPSIS, TOXICOLOGY, SNAKE_BITE).
- **Multi-Format Ingestion**: Ingests Images (`.png`, `.jpg`), PDF Documents (`.pdf`), and plain text symptoms.
- **Smart Content Extractor**: Direct PyMuPDF text layer extraction for searchable PDFs (zero OCR errors) and optional Tesseract OCR for image scans.
- **Computer Vision Quality Engine**: OpenCV Laplacian blur variance evaluation, brightness/contrast scoring, and megapixel checks.
- **Reasoning Transparency Card**: Explains *"Why was this recommendation generated?"* based on empirical decision factors.
- **Clinical SaaS Gradio UI**: Proportional 3-column responsive layout (Left 25%, Center 35%, Right 40% focus) with 1-click Demo Gallery presets.
- **Non-Diagnostic Safety Contract**: Strictly triages risk levels and generates referral notes without formulating prohibited diagnoses or drug dosages.
- **Automated Benchmarking Suite**: Non-mutating evaluation framework producing markdown reports, JSON summaries, CSV datasets, and SVG architecture diagrams.

---

## 📊 Benchmark Summary Metrics

| Metric | Measured | Target Threshold | Status |
|---|---|---|---|
| **Safety Gate Pass Rate** | `100.0%` (matching case intercepted, 5,000 evaluations) | `100.0%` | **PASS** |
| **Schema Validation Pass Rate** | `100.0%` (80 / 80 runs validated against `ClinicalReasoningOutput`, all COMPLETED) | `100.0%` | **PASS** |
| **Emergency Gate Latency** | `0.352 ms` median, `0.364 ms` p95 | `< 5.00 ms` | **PASS** |
| **Average OCR Confidence** | `77.5%` (Tesseract, 2 documents with a text layer, unedited) | `> 90.0%` | **FAIL** |
| **End-to-End Pipeline Latency** | `9,063 ms` median, `7,975` to `12,961 ms` | `< 15,000.0 ms` | **PASS** |

Measured 2026-09-14 on Apple M5 with `gemma3:4b` via Ollama, 20 runs per modality across the four `sample_data/` inputs, by `evaluation/capture_landing_data.py`. The raw capture is `frontend_v2/components/landing/data/capture.json`. OCR confidence is the mean Tesseract word confidence on the two sample images that carry text and is reported as read; the model produced a schema-valid assessment on every run.

---

## 📂 Project Structure

```
MediGem/
├── app.py                  # Main application launch entry point
├── backend/                # Modular backend package
│   ├── ai/                 # AI Inference Layer (Phase 4)
│   ├── config/             # Environment settings & constants
│   ├── emergency/          # Emergency Safety Engine (Phase 3)
│   ├── exceptions/         # Custom exception hierarchy
│   ├── input/              # Input Processing Framework (Phase 7)
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Strategy-pattern pipeline package (Phase 5)
│   ├── prompts/            # Markdown prompt templates (.md)
│   ├── reasoning/          # Medical Reasoning Framework & Context Fusion (Phase 6 & 8)
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Services & MediGemOrchestrator master coordinator
│   ├── utils/              # Generic helper utilities
│   └── validation/         # Clinical request validators
├── docs/                   # Complete Documentation & Presentation Kit (Phase 12)
│   ├── ARCHITECTURE.md     # Deep-dive technical architecture
│   ├── SAFETY.md           # Healthcare safety & clinical bounds
│   ├── EVALUATION.md       # Benchmark & quality metrics report
│   ├── DEMO_GUIDE.md       # System demonstration & walkthrough guide
│   ├── PRESENTATION.md     # Project overview & presentation guide
│   ├── FAQ.md              # Technical & clinical FAQ
│   ├── ROADMAP.md          # Multi-phase project roadmap (v1.0 to v3.0)
│   ├── CONTRIBUTING.md     # Open-source contributor guide
│   ├── LICENSE.md          # Apache 2.0 License
│   ├── CHANGELOG.md        # Release notes v1.0.0
│   ├── RELEASE_CHECKLIST.md# Quality & release verification checklist
│   ├── diagrams/           # Vector SVG architecture diagrams
│   └── screenshots/        # Visual screenshot assets
├── evaluation/             # Evaluation & Benchmarking Framework (Phase 11)
├── frontend/               # Gradio UI application (Phase 9 & 10)
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
└── requirements.txt        # Frozen Python dependencies
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Tesseract OCR (`brew install tesseract` on macOS)
- Ollama installed (`ollama pull gemma3:4b`)

### Installation & Execution

1. **Clone Repository & Setup Environment**:
   ```bash
   git clone https://github.com/reshmanth-sai/MediGem.git
   cd MediGem
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Launch the Gradio application** (single-process demo UI):
   ```bash
   python app.py
   ```
   Open `http://localhost:7860` in your web browser.

3. **Or run the pipeline API and the clinical workstation** (Next.js):
   ```bash
   # Terminal 1: HTTP layer over the orchestrator (backend/api/app.py)
   uvicorn backend.api.app:app --port 8000

   # Terminal 2: workstation
   cd frontend_v2
   cp .env.example .env.local      # NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   npm install && npm run dev
   ```
   Open `http://localhost:3000` for the product page and `http://localhost:3000/workstation` for the workstation. Without `NEXT_PUBLIC_API_BASE_URL` the workstation runs on bundled example cases and says so on every screen; a new intake cannot run.

   API routes: `GET /health`, `GET /rules`, `POST /gate/evaluate`, `POST /analyze` (multipart: demographics, symptoms, vitals, one image with `image_type`; the case is stored and its `case_id` returned), `GET /cases`, `GET /cases/{id}`, `POST /cases/{id}/review` (clinician sign-off: approved / modified / rejected with a note), `DELETE /cases/{id}`. Interactive docs at `http://localhost:8000/docs`.

   **Case store.** Cases live in one SQLite file, `data/medigem.db` by default (`MEDIGEM_DB_PATH` to move it; `:memory:` for tests). With the API up, every workstation list reads from it and the ribbon says "Live queue"; without it, the lists are the bundled examples and say so. Uploaded images are not kept; the stored case holds the intake fields and the pipeline's response.

   **Hosting.** A hosted build (Vercel) has no Ollama and no Python process. Two supported modes, switched by `NEXT_PUBLIC_API_BASE_URL`:
   - *Unset:* product page plus example workstation. A new intake **replays** one of the runs recorded by `evaluation/capture_landing_data.py` (the same data the product page quotes), labelled as a replay on every screen. No infrastructure.
   - *Set:* the workstation runs live against the API. Before exposing the API publicly, set `MEDIGEM_API_KEY` (checked on every POST as `X-API-Key`; mirror it as `NEXT_PUBLIC_API_KEY` and `MEDIGEM_API_KEY` on the site), `MEDIGEM_CORS_ORIGINS=https://<site>`, and put it behind HTTPS (Caddy is the least effort). `/analyze` is limited to `MEDIGEM_ANALYZE_PER_MINUTE` (default 6) requests per client. The API needs Python, Tesseract and Ollama with the model pulled; a run takes ~10 s on Apple silicon or a small GPU and 60-120 s on CPU-only hosts.

4. **Run Full System Evaluation**:
   ```bash
   python -m evaluation.evaluator
   ```

---

## 🧪 Verification & Unit Testing

Run the unit tests across the codebase:

```bash
python -m unittest evaluation/tests/test_evaluation.py frontend/tests/test_ui.py tests/test_api.py tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:

```bash
python tests/health_check.py
```

---

## 📖 Documentation Index

- 📘 [**Technical Architecture (`docs/ARCHITECTURE.md`)**](docs/ARCHITECTURE.md)
- 🛡️ [**Healthcare Safety Architecture (`docs/SAFETY.md`)**](docs/SAFETY.md)
- 📊 [**Benchmark Evaluation Report (`docs/EVALUATION.md`)**](docs/EVALUATION.md)
- 🎬 [**System Demonstration Guide (`docs/DEMO_GUIDE.md`)**](docs/DEMO_GUIDE.md)
- 📽️ [**Project Overview & Presentation (`docs/PRESENTATION.md`)**](docs/PRESENTATION.md)
- ❓ [**Technical & Clinical FAQ (`docs/FAQ.md`)**](docs/FAQ.md)
- 🗺️ [**Product Roadmap (`docs/ROADMAP.md`)**](docs/ROADMAP.md)
- 🤝 [**Contributing Guide (`docs/CONTRIBUTING.md`)**](docs/CONTRIBUTING.md)

---

## 📄 License

MediGem is licensed under the [Apache License 2.0](LICENSE).
