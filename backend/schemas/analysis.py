"""Analysis request and response schemas for MediGem backend workflows."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.schemas.medical_image import MedicalImage
from backend.schemas.patient import PatientInput
from backend.schemas.referral import ReferralSummary
from backend.schemas.risk import RiskAssessment


class AnalysisRequest(BaseModel):
    """Schema representing an incoming clinical multimodal analysis request."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "request_id": "REQ-77201",
                "patient": {
                    "patient_id": "P-10492",
                    "age": 45,
                    "gender": "Female",
                    "symptoms": ["Chest pain"],
                },
                "image": {
                    "image_id": "IMG-88291",
                    "file_path": "sample_data/ecg/sample_ecg.png",
                    "image_type": "ECG",
                },
                "notes": "Emergency triage evaluation requested.",
                "timestamp": "2026-07-30T10:00:00Z",
            }
        }
    )

    request_id: str = Field(
        ...,
        description="Unique request transaction identifier.",
        examples=["REQ-77201"],
    )
    patient: Optional[PatientInput] = Field(
        default=None,
        description="Optional patient demographics and vitals.",
    )
    image: Optional[MedicalImage] = Field(
        default=None,
        description="Optional medical image uploaded for analysis.",
    )
    notes: Optional[str] = Field(
        default=None,
        description="Additional context provided by healthcare worker.",
        examples=["Emergency triage evaluation requested."],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 creation timestamp.",
        examples=["2026-07-30T10:00:00Z"],
    )


class AnalysisResponse(BaseModel):
    """Schema representing the completed clinical analysis response."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "request_id": "REQ-77201",
                "summary": "ECG analysis indicates ST-segment elevation. High cardiac risk.",
                "risk_assessment": {
                    "risk_level": "EMERGENCY",
                    "urgency_score": 9.5,
                    "risk_flags": ["ST-elevation"],
                    "rationale": "High risk findings.",
                    "recommended_action": "Immediate transfer.",
                },
                "referral_summary": None,
                "status": "COMPLETED",
                "duration_ms": 420.5,
                "timestamp": "2026-07-30T10:00:01Z",
            }
        }
    )

    request_id: str = Field(
        ...,
        description="Matching transaction ID from the request.",
        examples=["REQ-77201"],
    )
    summary: str = Field(
        ...,
        description="High-level clinical summary of analysis findings.",
        examples=["Analysis complete. Key findings summarized for health worker."],
    )
    risk_assessment: Optional[RiskAssessment] = Field(
        default=None,
        description="Structured risk level and urgency evaluation.",
    )
    referral_summary: Optional[ReferralSummary] = Field(
        default=None,
        description="Generated referral recommendation if escalation is required.",
    )
    status: str = Field(
        default="COMPLETED",
        description="Processing status (e.g. COMPLETED, FAILED, PENDING).",
        examples=["COMPLETED"],
    )
    duration_ms: Optional[float] = Field(
        default=None,
        description="Analysis execution time in milliseconds.",
        examples=[420.5],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 completion timestamp.",
        examples=["2026-07-30T10:00:01Z"],
    )
