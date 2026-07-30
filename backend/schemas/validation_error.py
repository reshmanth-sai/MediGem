"""Validation error payload schema representation."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SchemaValidationError(BaseModel):
    """Schema representing structured validation error payloads.
    
    Named SchemaValidationError to avoid name collision with Pydantic's built-in
    ValidationError exception class.
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "error_code": "INVALID_AGE",
                "field_name": "age",
                "error_message": "Patient age must be between 0 and 120.",
                "timestamp": "2026-07-30T10:00:00Z",
            }
        }
    )

    error_code: str = Field(
        ...,
        description="Machine-readable error identifier code.",
        examples=["INVALID_INPUT", "FILE_TOO_LARGE"],
    )
    field_name: Optional[str] = Field(
        default=None,
        description="Target input field associated with the validation error.",
        examples=["age", "file_path"],
    )
    error_message: str = Field(
        ...,
        description="Human-readable error description.",
        examples=["File extension .exe is not allowed."],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 error event timestamp.",
        examples=["2026-07-30T10:00:00Z"],
    )
