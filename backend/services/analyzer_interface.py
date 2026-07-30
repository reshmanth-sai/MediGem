"""Abstract base analyzer interface for domain clinical workflows."""

from abc import ABC, abstractmethod
from typing import Any, Dict

from backend.schemas import AnalysisRequest, AnalysisResponse


class BaseMedicalAnalyzer(ABC):
    """Abstract interface for domain clinical analyzers (ECG, Reports, Prescriptions, Wounds)."""

    @abstractmethod
    def build_prompt(self, request: AnalysisRequest) -> str:
        """Construct domain-specific prompt string for the analyzer."""
        pass

    @abstractmethod
    def validate(self, request: AnalysisRequest) -> bool:
        """Validate incoming analysis request payload."""
        pass

    @abstractmethod
    def analyze(self, request: AnalysisRequest) -> AnalysisResponse:
        """Execute domain clinical analysis workflow and return structured response."""
        pass
