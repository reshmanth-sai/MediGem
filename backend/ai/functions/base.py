"""Base function calling interface for native Gemma tool execution."""

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseFunction(ABC):
    """Abstract base class for native Gemma function/tool definitions."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Function name for tool calling registry."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Detailed description explaining when the model should invoke this tool."""
        pass

    @property
    @abstractmethod
    def parameters_schema(self) -> Dict[str, Any]:
        """JSON Schema defining arguments required by the function."""
        pass

    @abstractmethod
    def execute(self, **kwargs: Any) -> Any:
        """Execute tool logic and return structured result payload."""
        pass

    def to_ollama_tool_schema(self) -> Dict[str, Any]:
        """Format function as an Ollama/Gemma compatible tool schema."""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters_schema,
            },
        }
