# MediGem Evaluation, Validation & Benchmarking Framework

> **Automated Evaluation, Safety Auditing, Latency Profiling & Diagram Generation**

The `evaluation` package provides an offline, non-mutating framework to validate MediGem's accuracy, safety compliance, multi-run consistency, and latency metrics across all supported clinical modalities.

---

## 🏗️ Evaluation Package Architecture

```
evaluation/
├── __init__.py               # Package exports
├── capture_landing_data.py   # Canonical 80-run multimodal benchmark suite (writes capture.json)
├── evaluator.py              # 5-fixture integration smoke test runner
├── benchmark.py              # Multi-run consistency runner over evaluator
├── metrics.py                # Quality, completeness, and pass rate collector
├── latency.py                # Latency profiler
├── safety_audit.py           # Emergency gate compliance auditor (<5.0ms threshold)
├── consistency.py           # Multi-run output consistency evaluator
├── fixtures.py               # Fixture manager for tests/fixtures
├── report_generator.py      # Markdown, JSON, and CSV report generator
├── screenshots.py           # Vector SVG diagram & screenshot generator
└── README.md                 # Package documentation
```

---

## 📊 Evaluation Tools & Sources of Truth

### 1. Canonical Multimodal Benchmark (`evaluation/capture_landing_data.py`)
This is the single source of truth for all published metrics across the landing page, workstation, and documentation:
- **Scope**: 80 runs (20 runs × 4 real modalities: CBC lab report, Lead II ECG, handwritten prescription, post-op wound photo) + 5,000 emergency gate evaluations.
- **Measured Metrics**:
  - End-to-end latency: **9,098 ms median** (published as **9.1 s**; mean **9,239 ms**), range 7,859–11,381 ms
  - Schema validity: **80 / 80 (100%)** COMPLETED against `ClinicalReasoningOutput`
  - Real OCR confidence: **77.5%** mean word confidence via Tesseract on documents with a text layer
  - Emergency gate latency: **0.445 ms median**, 0.511 ms p95, 7.267 ms max (in capture harness; up to 19.49 ms under console logging)
- **Artifact**: Writes to `frontend_v2/components/landing/data/capture.json` (parsed by a Zod schema at build time).

```bash
PYTHONPATH=. python evaluation/capture_landing_data.py --runs 20 --gate-iterations 5000
```

### 2. Integration Smoke Test (`evaluation/evaluator.py`)
A fast integration test running across 5 synthetic test fixtures (`tests/fixtures/`):
- **Scope**: 5 test cases testing orchestrator flow, safety rules, and report generation.
- **Note on Latency & OCR**: Test cases include acute symptoms (e.g. chest tightness) that are intercepted by the deterministic gate in < 1 ms without invoking Gemma. Averaging zero-model gate interceptions with full model runs dilutes the arithmetic mean to ~4.8–5.4 s. Additionally, OCR confidence in this smoke test uses fixed heuristic weights (95% / 100%), yielding an artificial 97.0% average. Do not cite `evaluator.py` averages as true pipeline latency.

```bash
python -m evaluation.evaluator
```

---

## 🚀 Running Verification Tests

Run automated unit tests for evaluation framework:

```bash
python -m unittest evaluation/tests/test_evaluation.py
```

