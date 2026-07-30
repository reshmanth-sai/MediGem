"""Context Enhancers generating structured EnrichmentNotes and calculating CompletenessLevel."""

from typing import List, Optional, Tuple
from backend.input.models import ContentSource, ProcessedMedicalInput, QualityLevel
from backend.reasoning.context_builder import ClinicalContext
from backend.reasoning.reasoning_context import CompletenessLevel, EnrichmentNote


class ContextEnhancer:
    """Enhancer generating structured quality, OCR confidence, and completeness notes for context fusion."""

    def enhance_context(
        self,
        clinical_context: ClinicalContext,
        processed_input: Optional[ProcessedMedicalInput] = None,
    ) -> Tuple[List[EnrichmentNote], CompletenessLevel]:
        """Evaluate input quality, OCR provenance, and clinical completeness."""
        notes: List[EnrichmentNote] = []

        # 1. Quality & Image Assessment Notes
        if processed_input and processed_input.quality:
            q = processed_input.quality
            if q.is_blurry:
                notes.append(
                    EnrichmentNote(
                        type="QUALITY",
                        severity="WARNING",
                        message=f"Image blur detected (Laplacian score: {q.blur_score}). Visual resolution may be degraded.",
                        source="QualityAssessmentEngine",
                    )
                )

            for warn in q.warnings:
                notes.append(
                    EnrichmentNote(
                        type="QUALITY",
                        severity="WARNING",
                        message=warn,
                        source="QualityAssessmentEngine",
                    )
                )

        # 2. OCR & Text Provenance Notes
        if processed_input and processed_input.extracted_content:
            c = processed_input.extracted_content
            if c.source == ContentSource.OCR_IMAGE:
                notes.append(
                    EnrichmentNote(
                        type="OCR",
                        severity="INFO" if c.confidence >= 0.7 else "WARNING",
                        message=f"Text extracted via Tesseract OCR (Confidence: {c.confidence * 100:.0f}%).",
                        source="OCRService",
                    )
                )
            elif c.source == ContentSource.TEXT_LAYER:
                notes.append(
                    EnrichmentNote(
                        type="OCR",
                        severity="INFO",
                        message="Direct text layer extraction from PDF document (100% confidence).",
                        source="ContentExtractor",
                    )
                )

        # 3. Patient Demographics & Vitals Completeness Assessment
        has_age = clinical_context.age > 0
        has_gender = clinical_context.gender != "UNKNOWN"
        has_symptoms = len(clinical_context.symptoms) > 0
        has_vitals = len(clinical_context.vital_signs) > 0
        has_media = processed_input is not None

        if not has_vitals:
            notes.append(
                EnrichmentNote(
                    type="COMPLETENESS",
                    severity="WARNING",
                    message="Patient vital signs not provided in request.",
                    source="ContextEnhancer",
                )
            )

        if not has_symptoms and not has_media:
            notes.append(
                EnrichmentNote(
                    type="COMPLETENESS",
                    severity="WARNING",
                    message="Neither clinical symptoms nor media files provided.",
                    source="ContextEnhancer",
                )
            )

        # Compute CompletenessLevel
        if has_age and has_gender and has_symptoms and (has_vitals or has_media):
            completeness = CompletenessLevel.COMPLETE
        elif has_symptoms or has_media:
            completeness = CompletenessLevel.PARTIAL
        else:
            completeness = CompletenessLevel.MINIMAL

        return notes, completeness


# Global Singleton ContextEnhancer Instance
context_enhancer = ContextEnhancer()
