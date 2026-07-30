"""Pydantic v2 data models for AI inference requests, responses, metadata, and capabilities."""

from enum import Enum
from typing import Any, Dict, List, Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field

from backend.utils import get_current_utc_timestamp


class ResponseFormat(str, Enum):
    """Supported AI response formats."""
    JSON = "JSON"
    TEXT = "TEXT"
    MARKDOWN = "MARKDOWN"


class ProviderCapabilities(BaseModel):
    """Capabilities model highlighting model and provider features."""
    supports_images: bool = Field(default=True, description="Multimodal image input capability.")
    supports_function_calling: bool = Field(default=True, description="Native tool/function calling capability.")
    supports_streaming: bool = Field(default=True, description="Token streaming output capability.")
    supports_json_mode: bool = Field(default=True, description="Structured JSON response mode.")
    supports_tools: bool = Field(default=True, description="External tool execution support.")


class ModelInfo(BaseModel):
    """Metadata describing the active AI model."""
    provider: str = Field(default="Ollama", description="AI provider name.")
    model_name: str = Field(..., description="Active AI model name.")
    model_version: str = Field(default="Gemma 4", description="Model family/version.")
    backend: str = Field(default="Local Offline Ollama Server", description="Inference backend engine.")
    supports_multimodal: bool = Field(default=True, description="Multimodal image/text capability.")
    supports_function_calling: bool = Field(default=True, description="Function calling capability.")
    capabilities: ProviderCapabilities = Field(default_factory=ProviderCapabilities)


class TokenUsage(BaseModel):
    """Token consumption metrics for inference calls."""
    prompt_tokens: int = Field(default=0, description="Tokens in prompt input.")
    completion_tokens: int = Field(default=0, description="Tokens generated in response.")
    total_tokens: int = Field(default=0, description="Total tokens processed.")


class InferenceContext(BaseModel):
    """Session and transaction context for end-to-end audit tracing."""
    request_id: str = Field(default_factory=lambda: f"REQ-{uuid.uuid4().hex[:8].upper()}", description="Transaction ID.")
    session_id: Optional[str] = Field(default=None, description="User or session identifier.")
    patient_id: Optional[str] = Field(default=None, description="Patient record identifier.")
    timestamp: str = Field(default_factory=get_current_utc_timestamp, description="Creation timestamp.")


class RetryPolicy(BaseModel):
    """Configurable retry policy for transient inference errors."""
    max_retries: int = Field(default=2, ge=0, le=5, description="Maximum retry attempts.")
    backoff_ms: float = Field(default=300.0, ge=0.0, description="Delay between retry attempts in milliseconds.")
    retry_on_timeout: bool = Field(default=True, description="Retry if request times out.")
    retry_on_connection: bool = Field(default=True, description="Retry if server connection drops.")


class InferenceRequest(BaseModel):
    """Structured request payload for AI inference."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prompt": "Analyze the following clinical observations.",
                "system_prompt": "You are MediGem, an offline medical AI co-pilot.",
                "temperature": 0.2,
                "max_tokens": 1024,
                "response_format": "JSON",
                "json_mode": True,
                "stream": False,
            }
        }
    )

    context: InferenceContext = Field(default_factory=InferenceContext, description="Session and transaction tracing context.")
    prompt: str = Field(..., description="Main user prompt or analysis payload.")
    system_prompt: Optional[str] = Field(default=None, description="Optional system instruction prompt.")
    temperature: float = Field(default=0.2, ge=0.0, le=1.0, description="Sampling temperature.")
    max_tokens: int = Field(default=2048, ge=1, description="Maximum completion tokens.")
    json_mode: bool = Field(default=True, description="Enforce JSON structured response output.")
    response_format: ResponseFormat = Field(default=ResponseFormat.JSON, description="Desired response format.")
    stream: bool = Field(default=False, description="Flag for future token streaming.")
    images: List[str] = Field(default_factory=list, description="List of image file paths or base64 strings for multimodal input.")
    functions: List[str] = Field(default_factory=list, description="List of registered function names available to the model.")


class InferenceMetadata(BaseModel):
    """Metadata attached to completed inference responses."""
    context: InferenceContext = Field(..., description="Tracing context.")
    provider: str = Field(..., description="Provider name that executed inference.")
    model_info: ModelInfo = Field(..., description="Model info.")
    latency_ms: float = Field(..., description="Total execution latency in milliseconds.")
    timestamp: str = Field(default_factory=get_current_utc_timestamp, description="Completion timestamp.")
    success: bool = Field(..., description="Execution status boolean.")
    token_usage: TokenUsage = Field(default_factory=TokenUsage, description="Token count metrics.")


class InferenceResponse(BaseModel):
    """Structured AI inference response containing parsed output and execution metadata."""

    parsed_output: Any = Field(..., description="Parsed JSON dictionary, model, or structured output.")
    metadata: InferenceMetadata = Field(..., description="Inference execution metadata.")
    success: bool = Field(default=True, description="Overall success flag.")
    error_message: Optional[str] = Field(default=None, description="Error message if inference failed.")
    raw_output: Optional[str] = Field(default=None, description="Optional raw model output text (for debugging only).")


class ProviderStatus(BaseModel):
    """Diagnostic status model for AI provider health checks."""
    provider_name: str = Field(..., description="AI Provider name.")
    is_available: bool = Field(..., description="Boolean indicating if provider is ready and reachable.")
    model_name: str = Field(..., description="Configured model name.")
    host: str = Field(..., description="Provider API server URL host.")
    details: str = Field(..., description="Detailed diagnostic description.")
    model_info: Optional[ModelInfo] = Field(default=None, description="Model info model if available.")
