"""Function calling registry for managing native Gemma tools."""

from typing import Dict, List, Optional
from backend.ai.functions.base import BaseFunction
from backend.logging import logger


class FunctionRegistry:
    """Central registry for registering and executing native Gemma function tools."""

    def __init__(self) -> None:
        self._functions: Dict[str, BaseFunction] = {}

    def register(self, func: BaseFunction) -> None:
        """Register a new function tool."""
        self._functions[func.name] = func
        logger.info(f"Registered function tool: {func.name}")

    def get(self, name: str) -> Optional[BaseFunction]:
        """Retrieve registered function by name."""
        return self._functions.get(name)

    def list_functions(self) -> List[str]:
        """Return list of all registered function names."""
        return list(self._functions.keys())

    def get_tool_schemas(self, filter_names: Optional[List[str]] = None) -> List[Dict]:
        """Return Ollama/Gemma compatible tool schemas."""
        schemas = []
        for name, func in self._functions.items():
            if filter_names is None or name in filter_names:
                schemas.append(func.to_ollama_tool_schema())
        return schemas


# Global Singleton Function Registry
function_registry = FunctionRegistry()
