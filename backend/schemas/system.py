"""System health and application status schema."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ApplicationStatus(BaseModel):
    """Schema representing backend environment health and service status."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "is_healthy": True,
                "app_name": "MediGem",
                "loaded_model": "gemma3:4b",
                "ollama_connected": True,
                "ollama_host": "http://localhost:11434",
                "version": "1.0.0",
                "uptime_seconds": 120.0,
                "timestamp": "2026-07-30T10:00:00Z",
            }
        }
    )

    is_healthy: bool = Field(
        ...,
        description="Boolean indicating whether all system components are operational.",
        examples=[True],
    )
    app_name: str = Field(
        default="MediGem",
        description="Application name.",
        examples=["MediGem"],
    )
    loaded_model: str = Field(
        ...,
        description="Currently configured AI model name.",
        examples=["gemma3:4b"],
    )
    ollama_connected: bool = Field(
        ...,
        description="Connection status to local Ollama inference service.",
        examples=[True],
    )
    ollama_host: str = Field(
        ...,
        description="URL host of local Ollama daemon.",
        examples=["http://localhost:11434"],
    )
    version: str = Field(
        default="1.0.0",
        description="Backend application version.",
        examples=["1.0.0"],
    )
    uptime_seconds: Optional[float] = Field(
        default=None,
        description="Service uptime in seconds.",
        examples=[120.0],
    )
    timestamp: Optional[str] = Field(
        default=None,
        description="ISO-8601 status check timestamp.",
        examples=["2026-07-30T10:00:00Z"],
    )
