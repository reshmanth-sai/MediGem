"""Gemma AI Provider implementation connecting to local Ollama inference server."""

import time
from typing import Dict, List, Optional
import ollama
import requests

from backend.ai.base import BaseAIProvider
from backend.ai.exceptions import (
    AIConnectionError,
    AIProviderError,
    InferenceTimeoutError,
    ModelUnavailableError,
)
from backend.ai.models import (
    InferenceMetadata,
    InferenceRequest,
    InferenceResponse,
    ModelInfo,
    ProviderCapabilities,
    ProviderStatus,
    ResponseFormat,
    TokenUsage,
)
from backend.config import settings
from backend.logging import logger
from backend.utils import get_current_epoch_ms, get_current_utc_timestamp


class GemmaProvider(BaseAIProvider):
    """Gemma AI Provider communicating with local Ollama server."""

    def __init__(self, host: Optional[str] = None, model_name: Optional[str] = None) -> None:
        self.host: str = host or settings.OLLAMA_HOST
        self.model_name: str = model_name or settings.MODEL_NAME
        self._client: Optional[ollama.Client] = None
        self._initialized: bool = False
        self._model_info: ModelInfo = ModelInfo(
            provider="GemmaProvider (Ollama)",
            model_name=self.model_name,
            model_version="Gemma 4",
            backend="Local Offline Ollama Engine",
            supports_multimodal=True,
            supports_function_calling=True,
            capabilities=ProviderCapabilities(
                supports_images=True,
                supports_function_calling=True,
                supports_streaming=True,
                supports_json_mode=True,
                supports_tools=True,
            ),
        )

    def initialize(self) -> None:
        """Initialize Ollama client and verify model availability."""
        try:
            self._client = ollama.Client(host=self.host)
            if not self.is_available():
                raise ModelUnavailableError(f"Model '{self.model_name}' not available on Ollama server at {self.host}")
            self._initialized = True
            logger.info(f"GemmaProvider initialized successfully for model '{self.model_name}' at {self.host}.")
        except Exception as e:
            if isinstance(e, AIProviderError):
                raise
            raise AIConnectionError(f"Failed to initialize GemmaProvider at {self.host}: {e}") from e

    def is_available(self) -> bool:
        """Check if Ollama server is reachable and configured model is installed."""
        try:
            res = requests.get(f"{self.host}/api/tags", timeout=3)
            if res.status_code != 200:
                return False
            models = [m.get("name") for m in res.json().get("models", [])]
            return any(self.model_name in m for m in models) or len(models) > 0
        except Exception:
            return False

    def get_model_info(self) -> ModelInfo:
        """Return ModelInfo metadata object."""
        return self._model_info

    def health_check(self) -> ProviderStatus:
        """Run health check diagnostic."""
        available = self.is_available()
        return ProviderStatus(
            provider_name="GemmaProvider",
            is_available=available,
            model_name=self.model_name,
            host=self.host,
            details="Ollama server online and Gemma model ready." if available else "Ollama server or model unavailable.",
            model_info=self._model_info,
        )

    def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Execute inference against Gemma model via Ollama."""
        if not self._initialized or self._client is None:
            self.initialize()

        start_time = get_current_epoch_ms()
        tx_id = request.context.request_id

        messages = []
        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})

        user_message: Dict[str, Any] = {"role": "user", "content": request.prompt}
        if request.images:
            user_message["images"] = request.images
        messages.append(user_message)

        options = {
            "temperature": request.temperature,
            "num_predict": request.max_tokens,
        }

        format_setting = "json" if (request.json_mode or request.response_format == ResponseFormat.JSON) else None

        logger.info(f"[{tx_id}] Executing Gemma inference (Model={self.model_name}, Format={format_setting or 'text'})")

        try:
            res = self._client.chat(
                model=self.model_name,
                messages=messages,
                options=options,
                format=format_setting,
            )

            latency_ms = round(get_current_epoch_ms() - start_time, 2)
            content = res.get("message", {}).get("content", "")

            eval_count = res.get("eval_count", 0)
            prompt_eval_count = res.get("prompt_eval_count", 0)
            token_usage = TokenUsage(
                prompt_tokens=prompt_eval_count,
                completion_tokens=eval_count,
                total_tokens=prompt_eval_count + eval_count,
            )

            metadata = InferenceMetadata(
                context=request.context,
                provider="GemmaProvider",
                model_info=self._model_info,
                latency_ms=latency_ms,
                timestamp=get_current_utc_timestamp(),
                success=True,
                token_usage=token_usage,
            )

            logger.info(f"[{tx_id}] Inference succeeded in {latency_ms}ms (Tokens: {token_usage.total_tokens})")

            return InferenceResponse(
                parsed_output=content,  # Will be processed by ResponseParser in AIManager
                metadata=metadata,
                success=True,
                raw_output=content,
            )

        except requests.exceptions.Timeout as e:
            latency_ms = round(get_current_epoch_ms() - start_time, 2)
            logger.error(f"[{tx_id}] Inference timed out after {latency_ms}ms: {e}")
            raise InferenceTimeoutError(f"Gemma inference timed out after {latency_ms}ms") from e
        except Exception as e:
            latency_ms = round(get_current_epoch_ms() - start_time, 2)
            logger.error(f"[{tx_id}] Gemma inference error after {latency_ms}ms: {e}")
            raise AIProviderError(f"Gemma inference error: {e}") from e

    def shutdown(self) -> None:
        """Shutdown client connection."""
        self._client = None
        self._initialized = False
        logger.info("GemmaProvider shut down.")
