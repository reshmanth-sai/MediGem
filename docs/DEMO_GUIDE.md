"""Live Demonstration Guide & Scripts for MediGem Hackathon Presentations."""

# MediGem Live Demonstration Guide

This guide provides timing scripts and step-by-step workflows for demonstrating MediGem live during hackathon judging rounds.

---

## ⏱️ Demo Script 1: 2-Minute Elevator Pitch

**Goal**: High-level overview demonstrating emergency safety interception and multimodal lab report reasoning.

- **0:00 - 0:30 (Problem & Vision)**:
  - Introduce MediGem as an offline multimodal AI assistant for rural health workers operating without internet access.
- **0:30 - 1:00 (Emergency Safety Gate Demo)**:
  - Enter patient symptoms: `"Severe crushing chest pain, diaphoresis"`.
  - Click **Execute Clinical Analysis**.
  - **Show Result**: Point to the **ACUTE EMERGENCY INTERCEPTED** red badge generated in `< 2.5ms` with LLM inference blocked.
- **1:00 - 1:40 (Multimodal Lab Report Demo)**:
  - Click **📄 Lab Report** in the 1-Click Demo Gallery.
  - Click **Execute Clinical Analysis**.
  - Point out:
    - Risk Assessment Badge (`MODERATE`).
    - Clinical Summary.
    - **Why was this recommendation generated?** card (showing PDF text layer extraction, OCR confidence 100%, and rule checks passed).
- **1:40 - 2:00 (Conclusion)**:
  - Highlight 100% offline Gemma 3 4B execution via Ollama and non-diagnostic safety bounds.

---

## ⏱️ Demo Script 2: 5-Minute Hackathon Judging Demo

**Goal**: Full walkthrough of Emergency Gate, Multimodal Ingestion (Lab Report PDF & Wound Photo), Reasoning Transparency, Developer Inspector, and File Exports.

1. **0:00 - 1:00 (Introduction & Architecture)**:
   - Walk through the proportional 3-column layout (Left 25% Patient, Center 35% Workspace, Right 40% Results Focus).
   - Explain offline execution architecture (`gemma3:4b` via Ollama).
2. **1:00 - 2:00 (Emergency Gate Demonstration)**:
   - Input acute symptoms (`"Acute stroke facial drooping and slurred speech"`).
   - Show instantaneous `< 0.3ms` deterministic interception and urgent referral memo generation.
3. **2:00 - 3:30 (Multimodal Ingestion & Computer Vision Quality)**:
   - Click **🩹 Wound Photo** in the Demo Gallery.
   - Click **Execute Clinical Analysis**.
   - Show live stage progress tracker (`✓ Upload Complete` -> `✓ Input Processing` -> `✓ Context Fusion` -> `⟳ Gemma Reasoning`).
   - Show Analysis Quality Card (displaying OpenCV Laplacian blur score and resolution metrics).
4. **3:30 - 4:30 (Reasoning Transparency & File Exports)**:
   - Highlight the **Why was this recommendation generated?** card.
   - Expand the **⚙️ Developer & Judge Evaluation Inspector** to show raw metrics.
   - Click **Referral Note** file download button to demonstrate printable text export.
5. **4:30 - 5:00 (Q&A Wrap-up)**:
   - Summarize 100% safety pass rate and invitation for judge questions.

---

## ⏱️ Demo Script 3: 10-Minute Deep-Dive Presentation

**Goal**: Complete end-to-end technical, clinical, and evaluation deep-dive including code architecture review and evaluation benchmark execution.

- **0:00 - 2:00**: Project vision, rural healthcare challenges, offline edge requirements.
- **2:00 - 4:00**: Live Gradio UI walkthrough featuring all 4 Demo Gallery presets (Lab Report, ECG, Prescription, Wound).
- **4:00 - 6:00**: Code architecture deep-dive: `EmergencyEngine` rules, `InputRouter`, `ContentExtractor`, `ContextFusionEngine`, and `SafetyGuard`.
- **6:00 - 8:00**: Evaluation Framework demonstration (`python -m evaluation.evaluator`), showcasing generated `evaluation_report.md`, `evaluation_summary.json`, `benchmark_results.csv`, and SVG architecture diagrams.
- **8:00 - 10:00**: Future roadmap (Android edge MediaPipe deployment, voice transcription) and Q&A.
