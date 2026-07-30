# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 📊 Evaluation, Validation & Benchmarking Framework (Phase 11)

MediGem includes an offline, non-mutating evaluation framework that validates accuracy, safety compliance, latency breakdowns, and multi-run consistency across all supported clinical modalities.

```text
Synthetic & Real Test Fixtures (Lab PDF, ECG, Prescription, Wound, Text)
        │
        ▼
EvaluationRunner (Executes benchmark without mutating backend logic)
        │
        ├─► LatencyProfiler (Stage latencies: Input, OCR, Fusion, Gemma, Safety)
        ├─► MetricsCollector (Safety pass rate, validation pass rate, OCR conf)
        ├─► SafetyAuditor (Emergency gate compliance < 2.5ms response)
        └─► ConsistencyEvaluator (Multi-run output stability)
        │
        ▼
Automated Report & Asset Generation
        ├─► evaluation_report.md (Executive markdown summary & benchmark table)
        ├─► evaluation_summary.json (Machine-readable JSON metadata header)
        ├─► benchmark_results.csv (Tabular CSV evaluation dataset)
        ├─► diagrams/system_architecture.svg (Vector SVG system diagram)
        └─► screenshots/*.png (Captured visual asset placecards)
```

### Benchmark Summary Metrics
- **Total Test Runs**: `5`
- **Safety Gate Pass Rate**: `100.0%`
- **Validation Pass Rate**: `100.0%`
- **Average OCR Confidence**: `97.0%`
- **Emergency Gate Max Latency**: `0.33 ms` (Threshold: < 5.0 ms)

---

## 🖥️ Interactive Gradio UI Application (Phase 9 & 10)

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

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Frontend / UI**: Gradio 5+ with Custom Clinical SaaS Styling
- **Evaluation & Benchmarking**: Non-Mutating Evaluation Engine, Latency Profiler, Safety Auditor, SVG Diagram Generator
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
├── evaluation/             # Evaluation & Benchmarking Framework (Phase 11)
│   ├── benchmark.py        # Benchmarking suite & multi-run driver
│   ├── consistency.py      # Multi-run output consistency evaluator
│   ├── diagrams/           # Generated vector SVG architecture diagrams
│   ├── evaluator.py        # EvaluationRunner orchestrator
│   ├── fixtures.py         # Dynamic fixture manager
│   ├── latency.py          # Stage latency profiler
│   ├── metrics.py          # Quality & provenance metrics collector
│   ├── report_generator.py # Report generator (MD, JSON, CSV)
│   ├── safety_audit.py     # Safety gate compliance auditor
│   ├── screenshots/        # Visual screenshot placecards
│   ├── screenshots.py     # SVG diagram & screenshot generator
│   └── tests/              # Evaluation framework unit tests
├── frontend/               # Gradio UI application (Phase 9 & 10)
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

## 🚀 Running MediGem Application & Evaluation

Start the web interface locally:

```bash
python app.py
```

Run full system evaluation and benchmarking suite:

```bash
python -m evaluation.evaluator
```

---

## 🧪 Verification & Unit Testing

Run the Evaluation Framework test suite:

```bash
python -m unittest evaluation/tests/test_evaluation.py
```

Run all 56 system unit tests:
```bash
python -m unittest evaluation/tests/test_evaluation.py frontend/tests/test_ui.py tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
