# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Medical Reasoning Framework**: Prompt Engineering Infrastructure, Qualitative Confidence (`LOW`, `MEDIUM`, `HIGH`), Layered Safety Guard, Presentation Explanation Builder
- **Master Orchestrator**: Strategy-Pattern Workflow Coordinator with End-to-End Safety Gate Interception
- **AI Infrastructure Layer**: Provider-Agnostic Architecture, Function-Calling Ready, Resilient JSON Parser
- **Safety Gate**: Deterministic Rule-Based Emergency Safety Engine (No AI / Zero LLM Dependency)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 🧠 Medical Reasoning & Prompt Infrastructure (Phase 6)

MediGem enforces a non-diagnostic AI reasoning contract (`ClinicalReasoningOutput`) with multi-layered safety guardrails.

```text
AnalysisStrategy
        ↓
MedicalContextBuilder (Assembles ClinicalContext)
        ↓
PromptComposer (Loads Markdown fragments from backend/prompts/reasoning/)
        ↓
AIManager / GemmaProvider
        ↓
OutputValidator (Validates against ClinicalReasoningOutput schema)
        ↓
SafetyGuard (3-Stage: Schema -> Policy -> Pattern & Dosage Check)
        ↓
ExplanationBuilder (Worker View / Patient View / Referral Note)
```

### Key Reasoning & Safety Features
1. **Unified Reasoning Contract (`ClinicalReasoningOutput`)**: Defines nested AI reasoning outputs:
   - `metadata`: Framework version ("1.0"), modality, timestamp.
   - `observations`: `SupportingObservation(source, observation)` tracking evidence linked back to input sources.
   - `assessment`: Clinical summary, risk level, qualitative `ConfidenceLevel` (`LOW`, `MEDIUM`, `HIGH`).
   - `recommendations`: Action steps, `needs_referral`, `requires_human_review`, follow-up notes.
   - `patient_summary`: Plain-language explanation for patients and families.
   - `limitations`: Structured AI limitation disclaimers.
   - `safety`: Safety validation flags and status.
2. **Modular Prompt Fragments (`backend/prompts/reasoning/`)**: System and user prompts assembled dynamically from Markdown files (`base.md`, `safety.md`, `ecg.md`, `wound.md`, `report.md`, `prescription.md`, `patient.md`).
3. **Layered Safety Guard (`backend/reasoning/safety.py`)**: 3-stage safety system rejecting outputs containing pharmaceutical drug dosage recommendations (e.g. `500mg paracetamol`) or unsupported diagnostic certitude claims (`100% certain`, `diagnosed with`).
4. **Presentation Decoupling (`backend/reasoning/explanation_builder.py`)**: Transforms `ClinicalReasoningOutput` into Worker View, Patient View, and Doctor Referral Note without coupling AI schemas to UI formatting.

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
│   ├── prompts/            # Markdown prompt templates (.md)
│   │   ├── reasoning/      # Modular reasoning prompt fragments (base, safety, ecg, wound, etc.)
│   │   └── system/         # Core system prompt templates
│   ├── reasoning/          # Prompt Engineering & Medical Reasoning Framework (Phase 6)
│   │   ├── context_builder.py  # MedicalContextBuilder
│   │   ├── exceptions.py       # Custom reasoning exceptions
│   │   ├── explanation_builder.py # Presentation ExplanationBuilder
│   │   ├── output_schema.py    # ClinicalReasoningOutput contract
│   │   ├── prompt_composer.py  # Provider-agnostic PromptComposer
│   │   ├── prompt_library.py   # PromptLibrary manager
│   │   ├── safety.py           # Layered SafetyGuard
│   │   └── validator.py        # OutputValidator
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Services & MediGemOrchestrator master coordinator
│   ├── utils/              # Generic helper utilities
│   └── validation/         # Clinical request validators
├── frontend/               # Gradio UI components & layouts
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
│   ├── health_check.py            # System diagnostic & health check suite
│   ├── test_reasoning_framework.py# Reasoning framework unit tests
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

Run the Medical Reasoning Framework test suite:

```bash
python -m unittest tests/test_reasoning_framework.py
```

Run all system test suites:
```bash
python -m unittest tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
