"""Unit and integration test suite for Multimodal Intelligence Engine and Context Fusion (Phase 8)."""

import unittest
from pathlib import Path
from pydantic import ValidationError

from backend.config.constants import ImageType, RiskLevel
from backend.input import InputType, ProcessedMedicalInput, input_router
from backend.pipeline import MedicalModality
from backend.reasoning import (
    AllowedCapabilities,
    ClinicalContext,
    ClinicalReasoningOutput,
    CompletenessLevel,
    ContextEnhancer,
    ContextFusionEngine,
    EnrichmentNote,
    ExplanationBuilder,
    OutputValidator,
    ReasoningContext,
    SafetyGuard,
    context_builder,
    context_enhancer,
    context_fusion_engine,
    explanation_builder,
    output_validator,
    safety_guard,
)
from backend.schemas import AnalysisRequest, MedicalImage, PatientInput
from backend.services import orchestrator


class TestMultimodalIntelligenceEngine(unittest.TestCase):
    """Test suite verifying Context Fusion, Enhancers, ReasoningContext immutability, and end-to-end integration."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.fixtures_dir = Path(__file__).parent / "fixtures"
        cls.ecg_fixture = cls.fixtures_dir / "sample_ecg.png"
        cls.report_fixture = cls.fixtures_dir / "sample_report.pdf"
        cls.rx_fixture = cls.fixtures_dir / "sample_prescription.png"
        cls.wound_fixture = cls.fixtures_dir / "sample_wound.png"

    # 1. Test Context Enhancer Notes & Completeness
    def test_context_enhancer_completeness(self) -> None:
        pt = PatientInput(patient_id="P-FUSE-01", age=45, gender="Male", symptoms=["Fever"], vital_signs={"HR": 85})
        req = AnalysisRequest(request_id="REQ-FUSE-01", patient=pt)

        clin_ctx = context_builder.build_context(req)
        notes, completeness = context_enhancer.enhance_context(clin_ctx, None)

        self.assertEqual(completeness, CompletenessLevel.COMPLETE)
        self.assertIsInstance(notes, list)

    # 2. Test Context Fusion Engine
    def test_context_fusion_engine(self) -> None:
        pt = PatientInput(patient_id="P-FUSE-02", age=30, gender="Female", symptoms=["Cough"])
        req = AnalysisRequest(request_id="REQ-FUSE-02", patient=pt)

        processed = input_router.process_input(
            request_id="REQ-FUSE-02",
            modality=MedicalModality.LAB_REPORT,
            file_path=str(self.report_fixture),
        )

        clin_ctx = context_builder.build_context(req, processed_input=processed)
        reasoning_ctx = context_fusion_engine.fuse_context(clin_ctx, processed)

        self.assertIsInstance(reasoning_ctx, ReasoningContext)
        self.assertEqual(reasoning_ctx.clinical_context.patient_id, "P-FUSE-02")
        self.assertIsNotNone(reasoning_ctx.processed_input)
        self.assertEqual(reasoning_ctx.processed_input.input_type, InputType.PDF)

    # 3. Test ReasoningContext Immutability
    def test_reasoning_context_immutability(self) -> None:
        pt = PatientInput(patient_id="P-IMMUT", age=25, gender="Male", symptoms=["Mild fever"])
        req = AnalysisRequest(request_id="REQ-IMMUT", patient=pt)
        clin_ctx = context_builder.build_context(req)
        reasoning_ctx = context_fusion_engine.fuse_context(clin_ctx, None)

        with self.assertRaises(ValidationError):
            reasoning_ctx.completeness = CompletenessLevel.MINIMAL  # type: ignore

    # 4. Test End-to-End Orchestration with PDF Lab Report Fixture
    def test_end_to_end_lab_report_fixture(self) -> None:
        pt = PatientInput(patient_id="P-FIXTURE-101", age=50, gender="Male", symptoms=["Fatigue"])
        img = MedicalImage(file_path=str(self.report_fixture), image_type=ImageType.REPORT)
        req = AnalysisRequest(request_id="REQ-E2E-REPORT", patient=pt, image=img)

        resp = orchestrator.process_analysis_request(req)

        self.assertEqual(resp.request_id, "REQ-E2E-REPORT")
        self.assertEqual(resp.status, "COMPLETED")
        self.assertIsNotNone(resp.summary)

    # 5. Test End-to-End Orchestration with Wound Image Fixture
    def test_end_to_end_wound_fixture(self) -> None:
        pt = PatientInput(patient_id="P-FIXTURE-102", age=35, gender="Female", symptoms=["Wound pain"])
        img = MedicalImage(file_path=str(self.wound_fixture), image_type=ImageType.WOUND)
        req = AnalysisRequest(request_id="REQ-E2E-WOUND", patient=pt, image=img)

        resp = orchestrator.process_analysis_request(req)

        self.assertEqual(resp.status, "COMPLETED")
        self.assertIsNotNone(resp.summary)


if __name__ == "__main__":
    unittest.main()
