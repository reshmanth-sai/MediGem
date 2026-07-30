# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Master Orchestrator**: Strategy-Pattern Workflow Coordinator with End-to-End Safety Gate Interception
- **AI Infrastructure Layer**: Provider-Agnostic Architecture, Function-Calling Ready, Resilient JSON Parser
- **Safety Gate**: Deterministic Rule-Based Emergency Safety Engine (No AI / Zero LLM Dependency)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 🔄 End-to-End Orchestration Workflow (Phase 5)

MediGem uses a clean Strategy-Pattern architecture coordinated by `MediGemOrchestrator`.

```text
Patient Input
      │
      ▼
RequestValidator (WorkflowState: VALIDATING)
      │
      ▼
Emergency Safety Engine (WorkflowState: EMERGENCY_CHECK)
      │
      ├── Emergency (safe_for_ai_processing=False) ──► Return Immediate Emergency Response
      │                                                (WorkflowState: EMERGENCY_INTERCEPTED)
      ▼ (safe_for_ai_processing=True)
AnalysisRouter (WorkflowState: ROUTING)
      │
      ▼
MedicalPipeline
      │
      ├─► AnalysisStrategy (General / ECG / Lab Report / Prescription / Wound)
      ├─► PromptBuilder (WorkflowState: PROMPT_BUILD)
      ├─► AIManager / GemmaProvider (WorkflowState: AI_INFERENCE)
      └─► ResponseParser (WorkflowState: PARSING)
      │
      ▼
AnalysisResponse (WorkflowState: COMPLETED)
```

### Key Orchestration Features
1. **Request Validation (`backend/validation/request_validator.py`)**: Validates patient demographics, symptoms, and required fields.
2. **Emergency Gate Interception (`backend/emergency/engine.py`)**: Evaluates 100% deterministic safety rules. If an acute emergency is detected (`safe_for_ai_processing=False`), Gemma LLM inference is **BLOCKED** and an immediate emergency response and doctor referral summary are returned in **< 2.5ms**.
3. **Decoupled Strategy Router (`backend/pipeline/router.py`)**: Resolves strategies (`BaseAnalysisStrategy`) by `MedicalModality` (`GENERAL`, `ECG`, `LAB_REPORT`, `PRESCRIPTION`, `WOUND`), allowing new modalities to be registered without modifying the orchestrator.
4. **Stateful Audit Tracing (`backend/pipeline/context.py`)**: `AnalysisContext` tracks request lifecycle through `WorkflowState` transitions (`VALIDATING`, `EMERGENCY_CHECK`, `ROUTING`, `PROMPT_BUILD`, `AI_INFERENCE`, `PARSING`, `COMPLETED`, `EMERGENCY_INTERCEPTED`, `FAILED`).

---

## 📂 Project Directory Structure

```
MediGem/
├── app.py                  # Main application entry point (Placeholder)
├── backend/                # Modular backend package
│   ├── ai/                 # AI Inference Layer (Phase 4)
│   ├── config/             # Environment settings & constants
│   ├── emergency/          # Emergency Safety Engine (Phase 3)
│   ├── exceptions/         # Custom exception hierarchy
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Strategy-pattern pipeline package (Phase 5)
│   │   ├── base_pipeline.py# Abstract BasePipeline interface
│   │   ├── context.py      # AnalysisContext, MedicalModality, WorkflowState
│   │   ├── medical_pipeline.py# Unified MedicalPipeline executor
│   │   ├── router.py       # AnalysisRouter strategy registry
│   │   └── strategies/     # Modality strategies (ECG, Report, Prescription, Wound, General)
│   ├── prompts/            # Markdown prompt templates (.md)
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Services & MediGemOrchestrator master coordinator
│   │   └── orchestrator.py # MediGemOrchestrator entrypoint
│   ├── utils/              # Generic helper utilities
│   └── validation/         # Clinical request validators
├── frontend/               # Gradio UI components & layouts
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
│   ├── health_check.py            # System diagnostic & health check suite
│   ├── test_orchestration.py      # End-to-end orchestration unit tests
│   ├── test_ai_provider.py        # AI Inference Layer unit tests
│   ├── test_emergency_engine.py   # Emergency engine unit tests
│   ├── test_dependencies.py       # Package import verification
│   ├── test_gradio.py             # Gradio interface verification
│   ├── test_image_processing.py   # Image loader verification
│   └── test_offline_inference.py  # Ollama Gemma inference test
├── tmp/                    # Temporary working files
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 🧪 Verification & Unit Testing

Run the Master Orchestrator integration test suite:

```bash
python -m unittest tests/test_orchestration.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
