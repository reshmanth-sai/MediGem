"""Referral summary representation schema."""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ReferralSummary(BaseModel):
    """Schema representing structured patient referral summaries for higher care facilities."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "referral_id": "REF-9941",
                "patient_id": "P-10492",
                "facility_level": "District Tertiary Hospital - Cardiology Unit",
                "key_findings": ["Acute ECG abnormalities", "Hypoxia (SpO2 94%)", "Chest pain"],
                "summary_notes": "Patient requires immediate evaluation by a specialist.",
                "timestamp": "2026-07-30T10:00:00Z",
            }
        }
    )

    referral_id: str = Field(
        ...,
        description="Unique identifier for the referral document.",
        examples=["REF-9941"],
    )
    patient_id: str = Field(
        ...,
        description="Patient ID associated with this referral.",
        examples=["P-10492"],
    )
    facility_level: str = Field(
        ...,
        description="Recommended destination healthcare facility tier.",
        examples=["District Hospital", "Tertiary Referral Hospital"],
    )
    key_findings: List[str] = Field(
        default_factory=list,
        description="Concise list of critical clinical findings supporting referral.",
        examples=[["Severe acute chest pain", "ECG ST-elevation"]],
    )
    summary_notes: str = Field(
        ...,
        description="Detailed referral summary narrative for receiving medical staff.",
        examples=["Patient stabilized at rural clinic, referred for emergency intervention."],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 timestamp when referral was generated.",
        examples=["2026-07-30T10:00:00Z"],
    )
