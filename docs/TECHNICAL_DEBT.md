# MediGem Technical Debt & Codebase Maintenance Inventory

> **Prioritized Technical Debt Analysis & Refactoring Recommendations**

This report documents existing technical debt, code refactoring opportunities, and future maintenance recommendations for **MediGem**.

---

## 🎯 Technical Debt Summary

| Priority Level | Item Count | Status | Target Phase |
|---|---|---|---|
| 🚨 **CRITICAL** | `0` | No critical flaws or safety breaches identified | — |
| 🟠 **HIGH** | `2` | Tracked for optimization | v1.1.0 |
| 🟡 **MEDIUM** | `3` | Planned feature refactoring | v2.0.0 |
| 🟢 **LOW** | `2` | Polish & minor cleanup | Future |

---

## 🚨 1. CRITICAL PRIORITY (0 Items)

*No critical safety violations, security vulnerabilities, or hard crashes exist in the codebase. All 56 system unit tests pass cleanly, and the Emergency Safety Engine intercepts acute cases in `< 0.3ms`.*

---

## 🟠 2. HIGH PRIORITY

### TD-H1: Local Ollama Multimodal Inference Speed Optimization
- **Location**: `backend/ai/provider.py` (`GemmaProvider`)
- **Description**: Inference on CPU-only edge hardware can take 12–15 seconds per request. While typical for local 4B models, model quantization (e.g. 4-bit AWQ / GGUF quantization) can reduce latency by 60%.
- **Recommendation**: Provide optional flags in `backend/config/settings.py` for quantized models (`gemma3:4b-q4_k_m`) to accelerate inference on CPU-only rural laptops.

### TD-H2: Tesseract OCR Engine Subprocess Pooling
- **Location**: `backend/input/content_extractor.py` (`ContentExtractor`)
- **Description**: Currently, `pytesseract.image_to_string` spawns a new Tesseract process per image execution.
- **Recommendation**: Cache Tesseract process instances or reuse pre-processed NumPy arrays to save 200–400ms per image OCR run.

---

## 🟡 3. MEDIUM PRIORITY

### TD-M1: Regional Language Translation Layer
- **Location**: `backend/reasoning/explanation_builder.py` (`ExplanationBuilder`)
- **Description**: Output summaries and patient-friendly explanations are currently rendered in English.
- **Recommendation**: Introduce an offline translation dictionary or lightweight NLLB-200 model translation pipeline for Hindi, Swahili, Spanish, and French.

### TD-M2: Native DICOM Medical Imaging Adapter
- **Location**: `backend/input/processors.py` (`ImageProcessor`)
- **Description**: `ImageProcessor` ingests standard raster image formats (`.png`, `.jpg`, `.jpeg`). Direct ingestion of raw DICOM X-Ray and Ultrasound files (`.dcm`) requires converting DICOM metadata.
- **Recommendation**: Integrate `pydicom` in `backend/input/` to parse DICOM header tags and convert pixel arrays into normalized OpenCV image objects.

### TD-M3: ONNX / TFLite Mobile Quantization for Android Edge
- **Location**: `backend/ai/`
- **Description**: Ollama serves desktop architectures efficiently. Deploying on low-cost Android mobile devices in rural clinics requires MediaPipe LLM Inference API bindings.
- **Recommendation**: Prepare MediaPipe task file wrappers for `gemma-2b-it-gpu-int4.bin`.

---

## 🟢 4. LOW PRIORITY

### TD-L1: Benchmark Fixture Dataset Expansion
- **Location**: `tests/fixtures/` & `evaluation/fixtures.py`
- **Description**: The current benchmark suite includes 5 core fixtures covering ECG, PDF, Rx, Wound, and Text.
- **Recommendation**: Expand fixture inventory to 25 synthetic cases for wider clinical variety testing.

### TD-L2: CSS Variable Centralization in Frontend Themes
- **Location**: `frontend/themes.py`
- **Description**: CSS properties in `CLINICAL_CSS` contain some repeated color hex codes (`#0D9488`, `#0F766E`).
- **Recommendation**: Refactor all inline hex codes into global CSS custom properties (`var(--primary-teal)`).
