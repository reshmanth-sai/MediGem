"""Data models for Emergency Safety Engine rules and responses."""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.emergency.constants import EmergencyCategory, RecommendedAction, RulePriority


class EmergencyRule(BaseModel):
    """Pydantic v2 schema representing a deterministic emergency trigger rule."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "rule_id": "R-CARDIAC-01",
                "rule_name": "Acute Cardiac Event",
                "description": "Triggers on severe chest pain radiating to left arm or jaw with diaphoresis.",
                "symptoms_required": ["chest pain", "shortness of breath"],
                "min_match_count": 1,
                "priority": 4,
                "recommended_action": "CALL_AMBULANCE",
                "emergency_category": "CARDIAC",
                "enabled": True,
            }
        }
    )

    rule_id: str = Field(
        ...,
        description="Unique identifier code for the emergency rule.",
        examples=["R-CARDIAC-01"],
    )
    rule_name: str = Field(
        ...,
        description="Human-readable title of the rule.",
        examples=["Acute Cardiac Event"],
    )
    description: str = Field(
        ...,
        description="Detailed description of clinical trigger criteria.",
        examples=["Triggers on severe chest pain or shortness of breath."],
    )
    symptoms_required: List[str] = Field(
        ...,
        description="List of normalized clinical symptoms required to trigger the rule.",
        examples=[["chest pain", "shortness of breath"]],
    )
    min_match_count: int = Field(
        default=1,
        ge=1,
        description="Minimum number of required symptoms that must match to trigger.",
        examples=[1],
    )
    priority: RulePriority = Field(
        default=RulePriority.HIGH,
        description="Priority level of the rule (LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4).",
        examples=[RulePriority.CRITICAL],
    )
    recommended_action: str = Field(
        default=RecommendedAction.IMMEDIATE_REFERRAL.value,
        description="Recommended clinical action upon rule trigger.",
        examples=["CALL_AMBULANCE"],
    )
    emergency_category: EmergencyCategory = Field(
        default=EmergencyCategory.GENERAL_EMERGENCY,
        description="Clinical emergency category.",
        examples=[EmergencyCategory.CARDIAC],
    )
    enabled: bool = Field(
        default=True,
        description="Flag indicating whether this rule is active during evaluation.",
        examples=[True],
    )


class EmergencyResponse(BaseModel):
    """Pydantic v2 schema representing the evaluation outcome of the Emergency Safety Engine."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "emergency_detected": True,
                "safe_for_ai_processing": False,
                "matched_rules": ["R-CARDIAC-01"],
                "matched_symptoms": ["chest pain", "shortness of breath"],
                "emergency_category": "CARDIAC",
                "priority": "CRITICAL",
                "rule_match_score": 1.0,
                "recommended_action": "CALL_AMBULANCE",
                "should_refer_immediately": True,
                "should_call_ambulance": True,
                "reason": "Critical cardiac emergency detected based on 2 matched symptoms.",
                "matched_reason": "Triggered rule R-CARDIAC-01 (Acute Cardiac Event) due to matching symptoms: ['chest pain', 'shortness of breath'].",
                "timestamp": "2026-07-30T10:00:00Z",
                "duration_ms": 1.45,
            }
        }
    )

    emergency_detected: bool = Field(
        ...,
        description="Boolean flag indicating whether any emergency trigger rule was matched.",
        examples=[True],
    )
    safe_for_ai_processing: bool = Field(
        ...,
        description="Boolean gate for downstream AI integration (True if no emergency, False if emergency).",
        examples=[False],
    )
    matched_rules: List[str] = Field(
        default_factory=list,
        description="List of Rule IDs that matched patient symptoms.",
        examples=[["R-CARDIAC-01"]],
    )
    matched_symptoms: List[str] = Field(
        default_factory=list,
        description="List of patient symptoms that triggered rule matches.",
        examples=[["chest pain", "shortness of breath"]],
    )
    emergency_category: Optional[EmergencyCategory] = Field(
        default=None,
        description="Primary emergency category of the highest-priority matching rule.",
        examples=[EmergencyCategory.CARDIAC],
    )
    priority: str = Field(
        default="LOW",
        description="Highest priority among all matched rules (LOW, MEDIUM, HIGH, CRITICAL).",
        examples=["CRITICAL"],
    )
    rule_match_score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Match score calculated as (matched_symptoms / required_symptoms) for highest matching rule.",
        examples=[1.0],
    )
    recommended_action: str = Field(
        default="MONITOR_PATIENT",
        description="Clinical recommendation for healthcare worker.",
        examples=["CALL_AMBULANCE"],
    )
    should_refer_immediately: bool = Field(
        default=False,
        description="Flag indicating immediate referral is required.",
        examples=[True],
    )
    should_call_ambulance: bool = Field(
        default=False,
        description="Flag indicating emergency ambulance dispatch is required.",
        examples=[True],
    )
    reason: str = Field(
        ...,
        description="High-level decision summary.",
        examples=["Critical cardiac emergency detected based on 2 matched symptoms."],
    )
    matched_reason: str = Field(
        ...,
        description="Human-readable transparent explanation of triggered rules and matched symptoms.",
        examples=["Triggered rule R-CARDIAC-01 (Acute Cardiac Event) due to matching symptoms: ['chest pain']."],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 evaluation completion timestamp.",
        examples=["2026-07-30T10:00:00Z"],
    )
    duration_ms: Optional[float] = Field(
        default=None,
        description="Engine evaluation time in milliseconds.",
        examples=[1.45],
    )
