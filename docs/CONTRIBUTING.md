# Contributing to MediGem

Thank you for your interest in contributing to **MediGem - Offline AI Co-Pilot for Rural Healthcare Workers**! We welcome open-source contributions to improve offline healthcare accessibility.

---

## 📜 Code of Conduct & Healthcare Safety Principles

1. **Safety First**: Never modify the Emergency Safety Engine rules or bypass `SafetyGuard` / `OutputValidator` without clinical review.
2. **Non-Diagnostic Constraint**: MediGem assists healthcare providers with risk triage and summary explanation. It MUST NOT formulate definitive diagnoses or recommend drug dosages.
3. **Offline Integrity**: All core inference and input processing must function 100% offline without external API dependencies.

---

## 🛠️ Development Setup

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/reshmanth-sai/MediGem.git
   cd MediGem
   ```

2. **Virtual Environment Setup**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Install Ollama & Gemma 3 4B**:
   ```bash
   ollama pull gemma3:4b
   ```

---

## 🧪 Running Tests & Diagnostics

Before submitting a pull request, run the full 56-test system suite:

```bash
python -m unittest evaluation/tests/test_evaluation.py frontend/tests/test_ui.py tests/test_multimodal_engine.py tests/test_input_processing.py tests/test_reasoning_framework.py tests/test_orchestration.py tests/test_ai_provider.py tests/test_emergency_engine.py
```

Run backend health check:

```bash
python tests/health_check.py
```

---

## ➕ Adding New Test Fixtures & Modalities

1. Place new synthetic fixture files in `tests/fixtures/`.
2. Register the fixture item in `evaluation/fixtures.py`.
3. Add a preset trigger button in `frontend/components.py` and `frontend/callbacks.py`.
4. Re-run `python -m evaluation.evaluator` to update benchmark reports.

---

## 📬 Pull Request Process

1. Create a feature branch (`git checkout -b feature/amazing-feature`).
2. Ensure all unit tests pass cleanly.
3. Commit changes with clean commit messages (`git commit -m "feat: add amazing feature"`).
4. Push to branch and open a Pull Request against `main`.
