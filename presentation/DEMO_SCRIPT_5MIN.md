# MediGem 5-Minute Live Judging Demonstration Script

> **Comprehensive 300-Second Pitch & Feature Walkthrough Script**

---

## ⏱️ Detailed 5-Minute Master Action Schedule

### Minute 1: Problem & Architecture (0:00 - 1:00)
- **Action**: Display MediGem Gradio UI landing dashboard.
- **Spoken Script**:
  > *"Good morning judges. Front-line health workers in rural clinics evaluate complex medical reports every day without internet access or specialist physicians. MediGem is an offline multimodal AI clinical co-pilot built on Google Gemma 3 4B running locally via Ollama. Notice our 3-column layout: Left sidebar for patient data, Center workspace for file ingestion, and Right panel for primary clinical results."*

---

### Minute 2: Emergency Safety Gate Interception (1:00 - 2:00)
- **Action**: Enter symptoms: `"Acute stroke facial drooping, slurred speech"` in left sidebar ➔ Click **Execute Clinical Analysis**.
- **Spoken Script**:
  > *"Healthcare safety requires strict deterministic rules. Before any prompt reaches Gemma, patient symptoms enter our Emergency Safety Engine. In just 0.18 milliseconds, our safety gate detects an acute stroke presentation, blocks LLM execution to prevent hallucination or delay, and generates an emergency referral memo."*
- **Expected UI Output**: Red card displaying `🚨 ACUTE EMERGENCY INTERCEPTED (URGENCY: 10/10)`.

---

### Minute 3: Multimodal Lab Report & Computer Vision (2:00 - 3:00)
- **Action**: Click **📄 Lab Report (PDF Blood Test)** in 1-Click Demo Gallery ➔ Click **Execute Clinical Analysis**.
- **Spoken Script**:
  > *"Now let's analyze a blood lab report PDF. MediGem's smart ContentExtractor detects the searchable PDF text layer and extracts data directly via PyMuPDF without running OCR. Our Context Fusion Engine enriches the input with quality metrics, and Gemma 3 4B generates a structured risk triage."*
- **Expected UI Output**: Animated stage tracker updates (`✓ Processing` ➔ `⟳ Gemma Reasoning`) ➔ `MODERATE RISK` badge rendered.

---

### Minute 4: Reasoning Transparency & Developer Inspector (3:00 - 4:00)
- **Action**: Scroll to **Why was this recommendation generated?** card ➔ Expand **⚙️ Developer & Judge Evaluation Inspector**.
- **Spoken Script**:
  > *"Judges, point your attention to our Reasoning Transparency Card. MediGem explicitly tells the health worker WHY this recommendation was generated, citiing PDF text extraction, OCR confidence, and rule checks. In our Developer Inspector, we reveal OpenCV blur variance scores and execution latencies."*

---

### Minute 5: Exports, Benchmarks & Wrap-up (4:00 - 5:00)
- **Action**: Click **Referral Note** download button ➔ Display slide/summary.
- **Spoken Script**:
  > *"All outputs are formatted into non-diagnostic summaries and referral memorandums ready for offline text export. With 56 automated system unit tests passing and a 100% safety pass rate, MediGem brings fast, transparent, offline AI assistance to rural healthcare. Thank you!"*
