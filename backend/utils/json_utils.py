"""JSON parsing and serialization helper functions."""

import json
from typing import Any, Dict, Optional
from pydantic import BaseModel

from backend.exceptions import AppValidationError


def safe_json_loads(json_str: str) -> Dict[str, Any]:
    """Parse JSON string into dictionary safely."""
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise AppValidationError(f"Invalid JSON string: {e}") from e


def safe_json_dumps(data: Any, indent: int = 2) -> str:
    """Serialize Python object or Pydantic model into pretty JSON string."""
    try:
        if isinstance(data, BaseModel):
            return data.model_dump_json(indent=indent)
        return json.dumps(data, indent=indent, default=str)
    except Exception as e:
        raise AppValidationError(f"Failed to serialize object to JSON: {e}") from e
