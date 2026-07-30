"""ECG wave image analysis strategy."""

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.pipeline.strategies.base_strategy import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest


class EcgAnalysisStrategy(BaseAnalysisStrategy):
    """Strategy for 12-lead and single-lead ECG wave image interpretation."""

    @property
    def modality(self) -> MedicalModality:
        return MedicalModality.ECG

    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        patient = request.patient
        patient_id = patient.patient_id if patient else "UNKNOWN"
        symptoms = patient.symptoms if patient else []

        return (
            f"Analyze the attached ECG wave image for Patient ID: {patient_id}.\n"
            f"Patient Symptoms: {symptoms}\n"
            f"Tasks:\n"
            f"1. Inspect ECG waveform pattern (ST segment, QRS complex, PR interval, T wave).\n"
            f"2. Identify potential acute ischemic or arrhythmic abnormalities.\n"
            f"3. Assign risk level (LOW, MODERATE, HIGH, EMERGENCY) and recommended triage action."
        )
