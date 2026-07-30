"""Prompt template manager and builder loading Markdown prompt files."""

from pathlib import Path
from typing import Any, Dict, Optional

from backend.logging import logger

PROMPTS_DIR: Path = Path(__file__).parent.parent / "prompts" / "system"


class PromptTemplate:
    """Prompt template container loaded from markdown files."""

    def __init__(self, name: str, template_text: str) -> None:
        self.name = name
        self.template_text = template_text

    def render(self, **kwargs: Any) -> str:
        """Substitute variables into the prompt template string."""
        try:
            return self.template_text.format(**kwargs)
        except KeyError as e:
            logger.warning(f"Missing variable {e} in prompt template '{self.name}'. Rendering with default empty values.")
            # Format safely ignoring missing keys
            return self.template_text


class PromptBuilder:
    """Manager loading and rendering markdown prompt templates from backend/prompts/system/."""

    def __init__(self, prompts_dir: Path = PROMPTS_DIR) -> None:
        self.prompts_dir = prompts_dir
        self._templates: Dict[str, PromptTemplate] = {}
        self.reload_templates()

    def reload_templates(self) -> None:
        """Load all .md template files from prompts directory."""
        if not self.prompts_dir.exists():
            self.prompts_dir.mkdir(parents=True, exist_ok=True)
            return

        for md_file in self.prompts_dir.glob("*.md"):
            name = md_file.stem
            content = md_file.read_text(encoding="utf-8")
            self._templates[name] = PromptTemplate(name, content)

        logger.info(f"PromptBuilder loaded {len(self._templates)} templates from {self.prompts_dir}.")

    def get_template(self, name: str) -> PromptTemplate:
        """Retrieve named template or return fallback template."""
        if name in self._templates:
            return self._templates[name]

        # Fallback if file doesn't exist
        fallback_text = f"# {name.title()} Prompt\n{{prompt}}"
        return PromptTemplate(name, fallback_text)

    def build_system_prompt(self) -> str:
        """Build core system prompt."""
        return self.get_template("system").render()

    def build_analysis_prompt(
        self,
        patient_id: str = "UNKNOWN",
        age: int = 0,
        gender: str = "UNKNOWN",
        symptoms: Any = "",
        vitals: Any = "",
        notes: str = "",
    ) -> str:
        """Build clinical analysis prompt."""
        return self.get_template("analysis").render(
            patient_id=patient_id,
            age=age,
            gender=gender,
            symptoms=symptoms,
            vitals=vitals,
            notes=notes,
        )

    def build_patient_explanation_prompt(self, clinical_summary: str) -> str:
        """Build patient plain-language explanation prompt."""
        return self.get_template("patient").render(clinical_summary=clinical_summary)

    def build_referral_prompt(
        self,
        patient_id: str,
        destination_facility: str,
        findings: str,
    ) -> str:
        """Build doctor referral document prompt."""
        return self.get_template("referral").render(
            patient_id=patient_id,
            destination_facility=destination_facility,
            findings=findings,
        )


# Global Singleton PromptBuilder Instance
prompt_builder = PromptBuilder()
