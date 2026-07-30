"""Output Validator verifying JSON responses against ClinicalReasoningOutput contract."""

from typing import Any, Dict, Optional
from pydantic import ValidationError

from backend.logging import logger
from backend.reasoning.exceptions import OutputValidationError
from backend.reasoning.output_schema import ClinicalReasoningOutput


class OutputValidator:
    """Validator ensuring raw JSON responses conform to the ClinicalReasoningOutput schema."""

    @staticmethod
    def validate_output(data: Any) -> ClinicalReasoningOutput:
        """Validate raw dictionary or JSON object against ClinicalReasoningOutput schema."""
        if not data:
            raise OutputValidationError("Cannot validate empty or None AI reasoning payload.")

        if not isinstance(data, dict):
            raise OutputValidationError(f"Expected JSON dictionary payload, got {type(data).__name__}.")

        try:
            output = ClinicalReasoningOutput.model_validate(data)
            logger.info("AI reasoning output successfully validated against ClinicalReasoningOutput contract.")
            return output
        except ValidationError as e:
            logger.error(f"Reasoning output schema validation failed: {e}")
            raise OutputValidationError(f"Response failed ClinicalReasoningOutput schema validation: {e}") from e


# Global Singleton OutputValidator Instance
output_validator = OutputValidator()
