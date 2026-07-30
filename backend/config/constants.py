"""Constants definition for MediGem backend architecture."""

from enum import Enum
from typing import Set


class RiskLevel(str, Enum):
    """Clinical risk levels for triage and assessment."""
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    EMERGENCY = "EMERGENCY"


class ImageType(str, Enum):
    """Supported medical image modality types."""
    ECG = "ECG"
    REPORT = "REPORT"
    PRESCRIPTION = "PRESCRIPTION"
    WOUND = "WOUND"


class MedicalModality(str, Enum):
    """Supported clinical content modalities."""
    GENERAL = "GENERAL"
    ECG = "ECG"
    LAB_REPORT = "LAB_REPORT"
    PRESCRIPTION = "PRESCRIPTION"
    WOUND = "WOUND"


# Allowed File Extensions
ALLOWED_IMAGE_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tiff"}
ALLOWED_DOCUMENT_EXTENSIONS: Set[str] = {".pdf", ".png", ".jpg", ".jpeg", ".txt"}
ALLOWED_FILE_EXTENSIONS: Set[str] = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS

# File Limits
MAX_UPLOAD_SIZE_MB: int = 10
MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024

# System Defaults
DEFAULT_APP_NAME: str = "MediGem"
DEFAULT_MODEL_NAME: str = "gemma3:4b"
DEFAULT_OLLAMA_HOST: str = "http://localhost:11434"
DEFAULT_PORT: int = 7860
