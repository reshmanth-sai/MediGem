"""Unit test suite for Prompt Engineering & Medical Reasoning Framework (Phase 6)."""

import unittest
from backend.config.constants import RiskLevel
from backend.pipeline import AnalysisContext, MedicalModality
from backend.reasoning import (
    ClinicalContext,
    ClinicalReasoningOutput,
    ConfidenceLevel,
    ExplanationBuilder,
    MedicalContextBuilder,
    MedicalSafetyViolationError,
    OutputValidationError,
    OutputValidator,
    PromptComposer,
    PromptLibrary,
    ReasoningAssessment,
    ReasoningMetadata,
    ReasoningRecommendations,
    ReasoningSafety,
    SafetyGuard,
    SupportingObservation,
    context_builder,
    explanation_builder,
    output_validator,
    prompt_composer,
    prompt_library,
    safety_guard,
)
from backend.schemas import AnalysisRequest, PatientInput


class TestReasoningFramework(unittest.TestCase):
    """Test suite verifying Context Builder, Prompt Composer, Output Validator, Safety Guard, and Explanation Builder."""

    def setUp(self) -> None:
        self.patient = PatientInput(patient_id="P-301", age=40, gender="Female", symptoms=["Fever", "Headache"])
        self.request = AnalysisRequest(request_id="REQ-REASON-01", patient=self.patient, notes="3 day duration")
        self.context = AnalysisContext(request_id="REQ-REASON-01", patient_id="P-301", modality=MedicalModality.GENERAL)

    # 1. Test Context Building
    def test_medical_context_builder(self) -> None:
        ctx = context_builder.build_context(self.request, self.context)
        self.assertEqual(ctx.request_id, "REQ-REASON-01")
        self.assertEqual(ctx.patient_id, "P-301")
        self.assertEqual(ctx.age, 40)
        self.assertEqual(ctx.gender, "Female")
        self.assertIn("Fever", ctx.symptoms)

    # 2. Test Prompt Composer & Fragments
    def test_prompt_composer(self) -> None:
        ctx = context_builder.build_context(self.request, self.context)
        composed = prompt_composer.compose_prompt(ctx)

        self.assertIsNotNone(composed.system_prompt)
        self.assertIsNotNone(composed.user_prompt)
        self.assertIn("MediGem", composed.system_prompt)
        self.assertIn("SAFETY INSTRUCTIONS", composed.system_prompt)
        self.assertIn("P-301", composed.user_prompt)
        self.assertEqual(composed.metadata.modality, MedicalModality.GENERAL)

    # 3. Test Output Validator Schema Compliance
    def test_output_validator_valid_payload(self) -> None:
        valid_dict = {
            "metadata": {"reasoning_version": "1.0", "modality": "GENERAL"},
            "observations": [{"source": "symptoms", "observation": "Fever"}],
            "assessment": {
                "clinical_summary": "Mild febrile reaction.",
                "risk_level": "MODERATE",
                "confidence_level": "HIGH",
                "red_flags": ["Fever"],
            },
            "recommendations": {
                "recommended_next_step": "Rest and oral hydration.",
                "needs_referral": False,
                "requires_human_review": True,
                "follow_up_notes": "Monitor temp.",
            },
            "patient_summary": "You have a mild fever. Please rest.",
            "limitations": ["Based on reported symptoms."],
            "safety": {"is_safe": True, "safety_flags": []},
        }

        output = output_validator.validate_output(valid_dict)
        self.assertIsInstance(output, ClinicalReasoningOutput)
        self.assertEqual(output.assessment.confidence_level, ConfidenceLevel.HIGH)

    def test_output_validator_invalid_schema(self) -> None:
        invalid_dict = {"assessment": "missing required nested structure"}
        with self.assertRaises(OutputValidationError):
            output_validator.validate_output(invalid_dict)

    # 4. Test SafetyGuard Layered Validation
    def test_safety_guard_accepts_safe_output(self) -> None:
        safe_output = ClinicalReasoningOutput(
            metadata=ReasoningMetadata(modality=MedicalModality.GENERAL),
            observations=[SupportingObservation(source="symptoms", observation="Mild fever")],
            assessment=ReasoningAssessment(
                clinical_summary="Clinical observations are suggestive of a mild viral illness.",
                risk_level=RiskLevel.LOW,
                confidence_level=ConfidenceLevel.HIGH,
                red_flags=[],
            ),
            recommendations=ReasoningRecommendations(
                recommended_next_step="Rest and oral hydration.",
                needs_referral=False,
                requires_human_review=True,
            ),
            patient_summary="You have a mild fever. Please rest.",
            limitations=["Based on symptoms."],
            safety=ReasoningSafety(),
        )

        is_safe, flags = safety_guard.validate_safety(safe_output)
        self.assertTrue(is_safe)

    def test_safety_guard_rejects_prohibited_dosage(self) -> None:
        unsafe_output = ClinicalReasoningOutput(
            metadata=ReasoningMetadata(modality=MedicalModality.GENERAL),
            observations=[],
            assessment=ReasoningAssessment(
                clinical_summary="Give 500mg paracetamol every 4 hours.",  # Prohibited dosage!
                risk_level=RiskLevel.LOW,
                confidence_level=ConfidenceLevel.HIGH,
                red_flags=[],
            ),
            recommendations=ReasoningRecommendations(
                recommended_next_step="Prescribe 500mg paracetamol.",
                needs_referral=False,
            ),
            patient_summary="Take 500mg paracetamol.",
            limitations=[],
            safety=ReasoningSafety(),
        )

        with self.assertRaises(MedicalSafetyViolationError):
            safety_guard.validate_safety(unsafe_output)

    # 5. Test ExplanationBuilder Presentation Decoupling
    def test_explanation_builder_views(self) -> None:
        reasoning = ClinicalReasoningOutput(
            metadata=ReasoningMetadata(modality=MedicalModality.GENERAL),
            observations=[SupportingObservation(source="symptoms", observation="Chest discomfort")],
            assessment=ReasoningAssessment(
                clinical_summary="Possible cardiac discomfort.",
                risk_level=RiskLevel.HIGH,
                confidence_level=ConfidenceLevel.HIGH,
                red_flags=["Chest pain"],
            ),
            recommendations=ReasoningRecommendations(
                recommended_next_step="Urgent evaluation at medical center.",
                needs_referral=True,
                requires_human_review=True,
            ),
            patient_summary="Please see a doctor immediately.",
            limitations=["Preliminary AI screening."],
            safety=ReasoningSafety(),
        )

        worker_view = explanation_builder.build_worker_view(reasoning)
        patient_view = explanation_builder.build_patient_view(reasoning)
        referral_view = explanation_builder.build_referral_note(reasoning)

        self.assertIn("summary", worker_view)
        self.assertEqual(worker_view["risk_level"], "HIGH")
        self.assertIn("explanation", patient_view)
        self.assertIn("reason_for_referral", referral_view)


if __name__ == "__main__":
    unittest.main()
