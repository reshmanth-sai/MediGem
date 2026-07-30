"""Unit test suite for Gradio Frontend UI and Callbacks (Phase 9)."""

import unittest
from pathlib import Path
import gradio as gr

from frontend.app import build_app
from frontend.callbacks import (
    handle_analysis_request,
    handle_demo_selection,
)
from frontend.formatting import (
    format_analysis_quality,
    format_observation_list,
    format_reasoning_transparency,
    format_referral_letter,
    format_risk_card,
)


class TestGradioFrontendUI(unittest.TestCase):
    """Test suite verifying Gradio Blocks assembly, callbacks, formatters, demo selection, and export generation."""

    # 1. Test App Building
    def test_build_app(self) -> None:
        app = build_app()
        self.assertIsInstance(app, gr.Blocks)

    # 2. Test Demo Preset Loading
    def test_handle_demo_selection(self) -> None:
        age, gender, symptoms, vitals, f_path = handle_demo_selection("LAB_REPORT")
        self.assertEqual(age, 45.0)
        self.assertEqual(gender, "Male")
        self.assertIn("Fatigue", symptoms)
        self.assertIsNotNone(f_path)
        self.assertTrue(Path(f_path).exists())

    # 3. Test Risk Card HTML Formatting
    def test_format_risk_card(self) -> None:
        html = format_risk_card("HIGH", urgency_score=7.5, emergency_intercepted=False)
        self.assertIn("HIGH RISK", html)
        self.assertIn("7.5", html)

    # 4. Test Reasoning Transparency HTML Formatting
    def test_format_reasoning_transparency(self) -> None:
        reasons = ["Elevated glucose values detected", "OCR confidence 97%"]
        html = format_reasoning_transparency(reasons)
        self.assertIn("Why This Recommendation?", html)
        self.assertIn("Elevated glucose values detected", html)

    # 5. Test Analysis Request UI Callback
    def test_handle_analysis_request_callback(self) -> None:
        history_state = []
        (
            risk_html,
            summary_text,
            transparency_html,
            quality_html,
            findings_html,
            patient_html,
            referral_html,
            dropdown_val,
            new_history,
            f_worker,
            f_patient,
            f_referral,
            f_json,
        ) = handle_analysis_request(
            age=40,
            gender="Female",
            symptoms_text="Severe chest pain",
            vital_signs_text="HR: 110\nBP: 150/95",
            notes_text="Patient presents with acute distress",
            file_upload=None,
            history_state=history_state,
        )

        self.assertIsNotNone(risk_html)
        self.assertIsNotNone(summary_text)
        self.assertEqual(len(new_history), 1)
        self.assertTrue(Path(f_worker).exists())
        self.assertTrue(Path(f_patient).exists())
        self.assertTrue(Path(f_referral).exists())
        self.assertTrue(Path(f_json).exists())


if __name__ == "__main__":
    unittest.main()
