"""Integration test suite for MediGem End-to-End Orchestrator, Emergency Gate, Strategy Router, and Pipelines."""

import unittest
from unittest.mock import MagicMock, patch
from pydantic import ValidationError

from backend.config.constants import ImageType, RiskLevel
from backend.exceptions import AppValidationError
from backend.pipeline import (
    AnalysisContext,
    AnalysisRouter,
    MedicalModality,
    MedicalPipeline,
    WorkflowState,
    analysis_router,
)
from backend.pipeline.strategies import BaseAnalysisStrategy, GeneralAssessmentStrategy
from backend.schemas import AnalysisRequest, MedicalImage, PatientInput
from backend.services import MediGemOrchestrator, orchestrator


class TestOrchestrationWorkflow(unittest.TestCase):
    """Test suite verifying end-to-end orchestration, emergency gate interception, and strategy routing."""

    def setUp(self) -> None:
        self.orchestrator = MediGemOrchestrator()

    # 1. Test Normal Non-Emergency Request Flow
    @patch.object(MedicalPipeline, "execute_workflow")
    def test_normal_request_flow(self, mock_execute: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.status = "COMPLETED"
        mock_response.summary = "Normal assessment complete"
        mock_execute.return_value = mock_response

        pt = PatientInput(patient_id="P-101", age=30, gender="Female", symptoms=["Mild cough"])
        req = AnalysisRequest(request_id="REQ-NORM-01", patient=pt)

        resp = self.orchestrator.process_analysis_request(req)

        self.assertEqual(resp.status, "COMPLETED")
        self.assertEqual(resp.summary, "Normal assessment complete")
        mock_execute.assert_called_once()

    # 2. Test Acute Emergency Interception (Gemma AI Skipped!)
    def test_emergency_interception_skips_gemma(self) -> None:
        pt = PatientInput(
            patient_id="P-999",
            age=55,
            gender="Male",
            symptoms=["Severe crushing chest pain", "Diaphoresis", "Shortness of breath"],
        )
        req = AnalysisRequest(request_id="REQ-EMG-01", patient=pt)

        resp = self.orchestrator.process_analysis_request(req)

        self.assertEqual(resp.status, "EMERGENCY_INTERCEPTED")
        self.assertIn("EMERGENCY GATE INTERCEPTION", resp.summary)
        self.assertIsNotNone(resp.risk_assessment)
        self.assertEqual(resp.risk_assessment.risk_level, RiskLevel.EMERGENCY)
        self.assertIsNotNone(resp.referral_summary)

    # 3. Test Validation Failure (Pydantic Schema Validation & Validator)
    def test_validation_failure_invalid_age(self) -> None:
        with self.assertRaises(ValidationError):
            PatientInput(patient_id="P-ERR", age=150, gender="Male", symptoms=["Headache"])

    def test_validation_failure_empty_request_id(self) -> None:
        pt = PatientInput(patient_id="P-ERR", age=30, gender="Male", symptoms=["Headache"])
        req = AnalysisRequest(request_id="", patient=pt)
        with self.assertRaises(AppValidationError):
            self.orchestrator.process_analysis_request(req)

    # 4. Test Strategy Router Resolution
    def test_analysis_router_modalities(self) -> None:
        router = AnalysisRouter()
        general_strat = router.get_strategy(MedicalModality.GENERAL)
        ecg_strat = router.get_strategy(MedicalModality.ECG)
        report_strat = router.get_strategy(MedicalModality.LAB_REPORT)

        self.assertEqual(general_strat.modality, MedicalModality.GENERAL)
        self.assertEqual(ecg_strat.modality, MedicalModality.ECG)
        self.assertEqual(report_strat.modality, MedicalModality.LAB_REPORT)

    # 5. Test Unsupported Modality Rejection
    def test_unsupported_modality_rejection(self) -> None:
        router = AnalysisRouter()
        with self.assertRaises(AppValidationError):
            router.get_strategy("NON_EXISTENT_MODALITY")


if __name__ == "__main__":
    unittest.main()
