"""Wound visual inspection and infection risk strategy."""

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.pipeline.strategies.base_strategy import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest


class WoundAnalysisStrategy(BaseAnalysisStrategy):
    """Strategy for wound visual inspection and infection assessment."""

    @property
    def modality(self) -> MedicalModality:
        return MedicalModality.WOUND

    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        patient = request.patient
        patient_id = patient.patient_id if patient else "UNKNOWN"
        notes = request.notes or ""

        return (
            f"Analyze the attached wound image for Patient ID: {patient_id}.\n"
            f"Notes: {notes}\n"
            f"Tasks:\n"
            f"1. Evaluate wound visual characteristics (erythema, exudate, tissue necrosis, swelling).\n"
            f"2. Assess infection risk and tissue healing stage.\n"
            f"3. Recommend wound care guidelines and referral necessity."
        )
