"""General clinical assessment analysis strategy."""

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.pipeline.strategies.base_strategy import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest


class GeneralAssessmentStrategy(BaseAnalysisStrategy):
    """Strategy for general symptom assessment and vital signs evaluation."""

    @property
    def modality(self) -> MedicalModality:
        return MedicalModality.GENERAL

    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        patient = request.patient
        patient_id = patient.patient_id if patient else "UNKNOWN"
        age = patient.age if patient else 0
        gender = patient.gender if patient else "UNKNOWN"
        symptoms = patient.symptoms if patient else []
        vitals = patient.vital_signs if patient else {}
        notes = request.notes or ""

        return (
            f"Perform a general clinical assessment for Patient ID: {patient_id}.\n"
            f"Demographics: Age {age}, Gender: {gender}.\n"
            f"Symptoms: {symptoms}\n"
            f"Vital Signs: {vitals}\n"
            f"Clinical Notes: {notes}\n"
            f"Tasks:\n"
            f"1. Evaluate clinical risk level (LOW, MODERATE, HIGH, EMERGENCY).\n"
            f"2. Identify key risk flags.\n"
            f"3. Provide actionable triage recommendations."
        )
