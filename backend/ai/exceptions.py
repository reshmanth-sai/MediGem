"""Custom exception definitions for AI Inference Layer."""

from backend.exceptions import ApplicationError


class AIProviderError(ApplicationError):
    """Base exception class for all AI provider and inference failures."""
    pass


class ModelUnavailableError(AIProviderError):
    """Raised when the requested AI model is not installed or available on Ollama server."""
    pass


class InferenceTimeoutError(AIProviderError):
    """Raised when an AI inference request exceeds the configured execution timeout."""
    pass


class ResponseParsingError(AIProviderError):
    """Raised when AI output fails JSON extraction or schema validation."""
    pass


class AIConnectionError(AIProviderError):
    """Raised when connection to local Ollama server fails."""
    pass


__all__ = [
    "AIProviderError",
    "ModelUnavailableError",
    "InferenceTimeoutError",
    "ResponseParsingError",
    "AIConnectionError",
]
