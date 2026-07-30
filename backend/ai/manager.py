"""AI Manager orchestrating provider lifecycle, retries, and structured response parsing."""

import time
from typing import Any, Optional, Type
from pydantic import BaseModel

from backend.ai.base import BaseAIProvider
from backend.ai.exceptions import AIConnectionError, InferenceTimeoutError
from backend.ai.gemma_provider import GemmaProvider
from backend.ai.models import (
    InferenceContext,
    InferenceRequest,
    InferenceResponse,
    ModelInfo,
    ProviderStatus,
    ResponseFormat,
    RetryPolicy,
)
from backend.ai.parser import ResponseParser
from backend.ai.prompts import prompt_builder
from backend.logging import logger


class AIManager:
    """Central manager orchestrating AI inference execution, provider lifecycle, and retries."""

    def __init__(
        self,
        provider: Optional[BaseAIProvider] = None,
        retry_policy: Optional[RetryPolicy] = None,
    ) -> None:
        self.provider: BaseAIProvider = provider or GemmaProvider()
        self.retry_policy: RetryPolicy = retry_policy or RetryPolicy()

    def get_model_info(self) -> ModelInfo:
        """Retrieve model information from active provider."""
        return self.provider.get_model_info()

    def health_check(self) -> ProviderStatus:
        """Run health check diagnostic on active provider."""
        return self.provider.health_check()

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        context: Optional[InferenceContext] = None,
        response_format: ResponseFormat = ResponseFormat.JSON,
        schema_model: Optional[Type[BaseModel]] = None,
        images: Optional[list] = None,
    ) -> InferenceResponse:
        """Orchestrate AI inference request with retry handling and structured parsing."""
        ctx = context or InferenceContext()
        sys_prompt = system_prompt or prompt_builder.build_system_prompt()

        req = InferenceRequest(
            context=ctx,
            prompt=prompt,
            system_prompt=sys_prompt,
            response_format=response_format,
            json_mode=(response_format == ResponseFormat.JSON),
            images=images or [],
        )

        attempts = 0
        last_exception: Optional[Exception] = None

        while attempts <= self.retry_policy.max_retries:
            attempts += 1
            try:
                # 1. Execute inference via active provider
                raw_response = self.provider.generate(req)

                # 2. Parse response content
                raw_text = raw_response.raw_output or ""
                if response_format == ResponseFormat.JSON:
                    parsed_output = ResponseParser.parse_and_validate(raw_text, schema_model=schema_model)
                else:
                    parsed_output = raw_text

                # Return structured InferenceResponse
                return InferenceResponse(
                    parsed_output=parsed_output,
                    metadata=raw_response.metadata,
                    success=True,
                    raw_output=raw_text if logger.isEnabledFor(10) else None,
                )

            except (AIConnectionError, InferenceTimeoutError) as e:
                last_exception = e
                if attempts <= self.retry_policy.max_retries:
                    logger.warning(
                        f"[{ctx.request_id}] Transient AI error on attempt {attempts}/{self.retry_policy.max_retries + 1}: {e}. "
                        f"Retrying in {self.retry_policy.backoff_ms}ms..."
                    )
                    time.sleep(self.retry_policy.backoff_ms / 1000.0)
                else:
                    logger.error(f"[{ctx.request_id}] Max retries exceeded ({attempts} attempts): {e}")
                    raise

            except Exception as e:
                logger.error(f"[{ctx.request_id}] Non-retryable AI inference failure: {e}")
                raise

        raise last_exception or Exception("Unknown inference failure")


# Global Singleton AI Manager Instance
ai_manager = AIManager()
