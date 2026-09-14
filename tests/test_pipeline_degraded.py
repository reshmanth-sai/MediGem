"""The pipeline must not report COMPLETED when the model produced no assessment."""

import unittest
from types import SimpleNamespace
from unittest.mock import patch

from backend.config.constants import ImageType
import importlib
from backend.pipeline.context import AnalysisContext
from backend.pipeline.router import analysis_router
from backend.schemas.analysis import AnalysisRequest, MedicalImage, PatientInput

# The package re-exports an instance under the module name, so resolve the module.
pipeline_module = importlib.import_module("backend.pipeline.medical_pipeline")

VALID = {
    "metadata": {"reasoning_version": "1.0", "modality": "PRESCRIPTION"},
    "observations": [{"source": "prescription", "observation": "Tab Paracetamol 650mg 1 tab PO TDS"}],
    "assessment": {
        "clinical_summary": "Routine follow-up prescription transcribed for verification.",
        "risk_level": "LOW",
        "confidence_level": "MEDIUM",
        "red_flags": [],
    },
    "recommendations": {
        "recommended_next_step": "Verify the transcription against the original document.",
        "needs_referral": False,
        "requires_human_review": True,
        "follow_up_notes": "",
    },
    "patient_summary": "Your prescription has been recorded for checking.",
    "limitations": ["Transcription only."],
    "safety": {"is_safe": True, "safety_flags": []},
}


def _request() -> AnalysisRequest:
    return AnalysisRequest(
        request_id="REQ-DEGRADED",
        patient=PatientInput(patient_id="P-1", age=40, gender="Female", symptoms=["follow-up visit"]),
        image=MedicalImage(file_path="sample_data/prescriptions/handwritten_prescription.png", image_type=ImageType.PRESCRIPTION),
    )


def _response(payload):
    # Only parsed_output is read by the pipeline; a light stand-in avoids
    # constructing the full metadata tree.
    return SimpleNamespace(parsed_output=payload, success=True, raw_output=None)


class PipelineDegradedTests(unittest.TestCase):
    def _run(self, payloads):
        with patch.object(pipeline_module.ai_manager, "generate", side_effect=[_response(p) for p in payloads]) as gen:
            strategy = analysis_router.get_strategy("PRESCRIPTION")
            resp = pipeline_module.medical_pipeline.execute_workflow(_request(), AnalysisContext(request_id="REQ-DEGRADED"), strategy)
            return resp, gen

    def test_empty_payload_is_retried_then_degraded(self) -> None:
        resp, gen = self._run([{}, {}])
        self.assertEqual(gen.call_count, 2)
        self.assertIn("RETRY", gen.call_args_list[1].kwargs["prompt"])
        self.assertEqual(resp.status, "DEGRADED")
        self.assertIsNone(resp.risk_assessment)
        self.assertIn("No validated assessment", resp.summary)

    def test_retry_that_succeeds_is_completed(self) -> None:
        resp, gen = self._run([{}, VALID])
        self.assertEqual(gen.call_count, 2)
        self.assertEqual(resp.status, "COMPLETED")
        self.assertIsNotNone(resp.risk_assessment)

    def test_valid_first_answer_is_not_retried(self) -> None:
        resp, gen = self._run([VALID])
        self.assertEqual(gen.call_count, 1)
        self.assertEqual(resp.status, "COMPLETED")


if __name__ == "__main__":
    unittest.main()
