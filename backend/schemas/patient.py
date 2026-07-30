"""Patient input schema for MediGem."""

from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class PatientInput(BaseModel):
    """Schema representing patient demographics, vitals, and presenting symptoms."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "patient_id": "P-10492",
                "age": 45,
                "gender": "Female",
                "symptoms": ["Chest pain radiating to left arm", "Shortness of breath", "Diaphoresis"],
                "vital_signs": {
                    "heart_rate_bpm": 110,
                    "blood_pressure_sys": 150,
                    "blood_pressure_dia": 95,
                    "spo2_percent": 94,
                    "temperature_c": 37.2,
                },
                "notes": "Patient presented at rural health outpost with sudden onset chest pain.",
            }
        }
    )

    patient_id: str = Field(
        default="UNKNOWN",
        description="Unique identifier for the patient or visit record.",
        examples=["P-10492"],
    )
    age: int = Field(
        ...,
        ge=0,
        le=120,
        description="Patient age in years.",
        examples=[45],
    )
    gender: str = Field(
        ...,
        description="Patient biological gender or identity.",
        examples=["Female", "Male", "Other"],
    )
    symptoms: List[str] = Field(
        default_factory=list,
        description="List of current symptoms reported by the patient or health worker.",
        examples=[["Chest pain", "Shortness of breath"]],
    )
    vital_signs: Dict[str, float] = Field(
        default_factory=dict,
        description="Key vital signs (heart rate, blood pressure, SpO2, temperature).",
        examples=[{"heart_rate_bpm": 110, "spo2_percent": 94}],
    )
    notes: Optional[str] = Field(
        default=None,
        description="Additional clinical context or triage notes provided by the healthcare worker.",
        examples=["Symptoms began 2 hours ago during physical activity."],
    )
