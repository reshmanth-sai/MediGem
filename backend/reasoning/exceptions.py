"""Custom exceptions for Prompt Engineering & Medical Reasoning Framework."""

from backend.exceptions import ApplicationError


class ReasoningError(ApplicationError):
    """Base exception for all prompt engineering and reasoning errors."""
    pass


class PromptCompositionError(ReasoningError):
    """Raised when prompt assembly or template rendering fails."""
    pass


class OutputValidationError(ReasoningError):
    """Raised when AI reasoning output fails JSON schema validation."""
    pass


class MedicalSafetyViolationError(ReasoningError):
    """Raised when AI reasoning output violates safety policy or contains prohibited claims."""
    pass


__all__ = [
    "ReasoningError",
    "PromptCompositionError",
    "OutputValidationError",
    "MedicalSafetyViolationError",
]
