"""Lab report and medical document analysis strategy."""

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.pipeline.strategies.base_strategy import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest


class ReportAnalysisStrategy(BaseAnalysisStrategy):
    """Strategy for lab reports, blood panels, and clinical document analysis."""

    @property
    def modality(self) -> MedicalModality:
        return MedicalModality.LAB_REPORT

    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        patient = request.patient
        patient_id = patient.patient_id if patient else "UNKNOWN"
        notes = request.notes or ""

        return (
            f"Analyze the attached medical lab report for Patient ID: {patient_id}.\n"
            f"Notes: {notes}\n"
            f"Tasks:\n"
            f"1. Extract abnormal lab values, critical biomarkers, and out-of-range indicators.\n"
            f"2. Summarize key diagnostic implications for the healthcare worker.\n"
            f"3. Assign risk level (LOW, MODERATE, HIGH, EMERGENCY) and recommended next steps."
        )
