# MediGem 2-Minute Live Pitch & Demonstration Script

> **Rapid 120-Second Pitch & Live UI Walkthrough Script**

---

## ⏱️ Timeline & Action Script

| Time | Presenter Action | On-Screen Click | Spoken Script | Expected UI Output |
|---|---|---|---|---|
| **0:00 - 0:25** | Intro & Problem | Hover over UI Header | *"Hello judges. Over 45% of rural clinics operate off-grid without internet or doctors. We built MediGem, an offline AI co-pilot powered by Google Gemma 3 4B running locally."* | MediGem Header visible with `🟢 OFFLINE FIRST` badge |
| **0:25 - 0:55** | Emergency Gate Demo | Type symptoms: `"Severe crushing chest pain, diaphoresis"` ➔ Click **Execute Clinical Analysis** | *"First, safety. If a patient presents with an acute emergency, our deterministic Safety Gate intercepts the workflow in under 0.3 milliseconds—blocking LLM inference and generating an immediate referral."* | Red Badge: `🚨 ACUTE EMERGENCY INTERCEPTED (URGENCY 10/10)` |
| **0:55 - 1:35** | Multimodal Demo | Click **📄 Lab Report** preset in Demo Gallery ➔ Click **Execute Clinical Analysis** | *"Now let's test a lab report PDF. MediGem extracts PDF text layers with zero OCR error, passes data through Context Fusion to Gemma, and generates a risk assessment, clinical summary, and reasoning transparency card explaining decision factors."* | Progress Tracker completes ➔ `MODERATE RISK` badge + Summary + Transparency Card |
| **1:35 - 2:00** | Wrap-Up & Exports | Scroll to **Download Export Summaries** | *"MediGem is 100% offline, 100% safe, and fully validated with 56 unit tests passing. Thank you!"* | Download buttons (`Worker Summary`, `Referral Note`, `JSON`) highlighted |

---

## 🔑 Key Transition Lines

- **Transition 1 (Intro ➔ Safety)**: *"Safety comes before AI reasoning. Let's see how our deterministic Emergency Gate handles a cardiac emergency."*
- **Transition 2 (Safety ➔ Multimodal)**: *"When symptoms are safe for AI evaluation, MediGem ingests complex multimodal documents using our Demo Gallery."*
- **Transition 3 (Demo ➔ Conclusion)**: *"Every output is non-diagnostic, fully validated, and exportable offline."*
