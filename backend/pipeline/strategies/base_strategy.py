"""Base analysis strategy interface for medical content modalities."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from backend.ai.prompts import prompt_builder
from backend.pipeline.context import AnalysisContext, MedicalModality
from backend.schemas.analysis import AnalysisRequest


class BaseAnalysisStrategy(ABC):
    """Abstract base class defining analysis strategy interface for specific medical modalities."""

    @property
    @abstractmethod
    def modality(self) -> MedicalModality:
        """Target medical modality supported by this strategy."""
        pass

    @property
    def name(self) -> str:
        """Strategy class name identifier."""
        return self.__class__.__name__

    def get_system_prompt(self) -> str:
        """Return system prompt for this analysis strategy."""
        return prompt_builder.build_system_prompt()

    @abstractmethod
    def build_prompt(self, request: AnalysisRequest, context: AnalysisContext) -> str:
        """Construct prompt payload for AI model inference."""
        pass

    def prepare_images(self, request: AnalysisRequest) -> list:
        """Extract and prepare image file paths for multimodal processing."""
        if request.image and request.image.file_path:
            return [request.image.file_path]
        return []
