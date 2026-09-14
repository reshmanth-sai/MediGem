# Evaluation

Everything published on the product page comes from one script,
`evaluation/capture_landing_data.py`, which writes
`frontend_v2/components/landing/data/capture.json`. The frontend parses that
file against a Zod schema at build time, so the page cannot show a shape the
backend does not produce.

## What is measured

| Metric | Value | Method |
|---|---|---|
| Emergency gate, matching case | 0.352 ms median, 0.364 ms p95 | 5,000 evaluations of `["chest tightness", "breathlessness"]` |
| Emergency gate, benign case | see capture | 5,000 evaluations of a non-matching list |
| End to end, image → validated assessment | 9,063 ms median, 7,975–12,961 ms | 20 runs per modality, four `sample_data/` inputs |
| Schema-valid outputs | 80 / 80, all `COMPLETED` | each run validated against `ClinicalReasoningOutput` and the safety guard |
| OCR confidence | 77.5 % | Tesseract mean word confidence on the two documents with a text layer |
| Input processing | per modality in capture | quality scores, OCR, image metadata timing |

Apple M5, macOS, `gemma3:4b` via Ollama, 2026-09-14.

## What is not measured

Clinical correctness. There is no labelled set and no clinician review of the
assessments. The figures above say the pipeline is fast and its output is
well-formed; they say nothing about whether the risk level or the next step is
right. See [`LIMITATIONS.md`](LIMITATIONS.md).

## Reproduce

```bash
source .venv/bin/activate
ollama pull gemma3:4b
PYTHONPATH=. python evaluation/capture_landing_data.py --runs 20 --gate-iterations 5000
```

Runs take about 15 minutes on an M-series laptop. The script overwrites the
capture JSON; the frontend test `components/landing/data/capture.test.ts`
fails if the new file does not match the schema.

## A finding from re-measuring

The first capture used 5 runs per modality. Re-running at 20 exposed that every
lab-report run was marked DEGRADED: the safety guard's dosage pattern matched
the "8 g" inside "13.8 g/dL" (haemoglobin) and treated a lab value as a
prescribed dose. The pattern now excludes decimals and concentrations
(`backend/reasoning/safety.py`, tests in `tests/test_safety_guard_units.py`),
and the capture was re-run: 80 / 80 COMPLETED.
