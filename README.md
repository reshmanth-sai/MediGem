# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Multimodal Medical Intelligence Engine**: `ContextFusionEngine`, `ContextEnhancer` (`EnrichmentNote`, `CompletenessLevel`, `AllowedCapabilities`), Immutable `ReasoningContext`
- **Input Processing Framework**: Multi-Format Ingestion (`IMAGE`, `PDF`, `TEXT`), Smart `ContentExtractor` (searchable PDF text layer vs optional OCR), OpenCV Quality Engine
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

## 🧠 Multimodal Medical Intelligence & Context Fusion Architecture (Phase 8)

MediGem fuses clinical context, processed input data, image quality metrics, and OCR provenance into an immutable `ReasoningContext` prior to Gemma AI reasoning.

```text
ProcessedMedicalInput + ClinicalContext
        │
        ▼
ContextEnhancer (Quality notes, OCR confidence, completeness evaluation)
        │
        ▼
ContextFusionEngine (Fuses payload into immutable ReasoningContext)
        │
        ▼
PromptComposer (Modality-aware markdown prompt fragments)
        │
        ▼
AIManager / GemmaProvider (Multimodal Gemma inference execution)
        │
        ▼
OutputValidator -> SafetyGuard -> ExplanationBuilder
```

### Key Multimodal Capabilities
1. **Context Fusion Engine (`backend/reasoning/context_fusion.py`)**: Merges `ClinicalContext`, `ProcessedMedicalInput`, and context enrichments into an immutable `ReasoningContext`.
2. **Structured Enrichment Notes (`EnrichmentNote`)**: Captures CV image quality warnings (e.g., OpenCV Laplacian blur scores), OCR confidence levels, and vitals completeness without inventing medical facts.
3. **Completeness Evaluation (`CompletenessLevel`)**: Categorizes context payload completeness into `COMPLETE`, `PARTIAL`, or `MINIMAL` to guide Gemma reasoning bounds.
4. **Allowed AI Capabilities (`AllowedCapabilities`)**: Explicitly declares allowed AI reasoning tasks (summarize observations, highlight red flags, recommend triage) vs prohibited actions (formulating diagnoses, prescribing drugs or dosages).
5. **Direct Pipeline Integration**: Directly streams Gemma output through `OutputValidator` -> `SafetyGuard` -> `ExplanationBuilder` without unnecessary pipeline abstraction layers.

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
│   ├── input/              # Input Processing Framework (Phase 7)
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Strategy-pattern pipeline package (Phase 5)
│   ├── prompts/            # Markdown prompt templates (.md)
│   ├── reasoning/          # Medical Reasoning Framework & Context Fusion (Phase 6 & 8)
│   │   ├── context_builder.py     # MedicalContextBuilder
│   │   ├── context_enhancers.py   # ContextEnhancer (Quality & OCR notes)
│   │   ├── context_fusion.py      # ContextFusionEngine
│   │   ├── explanation_builder.py # Presentation ExplanationBuilder
│   │   ├── output_schema.py       # ClinicalReasoningOutput contract
│   │   ├── prompt_composer.py     # Provider-agnostic PromptComposer
│   │   ├── prompt_library.py      # PromptLibrary manager
│   │   ├── reasoning_context.py   # Immutable ReasoningContext & models
│   │   ├── safety.py              # Layered SafetyGuard
│   │   └── validator.py           # OutputValidator
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Services & MediGemOrchestrator master coordinator
│   ├── utils/              # Generic helper utilities
│   └── validation/         # Clinical request validators
├── frontend/               # Gradio UI components & layouts
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

## 🧪 Verification & Unit Testing

Run the Multimodal Intelligence Engine test suite:

```bash
python -m unittest tests/test_multimodal_engine.py
```

Run all 44 system unit tests:
```bash
python -m unittest tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
