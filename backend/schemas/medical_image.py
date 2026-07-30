"""Medical image input and representation schema."""

from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.config.constants import ImageType


class MedicalImage(BaseModel):
    """Schema describing an uploaded medical image artifact (ECG, Wound, Report, Prescription)."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "image_id": "IMG-88291",
                "file_path": "sample_data/ecg/sample_ecg.png",
                "image_type": "ECG",
                "width": 1200,
                "height": 800,
                "channels": 3,
                "metadata": {"source": "Camera upload", "lead_count": 12},
            }
        }
    )

    image_id: str = Field(
        default="IMG-DEFAULT",
        description="Unique identifier for the medical image artifact.",
        examples=["IMG-88291"],
    )
    file_path: str = Field(
        ...,
        description="Absolute or relative local filesystem path to the image.",
        examples=["sample_data/ecg/sample_ecg.png"],
    )
    image_type: ImageType = Field(
        ...,
        description="Clinical modality type of the image (ECG, REPORT, PRESCRIPTION, WOUND).",
        examples=[ImageType.ECG],
    )
    width: Optional[int] = Field(
        default=None,
        ge=1,
        description="Image width in pixels.",
        examples=[1200],
    )
    height: Optional[int] = Field(
        default=None,
        ge=1,
        description="Image height in pixels.",
        examples=[800],
    )
    channels: Optional[int] = Field(
        default=3,
        description="Number of color channels (e.g. 1 for grayscale, 3 for RGB).",
        examples=[3],
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary metadata attributes extracted during image preprocessing.",
        examples=[{"capture_device": "Mobile Camera", "lighting": "Good"}],
    )
