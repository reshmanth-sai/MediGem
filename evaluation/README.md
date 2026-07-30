# MediGem Evaluation, Validation & Benchmarking Framework

> **Automated Evaluation, Safety Auditing, Latency Profiling & Diagram Generation**

The `evaluation` package provides an offline, non-mutating framework to validate MediGem's accuracy, safety compliance, multi-run consistency, and latency metrics across all supported clinical modalities.

---

## 🏗️ Evaluation Package Architecture

```
evaluation/
├── __init__.py          # Package exports
├── evaluator.py         # EvaluationRunner orchestrating execution
├── benchmark.py         # Benchmarking suite & multi-run consistency driver
├── metrics.py           # Metrics collector (OCR confidence, quality, completeness)
├── latency.py           # Latency breakdown profiler (Input, OCR, Fusion, Gemma, Validation)
├── safety_audit.py      # Safety compliance auditor (<2.5ms emergency gate)
├── consistency.py      # Output consistency evaluator across multi-run executions
├── fixtures.py          # Dynamic fixture manager (discovers ECG, PDF, Rx, Wound samples)
├── report_generator.py # Report generator (Markdown, JSON, CSV)
├── screenshots.py      # Vector SVG/PNG architecture diagram & visual asset generator
├── diagrams/            # Generated SVG/PNG vector architecture diagrams
├── screenshots/         # Visual screenshot placecard assets
└── README.md            # Framework documentation
```

---

## 📊 Generated Evaluation Artifacts

Running the evaluation framework automatically creates:
1. `evaluation/evaluation_report.md`: Markdown summary report with executive metrics, emergency safety audit, and benchmark dataset table.
2. `evaluation/evaluation_summary.json`: Machine-readable JSON summary stamped with metadata (`Timestamp`, `Model: gemma3:4b`, `Prompt Version: v1.0`, `Reasoning Version: v1.0`).
3. `evaluation/benchmark_results.csv`: Tabular CSV benchmark dataset for export and statistical analysis.
4. `evaluation/diagrams/system_architecture.svg`: Vector SVG architecture diagram.
5. `evaluation/screenshots/*.png`: Visual screenshot placecard assets.

---

## 🚀 Running Evaluation Suite

Execute full evaluation runner:

```bash
python -m evaluation.evaluator
```

Or run benchmark suite:

```bash
python -m evaluation.benchmark
```

Run automated unit tests for evaluation framework:

```bash
python -m unittest evaluation/tests/test_evaluation.py
```
