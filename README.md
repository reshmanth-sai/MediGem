# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🖥️ Interactive Gradio UI Application (Phase 9)

MediGem features a clinical SaaS Web UI built with Gradio 5+, optimized for rural health workers and healthcare providers.

```text
┌───────────────────────────┬───────────────────────────────┬───────────────────────────────────────────┐
│ 👤 LEFT SIDEBAR (25%)     │ 📁 CENTER WORKSPACE (35%)     │ 📋 RIGHT RESULTS PANEL (40% PRIMARY FOCUS) │
├───────────────────────────┼───────────────────────────────┼───────────────────────────────────────────┤
│ • Patient Demographics    │ • Image/PDF Upload Workspace  │ • Risk Assessment Badge Card              │
│ • Presenting Symptoms     │ • Demo Preset Gallery (1-Click│ • Clinical Summary (Worker View)          │
│ • Vital Signs Input       │   Lab, ECG, Rx, Wound)        │ • Reasoning Transparency Card             │
│ • Healthcare Worker Notes │ • Execute Analysis Trigger    │ • Analysis Quality & Provenance Card      │
│ • Session History Dropdown│ • Live Stage Progress Tracker │ • Supporting Observation Cards            │
│                           │                               │ • Patient View & Referral Note            │
│                           │                               │ • Download Exports (txt/json)             │
└───────────────────────────┴───────────────────────────────┴───────────────────────────────────────────┘
```

### Key UI/UX Highlights
1. **Clinical SaaS Aesthetics**: White-first design with teal accents (`#0D9488`), soft rounded cards (12–16px radius), subtle shadows, Inter/Roboto typography, and subtle micro-animations.
2. **Proportional 3-Column Layout**: Left (25%), Center (35%), Right (40% - largest focus on clinical results and safety details).
3. **Reasoning Transparency Card ("Why This Recommendation?")**: Explains AI reasoning rationale (e.g. "Elevated glucose values detected", "OCR confidence 97%", "Emergency gate status: PASSED") without ever formulating a diagnosis.
4. **Demo Mode Preset Gallery**: One-click fixture loading for synthetic Lab Reports, ECG strips, Prescriptions, and Wound inspection photos.
5. **Download File Exports**: One-click download triggers for Healthcare Worker Summary, Patient Summary, Referral Memorandum, and full JSON audit payload.
6. **Developer & Judge Evaluation Inspector**: Collapsible inspection accordion revealing OpenCV blur scores, Tesseract OCR confidence scores, information completeness levels, and execution latency.

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
├── frontend/               # Gradio UI application (Phase 9)
│   ├── app.py              # Core Gradio Blocks 3-column layout
│   ├── callbacks.py        # Event callbacks delegating to MediGemOrchestrator
│   ├── components.py       # Header, Landing, Patient, Upload, Results, Timeline, Footer
│   ├── formatting.py       # HTML formatters for Risk Cards, Transparency & Quality Cards
│   ├── themes.py           # Custom Clinical SaaS Theme & CSS stylesheet
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

Run all 49 system unit tests:
```bash
python -m unittest frontend/tests/test_ui.py tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
