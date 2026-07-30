"""Medical Context Builder assembling structured ClinicalContext objects."""

from typing import TYPE_CHECKING, Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.schemas.analysis import AnalysisRequest

if TYPE_CHECKING:
    from backend.input.models import ProcessedMedicalInput


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
    extracted_text: Optional[str] = Field(default=None, description="Extracted text from OCR or PDF layer.")
    modality: MedicalModality = Field(default=MedicalModality.GENERAL, description="Clinical modality.")
    emergency_status: bool = Field(default=False, description="Emergency gate detection status.")
    clinical_notes: str = Field(default="", description="Worker notes.")


class MedicalContextBuilder:
    """Builder class transforming AnalysisRequest, AnalysisContext, and ProcessedMedicalInput into a unified ClinicalContext."""

    @staticmethod
    def build_context(
        request: AnalysisRequest,
        context: Optional[AnalysisContext] = None,
        processed_input: Optional[Any] = None,
    ) -> ClinicalContext:
        """Assemble structured ClinicalContext from incoming request, context, and processed medical input."""
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
        doc_meta = {}
        extracted_text = None

        if processed_input:
            if hasattr(processed_input, "image_metadata") and processed_input.image_metadata:
                img_meta = processed_input.image_metadata.model_dump()
            if hasattr(processed_input, "document_metadata") and processed_input.document_metadata:
                doc_meta = processed_input.document_metadata.model_dump()
            if hasattr(processed_input, "extracted_content") and processed_input.extracted_content and processed_input.extracted_content.has_text:
                extracted_text = processed_input.extracted_content.text
        elif request.image:
            img_meta = {
                "file_path": request.image.file_path,
                "image_type": str(request.image.image_type),
                "resolution": request.image.resolution,
            }

        notes = request.notes or ""
        if extracted_text:
            notes = f"{notes}\nExtracted Content: {extracted_text}".strip()

        return ClinicalContext(
            request_id=tx_id,
            patient_id=patient_id,
            age=age,
            gender=gender,
            symptoms=symptoms,
            vital_signs=vitals,
            medical_history=[],
            image_metadata=img_meta,
            document_metadata=doc_meta,
            extracted_text=extracted_text,
            modality=modality,
            emergency_status=emergency_status,
            clinical_notes=notes,
        )


# Global Singleton MedicalContextBuilder Instance
context_builder = MedicalContextBuilder()
