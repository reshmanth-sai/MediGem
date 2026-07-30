"""Medical Context Builder assembling structured ClinicalContext objects."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.schemas.analysis import AnalysisRequest


class ClinicalContext(BaseModel):
    """Structured context object aggregating patient demographics, symptoms, vitals, metadata, and modality."""

    request_id: str = Field(..., description="Transaction request identifier.")
    patient_id: str = Field(default="UNKNOWN", description="Patient record identifier.")
    age: int = Field(default=0, description="Patient age.")
    gender: str = Field(default="UNKNOWN", description="Patient gender.")
    symptoms: List[str] = Field(default_factory=list, description="List of presenting symptoms.")
    vital_signs: Dict[str, Any] = Field(default_factory=dict, description="Dictionary of vital signs.")
    medical_history: List[str] = Field(default_factory=list, description="Known medical history notes.")
    image_metadata: Dict[str, Any] = Field(default_factory=dict, description="Image metadata dictionary.")
    document_metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata dictionary.")
    modality: MedicalModality = Field(default=MedicalModality.GENERAL, description="Clinical modality.")
    emergency_status: bool = Field(default=False, description="Emergency gate detection status.")
    clinical_notes: str = Field(default="", description="Worker notes.")


class MedicalContextBuilder:
    """Builder class transforming AnalysisRequest and AnalysisContext into a unified ClinicalContext."""

    @staticmethod
    def build_context(
        request: AnalysisRequest,
        context: Optional[AnalysisContext] = None,
    ) -> ClinicalContext:
        """Assemble structured ClinicalContext from incoming request and context."""
        tx_id = request.request_id
        patient = request.patient

        patient_id = patient.patient_id if patient else "UNKNOWN"
        age = patient.age if patient else 0
        gender = patient.gender if patient else "UNKNOWN"
        symptoms = patient.symptoms if patient else []
        vitals = patient.vital_signs if patient else {}

        modality = context.modality if context else MedicalModality.GENERAL
        emergency_status = not (context.safe_for_ai_processing if context else True)

        img_meta = {}
        if request.image:
            img_meta = {
                "file_path": request.image.file_path,
                "image_type": str(request.image.image_type),
                "resolution": request.image.resolution,
            }

        return ClinicalContext(
            request_id=tx_id,
            patient_id=patient_id,
            age=age,
            gender=gender,
            symptoms=symptoms,
            vital_signs=vitals,
            medical_history=[],
            image_metadata=img_meta,
            document_metadata={},
            modality=modality,
            emergency_status=emergency_status,
            clinical_notes=request.notes or "",
        )


# Global Singleton MedicalContextBuilder Instance
context_builder = MedicalContextBuilder()
