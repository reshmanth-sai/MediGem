"""Pydantic v2 schemas defining the unified ClinicalReasoningOutput contract for Gemma."""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.config.constants import RiskLevel
from backend.pipeline.context import MedicalModality
from backend.utils import get_current_utc_timestamp


class ConfidenceLevel(str, Enum):
    """Qualitative confidence levels for AI reasoning outputs."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class SupportingObservation(BaseModel):
    """Structured evidence linking clinical observations back to input sources."""
    source: str = Field(..., description="Source of observation (e.g. 'symptoms', 'vital_signs', 'ecg_image', 'lab_report').")
    observation: str = Field(..., description="Specific observation or clinical finding extracted from input.")


class ReasoningMetadata(BaseModel):
    """Metadata tracking prompt version and context."""
    reasoning_version: str = Field(default="1.0", description="Prompt framework version.")
    modality: MedicalModality = Field(default=MedicalModality.GENERAL, description="Target medical content modality.")
    timestamp: str = Field(default_factory=get_current_utc_timestamp, description="Timestamp of reasoning generation.")


class ReasoningAssessment(BaseModel):
    """Clinical assessment findings and risk categorization."""
    clinical_summary: str = Field(..., description="Objective clinical summary for healthcare workers.")
    risk_level: RiskLevel = Field(default=RiskLevel.LOW, description="Assigned risk categorization.")
    confidence_level: ConfidenceLevel = Field(default=ConfidenceLevel.MEDIUM, description="Qualitative confidence assessment.")
    red_flags: List[str] = Field(default_factory=list, description="List of warning signs or red flags.")


class ReasoningRecommendations(BaseModel):
    """Recommended actions and referral necessity."""
    recommended_next_step: str = Field(..., description="Immediate recommended clinical next step.")
    needs_referral: bool = Field(default=False, description="Flag indicating facility transfer recommendation.")
    requires_human_review: bool = Field(default=True, description="Flag requiring healthcare worker verification.")
    follow_up_notes: str = Field(default="", description="Follow-up instructions or monitoring notes.")


class ReasoningSafety(BaseModel):
    """Safety status and policy flags."""
    is_safe: bool = Field(default=True, description="Safety check validation result boolean.")
    safety_flags: List[str] = Field(default_factory=list, description="List of detected safety warnings or policy notes.")


class ClinicalReasoningOutput(BaseModel):
    """Unified JSON output contract expected from Gemma reasoning inference."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "metadata": {"reasoning_version": "1.0", "modality": "GENERAL"},
                "observations": [{"source": "symptoms", "observation": "Persistent fever and headache"}],
                "assessment": {
                    "clinical_summary": "Patient presents with mild febrile symptoms.",
                    "risk_level": "MODERATE",
                    "confidence_level": "HIGH",
                    "red_flags": ["High temperature"],
                },
                "recommendations": {
                    "recommended_next_step": "Provide oral hydration and monitor vitals every 4 hours.",
                    "needs_referral": False,
                    "requires_human_review": True,
                    "follow_up_notes": "Re-evaluate if fever exceeds 38.5C.",
                },
                "patient_summary": "You have a mild fever. Please drink plenty of fluids and rest.",
                "limitations": [
                    "Based strictly on reported symptoms.",
                    "Does not replace in-person physical examination.",
                ],
                "safety": {"is_safe": True, "safety_flags": []},
            }
        }
    )

    metadata: ReasoningMetadata = Field(default_factory=ReasoningMetadata, description="Reasoning metadata.")
    observations: List[SupportingObservation] = Field(default_factory=list, description="Supporting evidence observations.")
    assessment: ReasoningAssessment = Field(..., description="Clinical risk assessment.")
    recommendations: ReasoningRecommendations = Field(..., description="Recommended actions and referral flags.")
    patient_summary: str = Field(..., description="Empathetic, plain-language patient summary.")
    limitations: List[str] = Field(default_factory=list, description="Structured AI limitation disclaimers.")
    safety: ReasoningSafety = Field(default_factory=ReasoningSafety, description="Safety evaluation status.")
