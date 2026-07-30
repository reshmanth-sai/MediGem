"""Unit test suite for AI Inference Layer, GemmaProvider, PromptBuilder, and ResponseParser."""

import json
import unittest
from unittest.mock import MagicMock, patch

from backend.ai.exceptions import AIConnectionError, ResponseParsingError
from backend.ai.functions import BaseFunction, FunctionRegistry
from backend.ai.gemma_provider import GemmaProvider
from backend.ai.health import check_ai_health
from backend.ai.manager import AIManager
from backend.ai.models import (
    InferenceContext,
    InferenceMetadata,
    InferenceRequest,
    InferenceResponse,
    ModelInfo,
    ResponseFormat,
    RetryPolicy,
)
from backend.ai.parser import ResponseParser
from backend.ai.prompts import PromptBuilder


class MockFunction(BaseFunction):
    """Test function tool implementation for registry testing."""

    @property
    def name(self) -> str:
        return "get_vital_signs"

    @property
    def description(self) -> str:
        return "Retrieve recent patient vital signs."

    @property
    def parameters_schema(self) -> dict:
        return {"type": "object", "properties": {"patient_id": {"type": "string"}}}

    def execute(self, **kwargs) -> dict:
        return {"heart_rate": 80, "spo2": 98}


class TestAIInferenceLayer(unittest.TestCase):
    """Test suite verifying AI infrastructure, prompt builder, JSON parser, and Gemma provider."""

    def setUp(self) -> None:
        self.parser = ResponseParser()

    # 1. Test ResponseParser JSON extraction across formats
    def test_parser_raw_json(self) -> None:
        raw_json = '{"status": "ok", "risk": "LOW"}'
        result = self.parser.extract_json(raw_json)
        self.assertEqual(result.get("status"), "ok")
        self.assertEqual(result.get("risk"), "LOW")

    def test_parser_markdown_fenced_json(self) -> None:
        fenced = "```json\n{\n  \"status\": \"completed\",\n  \"confidence\": 0.95\n}\n```"
        result = self.parser.extract_json(fenced)
        self.assertEqual(result.get("status"), "completed")
        self.assertEqual(result.get("confidence"), 0.95)

    def test_parser_embedded_json_in_mixed_text(self) -> None:
        """Verify parser extracts first valid JSON object embedded in free text."""
        mixed = "Here is the patient risk summary:\n{\n  \"risk_level\": \"MODERATE\",\n  \"score\": 6.5\n}\nHope this helps!"
        result = self.parser.extract_json(mixed)
        self.assertEqual(result.get("risk_level"), "MODERATE")
        self.assertEqual(result.get("score"), 6.5)

    def test_parser_malformed_json_raises_exception(self) -> None:
        malformed = "This response contains no JSON brackets or valid payload."
        with self.assertRaises(ResponseParsingError):
            self.parser.extract_json(malformed)

    # 2. Test PromptBuilder Markdown template rendering
    def test_prompt_builder_loading_and_rendering(self) -> None:
        pb = PromptBuilder()
        system_prompt = pb.build_system_prompt()
        self.assertIn("MediGem", system_prompt)

        analysis_prompt = pb.build_analysis_prompt(
            patient_id="P-10492",
            age=45,
            gender="Female",
            symptoms=["Chest pain"],
            vitals="HR: 110",
        )
        self.assertIn("P-10492", analysis_prompt)
        self.assertIn("Female", analysis_prompt)
        self.assertIn("Chest pain", analysis_prompt)

    # 3. Test Function Calling Registry
    def test_function_calling_registry(self) -> None:
        registry = FunctionRegistry()
        func = MockFunction()
        registry.register(func)

        self.assertIn("get_vital_signs", registry.list_functions())
        retrieved = registry.get("get_vital_signs")
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.execute(patient_id="P-1"), {"heart_rate": 80, "spo2": 98})

        schemas = registry.get_tool_schemas()
        self.assertEqual(len(schemas), 1)
        self.assertEqual(schemas[0]["function"]["name"], "get_vital_signs")

    # 4. Test GemmaProvider capabilities & ModelInfo
    def test_gemma_provider_model_info(self) -> None:
        provider = GemmaProvider()
        info = provider.get_model_info()
        self.assertIsInstance(info, ModelInfo)
        self.assertEqual(info.model_version, "Gemma 4")
        self.assertTrue(info.supports_multimodal)
        self.assertTrue(info.supports_function_calling)

    # 5. Test AIManager execution & RetryPolicy
    @patch.object(GemmaProvider, "generate")
    def test_ai_manager_generate_success(self, mock_generate: MagicMock) -> None:
        provider = GemmaProvider()
        mock_response = MagicMock()
        mock_response.raw_output = '{"result": "success"}'
        mock_response.metadata = InferenceMetadata(
            context=InferenceContext(),
            provider="GemmaProvider",
            model_info=provider.get_model_info(),
            latency_ms=10.0,
            success=True,
        )
        mock_generate.return_value = mock_response

        manager = AIManager(provider=provider, retry_policy=RetryPolicy(max_retries=1))
        response = manager.generate(prompt="Test prompt", response_format=ResponseFormat.JSON)

        self.assertTrue(response.success)
        self.assertEqual(response.parsed_output.get("result"), "success")
        mock_generate.assert_called_once()

    # 6. Test AI Health Check Execution
    def test_check_ai_health(self) -> None:
        status = check_ai_health()
        self.assertIsNotNone(status)
        self.assertEqual(status.provider_name, "GemmaProvider")


if __name__ == "__main__":
    unittest.main()
