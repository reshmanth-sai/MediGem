# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🏆 Hackathon Presentation & Demo Experience (Phase 10)

MediGem features a clinical SaaS Web UI built with Gradio 5+, optimized for rural health workers, judges, and healthcare providers.

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

### Presentation Highlights & Judge Transparency
1. **Clinical SaaS Aesthetics**: White-first design with teal accents (`#0D9488`), soft rounded cards (14px radius), subtle shadows, Inter/Roboto typography, and micro-interactions.
2. **Proportional 3-Column Layout**: Left (25%), Center (35%), Right (40% - largest focus on clinical results and safety details).
3. **Reasoning Transparency Card ("Why was this recommendation generated?")**: Explains empirical decision factors (e.g. "Elevated glucose values detected", "OCR confidence 97%", "Emergency rule checks: PASSED") without ever formulating a diagnosis.
4. **Animated Live Stage Pipeline Tracker**: Real-time progress feedback (`✓ Upload Complete` -> `✓ Input Processing` -> `✓ OCR Extraction` -> `✓ Context Fusion` -> `⟳ Gemma Reasoning` -> `✓ Safety Guard` -> `✓ Explanation Builder`).
5. **Interactive Demo Preset Gallery**: Visual 1-click presets for synthetic Lab Reports, ECG rhythm strips, Prescription scans, and Wound inspection photos.
6. **Download File Exports with Metadata**: Downloadable Healthcare Worker Summary, Patient Summary, Referral Memorandum, and JSON audit report stamped with `Timestamp`, `Model: gemma3:4b`, `Prompt Version: v1.0`, and `Reasoning Version: v1.0`.
7. **Developer & Judge Evaluation Inspector**: Collapsible inspection accordion revealing OpenCV blur scores, Tesseract OCR confidence scores, information completeness levels, and execution latency.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Frontend / UI**: Gradio 5+ with Custom Clinical SaaS Styling
- **Multimodal Intelligence Engine**: `ContextFusionEngine`, `ContextEnhancer` (`EnrichmentNote`, `CompletenessLevel`, `AllowedCapabilities`), Immutable `ReasoningContext`
- **Input Processing Framework**: Multi-Format Ingestion (`IMAGE`, `PDF`, `TEXT`), Smart `ContentExtractor` (searchable PDF text layer vs optional OCR), OpenCV Quality Engine
- **Medical Reasoning Framework**: Prompt Engineering Infrastructure, Qualitative Confidence (`LOW`, `MEDIUM`, `HIGH`), Layered Safety Guard, Presentation Explanation Builder
- **Master Orchestrator**: Strategy-Pattern Workflow Coordinator with End-to-End Safety Gate Interception
- **AI Infrastructure Layer**: Provider-Agnostic Architecture, Function-Calling Ready, Resilient JSON Parser
- **Safety Gate**: Deterministic Rule-Based Emergency Safety Engine (No AI / Zero LLM Dependency)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 📂 Project Directory Structure

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
├── frontend/               # Gradio UI application (Phase 9 & 10)
│   ├── app.py              # Core Gradio Blocks 3-column layout
│   ├── callbacks.py        # Event callbacks with live stage tracker & export headers
│   ├── components.py       # Header, Landing, Patient, Upload, Demo Gallery, Results, Footer
│   ├── formatting.py       # HTML formatters for Risk Cards, Transparency, Quality & Empty States
│   ├── themes.py           # Custom Clinical SaaS Theme, Micro-Interactions & CSS stylesheet
│   └── tests/              # Frontend unit test suite (test_ui.py)
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
│   ├── fixtures/                  # Benchmark test fixtures (sample ECG, PDF, Rx, Wound)
│   ├── health_check.py            # System diagnostic & health check suite
│   ├── test_multimodal_engine.py  # Multimodal engine & Context Fusion unit tests
│   ├── test_input_processing.py   # Input processing unit tests
│   ├── test_reasoning_framework.py# Reasoning framework unit tests
│   ├── test_orchestration.py      # End-to-end orchestration unit tests
│   ├── test_ai_provider.py        # AI Inference Layer unit tests
│   ├── test_emergency_engine.py   # Emergency engine unit tests
│   └── test_offline_inference.py  # Ollama Gemma inference test
├── tmp/                    # Temporary working files
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 🚀 Running MediGem Application

Start the web interface locally:

```bash
python app.py
```

Open your browser at `http://localhost:7860`.

---

## 🧪 Verification & Unit Testing

Run the Frontend UI test suite:

```bash
python -m unittest frontend/tests/test_ui.py
```

Run all 51 system unit tests:
```bash
python -m unittest frontend/tests/test_ui.py tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
