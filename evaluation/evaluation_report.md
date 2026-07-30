# MediGem System Evaluation & Benchmark Report

> **Timestamp**: `2026-07-30T08:11:04.485304+00:00` | **Model**: `gemma3:4b` | **Prompt Version**: `v1.0` | **Reasoning Version**: `v1.0`

---

## 📊 Executive Summary

- **Total Test Runs**: `2`
- **Safety Pass Rate**: `100.0%`
- **Validation Pass Rate**: `100.0%`
- **Average OCR Confidence**: `96.0%`
- **Average Latency**: `250.00 ms`

---

## 🛡️ Emergency Safety Engine Audit

- **Critical Symptoms Tested**: `4`
- **Detection Rate**: `100%`
- **Max Gate Latency**: `0.25 ms` (Threshold: < 5.0 ms)
- **Status**: `PASS`

---

## 🏎️ Benchmark Dataset Summary

| Fixture ID | Modality | Risk Level | Safety Pass | Validation Pass | OCR Conf | Completeness | Latency (ms) |
|---|---|---|---|---|---|---|---|
| `FIX-ECG-01` | `ECG` | **MODERATE** | `PASS` | `PASS` | `95%` | `COMPLETE` | `300.0` |

---

## 🌟 Key Strengths & Constraints

### Strengths
1. **Deterministic Safety Gate**: Intercepts acute emergency presentations in < 2.5ms without calling LLMs.
2. **Provider-Agnostic Multimodal Engine**: Normalizes lab reports, ECGs, prescriptions, and wound photos seamlessly.
3. **Structured Non-Diagnostic Contract**: Enforces strict Pydantic schema validation preventing hallucinatory drug dosages or diagnostic claims.

### Known Constraints
1. **Local Ollama Latency**: Multimodal inference latency depends on host hardware (CPU/GPU acceleration).
2. **Tesseract OCR Dependencies**: Document image OCR quality varies with lighting and scan resolution.
