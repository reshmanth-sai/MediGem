"""Abstract base class interface for AI providers in MediGem."""

from abc import ABC, abstractmethod

from backend.ai.models import (
    InferenceRequest,
    InferenceResponse,
    ModelInfo,
    ProviderStatus,
)


class BaseAIProvider(ABC):
    """Abstract Base Class defining standard provider interface for AI models."""

    @abstractmethod
    def initialize(self) -> None:
        """Initialize provider connections, model readiness, or hardware buffers."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if provider and configured model are online and ready for inference."""
        pass

    @abstractmethod
    def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Execute AI inference for the given request and return structured response."""
        pass

    @abstractmethod
    def health_check(self) -> ProviderStatus:
        """Perform comprehensive health check returning provider status diagnostics."""
        pass

    @abstractmethod
    def get_model_info(self) -> ModelInfo:
        """Retrieve model metadata, capabilities, and backend engine details."""
        pass

    @abstractmethod
    def shutdown(self) -> None:
        """Gracefully release provider resources."""
        pass


__all__ = ["BaseAIProvider"]
