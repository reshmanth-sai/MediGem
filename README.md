# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
- **Backend Architecture**: Clean Architecture, Pydantic v2, Python 3.14+
- **Frontend / UI**: Gradio
- **Computer Vision & Image Processing**: OpenCV, Pillow (PIL), Scikit-Image
- **Document & Data Processing**: PyMuPDF (`fitz`), PyTesseract, Pandas, NumPy
- **API & Schemas**: Pydantic v2, Python-Dotenv, Requests
- **Logging & Diagnostics**: Rich, Standard Logging

---

## 📂 Project Directory Structure

```
MediGem/
├── app.py                  # Main application entry point (Placeholder)
├── backend/                # Modular backend package
│   ├── config/             # Environment settings & constants
│   │   ├── constants.py    # RiskLevel, ImageType, File extension & limit constants
│   │   └── settings.py     # Pydantic environment configuration loader
│   ├── exceptions/         # Custom exception hierarchy
│   │   └── __init__.py     # ApplicationError, ConfigurationError, AppValidationError, etc.
│   ├── logging/            # Central logging infrastructure
│   │   └── logger.py       # Rich colored console + rotating file logger (logs/app.log)
│   ├── pipeline/           # Abstract pipeline workflow interfaces
│   │   └── base_pipeline.py# BasePipeline(ABC) for ECG, Report, Prescription & Wound workflows
│   ├── schemas/            # Modular Pydantic v2 schemas
│   │   ├── patient.py          # PatientInput schema
│   │   ├── medical_image.py    # MedicalImage schema
│   │   ├── analysis.py         # AnalysisRequest & AnalysisResponse schemas
│   │   ├── risk.py             # RiskAssessment schema
│   │   ├── referral.py         # ReferralSummary schema
│   │   ├── system.py           # ApplicationStatus schema
│   │   └── validation_error.py # SchemaValidationError schema
│   ├── services/           # Abstract Base Class interfaces
│   │   └── __init__.py     # BaseService(ABC), BaseAnalyzer(ABC), BaseValidator(ABC)
│   ├── utils/              # Generic helper utilities
│   │   ├── file_utils.py       # Safe file reading/writing & path utilities
│   │   ├── image_utils.py      # Image resolution & PIL format helpers
│   │   ├── json_utils.py       # Safe JSON serialization
│   │   ├── time_utils.py       # ISO-8601 UTC timestamp utilities
│   │   └── validation_utils.py # Range validation & text sanitization
│   └── (ai, emergency, prompts, models, validation...) # Domain modules
├── frontend/               # Gradio UI components & layouts
├── assets/                 # Static assets, branding, and test images
├── logs/                   # Application log files (app.log)
├── outputs/                # Generated reports & exported artifacts
│   ├── analysis/           # Analysis outputs
│   ├── referrals/          # Generated referral PDFs & documents
│   └── reports/            # Summary clinical reports
├── sample_data/            # Sample healthcare datasets
│   ├── ecg/                # Sample ECG wave images/data
│   ├── prescriptions/      # Sample prescription scans
│   ├── reports/            # Lab reports & clinical notes
│   └── wounds/             # Wound visual inspection samples
├── tests/                  # Automated verification & test suite
│   ├── health_check.py          # System diagnostic & health check suite
│   ├── test_dependencies.py     # Package import verification
│   ├── test_gradio.py           # Gradio interface verification
│   ├── test_image_processing.py # Image loader verification
│   └── test_offline_inference.py# Ollama Gemma inference test
├── tmp/                    # Temporary working files
├── .env.example            # Environment settings template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 🏗️ How Future Modules Plug Into This Architecture

MediGem's backend foundation enforces clean architecture separation:

1. **Adding a New Analysis Workflow (e.g. ECG Analysis Pipeline)**:
   - Inherit from `backend.pipeline.BasePipeline`:
     ```python
     from backend.pipeline import BasePipeline
     from backend.schemas import AnalysisRequest, AnalysisResponse

     class EcgPipeline(BasePipeline):
         def preprocess(self, request: AnalysisRequest): ...
         def process(self, preprocessed_data): ...
         def postprocess(self, process_output, request: AnalysisRequest) -> AnalysisResponse: ...
     ```

2. **Creating Domain Analyzers**:
   - Inherit from `backend.services.BaseAnalyzer`:
     ```python
     from backend.services import BaseAnalyzer

     class WoundAnalyzer(BaseAnalyzer):
         def analyze(self, input_data): ...
     ```

3. **Input & Data Validation**:
   - Import schemas from `backend.schemas` and use `AppValidationError` from `backend.exceptions` for domain error handling:
     ```python
     from backend.schemas import PatientInput
     from backend.exceptions import AppValidationError
     ```

4. **Logging Across Modules**:
   - Always import logger from `backend.logging`:
     ```python
     from backend.logging import logger
     logger.info("Clinical analysis initiated for patient P-10492")
     ```

---

## 🧪 Verification & Health Check

Run the diagnostic health check to verify the entire foundation:

```bash
python tests/health_check.py
```

Expected diagnostic output:
- `✓ Python Version Check: PASS`
- `✓ Virtual Environment: PASS`
- `✓ Ollama Service Connection: PASS`
- `✓ AI Model Existence: PASS`
- `✓ Configuration Settings: PASS`
- `✓ Directory Hierarchy: PASS`
- `✓ Logging Infrastructure: PASS`
- `✓ Pydantic Schemas Import: PASS`
- `✓ Service & Pipeline Base: PASS`

---

## 📜 Development Workflow & Coding Standards

1. **Type Annotations**: All functions must include complete Python type hints (`str`, `int`, `Optional`, `Dict`, `List`).
2. **Docstrings**: Use standard Google-style docstrings for all classes, methods, and modules.
3. **No Hardcoded Constants**: Store configuration in `backend/config/settings.py` or `backend/config/constants.py`.
4. **Exception Handling**: Raise domain-specific exceptions inheriting from `ApplicationError` (`backend/exceptions`).
