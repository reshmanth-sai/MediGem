"""Custom exception definitions for Emergency Safety Engine."""

from backend.exceptions import ApplicationError


class EmergencyEngineError(ApplicationError):
    """Base exception for all Emergency Safety Engine errors."""
    pass


class InvalidRuleDefinitionError(EmergencyEngineError):
    """Raised when an emergency rule definition fails schema or validation checks."""
    pass


__all__ = ["EmergencyEngineError", "InvalidRuleDefinitionError"]
