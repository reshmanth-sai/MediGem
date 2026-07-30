"""Prompt Library loading modular Markdown prompt fragments from backend/prompts/reasoning/."""

from pathlib import Path
from typing import Dict

from backend.logging import logger

REASONING_PROMPTS_DIR: Path = Path(__file__).parent.parent / "prompts" / "reasoning"


class PromptLibrary:
    """Library loading and caching modular markdown prompt fragments."""

    def __init__(self, directory: Path = REASONING_PROMPTS_DIR) -> None:
        self.directory = directory
        self._fragments: Dict[str, str] = {}
        self.reload_fragments()

    def reload_fragments(self) -> None:
        """Reload all .md prompt fragments from directory."""
        if not self.directory.exists():
            self.directory.mkdir(parents=True, exist_ok=True)
            return

        for md_file in self.directory.glob("*.md"):
            key = md_file.stem.lower()
            self._fragments[key] = md_file.read_text(encoding="utf-8").strip()

        # Add aliases
        if "report" in self._fragments and "lab_report" not in self._fragments:
            self._fragments["lab_report"] = self._fragments["report"]

        logger.info(f"PromptLibrary loaded {len(self._fragments)} prompt fragments from {self.directory}.")

    def get_fragment(self, name: str) -> str:
        """Retrieve fragment text by name or return empty fallback."""
        key = name.lower()
        if key in self._fragments:
            return self._fragments[key]
        logger.warning(f"Prompt fragment '{name}' not found in library.")
        return ""

    @property
    def base_rules(self) -> str:
        return self.get_fragment("base")

    @property
    def safety_instructions(self) -> str:
        return self.get_fragment("safety")

    @property
    def patient_guidelines(self) -> str:
        return self.get_fragment("patient")


# Global Singleton PromptLibrary Instance
prompt_library = PromptLibrary()
