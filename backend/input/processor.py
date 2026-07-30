"""Pluggable Input Processors for Image, PDF, and Plain Text modalities."""

from abc import ABC, abstractmethod
from typing import Optional

from backend.config.constants import MedicalModality
from backend.input.extractors import content_extractor
from backend.input.metadata import metadata_extractor
from backend.input.models import (
    InputType,
    ProcessedMedicalInput,
    ProcessingSummary,
    QualityLevel,
)
from backend.input.quality import quality_engine
from backend.utils import get_current_epoch_ms


class BaseInputProcessor(ABC):
    """Abstract base class for pluggable input processors."""

    @abstractmethod
    def process_input(
        self,
        request_id: str,
        modality: MedicalModality,
        file_path: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> ProcessedMedicalInput:
        """Process raw input into an immutable ProcessedMedicalInput container."""
        pass


class ImageProcessor(BaseInputProcessor):
    """Processor for Image inputs (ECG, Wound, Lab Report, Prescription images)."""

    def process_input(
        self,
        request_id: str,
        modality: MedicalModality,
        file_path: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> ProcessedMedicalInput:
        start_time = get_current_epoch_ms()

        img_meta = metadata_extractor.extract_image_metadata(file_path) if file_path else None
        quality = quality_engine.evaluate_image_quality(file_path) if file_path else None

        extracted_content, ocr_performed = content_extractor.extract_content(
            input_type=InputType.IMAGE,
            modality=modality,
            file_path=file_path,
        )

        processing_time = round(get_current_epoch_ms() - start_time, 2)
        q_level = quality.quality_level if quality else QualityLevel.GOOD
        warnings = quality.warnings if quality else []

        summary = ProcessingSummary(
            input_type=InputType.IMAGE,
            modality=modality,
            quality_level=q_level,
            content_available=file_path is not None,
            ocr_performed=ocr_performed,
            warnings=warnings,
            processing_time_ms=processing_time,
        )

        return ProcessedMedicalInput(
            request_id=request_id,
            input_type=InputType.IMAGE,
            modality=modality,
            file_path=file_path,
            raw_text_input=None,
            extracted_content=extracted_content,
            image_metadata=img_meta,
            document_metadata=None,
            quality=quality,
            summary=summary,
        )


class PdfProcessor(BaseInputProcessor):
    """Processor for PDF document inputs."""

    def process_input(
        self,
        request_id: str,
        modality: MedicalModality,
        file_path: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> ProcessedMedicalInput:
        start_time = get_current_epoch_ms()

        doc_meta = metadata_extractor.extract_pdf_metadata(file_path) if file_path else None

        extracted_content, ocr_performed = content_extractor.extract_content(
            input_type=InputType.PDF,
            modality=modality,
            file_path=file_path,
        )

        processing_time = round(get_current_epoch_ms() - start_time, 2)

        summary = ProcessingSummary(
            input_type=InputType.PDF,
            modality=modality,
            quality_level=QualityLevel.GOOD,
            content_available=extracted_content is not None and extracted_content.has_text,
            ocr_performed=ocr_performed,
            warnings=[],
            processing_time_ms=processing_time,
        )

        return ProcessedMedicalInput(
            request_id=request_id,
            input_type=InputType.PDF,
            modality=modality,
            file_path=file_path,
            raw_text_input=None,
            extracted_content=extracted_content,
            image_metadata=None,
            document_metadata=doc_meta,
            quality=None,
            summary=summary,
        )


class TextProcessor(BaseInputProcessor):
    """Processor for plain text symptom inputs."""

    def process_input(
        self,
        request_id: str,
        modality: MedicalModality,
        file_path: Optional[str] = None,
        raw_text: Optional[str] = None,
    ) -> ProcessedMedicalInput:
        start_time = get_current_epoch_ms()

        extracted_content, ocr_performed = content_extractor.extract_content(
            input_type=InputType.TEXT,
            modality=modality,
            raw_text_input=raw_text,
        )

        processing_time = round(get_current_epoch_ms() - start_time, 2)

        summary = ProcessingSummary(
            input_type=InputType.TEXT,
            modality=modality,
            quality_level=QualityLevel.EXCELLENT,
            content_available=raw_text is not None and len(raw_text.strip()) > 0,
            ocr_performed=False,
            warnings=[],
            processing_time_ms=processing_time,
        )

        return ProcessedMedicalInput(
            request_id=request_id,
            input_type=InputType.TEXT,
            modality=modality,
            file_path=None,
            raw_text_input=raw_text,
            extracted_content=extracted_content,
            image_metadata=None,
            document_metadata=None,
            quality=None,
            summary=summary,
        )
