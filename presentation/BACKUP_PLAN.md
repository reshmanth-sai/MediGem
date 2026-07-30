# MediGem Failure Recovery & Contingency Plan

> **Robust Protocols for Unexpected Technical Issues During Live Judging**

Live hackathon demonstrations carry inherent hardware and runtime risks. MediGem includes contingency protocols for every potential failure scenario.

---

## 🛠️ Contingency Matrix & Recovery Actions

| Failure Scenario | Root Cause | Immediate Recovery Action | Secondary Fallback |
|---|---|---|---|
| **Ollama Daemon Unresponsive** | Model memory pressure or process crash | Restart Ollama daemon: `ollama run gemma3:4b` | Trigger Emergency Safety Gate demo (which operates 100% without Ollama) |
| **Gemma Inference Takes > 15s** | CPU contention on laptop | Speak through the **Live Stage Progress Tracker** (`✓ Processing` ➔ `⟳ Gemma Reasoning`) explaining pipeline steps | Open pre-generated export file from `tmp/` directory |
| **Gradio Web App Fails to Render** | Port binding conflict | Relaunch app on port 7861: `python app.py --port 7861` | Present SVG system architecture diagram (`docs/diagrams/system_architecture.svg`) |
| **Tesseract OCR Library Error** | Missing system binary | Upload PDF document fixture (`sample_report.pdf`), which bypasses OCR via PyMuPDF | Use plain text symptom presentation mode |
| **Laptop Battery Low / Power Outage** | Unplugged charger | Connect power adapter immediately; system continues running 100% offline without network loss | Use backup tablet or presentation slides (`docs/PRESENTATION.md`) |
| **Judge Asks Out-of-Scope Question** | Question on diagnostic claims | Reiterate MediGem's non-diagnostic boundary: *"MediGem strictly triages risk levels and prepares referral notes to assist healthcare providers."* | Refer to `docs/SAFETY.md` |
