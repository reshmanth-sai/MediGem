"""MediGem Gradio UI Application Entry Point."""

import gradio as gr

from frontend.callbacks import (
    handle_analysis_request,
    handle_demo_selection,
)
from frontend.components import (
    create_demo_gallery,
    create_footer,
    create_header,
    create_landing_experience,
)
from frontend.formatting import (
    format_empty_state,
    format_stage_tracker,
)
from frontend.themes import CLINICAL_CSS, get_clinical_theme


def build_app() -> gr.Blocks:
    """Build and assemble complete Gradio Blocks application layout."""
    theme = get_clinical_theme()

    with gr.Blocks(theme=theme, css=CLINICAL_CSS, title="MediGem - Offline AI Co-Pilot") as app:
        # Session State Storage
        history_state = gr.State(value=[])

        # Header
        create_header()

        # Welcome Landing Experience
        create_landing_experience()

        # Proportional 3-Column Layout: Left (25%), Center (35%), Right (40%)
        with gr.Row():
            # LEFT SIDEBAR (25%)
            with gr.Column(scale=25, min_width=280):
                gr.Markdown("### 👤 Patient Information")
                age_input = gr.Number(label="Patient Age", value=35, precision=0)
                gender_input = gr.Dropdown(label="Gender", choices=["Male", "Female", "Other", "UNKNOWN"], value="Male")

                gr.Markdown("### 🩺 Clinical Presentation")
                symptoms_input = gr.Textbox(
                    label="Presenting Symptoms (comma-separated)",
                    placeholder="e.g. Fever, cough, fatigue",
                    value="Fever, cough",
                    lines=2,
                )
                vitals_input = gr.Textbox(
                    label="Vital Signs (key: value per line)",
                    placeholder="HR: 85\nBP: 120/80\nTemp: 98.6F",
                    value="HR: 85\nBP: 120/80",
                    lines=3,
                )
                notes_input = gr.Textbox(
                    label="Healthcare Worker Notes",
                    placeholder="Optional clinical observations",
                    lines=2,
                )

                gr.Markdown("### 📜 Session History")
                history_dropdown = gr.Dropdown(
                    label="Previous Analyses Timeline",
                    choices=[],
                    value="",
                    interactive=True,
                )

            # CENTER WORKSPACE (35%)
            with gr.Column(scale=35, min_width=320):
                gr.Markdown("### 📁 Medical Input Workspace")
                file_upload = gr.File(
                    label="Upload Medical Image or PDF Document",
                    file_types=[".png", ".jpg", ".jpeg", ".pdf", ".txt"],
                )

                # Demo Preset Gallery
                btn_report, btn_ecg, btn_rx, btn_wound = create_demo_gallery()

                # Action Trigger Button
                analyze_btn = gr.Button(
                    "💎 Execute Clinical Analysis",
                    variant="primary",
                    size="lg",
                )

                gr.Markdown("### ⚙️ Processing Status")
                progress_html = gr.HTML(format_stage_tracker(0))

            # RIGHT RESULTS PANEL (40% - Primary Focus)
            with gr.Column(scale=40, min_width=380):
                gr.Markdown("### 📋 Analysis Results & Reasoning Output")

                # Risk Assessment Card Output
                risk_output_html = gr.HTML(format_empty_state("No Analysis Executed", "Select Demo Mode or click Execute to analyze."))

                # Clinical Summary Output
                summary_output_text = gr.Textbox(
                    label="Clinical Summary (Healthcare Worker View)",
                    lines=4,
                    interactive=False,
                    placeholder="Clinical reasoning summary will appear here following execution.",
                )

                # Reasoning Transparency Card ("Why was this recommendation generated?")
                transparency_output_html = gr.HTML()

                # Analysis Quality & Provenance Card
                quality_output_html = gr.HTML()

                # Supporting Findings Output
                findings_output_html = gr.HTML()

                # Patient Summary View
                patient_output_html = gr.HTML()

                # Referral Note Output
                referral_output_html = gr.HTML()

                # Export Download Actions
                gr.Markdown("### 📤 Download Export Summaries")
                with gr.Row():
                    file_worker_out = gr.File(label="Worker Summary", interactive=False)
                    file_patient_out = gr.File(label="Patient Summary", interactive=False)
                    file_referral_out = gr.File(label="Referral Note", interactive=False)
                    file_json_out = gr.File(label="JSON Payload", interactive=False)

        # Developer Evaluation Accordion
        with gr.Accordion("⚙️ Developer & Judge Evaluation Inspector", open=False):
            gr.Markdown(
                """
                **Technical Pipeline Details:**
                - Model: `gemma3:4b` | Provider: `GemmaProvider` (Ollama Local)
                - Emergency Gate: `EmergencyEngine` (Deterministic 11 Rules)
                - Input Engine: `InputRouter` -> `ContentExtractor` (Tesseract OCR / PDF Layer)
                - Quality Engine: OpenCV Laplacian Blur Variance
                """
            )

        # Footer
        create_footer()

        # Callback Bindings

        # Demo Preset Callbacks
        btn_report.click(
            fn=lambda: handle_demo_selection("LAB_REPORT"),
            outputs=[age_input, gender_input, symptoms_input, vitals_input, file_upload],
        )
        btn_ecg.click(
            fn=lambda: handle_demo_selection("ECG"),
            outputs=[age_input, gender_input, symptoms_input, vitals_input, file_upload],
        )
        btn_rx.click(
            fn=lambda: handle_demo_selection("PRESCRIPTION"),
            outputs=[age_input, gender_input, symptoms_input, vitals_input, file_upload],
        )
        btn_wound.click(
            fn=lambda: handle_demo_selection("WOUND"),
            outputs=[age_input, gender_input, symptoms_input, vitals_input, file_upload],
        )

        # Main Analysis Execution Callback
        analyze_btn.click(
            fn=handle_analysis_request,
            inputs=[
                age_input,
                gender_input,
                symptoms_input,
                vitals_input,
                notes_input,
                file_upload,
                history_state,
            ],
            outputs=[
                risk_output_html,
                summary_output_text,
                transparency_output_html,
                quality_output_html,
                findings_output_html,
                patient_output_html,
                referral_output_html,
                history_dropdown,
                history_state,
                file_worker_out,
                file_patient_out,
                file_referral_out,
                file_json_out,
                progress_html,
            ],
        )

    return app


if __name__ == "__main__":
    demo = build_app()
    demo.launch(server_name="0.0.0.0", server_port=7860)
