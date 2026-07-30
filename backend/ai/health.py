"""AI Inference Layer diagnostic health check module."""

from backend.ai.gemma_provider import GemmaProvider
from backend.ai.manager import ai_manager
from backend.ai.models import ProviderStatus, ResponseFormat
from backend.ai.parser import ResponseParser
from backend.logging import logger


def check_ai_health() -> ProviderStatus:
    """Execute diagnostic check on AI Inference Layer, Ollama server, and JSON parser."""
    try:
        # 1. Provider status
        provider = GemmaProvider()
        status = provider.health_check()

        if not status.is_available:
            return status

        # 2. Test JSON inference and parser verification
        test_prompt = "Return a JSON object with key 'status' set to 'ok' and key 'message' set to 'ready'."
        res = ai_manager.generate(prompt=test_prompt, response_format=ResponseFormat.JSON)

        parsed = res.parsed_output
        if isinstance(parsed, dict) and parsed.get("status") in ("ok", "ready", True):
            status.details = f"All systems operational. Test inference latency: {res.metadata.latency_ms}ms"
        else:
            status.details = f"Inference completed in {res.metadata.latency_ms}ms. Response: {parsed}"

        return status

    except Exception as e:
        logger.error(f"AI health check diagnostic failed: {e}")
        return ProviderStatus(
            provider_name="GemmaProvider",
            is_available=False,
            model_name="gemma3:4b",
            host="http://localhost:11434",
            details=f"Diagnostic failure: {e}",
            model_info=None,
        )
