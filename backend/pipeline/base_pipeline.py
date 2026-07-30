"""Abstract base pipeline interface for multimodal healthcare analysis workflows."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from backend.schemas.analysis import AnalysisRequest, AnalysisResponse


class BasePipeline(ABC):
    """Abstract base class for all MediGem analysis workflows (ECG, Reports, Prescriptions, Wounds)."""

    def __init__(self, name: str = "BasePipeline") -> None:
        self.name = name

    @abstractmethod
    def preprocess(self, request: AnalysisRequest) -> Dict[str, Any]:
        """Stage 1: Preprocess raw input data and extract image or text features."""
        pass

    @abstractmethod
    def process(self, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Stage 2: Core processing workflow execution."""
        pass

    @abstractmethod
    def postprocess(self, process_output: Dict[str, Any], request: AnalysisRequest) -> AnalysisResponse:
        """Stage 3: Format output into structured AnalysisResponse."""
        pass

    def run(self, request: AnalysisRequest) -> AnalysisResponse:
        """Template method orchestrating standard pipeline execution phases."""
        preprocessed = self.preprocess(request)
        processed = self.process(preprocessed)
        response = self.postprocess(processed, request)
        return response
