"""Reasoning Context data models, structured enrichment notes, and allowed AI capabilities."""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.input.models import ProcessedMedicalInput
from backend.reasoning.context_builder import ClinicalContext
from backend.reasoning.output_schema import ReasoningMetadata


class CompletenessLevel(str, Enum):
    """Information completeness evaluation level."""
    COMPLETE = "COMPLETE"
    PARTIAL = "PARTIAL"
    MINIMAL = "MINIMAL"


class EnrichmentNote(BaseModel):
    """Structured context enrichment note highlighting data quality or missing information."""
    type: str = Field(..., description="Enrichment category (e.g. 'QUALITY', 'OCR', 'COMPLETENESS').")
    severity: str = Field(default="INFO", description="Severity level ('INFO' or 'WARNING').")
    message: str = Field(..., description="Actionable descriptive message.")
    source: str = Field(..., description="Origin source component.")


class AllowedCapabilities(BaseModel):
    """Explicit declaration of allowed and disallowed AI capabilities for Gemma guidance."""
    allowed: List[str] = Field(
        default_factory=lambda: [
            "Summarize clinical observations",
            "Highlight warning signs and red flags",
            "Explain lab/ECG/wound findings",
            "Recommend triage and facility referral necessity",
            "Generate plain-language patient explanations",
        ],
        description="List of allowed AI reasoning tasks.",
    )
    disallowed: List[str] = Field(
        default_factory=lambda: [
            "Formulate definitive medical diagnoses",
            "Prescribe pharmaceutical medications",
            "Recommend specific drug dosages",
            "Override Emergency Safety Engine decisions",
        ],
        description="List of prohibited AI tasks.",
    )


class ReasoningContext(BaseModel):
    """Immutable read-only container holding fused clinical, processed input, and enrichment context for Gemma."""

    model_config = ConfigDict(frozen=True)

    clinical_context: ClinicalContext = Field(..., description="Primary clinical presentation context.")
    processed_input: Optional[ProcessedMedicalInput] = Field(default=None, description="Processed medical input container if available.")
    enrichments: List[EnrichmentNote] = Field(default_factory=list, description="Structured enrichment notes.")
    completeness: CompletenessLevel = Field(default=CompletenessLevel.PARTIAL, description="Information completeness evaluation.")
    capabilities: AllowedCapabilities = Field(default_factory=AllowedCapabilities, description="Allowed/disallowed AI capabilities.")
    metadata: ReasoningMetadata = Field(default_factory=ReasoningMetadata, description="Reasoning metadata.")
