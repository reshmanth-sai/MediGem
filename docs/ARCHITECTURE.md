# Architecture

Two processes and a file.

```
┌──────────────────────────────┐        HTTP (JSON, multipart)        ┌───────────────────────────────┐
│  frontend_v2  (Next.js 15)   │ ───────────────────────────────────▶ │  backend/api  (FastAPI)       │
│  product page  /             │ ◀─────────────────────────────────── │  /health /rules /gate         │
│  workstation   /workstation… │                                      │  /analyze  /cases…            │
└──────────────────────────────┘                                      └──────────────┬────────────────┘
                                                                                     │
                                                    ┌────────────────────────────────┴───────────────────────────┐
                                                    │  backend/services/orchestrator.py                          │
                                                    │  1 validate  2 emergency gate  3 route  4 pipeline         │
                                                    └───┬──────────────┬─────────────────┬──────────────┬───────┘
                                                        │              │                 │              │
                                             backend/emergency   backend/input    backend/reasoning   backend/ai
                                             rules.json +        quality scores   prompt composer     Ollama client
                                             synonyms            OCR / PDF text   output schema       gemma3:4b
                                                                                  validator, guard
                                                                                     │
                                                                          backend/store/cases.py
                                                                          SQLite  data/medigem.db
```

## Request path

1. **Validate** the `AnalysisRequest` (demographics, symptoms, vitals, optional image with modality).
2. **Emergency gate** (`backend/emergency`): symptoms are normalised through a synonym table and matched against `rules.json`. A match returns `EMERGENCY_INTERCEPTED` with a `RiskAssessment` and a referral; the model is never called. Median 0.45 ms.
3. **Route** to a per-modality strategy (lab report, ECG, prescription, wound, general).
4. **Pipeline** (`backend/pipeline/medical_pipeline.py`):
   - input processing: OpenCV quality scores, Tesseract OCR or PyMuPDF text layer, image metadata;
   - context fusion and prompt composition from `backend/prompts/*.md`;
   - inference through `backend/ai` (Ollama, JSON mode, schema-constrained), with one retry on an empty payload;
   - validation: `ClinicalReasoningOutput` (Pydantic) then `SafetyGuard` (prohibited doses, certainty claims). Failure → `DEGRADED`, never a placeholder assessment.
5. **Store** (`backend/store`): the intake and the full response are written to SQLite; the response gains a `case_id`.

## Frontend

- `lib/api-client.ts` — one fetch wrapper: base URL and timeout from env, typed `ApiError` (unconfigured / network / timeout / http / parse), optional `X-API-Key`.
- `lib/schemas/analysis.ts` — Zod mirrors of the Python models. Every response is parsed; a backend change that alters the shape fails loudly.
- `providers/CasesProvider.tsx` — the one case list. Reads `/cases` when the API is configured (poll 30 s, refresh on focus and after intake); otherwise the bundled examples. `source` is `"live"` or `"example"` and the ribbon shows it.
- `lib/mapAnalysis.ts` — `AnalysisResponse` / stored case → the `ClinicalCaseData` the screens render. Nothing is invented: absent fields stay absent.
- `lib/replay.ts` — without an API, an intake replays one of five recorded runs from `capture.json`, labelled as a replay everywhere it appears.
- Landing (`components/landing`): GSAP + Lenis scroll, a canvas ECG per section, one WebGL plane for the document dissolve; everything degrades to static under `prefers-reduced-motion`. All copy in `copy.ts`, all figures from `data/capture.json`.

## Invariants

- The gate runs before the model, always. There is no setting that disables it.
- The model's output is never shown unvalidated.
- No figure on a screen is typed in: it is measured, read from `/health`, read from the browser, or derived from the case list.
- Uploads are deleted after the run.
