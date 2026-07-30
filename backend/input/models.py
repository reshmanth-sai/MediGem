"""Pydantic v2 models for input types, quality assessments, extracted content, and ProcessedMedicalInput."""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.config.constants import MedicalModality


class InputType(str, Enum):
    """Supported input data formats."""
    IMAGE = "IMAGE"
    PDF = "PDF"
    TEXT = "TEXT"


class QualityLevel(str, Enum):
    """Qualitative image/document quality levels."""
    POOR = "POOR"
    FAIR = "FAIR"
    GOOD = "GOOD"
    EXCELLENT = "EXCELLENT"


class ContentSource(str, Enum):
    """Origin source of extracted clinical text."""
    TEXT_LAYER = "TEXT_LAYER"
    OCR_IMAGE = "OCR_IMAGE"
    MANUAL_TEXT = "MANUAL_TEXT"


class ProcessingStage(str, Enum):
    """Lifecycle stage tracking during input processing."""
    LOAD = "LOAD"
    METADATA = "METADATA"
    CONTENT_EXTRACTION = "CONTENT_EXTRACTION"
    QUALITY_ASSESSMENT = "QUALITY_ASSESSMENT"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ExtractedContent(BaseModel):
    """Structured text content extracted from document or image."""
    text: str = Field(default="", description="Extracted text string.")
    source: ContentSource = Field(..., description="Origin of extracted text.")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Extraction confidence score.")
    language: str = Field(default="eng", description="Language ISO code.")
    has_text: bool = Field(default=False, description="Flag indicating if non-empty text was extracted.")


class ImageMetadata(BaseModel):
    """Technical metadata for image inputs."""
    width: int = Field(..., description="Image width in pixels.")
    height: int = Field(..., description="Image height in pixels.")
    channels: int = Field(default=3, description="Color channels count.")
    resolution_dpi: Optional[int] = Field(default=None, description="Image DPI resolution if available.")
    file_size_bytes: int = Field(..., description="File size in bytes.")
    mime_type: str = Field(default="image/png", description="Image MIME type.")


class DocumentMetadata(BaseModel):
    """Technical metadata for PDF document inputs."""
    page_count: int = Field(default=1, description="Total document pages.")
    format: str = Field(default="PDF", description="Document format string.")
    file_size_bytes: int = Field(..., description="File size in bytes.")
    has_text_layer: bool = Field(default=False, description="Flag indicating searchable text layer presence.")
    has_images: bool = Field(default=False, description="Flag indicating embedded images presence.")


class QualityAssessment(BaseModel):
    """Empirical computer vision quality evaluation."""
    blur_score: float = Field(..., description="OpenCV Laplacian variance score.")
    is_blurry: bool = Field(..., description="Flag indicating blur detection threshold (<100).")
    brightness_score: float = Field(..., description="Mean pixel brightness (0-255).")
    contrast_score: float = Field(..., description="Pixel standard deviation.")
    resolution_score: float = Field(..., description="Normalized megapixel resolution score.")
    quality_level: QualityLevel = Field(default=QualityLevel.GOOD, description="Qualitative quality level.")
    warnings: List[str] = Field(default_factory=list, description="List of quality warnings.")


class ProcessingSummary(BaseModel):
    """Diagnostic processing summary attached to ProcessedMedicalInput."""
    input_type: InputType = Field(..., description="Input data format type.")
    modality: MedicalModality = Field(..., description="Target medical modality.")
    quality_level: QualityLevel = Field(default=QualityLevel.GOOD, description="Quality level.")
    content_available: bool = Field(default=False, description="Flag indicating text/image content presence.")
    ocr_performed: bool = Field(default=False, description="Flag indicating whether OCR engine was executed.")
    warnings: List[str] = Field(default_factory=list, description="List of processing warnings.")
    processing_time_ms: float = Field(default=0.0, description="Total input processing latency in ms.")


class ProcessedMedicalInput(BaseModel):
    """Immutable read-only container holding normalized medical input for downstream reasoning."""

    model_config = ConfigDict(frozen=True)

    request_id: str = Field(..., description="Transaction request identifier.")
    input_type: InputType = Field(..., description="Input format type.")
    modality: MedicalModality = Field(..., description="Target medical modality.")
    file_path: Optional[str] = Field(default=None, description="Absolute file path if file-based input.")
    raw_text_input: Optional[str] = Field(default=None, description="Original plain text input if provided.")
    extracted_content: Optional[ExtractedContent] = Field(default=None, description="Extracted text content with provenance.")
    image_metadata: Optional[ImageMetadata] = Field(default=None, description="Image technical metadata.")
    document_metadata: Optional[DocumentMetadata] = Field(default=None, description="PDF technical metadata.")
    quality: Optional[QualityAssessment] = Field(default=None, description="Quality assessment evaluation.")
    summary: ProcessingSummary = Field(..., description="Attached processing summary.")
