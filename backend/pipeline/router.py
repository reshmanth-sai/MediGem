"""Analysis router resolving modality-specific analysis strategies."""

from typing import Dict, List, Optional, Union
from backend.config.constants import MedicalModality
from backend.exceptions import AppValidationError
from backend.logging import logger
from backend.pipeline.strategies import (
    BaseAnalysisStrategy,
    EcgAnalysisStrategy,
    GeneralAssessmentStrategy,
    PrescriptionAnalysisStrategy,
    ReportAnalysisStrategy,
    WoundAnalysisStrategy,
)


class AnalysisRouter:
    """Registry and router resolving analysis strategies by MedicalModality."""

    def __init__(self) -> None:
        self._strategies: Dict[MedicalModality, BaseAnalysisStrategy] = {}
        self._register_default_strategies()

    def _register_default_strategies(self) -> None:
        """Register default strategies for all supported clinical modalities."""
        self.register_strategy(GeneralAssessmentStrategy())
        self.register_strategy(EcgAnalysisStrategy())
        self.register_strategy(ReportAnalysisStrategy())
        self.register_strategy(PrescriptionAnalysisStrategy())
        self.register_strategy(WoundAnalysisStrategy())

    def register_strategy(self, strategy: BaseAnalysisStrategy) -> None:
        """Register or override an analysis strategy."""
        self._strategies[strategy.modality] = strategy
        logger.info(f"Registered AnalysisStrategy '{strategy.name}' for Modality '{strategy.modality.value}'.")

    def get_strategy(self, modality: Union[MedicalModality, str]) -> BaseAnalysisStrategy:
        """Resolve and return strategy for given MedicalModality or string."""
        if isinstance(modality, str):
            try:
                modality = MedicalModality(modality.upper())
            except ValueError:
                raise AppValidationError(f"No analysis strategy registered for modality: {modality}")

        if modality not in self._strategies:
            mod_str = modality.value if hasattr(modality, "value") else str(modality)
            raise AppValidationError(f"No analysis strategy registered for modality: {mod_str}")
        return self._strategies[modality]

    def list_modalities(self) -> List[str]:
        """List all supported modality strings."""
        return [m.value for m in self._strategies.keys()]


# Global Singleton AnalysisRouter Instance
analysis_router = AnalysisRouter()
