"""Custom Exception Hierarchy for MediGem."""

from typing import Any, Optional


class ApplicationError(Exception):
    """Base exception class for all MediGem domain and backend errors."""

    def __init__(self, message: str, details: Optional[Any] = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details

    def __str__(self) -> str:
        if self.details:
            return f"{self.message} | Details: {self.details}"
        return self.message


class ConfigurationError(ApplicationError):
    """Raised when application or environment configuration is invalid."""
    pass


class AppValidationError(ApplicationError):
    """Raised when data input or schema validation fails."""
    pass


class InferenceError(ApplicationError):
    """Raised during model execution or local offline LLM inference failure."""
    pass


class ImageProcessingError(ApplicationError):
    """Raised when medical image reading, conversion, or processing fails."""
    pass


class EmergencyRuleError(ApplicationError):
    """Raised when triage or emergency rule evaluation fails."""
    pass


__all__ = [
    "ApplicationError",
    "ConfigurationError",
    "AppValidationError",
    "InferenceError",
    "ImageProcessingError",
    "EmergencyRuleError",
]
