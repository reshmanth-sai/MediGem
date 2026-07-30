# MediGem Step-by-Step Live UI Demonstration Flow

> **Exact UI Click Sequences & Fixture Dataset Recommendations**

---

## 🎯 Recommended Benchmark Fixture Datasets

For maximum visual impact during judging, use these pre-loaded synthetic fixtures:

1. **Emergency Demonstration**: Symptoms: `"Severe crushing chest pain, diaphoresis, radiation to left jaw"`.
   - *Why*: Triggers `R-CARDIAC-01` rule in `0.17ms`, blocking LLM inference and rendering a red emergency card.
2. **Lab Report Demonstration**: Click **📄 Lab Report (PDF Blood Test)** preset (`sample_report.pdf`).
   - *Why*: Shows PyMuPDF searchable PDF layer extraction without running OCR (`ocr_performed=False`), rendering `MODERATE RISK`.
3. **Wound Demonstration**: Click **🩹 Wound Photo** preset (`sample_wound.png`).
   - *Why*: Demonstrates OpenCV Laplacian blur variance evaluation, quality scoring, and image triage.

---

## 👆 Step-by-Step UI Execution Sequence

```text
Step 1: Open Browser at http://localhost:7860
        │
        ▼
Step 2: Highlight "🟢 OFFLINE FIRST" & "MODEL: GEMMA 3 4B" Header Badges
        │
        ▼
Step 3: Demo Emergency Gate (Type "Severe crushing chest pain" -> Click Execute)
        │
        ▼
Step 4: Point to Red "🚨 ACUTE EMERGENCY INTERCEPTED" Card (Urgency 10/10)
        │
        ▼
Step 5: Demo Multimodal Lab Report (Click "📄 Lab Report" Preset -> Click Execute)
        │
        ▼
Step 6: Show Live Stage Progress Tracker (✓ Upload -> ✓ Processing -> ⟳ Gemma)
        │
        ▼
Step 7: Highlight "MODERATE RISK" Badge & Clinical Summary Textbox
        │
        ▼
Step 8: Point to "💡 Why was this recommendation generated?" Transparency Card
        │
        ▼
Step 9: Expand "⚙️ Developer & Judge Evaluation Inspector" Accordion
        │
        ▼
Step 10: Click "Referral Note" Export Download Button to output text file
```
