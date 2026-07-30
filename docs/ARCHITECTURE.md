# MediGem Technical Architecture Specification

> **Deep-Dive Architectural & Data Flow Documentation**

MediGem is structured around Clean Architecture principles, enforcing clear boundaries between input ingestion, emergency safety, prompt composition, AI inference, and user presentation.

---

## 🏛️ High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 GRADIO UI FRONTEND                                     │
│     • Left Sidebar (25%)  • Center Workspace (35%)  • Right Results Panel (40%)          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ AnalysisRequest
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                MEDIGEM ORCHESTRATOR                                    │
│   1. Request Validation                                                                │
│   2. Emergency Safety Gate Evaluation (<0.3ms)                                         │
│   3. Input Processing & CV Quality Analysis                                            │
│   4. Context Fusion & Enrichment                                                       │
│   5. Strategy-Pattern Pipeline Dispatch                                                │
└───────────┬────────────────────────────────────────────────────────────────────────────┘
            │
            ├───────────────► [EMERGENCY DETECTED] ──► Block LLM ➔ Urgent Referral Note
            │
            ▼ [EMERGENCY PASSED]
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              REASONING ENGINE (GEMMA 3 4B)                             │
│   • Prompt Composer (Selects Strategy Fragments)                                       │
│   • GemmaProvider (Ollama Local API @ http://localhost:11434)                          │
│   • OutputValidator & SafetyGuard (Schema & Non-Diagnostic Contract Enforcement)        │
│   • ExplanationBuilder (Worker & Patient Summaries)                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Core Architecture Components

### 1. Emergency Safety Engine (`backend/emergency/`)
- **Class**: `EmergencyEngine`
- **Behavior**: Evaluates patient symptoms against 11 rules in `rules.json` using exact string & synonym matching.
- **Latency**: `< 0.3ms`.
- **Action**: If triggered, blocks LLM inference and immediately generates an emergency referral memo.

### 2. Input Processing Framework (`backend/input/`)
- **Components**: `InputRouter`, `ContentExtractor`, `QualityAssessmentEngine`.
- **Behavior**:
  - `IMAGE`: Runs OpenCV Laplacian blur variance evaluation, brightness/contrast scoring, megapixel resolution check. Runs Tesseract OCR on Lab Reports and Prescriptions. Skips OCR on ECG and Wound images.
  - `PDF`: PyMuPDF (`fitz`) extracts text layer directly without OCR.
  - `TEXT`: Ingests plain text symptoms.

### 3. Context Fusion Engine (`backend/reasoning/context_fusion.py`)
- **Class**: `ContextFusionEngine`
- **Behavior**: Fuses clinical inputs, vital signs, quality metrics, and OCR confidence into an immutable frozen `ReasoningContext` carrying `CompletenessLevel` (`MINIMAL`, `PARTIAL`, `COMPLETE`) and `AllowedCapabilities`.

### 4. AI Inference Layer (`backend/ai/`)
- **Components**: `GemmaProvider`, `AIManager`, `ResponseParser`.
- **Behavior**: Communicates with Ollama local instance using model `gemma3:4b`. Parses structured JSON responses with fallback regex recovery for mixed-text LLM outputs.

### 5. Medical Reasoning Framework (`backend/reasoning/`)
- **Components**: `ClinicalReasoningOutput`, `OutputValidator`, `SafetyGuard`, `ExplanationBuilder`.
- **Behavior**: Validates reasoning output against Pydantic schema, verifies absence of prohibited drug prescriptions or diagnosis claims, and formats presentation cards.

### 6. Evaluation Framework (`evaluation/`)
- **Components**: `EvaluationRunner`, `FixtureManager`, `LatencyProfiler`, `MetricsCollector`, `SafetyAuditor`, `ReportGenerator`, `ScreenshotGenerator`.
- **Behavior**: Non-mutating benchmark runner producing `evaluation_report.md`, `evaluation_summary.json`, `benchmark_results.csv`, and SVG architecture diagrams.
