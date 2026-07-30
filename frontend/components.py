"""Modular Gradio Layout Components for MediGem Clinical SaaS Application."""

from typing import Tuple
import gradio as gr


def create_header() -> gr.HTML:
    """Create brand header with logo, title, and offline co-pilot status indicator."""
    return gr.HTML(
        """
        <div class="medigem-header">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h1>💎 MediGem Clinical Co-Pilot</h1>
                    <p>Multimodal Offline AI Assistant for Rural Healthcare Workers</p>
                </div>
                <div style="background: rgba(255, 255, 255, 0.2); padding: 0.4rem 0.8rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem;">
                    <span>🟢 OFFLINE FIRST</span> | <span>MODEL: GEMMA 3 4B</span>
                </div>
            </div>
        </div>
        """
    )


def create_landing_experience() -> gr.HTML:
    """Create interactive welcome dashboard displayed before analysis."""
    return gr.HTML(
        """
        <div class="medigem-card" style="background: linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%); border-color: #99F6E4;">
            <h3 style="color: #0F766E; margin-top: 0;">👋 Welcome to MediGem Offline AI Co-Pilot</h3>
            <p style="color: #475569; font-size: 0.95rem; line-height: 1.5;">
                MediGem is designed for healthcare providers operating in low-resource environments without continuous internet access. 
                Upload clinical reports, ECG strips, prescription scans, or wound photos to receive instant risk triage and non-diagnostic reasoning summaries.
            </p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <div style="flex: 1; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                    <strong style="color: #0F172A;">📄 Lab Reports</strong>
                    <p style="font-size: 0.8rem; color: #64748B; margin: 0.25rem 0 0 0;">PDF text layer & Tesseract OCR</p>
                </div>
                <div style="flex: 1; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                    <strong style="color: #0F172A;">❤️ ECG Analysis</strong>
                    <p style="font-size: 0.8rem; color: #64748B; margin: 0.25rem 0 0 0;">Waveform quality & triage</p>
                </div>
                <div style="flex: 1; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                    <strong style="color: #0F172A;">💊 Prescriptions</strong>
                    <p style="font-size: 0.8rem; color: #64748B; margin: 0.25rem 0 0 0;">Medication text extraction</p>
                </div>
                <div style="flex: 1; background: white; padding: 0.75rem; border-radius: 8px; border: 1px solid #E2E8F0;">
                    <strong style="color: #0F172A;">🩹 Wound Photo</strong>
                    <p style="font-size: 0.8rem; color: #64748B; margin: 0.25rem 0 0 0;">OpenCV blur & contrast check</p>
                </div>
            </div>
        </div>
        """
    )


def create_demo_gallery() -> Tuple[gr.Button, gr.Button, gr.Button, gr.Button]:
    """Create visual preset demo gallery buttons with descriptions."""
    gr.Markdown("### 🚀 Hackathon Demo Gallery (1-Click Presets)")
    with gr.Row():
        with gr.Column(scale=1, min_width=120):
            btn_report = gr.Button("📄 Lab Report\n(PDF Blood Test)", size="sm", variant="secondary")
        with gr.Column(scale=1, min_width=120):
            btn_ecg = gr.Button("❤️ ECG Strip\n(12-Lead Rhythm)", size="sm", variant="secondary")
        with gr.Column(scale=1, min_width=120):
            btn_rx = gr.Button("💊 Prescription\n(Med Scan)", size="sm", variant="secondary")
        with gr.Column(scale=1, min_width=120):
            btn_wound = gr.Button("🩹 Wound Photo\n(Laceration)", size="sm", variant="secondary")
    return btn_report, btn_ecg, btn_rx, btn_wound


def create_footer() -> gr.HTML:
    """Create clinical SaaS footer with medical disclaimer."""
    return gr.HTML(
        """
        <div class="medigem-footer">
            <p><strong>MediGem Offline AI Co-Pilot</strong> v1.0.0 | Model: Gemma 3 4B | Host: Ollama Local</p>
            <p style="font-size: 0.78rem; max-width: 800px; margin: 0.4rem auto 0 auto; color: #94A3B8;">
                <strong>MEDICAL DISCLAIMER:</strong> MediGem provides automated risk triage assistance to healthcare providers and does not formulate definitive diagnoses, prescribe medications, or replace professional clinical judgement. All emergency cases are governed deterministically by the Emergency Safety Engine.
            </p>
        </div>
        """
    )
