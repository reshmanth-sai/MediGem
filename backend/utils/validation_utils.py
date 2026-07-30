"""Input validation and sanitization utility helpers."""

from backend.exceptions import AppValidationError


def validate_range(value: float, min_val: float, max_val: float, param_name: str = "value") -> None:
    """Validate numerical value is within expected bounds [min_val, max_val]."""
    if not (min_val <= value <= max_val):
        raise AppValidationError(
            f"Parameter '{param_name}' ({value}) must be between {min_val} and {max_val}."
        )


def sanitize_text_input(text: str) -> str:
    """Strip leading/trailing whitespace and normalize string input."""
    if not text:
        return ""
    return text.strip()
