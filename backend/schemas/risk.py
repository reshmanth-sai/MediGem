"""Risk assessment representation schema."""

from typing import List
from pydantic import BaseModel, ConfigDict, Field

from backend.config.constants import RiskLevel


class RiskAssessment(BaseModel):
    """Schema representing structured triage risk evaluation and clinical urgency."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "risk_level": "EMERGENCY",
                "urgency_score": 9.5,
                "risk_flags": ["ST-segment elevation detected", "Severe chest pain", "Hypoxia"],
                "rationale": "High-risk ECG findings consistent with acute myocardial infarction requiring immediate escalation.",
                "recommended_action": "Immediate transfer to tertiary medical center with ICU capability.",
            }
        }
    )

    risk_level: RiskLevel = Field(
        ...,
        description="Categorical risk level (LOW, MODERATE, HIGH, EMERGENCY).",
        examples=[RiskLevel.EMERGENCY],
    )
    urgency_score: float = Field(
        ...,
        ge=0.0,
        le=10.0,
        description="Numerical urgency score from 0.0 (routine) to 10.0 (life-threatening emergency).",
        examples=[9.5],
    )
    risk_flags: List[str] = Field(
        default_factory=list,
        description="List of clinical warning flags or critical findings identified.",
        examples=[["ST-elevation", "Hypoxia"]],
    )
    rationale: str = Field(
        ...,
        description="Clinical rationale explaining the risk assessment.",
        examples=["Key findings indicate severe acute cardiac event."],
    )
    recommended_action: str = Field(
        ...,
        description="Actionable next step for the healthcare worker.",
        examples=["Initiate emergency transfer protocol immediately."],
    )
