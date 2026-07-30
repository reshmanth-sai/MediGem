"""AI Inference Layer package exports for MediGem."""

from backend.ai.base import BaseAIProvider
from backend.ai.exceptions import (
    AIConnectionError,
    AIProviderError,
    InferenceTimeoutError,
    ModelUnavailableError,
    ResponseParsingError,
)
from backend.ai.gemma_provider import GemmaProvider
from backend.ai.health import check_ai_health
from backend.ai.manager import AIManager, ai_manager
from backend.ai.models import (
    InferenceContext,
    InferenceMetadata,
    InferenceRequest,
    InferenceResponse,
    ModelInfo,
    ProviderCapabilities,
    ProviderStatus,
    ResponseFormat,
    RetryPolicy,
    TokenUsage,
)
from backend.ai.parser import ResponseParser
from backend.ai.prompts import PromptBuilder, prompt_builder

__all__ = [
    "BaseAIProvider",
    "GemmaProvider",
    "AIManager",
    "ai_manager",
    "ResponseParser",
    "PromptBuilder",
    "prompt_builder",
    "InferenceRequest",
    "InferenceResponse",
    "InferenceContext",
    "InferenceMetadata",
    "ModelInfo",
    "ProviderCapabilities",
    "ProviderStatus",
    "ResponseFormat",
    "RetryPolicy",
    "TokenUsage",
    "check_ai_health",
    "AIProviderError",
    "ModelUnavailableError",
    "InferenceTimeoutError",
    "ResponseParsingError",
    "AIConnectionError",
]
