# MediGem

> **Offline AI Co-Pilot for Rural Healthcare Workers**

MediGem is a multimodal, offline-first AI assistant designed for healthcare providers in resource-constrained and rural environments. Built for the **Build with Gemma Hackathon**.

---

## 🛠️ Technology Stack

- **Primary AI Engine**: Ollama (Gemma 3 4B / Gemma 2B / MedGemma)
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

## 📥 Input Processing Framework Architecture (Phase 7)

MediGem normalizes multi-format raw inputs (`IMAGE`, `PDF`, `TEXT`) into an immutable `ProcessedMedicalInput` container prior to downstream context building.

```text
Raw Medical Input (Image / PDF / Plain Text)
        ↓
InputRouter (Infers InputType: IMAGE | PDF | TEXT)
        │
        ├─► MetadataExtractor (Dimensions, DPI, file size, PDF pages)
        │
        ├─► QualityAssessmentEngine (Laplacian blur, brightness, contrast, QualityLevel)
        │
        ├─► ContentExtractor
        │       ├─► PDF: Text Layer (direct extraction, OCR skipped)
        │       ├─► Image (Lab Report / Prescription): Tesseract OCR Engine
        │       └─► Image (ECG / Wound) & Text: OCR skipped
        │
        └─► ProcessedMedicalInput (Immutable Pydantic Container, frozen=True)
                ↓
        MedicalContextBuilder
```

### Key Input Processing Capabilities
1. **InputType vs MedicalModality Disambiguation**: Separates input data format (`InputType.IMAGE`, `InputType.PDF`, `InputType.TEXT`) from clinical domain modality (`MedicalModality.ECG`, `LAB_REPORT`, `PRESCRIPTION`, `WOUND`, `GENERAL`).
2. **Smart Content Extractor (`backend/input/extractors.py`)**: Skips OCR when unnecessary (searchable PDFs with text layers, plain text, ECG/wound images) and runs `OCRService` only when text extraction is clinically required.
3. **Content Provenance (`ExtractedContent`)**: Tracks extracted text origin (`ContentSource.TEXT_LAYER`, `ContentSource.OCR_IMAGE`, `ContentSource.MANUAL_TEXT`).
4. **Computer Vision Quality Engine (`backend/input/quality.py`)**: Evaluates OpenCV Laplacian variance for blur, brightness, contrast, and megapixel resolution, mapping to qualitative `QualityLevel` (`POOR`, `FAIR`, `GOOD`, `EXCELLENT`) and generating actionable warnings.
5. **Immutable Container (`ProcessedMedicalInput`)**: Read-only, frozen container carrying `ImageMetadata`, `DocumentMetadata`, `QualityAssessment`, `ExtractedContent`, and `ProcessingSummary`.

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
│   │   ├── exceptions.py   # InputProcessingError, OCRError, etc.
│   │   ├── extractors.py   # ContentExtractor (PDF text layer vs optional OCR)
│   │   ├── health.py       # Diagnostic check_input_health() with real sample files
│   │   ├── metadata.py     # MetadataExtractor (Image & PDF)
│   │   ├── models.py       # InputType, QualityLevel, ProcessedMedicalInput
│   │   ├── ocr.py          # OCRService & TesseractEngine
│   │   ├── processor.py    # ImageProcessor, PdfProcessor, TextProcessor
│   │   ├── quality.py      # QualityAssessmentEngine (OpenCV Laplacian blur)
│   │   └── router.py       # Pluggable InputRouter
│   ├── logging/            # Central logging infrastructure
│   ├── pipeline/           # Strategy-pattern pipeline package (Phase 5)
│   ├── prompts/            # Markdown prompt templates (.md)
│   ├── reasoning/          # Prompt Engineering & Medical Reasoning Framework (Phase 6)
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
│   ├── test_input_processing.py   # Input processing unit tests
│   ├── test_reasoning_framework.py# Reasoning framework unit tests
│   ├── test_orchestration.py      # End-to-end orchestration unit tests
│   ├── test_ai_provider.py        # AI Inference Layer unit tests
│   ├── test_emergency_engine.py   # Emergency engine unit tests
│   ├── test_dependencies.py       # Package import verification
│   ├── test_gradio.py             # Gradio interface verification
│   └── test_offline_inference.py  # Ollama Gemma inference test
├── tmp/                    # Temporary working files
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore configuration
├── README.md               # Project overview & guide
└── requirements.txt        # Frozen Python dependencies
```

---

## 🧪 Verification & Unit Testing

Run the Input Processing Framework test suite:

```bash
python -m unittest tests/test_input_processing.py
```

Run all 39 system unit tests:
```bash
python -m unittest tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run complete system health diagnostics:
```bash
python tests/health_check.py
```
