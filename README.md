# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **AI Infrastructure Layer**: Provider-Agnostic Architecture, Function-Calling Ready, Resilient JSON Parser
- **Safety Gate**: Deterministic Rule-Based Emergency Safety Engine (No AI / Zero LLM Dependency)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 🤖 AI Inference Layer Architecture (Phase 4)

MediGem isolates Ollama and Gemma implementation details behind a provider-agnostic infrastructure layer. Higher application layers interact strictly via `AIManager` and structured Pydantic models.

```text
Emergency Safety Engine
        ↓
safe_for_ai_processing (True)
        ↓
AIManager (Orchestration & RetryPolicy)
        │
        ├─► PromptBuilder (Loads Markdown templates from backend/prompts/system/)
        │
        ├─► GemmaProvider (Communicates with local Ollama server, measures latency)
        │
        ├─► ResponseParser (Extracts embedded JSON objects/arrays, validates schema)
        │
        └─► InferenceResponse (Parsed output, InferenceMetadata, TokenUsage)
```

### Key AI Infrastructure Capabilities
1. **Gemma Provider (`backend/ai/gemma_provider.py`)**: Connects to local Ollama server, exposes `ModelInfo` and `ProviderCapabilities` (`supports_multimodal=True`, `supports_function_calling=True`).
2. **Function Calling Infrastructure (`backend/ai/functions/`)**: `BaseFunction` and `FunctionRegistry` ready for native Gemma tool execution.
3. **Markdown Prompt Templates (`backend/prompts/system/`)**: System, analysis, patient, and referral prompts stored in Markdown files (`.md`) for clean version control.
4. **Strengthened Response Parser (`backend/ai/parser.py`)**: Robustly extracts the first valid JSON object or array from mixed free-text outputs (e.g. `Text... { "key": "val" } ...`), raw JSON, and markdown code fences (` ```json ... ``` `).
5. **Session Tracing & Retries**: `InferenceContext` tracks requests across logs; `RetryPolicy` handles transient connection and timeout failures automatically.

---

## 📂 Project Directory Structure

```
MediGem/
├── app.py                  # Main application entry point (Placeholder)
├── backend/                # Modular backend package
│   ├── ai/                 # AI Inference Layer (Phase 4)
│   │   ├── base.py         # Abstract BaseAIProvider(ABC) interface
│   │   ├── exceptions.py   # AIProviderError, ResponseParsingError, etc.
│   │   ├── gemma_provider.py# GemmaProvider Ollama driver
│   │   ├── health.py       # Comprehensive check_ai_health() diagnostic
│   │   ├── manager.py      # AIManager facade & retry orchestrator
│   │   ├── models.py       # InferenceRequest, InferenceResponse, ModelInfo, ProviderCapabilities
│   │   ├── parser.py       # Resilient JSON parser & extraction engine
│   │   ├── prompts.py      # PromptBuilder loading Markdown templates
│   │   └── functions/      # Function calling infrastructure
│   │       ├── base.py     # BaseFunction(ABC)
│   │       └── registry.py # FunctionRegistry for tool registration
│   ├── config/             # Environment settings & constants
│   ├── emergency/          # Emergency Safety Engine (Phase 3)
│   ├── exceptions/         # Custom exception hierarchy
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Abstract pipeline workflow interfaces
│   ├── prompts/            # Markdown prompt templates
│   │   └── system/         # system.md, analysis.md, patient.md, referral.md
│   ├── schemas/            # Modular Pydantic v2 schemas
│   ├── services/           # Abstract Base Class interfaces & BaseMedicalAnalyzer
│   └── utils/              # Generic helper utilities
├── frontend/               # Gradio UI components & layouts
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
├── sample_data/            # Sample healthcare datasets
├── tests/                  # Automated verification & test suite
│   ├── health_check.py            # System diagnostic & health check suite
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

Run the AI Inference Layer test suite:

```bash
python -m unittest tests/test_ai_provider.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
