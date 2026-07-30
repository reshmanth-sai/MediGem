# MediGem Pre-Demo Readiness Checklist

> **Step-by-Step Verification Protocol Before Walking On Stage**

Execute this checklist 15 minutes prior to live presentation.

---

## 📋 15-Minute Pre-Presentation Protocol

- [ ] **Hardware & Power**: Laptop plugged into power adapter; display brightness set to maximum.
- [ ] **Ollama Local Daemon Running**:
  ```bash
  ollama list
  ```
  *Verify `gemma3:4b` is listed and responsive.*
- [ ] **Virtual Environment Active**:
  ```bash
  source .venv/bin/activate
  ```
- [ ] **Test Application Launch**:
  ```bash
  python app.py
  ```
  *Verify web interface loads cleanly at `http://localhost:7860`.*
- [ ] **Verify Test Fixtures**:
  - `tests/fixtures/sample_report.pdf` present
  - `tests/fixtures/sample_ecg.png` present
  - `tests/fixtures/sample_prescription.png` present
  - `tests/fixtures/sample_wound.png` present
- [ ] **Pre-Load Demo Gallery**: Click each Demo Gallery button once to warm up PyMuPDF and model caches.
- [ ] **Browser Display**: Zoom browser to 110% for crisp visibility on judge screens.
- [ ] **Close Background Apps**: Close slack, email, and heavy browser tabs to maximize CPU/RAM for Ollama local inference.
