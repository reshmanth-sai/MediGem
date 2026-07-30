"""Resilient JSON parser for extracting and validating AI model responses."""

import json
import re
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel

from backend.ai.exceptions import ResponseParsingError
from backend.logging import logger


class ResponseParser:
    """Parser responsible for extracting valid JSON payloads from free-text AI model output."""

    @staticmethod
    def extract_json(raw_text: str) -> Any:
        """Extract first valid JSON object or array from raw model text.

        Handles:
        - Pure raw JSON
        - Markdown fenced blocks (```json ... ```)
        - Mixed text with embedded JSON objects ({...}) or arrays ([...])
        """
        if not raw_text or not raw_text.strip():
            raise ResponseParsingError("Cannot parse JSON from empty AI response text.")

        cleaned = raw_text.strip()

        # 1. Direct JSON parse try
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # 2. Extract from markdown code fences (```json ... ``` or ``` ... ```)
        fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
        if fence_match:
            try:
                return json.loads(fence_match.group(1).strip())
            except json.JSONDecodeError:
                pass

        # 3. Extract first embedded JSON object { ... } using regex bracket matching
        obj_match = re.search(r"(\{[\s\S]*\})", cleaned)
        if obj_match:
            try:
                return json.loads(obj_match.group(1).strip())
            except json.JSONDecodeError:
                pass

        # 4. Extract first embedded JSON array [ ... ] using regex bracket matching
        arr_match = re.search(r"(\[[\s\S]*\])", cleaned)
        if arr_match:
            try:
                return json.loads(arr_match.group(1).strip())
            except json.JSONDecodeError:
                pass

        # If all extraction methods fail, raise ResponseParsingError
        logger.error(f"Failed to extract JSON from AI response: {cleaned[:150]}...")
        raise ResponseParsingError(
            f"Failed to parse JSON from AI model response. Content preview: '{cleaned[:100]}...'"
        )

    @classmethod
    def parse_and_validate(
        cls,
        raw_text: str,
        schema_model: Optional[Type[BaseModel]] = None,
    ) -> Any:
        """Extract JSON and optionally validate against a Pydantic schema model."""
        parsed_data = cls.extract_json(raw_text)

        if schema_model is not None and isinstance(parsed_data, dict):
            try:
                return schema_model.model_validate(parsed_data)
            except Exception as e:
                raise ResponseParsingError(
                    f"Parsed JSON failed schema validation for {schema_model.__name__}: {e}"
                ) from e

        return parsed_data
