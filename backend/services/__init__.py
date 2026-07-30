"""Service and analyzer abstract base class interfaces for MediGem backend."""

from abc import ABC, abstractmethod
from typing import Any, Dict

from backend.services.analyzer_interface import BaseMedicalAnalyzer


class BaseService(ABC):
    """Abstract base class for stateful backend services."""

    @abstractmethod
    def initialize(self) -> None:
        """Initialize service resources, models, or network connections."""
        pass

    @abstractmethod
    def shutdown(self) -> None:
        """Gracefully release service resources."""
        pass


class BaseAnalyzer(ABC):
    """Abstract base class for domain clinical analyzers."""

    @abstractmethod
    def analyze(self, input_data: Any) -> Any:
        """Perform domain clinical analysis on input data and return structured output."""
        pass


class BaseValidator(ABC):
    """Abstract base class for domain input and schema validators."""

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Validate input payload, returning True if valid or raising AppValidationError."""
        pass


__all__ = ["BaseService", "BaseAnalyzer", "BaseValidator", "BaseMedicalAnalyzer"]
