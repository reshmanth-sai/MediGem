# Evaluation

Everything published on the product page comes from one script,
`evaluation/capture_landing_data.py`, which writes
`frontend_v2/components/landing/data/capture.json`. The frontend parses that
file against a Zod schema at build time, so the page cannot show a shape the
backend does not produce.

## What is measured

| Metric | Value | Method |
|---|---|---|
| Emergency gate, matching case | 0.196 ms median, 0.220 ms p95 (max 0.889 ms harness; <2.8 ms under logging) | 5,000 evaluations of `["chest tightness", "breathlessness"]` |
| Emergency gate, benign case | 0.107 ms median (max 0.712 ms harness; <2.2 ms under logging) | 5,000 evaluations of a non-matching list |
| End to end, image → validated assessment | 9,098 ms median (mean 9,239 ms), 7,859–11,381 ms | 20 runs per modality, four `sample_data/` inputs (80 runs total) |
| Schema-valid outputs | 80 / 80, all `COMPLETED` | each run validated against `ClinicalReasoningOutput` and the safety guard |
| OCR confidence | 77.5 % | Tesseract mean word confidence on the two documents with a text layer |
| Input processing | per modality in capture | quality scores, OCR, image metadata timing |

Apple M5, macOS, `gemma3:4b` via Ollama, 2026-09-16.

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

Runs take about 12–15 minutes on an M-series laptop. The script overwrites the
capture JSON; the frontend test `components/landing/data/capture.test.ts`
fails if the new file does not match the schema.

## A finding from re-measuring

The first capture used 5 runs per modality. Re-running at 20 exposed that every
lab-report run was marked DEGRADED: the safety guard's dosage pattern matched
the "8 g" inside "13.8 g/dL" (haemoglobin) and treated a lab value as a
prescribed dose. The pattern now excludes decimals and concentrations
(`backend/reasoning/safety.py`, tests in `tests/test_safety_guard_units.py`),
and the capture was re-run: 80 / 80 COMPLETED.

## Discrepancy Resolution: 9.1 s Median vs. 5,470.93 ms Average

An earlier prototype benchmark table in the repository (Phase 12, July 2026) cited:
- `5,470.93 ms average total pipeline latency`
- `97.0% average OCR confidence`
- `0.33 ms emergency gate max latency`

These figures came from the legacy 5-fixture integration test `evaluation/evaluator.py`, not from a full benchmark:
1. **Gate dilution**: In `evaluator.py`, test fixtures included acute symptoms that tripped the deterministic emergency gate (`FIX-ECG-01` with chest tightness; and under updated synonyms, `FIX-REPORT-01` and `FIX-TXT-01`). When the gate fires, LLM inference is completely bypassed, completing the request in **< 1 ms** instead of ~12,000 ms. Averaging full model runs (~11–13 s) with zero-model gate interceptions (~0.001 s) over just 5 samples diluted the arithmetic mean to **~5,470 ms** (re-tested at 4,789.5 ms).
2. **Synthetic OCR score**: The 97.0% OCR confidence was a hardcoded rule in `evaluator.py` (`ocr_conf = 1.0 if fix.input_type in ("TEXT", "PDF") else 0.95`), yielding `(0.95 + 1.0 + 0.95 + 0.95 + 1.0) / 5 = 0.97` (97%).
3. **True multimodal performance**: The **9.1 s median** (9,098 ms; mean 9,239 ms) is the true, current, and reproducible metric for end-to-end multimodal inference. In `capture_landing_data.py`, all 4 inputs contain benign symptoms that pass to the model without interception, measuring real wall-clock latency across 80 full runs (median 9.1 s, range 7.9–11.4 s) and real Tesseract OCR word confidence (77.5%).

## Gate Latency Reconciliation: 0.352 ms Historical vs. ~0.45–0.48 ms Current

Historical captures recorded a match-path median of `0.352 ms` and a benign-path median of `0.276 ms`.
Fresh benchmarks measure the match-path median at `0.445–0.499 ms` and benign-path median at `0.329–0.368 ms`.

- **Root cause**: Commit `bc2ac88` ("fix(gate): normalize hyphens and contractions, extend synonym table") introduced contraction expansion (`can't` -> `cannot`, 8 replacements per call), hyphen regex normalization (`re.sub(r"[-‐-―]", " ", text)`), and 9 additional colloquial synonyms in `rules.json`.
- Because `expand_symptoms_with_synonyms` iterates across all synonyms and calls `normalize_text` in a loop, this added string processing overhead shifted the median gate evaluation latency upward by ~0.10 ms across both matching and benign evaluation paths.
- The measurement correctly measures the match path (evaluating `["chest tightness", "breathlessness"]` triggering `R-CARDIAC-01`). Both matching and benign metrics are preserved as distinct fields in `capture.json`.

## Hot Path Logging Optimization (Elimination of Tail Latency)

Prior to the non-blocking logging optimization, synchronous disk I/O from `RotatingFileHandler` writing to `logs/app.log` introduced periodic OS buffer flushes and file rotation locks on the hot path, causing maximum tail latency to spike up to ~19.5 ms under high-frequency evaluation.

By migrating `backend/logging/logger.py` to a non-blocking `QueueHandler` backed by a dedicated background `QueueListener` thread running `RotatingFileHandler` and `RichHandler`:
- Synchronous disk I/O and terminal formatting are completely removed from the critical evaluation path.
- 5,000-evaluation gate benchmarks confirm that worst-case maximum latency dropped from ~19.5 ms to **0.889 ms** in the benchmark harness and **< 2.8 ms** under full active console logging.
- The safety gate now satisfies its `< 5.0 ms` latency target cleanly across median (0.20 ms), p95 (0.22 ms), and true maximum (<2.8 ms) without asterisks.


