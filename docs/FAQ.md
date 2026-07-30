# MediGem Hackathon Judge FAQ

Common questions and technical answers regarding MediGem's architecture, safety bounds, AI model selection, and clinical design.

---

### Q1: Why use Google Gemma 3 4B?
**Answer**: Gemma 3 4B is Google's open-weights model offering exceptional instruction-following, multimodal vision capabilities, and structured JSON output generation while remaining compact enough to run completely offline on modest hardware via Ollama. Its strong reasoning capabilities allow MediGem to synthesize complex clinical contexts safely.

### Q2: Why is offline-first architecture essential?
**Answer**: Over 45% of rural healthcare facilities globally operate in areas with intermittent or zero internet connectivity. By executing Gemma locally on edge hardware via Ollama, MediGem ensures uninterrupted clinical assistance without network latency or cloud API dependency.

### Q3: Why does MediGem NEVER formulate a diagnosis or prescribe drug dosages?
**Answer**: Healthcare AI safety requires strict ethical boundaries. Formulating definitive diagnoses or recommending drug dosages creates high liability and risk of harm. MediGem acts strictly as a **non-diagnostic decision support assistant**—it triages risk levels (`LOW`, `MODERATE`, `HIGH`, `EMERGENCY`), summarizes observations, highlights red flags, and prepares facility referral notes.

### Q4: How is emergency safety enforced before AI inference?
**Answer**: MediGem implements a **Deterministic Emergency Safety Engine** (`backend/emergency/`) that acts as a hard safety gate. Before any prompt reaches Gemma, the patient's symptoms are evaluated against a rule database (11 rules across 6 acute categories). If an emergency (e.g. crushing chest pain, acute stroke) is detected, the safety gate intercepts the workflow in `< 0.3ms`, blocks Gemma execution, and immediately generates an urgent referral note.

### Q5: How does the Input Processing Framework handle searchable PDFs vs images?
**Answer**: MediGem uses a smart `ContentExtractor`:
- For **PDF documents**, PyMuPDF (`fitz`) extracts the text layer directly without running OCR (`ocr_performed=False`), guaranteeing 100% text accuracy.
- For **Lab Reports and Prescriptions (Images)**, Tesseract OCR is executed.
- For **ECG strips and Wound photos**, OCR is skipped automatically since visual feature analysis is required rather than text extraction.

### Q6: Why did you choose Gradio 5+ for the frontend?
**Answer**: Gradio allows rapid Python-native web application deployment while supporting custom CSS themes, Blocks layout scaling, reactive event callbacks, and downloadable file exports. MediGem customizes Gradio with a white-first Clinical SaaS design system (`#0D9488` teal accents, 14px rounded cards, 3-column desktop grid).

### Q7: How does MediGem ensure output schema validity?
**Answer**: All Gemma responses are constrained to JSON format (`ResponseFormat.JSON`) and parsed against the `ClinicalReasoningOutput` Pydantic v2 contract. The `OutputValidator` and `SafetyGuard` verify schema compliance and reject any outputs attempting to recommend prohibited actions before displaying results to the user.
