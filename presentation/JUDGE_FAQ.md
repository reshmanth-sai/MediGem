# MediGem Judge Q&A & Technical Defence Guide

> **Confident Technical, Clinical, and Architectural Answers for Hackathon Judging**

---

### Q1: Why did you choose Google Gemma 3 4B over larger cloud models?
**Answer**: Gemma 3 4B strikes the perfect balance between multimodal vision capabilities, instruction following, and local edge execution. In rural clinics, internet connectivity is unreliable or nonexistent. Gemma 3 4B runs locally via Ollama without cloud latency, while maintaining strong reasoning capabilities required for clinical context fusion.

### Q2: How do you guarantee the AI won't hallucinate dangerous drug dosages?
**Answer**: Through a multi-layered safety contract. First, prompt templates constrain output to structured JSON schemas. Second, `SafetyGuard` scans generated text for prohibited clinical actions (e.g. drug orders, milligram dosages, definitive diagnostic statements) and rejects non-compliant responses. Third, MediGem is explicitly scoped as a non-diagnostic risk triage and summary assistant.

### Q3: How fast is your Emergency Safety Engine?
**Answer**: The Emergency Safety Engine operates deterministically *before* calling AI models. It evaluates symptoms against 11 rules across 6 acute categories in `< 0.3 milliseconds`. If cardiac arrest, stroke, or anaphylaxis is detected, LLM inference is blocked instantly and an urgent referral note is generated.

### Q4: How does your Input Processor handle PDFs versus images?
**Answer**: MediGem uses a smart `ContentExtractor`:
- For **searchable PDF lab reports**, PyMuPDF (`fitz`) extracts the text layer directly (`ocr_performed=False`), ensuring 100% text accuracy.
- For **image scans of prescriptions**, Tesseract OCR is executed.
- For **ECG strips and wound photos**, OCR is skipped automatically in favor of visual quality analysis.

### Q5: How do you protect patient privacy?
**Answer**: MediGem is 100% offline. Zero patient data, images, or clinical notes ever leave the local machine or transfer across cloud networks. All session state is stored in memory and temporary export files on the local machine.
