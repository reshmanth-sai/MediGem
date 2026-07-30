"""Custom exception definitions for Input Processing Framework."""

from backend.exceptions import ApplicationError


class InputProcessingError(ApplicationError):
    """Base exception class for all input processing failures."""
    pass


class UnsupportedInputTypeError(InputProcessingError):
    """Raised when an unsupported input type or MIME type is encountered."""
    pass


class OCRError(InputProcessingError):
    """Raised when text extraction or OCR engine fails."""
    pass


class DocumentParsingError(InputProcessingError):
    """Raised when PDF or document metadata parsing fails."""
    pass


__all__ = [
    "InputProcessingError",
    "UnsupportedInputTypeError",
    "OCRError",
    "DocumentParsingError",
]
