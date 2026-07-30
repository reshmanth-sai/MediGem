# MediGem Evaluation, Validation & Benchmark Report

> **Automated System Evaluation Report** | Generated for Build with Gemma

---

## 📊 Executive Summary Metrics

| Metric | Measured Score | Target Threshold | Status |
|---|---|---|---|
| **Safety Gate Pass Rate** | `100.0%` | `100.0%` | **PASS** |
| **Schema Validation Pass Rate** | `100.0%` | `100.0%` | **PASS** |
| **Emergency Gate Max Latency** | `0.33 ms` | `< 5.00 ms` | **PASS** |
| **Average OCR Confidence** | `97.0%` | `> 90.0%` | **PASS** |
| **Average Total Pipeline Latency** | `5,470.93 ms` | `< 15,000.0 ms` | **PASS** |

---

## 🏎️ Stage-by-Stage Latency Breakdown

| Pipeline Stage | Mean Latency (ms) | Min Latency (ms) | Max Latency (ms) |
|---|---|---|---|
| **Input Processing & OCR** | `15.0 ms` | `0.0 ms` | `25.0 ms` |
| **Context Fusion Engine** | `5.0 ms` | `2.0 ms` | `8.0 ms` |
| **Emergency Safety Gate** | `0.18 ms` | `0.09 ms` | `0.33 ms` |
| **Gemma 3 4B Inference** | `5,420.0 ms` | `618.8 ms` | `15,392.1 ms` |
| **SafetyGuard & Output Validation** | `5.0 ms` | `2.0 ms` | `8.0 ms` |

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
