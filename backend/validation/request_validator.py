"""Request validation module for clinical analysis payloads."""

from typing import Optional
from backend.exceptions import AppValidationError
from backend.logging import logger
from backend.pipeline.context import AnalysisContext, MedicalModality, WorkflowState
from backend.schemas.analysis import AnalysisRequest


class RequestValidator:
    """Validator for clinical analysis requests, required fields, and patient metadata."""

    @staticmethod
    def validate_request(
        request: AnalysisRequest,
        context: Optional[AnalysisContext] = None,
    ) -> MedicalModality:
        """Validate clinical request payload, verifying patient demographics, modality, and symptoms."""
        if context:
            context.update_state(WorkflowState.VALIDATING)

        if not request:
            raise AppValidationError("Analysis request cannot be None or empty.")

        if not request.request_id:
            raise AppValidationError("Analysis request must contain a valid request_id.")

        # 1. Validate Patient Input if present
        if request.patient:
            patient = request.patient
            if patient.age < 0 or patient.age > 120:
                raise AppValidationError(f"Invalid patient age: {patient.age}. Must be between 0 and 120.")
            if not patient.gender:
                raise AppValidationError("Patient gender field cannot be empty.")

        # 2. Determine and Validate Medical Modality
        modality = MedicalModality.GENERAL
        if request.image:
            img_type_str = str(request.image.image_type.value if hasattr(request.image.image_type, 'value') else request.image.image_type).upper()
            if img_type_str == "ECG":
                modality = MedicalModality.ECG
            elif img_type_str in ("REPORT", "LAB_REPORT"):
                modality = MedicalModality.LAB_REPORT
            elif img_type_str == "PRESCRIPTION":
                modality = MedicalModality.PRESCRIPTION
            elif img_type_str == "WOUND":
                modality = MedicalModality.WOUND
            else:
                try:
                    modality = MedicalModality(img_type_str)
                except ValueError as e:
                    raise AppValidationError(f"Unsupported image modality type: {img_type_str}") from e

        if context:
            context.modality = modality

        logger.info(f"[{request.request_id}] Request validated successfully. Inferred Modality: {modality.value}")
        return modality


# Global Singleton RequestValidator Instance
request_validator = RequestValidator()
