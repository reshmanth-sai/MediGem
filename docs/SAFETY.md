# Safety design

The safety model is layered, and the layers are in a fixed order.

1. **Deterministic gate before inference.** `backend/emergency` matches
   normalised symptoms against `rules.json` (11 rules across 11 distinct
   categories: cardiac, respiratory, stroke, sepsis, anaphylaxis, poisoning,
   snakebite, burns, trauma, obstetric, general). A match returns a referral
   and the model is not called. The gate cannot be disabled from the UI or the
   API.
2. **Output contract.** The model must return `ClinicalReasoningOutput`
   (`backend/reasoning/output_schema.py`). `requires_human_review` defaults to
   `true`. Invalid or empty output is retried once, then reported as
   `DEGRADED`.
3. **Output guard.** `SafetyGuard` (`backend/reasoning/safety.py`) rejects
   prohibited content: doses and quantities (`650 mg`, `2 tablets`),
   `prescribe …`, `dose: N`, and certainty claims (`diagnosed with`,
   `definitive diagnosis`, `100% certain`). Lab concentrations (`13.8 g/dL`)
   are excluded after a false positive that degraded every lab-report run.
4. **Clinician sign-off.** A stored case carries `requires_review` until a
   clinician records approved / modified / rejected with a note.
5. **Assistant.** The chat assistant's prompt forbids doses and diagnoses and
   consults the gate first; its fallback text contains no quantities and is
   labelled "Reference text. No model was consulted." Its output does not yet
   pass through `SafetyGuard` (see `LIMITATIONS.md`).

What follows is the original clinical-bounds contract.

---



## 🛑 What MediGem DOES vs What MediGem DOES NOT Do

### What MediGem DOES:
- ✅ **Assesses Risk Levels**: Triages presentations into `LOW`, `MODERATE`, `HIGH`, or `EMERGENCY`.
- ✅ **Summarizes Clinical Observations**: Extracts observations from patient text, PDF lab reports, prescription scans, and wound photos.
- ✅ **Highlights Warning Signs**: Identifies abnormal lab parameters or red flag symptoms.
- ✅ **Provides Reasoning Transparency**: Explains why a recommendation was generated based on empirical quality metrics and rule checks.
- ✅ **Generates Referral Memorandums**: Formats structured referral letters for facility transfers.
- ✅ **Generates Plain-Language Explanations**: Produces clear patient-facing summaries.

### What MediGem DOES NOT Do:
- ❌ **Does NOT Formulate Definitive Diagnoses**: MediGem never claims a patient has a specific medical disease.
- ❌ **Does NOT Prescribe Pharmaceutical Medications**: MediGem never orders or prescribes drugs.
- ❌ **Does NOT Recommend Drug Dosages**: MediGem never suggests milligram dosages or administration schedules.
- ❌ **Does NOT Override Emergency Rules**: The deterministic Emergency Safety Engine cannot be bypassed by Gemma.
- ❌ **Does NOT Require Internet Connectivity**: Executes 100% offline via local Ollama inference.

---

## 🚨 Deterministic Emergency Safety Engine

The **Emergency Safety Engine** (`backend/emergency/`) acts as the primary safety gate before any prompt enters Gemma.

```text
Patient Symptoms
       │
       ▼
Emergency Safety Engine (11 Rules, 11 Distinct Categories, 12 Synonym Groups)
       │
       ├─► Emergency Detected? 
       │       ├─► YES: BLOCK Gemma LLM Inference ➔ Return Urgent Referral (0.45ms median, 0.51ms p95, target <5.0ms; max up to 19.5ms)
       │       └─► NO: Continue to Multimodal Context Fusion & Gemma Inference
```

### Emergency Gate Latency Profile (5,000 Evaluations)

The deterministic gate latency was evaluated across 5,000 consecutive matching evaluations (`["chest tightness", "breathlessness"]`) triggering rule `R-CARDIAC-01`:

| Metric | Measured Value (Benchmark Harness) | Measured Value (Under Console Logging) | Stated Target |
|---|---|---|---|
| **Median** | **0.445 ms** | **0.456 – 0.499 ms** | < 5.0 ms (Met) |
| **95th Percentile (p95)** | **0.511 ms** | **0.899 – 1.031 ms** | < 5.0 ms (Met) |
| **Worst-Case Maximum (Max)** | **7.267 ms** | **18.094 – 19.489 ms** | < 5.0 ms (**Exceeded**) |

> [!WARNING]
> **Worst-Case Tail Latency Exceeds <5.0 ms Target**:
> While the median (~0.45 ms) and 95th percentile (~0.51–0.92 ms) comfortably operate well within the <5.0 ms safety target, the worst-case maximum (7.27 ms in the capture harness and up to 19.49 ms under full logging) exceeds the 5.0 ms target. This tail latency is caused by:
> 1. **Logging Disk I/O & File Rotation**: Every evaluation emits structured logs via Python `logging` to a `RotatingFileHandler` writing to `logs/app.log`. OS buffer flushes, file size checks, and disk rotation locks intermittently introduce multi-millisecond pauses.
> 2. **Runtime Garbage Collection (GC)**: Python's generational garbage collector triggers periodic stop-the-world sweeps during high-frequency string normalization and dictionary lookups across thousands of iterations.
> 3. **Cold Starts & Terminal I/O**: Initial rule evaluation encounters one-off regex compilation overhead, and interactive Rich console rendering adds terminal buffer latency.
> 
> Under zero I/O and isolated compute, the gate completes in <0.20 ms. However, under realistic production logging, worst-case tail spikes up to ~19.5 ms must be acknowledged rather than concealed behind a percentile.

### Supported Emergency Categories (11 Rules, 11 Distinct Categories)
The 11 active rules in `backend/emergency/rules.json` map 1:1 to 11 distinct emergency categories:
1. **CARDIAC** (`R-CARDIAC-01`): Acute cardiac event, chest pain, angina, chest tightness with breathlessness.
2. **RESPIRATORY** (`R-RESP-01`): Severe respiratory distress, acute dyspnea, cyanosis, gasping for air.
3. **STROKE** (`R-STROKE-01`): Acute cerebrovascular event, sudden facial drooping, unilateral weakness, slurred speech.
4. **SEPSIS** (`R-SEPSIS-01`): High fever with altered mental status, delirium, or severe systemic infection.
5. **POISONING** (`R-TOXIC-01`): Acute chemical or pesticide ingestion, toxic substance exposure.
6. **SNAKE_BITE** (`R-SNAKE-01`): Suspected or confirmed venomous snake envenomation.
7. **BURNS** (`R-BURNS-01`): Major thermal or airway burn, extensive skin involvement.
8. **ANAPHYLAXIS** (`R-ANAPHYLAXIS-01`): Severe acute systemic allergic reaction, airway compromise.
9. **PREGNANCY_EMERGENCY** (`R-OB-01`): Obstetric emergency, vaginal hemorrhage, acute severe pain or convulsions.
10. **GENERAL_EMERGENCY** (`R-NEURO-01`): Acute loss of consciousness, unresponsiveness, or active seizure.
11. **TRAUMA** (`R-TRAUMA-01`): Major trauma presentation or critical acute injury.


---

## 🛡️ Layered Safety Guard & Output Validator

Every output generated by Gemma passes through a 3-stage validation pipeline:

1. **`OutputValidator`**: Verifies JSON schema compliance against `ClinicalReasoningOutput`.
2. **`SafetyGuard`**: Scans text for prohibited keywords (e.g. "diagnosed with", "take 500mg of", "prescribe"). Rejects unsafe outputs automatically.
3. **`ExplanationBuilder`**: Formats non-diagnostic healthcare worker summaries and patient-friendly explanations.
