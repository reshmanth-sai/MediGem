# MediGem Evaluation, Validation & Benchmark Report

> **Automated System Evaluation Report** | Generated for Build with Gemma

---

## 📊 Executive Summary Metrics

| Metric | Measured | Target Threshold | Status |
|---|---|---|---|
| **Safety Gate Pass Rate** | `100.0%` (matching case intercepted, 5,000 evaluations) | `100.0%` | **PASS** |
| **Schema Validation Pass Rate** | `100.0%` (20 / 20 runs validated against `ClinicalReasoningOutput`) | `100.0%` | **PASS** |
| **Emergency Gate Latency** | `0.357 ms` median, `0.386 ms` p95 | `< 5.00 ms` | **PASS** |
| **Average OCR Confidence** | `77.5%` (Tesseract, 2 documents with a text layer, unedited) | `> 90.0%` | **FAIL** |
| **End-to-End Pipeline Latency** | `11,815.10 ms` median, `8,675` to `18,791 ms` | `< 15,000.0 ms` | **PASS** |

Measured 2026-09-14 on Apple M5 with `gemma3:4b` via Ollama, 5 runs per modality across the four `sample_data/` inputs, by `evaluation/capture_landing_data.py`. The raw capture is `frontend_v2/components/landing/data/capture.json`. OCR confidence is the mean Tesseract word confidence on the two sample images that carry text and is reported as read; the model produced a schema-valid assessment on every run.

---

## 🏎️ Stage-by-Stage Latency Breakdown

Per-stage timings are not yet instrumented; `evaluation/evaluator.py` records only the end-to-end duration and the gate latency. The figures above are the measured totals. Input processing on the sample images (OpenCV quality checks plus Tesseract where a text layer exists) is recorded per modality in the capture file under `input.input_processing_ms`.

---

## 🛡️ Emergency Safety Engine Audit

Evaluated across 4 acute emergency categories using deterministic rules:

1. **Cardiac Emergency (`Severe crushing chest pain`)**:
   - Intercepted: `True` | Category: `CARDIAC` | Latency: `0.17 ms` | Status: `PASS`
2. **Respiratory Distress (`Anaphylactic difficulty breathing`)**:
   - Intercepted: `True` | Category: `RESPIRATORY` | Latency: `0.13 ms` | Status: `PASS`
3. **Acute Stroke (`Facial drooping, slurred speech`)**:
   - Intercepted: `True` | Category: `STROKE` | Latency: `0.18 ms` | Status: `PASS`
4. **Snake Bite Reaction (`Systemic venom toxicity`)**:
   - Intercepted: `True` | Category: `SNAKE_BITE` | Latency: `0.18 ms` | Status: `PASS`

---

## 🔄 Multi-Run Consistency Evaluation

Repeated runs across identical test fixtures confirmed 100% risk level stability (`is_consistent: True`).
- **Fixture `FIX-REPORT-01`**: Assessed risk level `MODERATE` across 3 consecutive runs.
- **Fixture `FIX-WOUND-01`**: Assessed risk level `LOW` across 3 consecutive runs.
