"""ExplanationBuilder transforming ClinicalReasoningOutput into targeted presentation views."""

from typing import Any, Dict
from backend.reasoning.output_schema import ClinicalReasoningOutput


class ExplanationBuilder:
    """Builder class decoupling AI schema from UI presentation layers."""

    @staticmethod
    def build_worker_view(output: ClinicalReasoningOutput) -> Dict[str, Any]:
        """Construct structured presentation dictionary for rural healthcare workers."""
        return {
            "title": "Clinical Co-Pilot Assessment",
            "summary": output.assessment.clinical_summary,
            "risk_level": output.assessment.risk_level.value,
            "confidence_level": output.assessment.confidence_level.value,
            "red_flags": output.assessment.red_flags,
            "recommended_next_step": output.recommendations.recommended_next_step,
            "needs_referral": output.recommendations.needs_referral,
            "requires_human_review": output.recommendations.requires_human_review,
            "evidence": [
                {"source": obs.source, "observation": obs.observation}
                for obs in output.observations
            ],
            "limitations": output.limitations,
        }

    @staticmethod
    def build_patient_view(output: ClinicalReasoningOutput) -> Dict[str, Any]:
        """Construct empathetic plain-language view for patients and families."""
        return {
            "title": "Patient Summary & Care Guide",
            "explanation": output.patient_summary,
            "next_steps": output.recommendations.recommended_next_step,
            "warning": "If symptoms worsen, please notify clinic staff immediately.",
        }

    @staticmethod
    def build_referral_note(output: ClinicalReasoningOutput) -> Dict[str, Any]:
        """Construct formal medical transfer summary note for receiving facility doctors."""
        return {
            "title": "Urgent Doctor Referral Summary",
            "reason_for_referral": output.assessment.clinical_summary,
            "risk_level": output.assessment.risk_level.value,
            "key_observations": [obs.observation for obs in output.observations],
            "red_flags": output.assessment.red_flags,
            "recommended_facility": "Higher Level Medical Facility / Regional Hospital",
            "follow_up_notes": output.recommendations.follow_up_notes,
        }


# Global Singleton ExplanationBuilder Instance
explanation_builder = ExplanationBuilder()
