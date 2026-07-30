"""Prescription document and medication verification strategy."""

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.pipeline.strategies.base_strategy import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest


class PrescriptionAnalysisStrategy(BaseAnalysisStrategy):
    """Strategy for prescription scan analysis and medication verification."""

    @property
    def modality(self) -> MedicalModality:
        return MedicalModality.PRESCRIPTION

    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        patient = request.patient
        patient_id = patient.patient_id if patient else "UNKNOWN"

        return (
            f"Analyze the attached prescription document for Patient ID: {patient_id}.\n"
            f"Tasks:\n"
            f"1. Transcribe prescribed medications, dosages, frequency, and administration routes.\n"
            f"2. Check for potential drug interactions or contraindications.\n"
            f"3. Output clear medication verification guidelines."
        )
