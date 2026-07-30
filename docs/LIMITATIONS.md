# MediGem System Limitations & Assumptions

> **Honest Clinical AI Transparency & Constraints Document**

MediGem aims to assist rural health workers safely while maintaining strict transparency regarding technical boundaries and system assumptions.

---

## ⚠️ System Limitations & Constraints

1. **Hardware-Dependent LLM Inference Latency**:
   - MediGem executes Gemma 3 4B locally via Ollama. Total pipeline latency depends directly on the host machine's hardware (e.g. CPU vs Apple Silicon / CUDA GPU acceleration). On modern Apple Silicon hardware, inference completes in 5–12 seconds, whereas on older dual-core CPUs it may take 25–45 seconds.

2. **OCR Quality Dependency on Image Capture**:
   - While PyMuPDF extracts 100% accurate text layers from digital PDF reports, image scans of physical paper prescriptions or lab printouts rely on Tesseract OCR. Extremely blurry, crumpled, low-contrast, or handwritten notes may produce partial OCR text.

3. **Language Scope**:
   - Version 1.0 prompt engineering and reasoning output contracts are written in English. Local regional language translation (Hindi, Swahili, Spanish, French) is planned for Version 2.0.

4. **Non-Diagnostic & Non-Prescriptive Constraints**:
   - MediGem strictly triages risk levels (`LOW`, `MODERATE`, `HIGH`, `EMERGENCY`), summarizes observations, highlights abnormal lab values, and formats facility referral letters. It DOES NOT replace a licensed physician, formulate definitive medical diagnoses, or prescribe drug dosages.

---

## 📋 Operational Assumptions

1. **Healthcare Worker Supervision**: MediGem is designed as a co-pilot for trained front-line healthcare workers (nurses, community officers) who perform physical patient examinations. It is not intended for unassisted self-triage by patients.
2. **Offline Local Ollama Service**: Assumes the local Ollama daemon is running on the host machine (`http://localhost:11434`) with `gemma3:4b` pulled.
