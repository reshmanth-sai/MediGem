"""Provider-agnostic PromptComposer assembling modality-aware prompts."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from backend.ai.prompts import prompt_builder
from backend.pipeline.context import MedicalModality
from backend.reasoning.context_builder import ClinicalContext
from backend.reasoning.prompt_library import prompt_library


class PromptMetadata(BaseModel):
    """Metadata attached to composed prompts for audit and debugging."""
    template_name: str = Field(..., description="Prompt template name.")
    modality: MedicalModality = Field(..., description="Target modality.")
    version: str = Field(default="1.0", description="Reasoning framework version.")
    language: str = Field(default="en", description="Prompt target language.")


class ComposedPrompt(BaseModel):
    """Container holding system prompt, user prompt, and metadata."""
    system_prompt: str = Field(..., description="System instructions prompt.")
    user_prompt: str = Field(..., description="User query / context prompt.")
    metadata: PromptMetadata = Field(..., description="Prompt composition metadata.")


class PromptComposer:
    """Composer assembling provider-agnostic prompts from ClinicalContext and PromptLibrary."""

    def compose_prompt(self, context: ClinicalContext) -> ComposedPrompt:
        """Compose system and user prompts for given ClinicalContext."""
        modality = context.modality

        # 1. Assemble System Prompt with Base & Safety Fragments
        base_sys = prompt_builder.build_system_prompt()
        safety_frag = prompt_library.safety_instructions
        base_rules = prompt_library.base_rules

        system_prompt = (
            f"{base_sys}\n\n"
            f"--- SAFETY INSTRUCTIONS ---\n{safety_frag}\n\n"
            f"--- REASONING DIRECTIVES ---\n{base_rules}"
        )

        # 2. Select Modality Fragment
        modality_frag = ""
        mod_key = modality.value.lower()
        if mod_key in ("ecg", "lab_report", "prescription", "wound"):
            modality_frag = prompt_library.get_fragment(mod_key)

        # 3. Assemble User Query Prompt
        user_prompt = (
            f"Patient ID: {context.patient_id}\n"
            f"Age: {context.age}, Gender: {context.gender}\n"
            f"Presenting Symptoms: {', '.join(context.symptoms) if context.symptoms else 'None reported'}\n"
            f"Vital Signs: {context.vital_signs}\n"
            f"Worker Notes: {context.clinical_notes}\n"
        )

        if modality_frag:
            user_prompt += f"\n--- MODALITY SPECIFIC INSTRUCTIONS ({modality.value}) ---\n{modality_frag}\n"

        user_prompt += (
            f"\n--- REQUIRED JSON OUTPUT CONTRACT ---\n"
            f"Return a structured JSON object strictly adhering to the ClinicalReasoningOutput schema:\n"
            f"{{\n"
            f'  "metadata": {{"reasoning_version": "1.0", "modality": "{modality.value}"}},\n'
            f'  "observations": [{{"source": "symptoms", "observation": "description"}}],\n'
            f'  "assessment": {{\n'
            f'    "clinical_summary": "summary text",\n'
            f'    "risk_level": "LOW|MODERATE|HIGH|EMERGENCY",\n'
            f'    "confidence_level": "LOW|MEDIUM|HIGH",\n'
            f'    "red_flags": ["flag1"]\n'
            f'  }},\n'
            f'  "recommendations": {{\n'
            f'    "recommended_next_step": "action text",\n'
            f'    "needs_referral": true|false,\n'
            f'    "requires_human_review": true,\n'
            f'    "follow_up_notes": "notes"\n'
            f'  }},\n'
            f'  "patient_summary": "plain language explanation",\n'
            f'  "limitations": ["disclaimer 1", "disclaimer 2"],\n'
            f'  "safety": {{"is_safe": true, "safety_flags": []}}\n'
            f"}}\n"
        )

        meta = PromptMetadata(
            template_name=f"reasoning_{modality.value.lower()}",
            modality=modality,
            version="1.0",
        )

        return ComposedPrompt(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            metadata=meta,
        )


# Global Singleton PromptComposer Instance
prompt_composer = PromptComposer()
