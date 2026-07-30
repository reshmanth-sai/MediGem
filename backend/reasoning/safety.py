"""Layered SafetyGuard enforcing medical AI policy, dosage prohibitions, and diagnostic safety."""

import re
from typing import List, Tuple

from backend.logging import logger
from backend.reasoning.exceptions import MedicalSafetyViolationError
from backend.reasoning.output_schema import ClinicalReasoningOutput


class SafetyGuard:
    """Layered safety enforcement system scanning AI outputs for prohibited claims or drug dosages."""

    PROHIBITED_DOSAGE_PATTERNS: List[re.Pattern] = [
        re.compile(r"\b\d+\s*(mg|mcg|g|ml| tablets?| capsules?)\b", re.IGNORECASE),
        re.compile(r"\bprescribe\s+[a-z]+", re.IGNORECASE),
        re.compile(r"\bdose:\s*\d+", re.IGNORECASE),
    ]

    PROHIBITED_CERTITUDE_PATTERNS: List[re.Pattern] = [
        re.compile(r"\bdiagnosed with\b", re.IGNORECASE),
        re.compile(r"\bdefinitive diagnosis\b", re.IGNORECASE),
        re.compile(r"\bguaranteed cure\b", re.IGNORECASE),
        re.compile(r"\b100%\s*certain\b", re.IGNORECASE),
    ]

    def validate_safety(self, output: ClinicalReasoningOutput) -> Tuple[bool, List[str]]:
        """Perform 3-stage safety evaluation on ClinicalReasoningOutput."""
        safety_flags: List[str] = []

        # Stage 1: Check clinical summary and recommendations text
        text_corpus = (
            f"{output.assessment.clinical_summary} "
            f"{output.recommendations.recommended_next_step} "
            f"{output.recommendations.follow_up_notes} "
            f"{output.patient_summary}"
        )

        # Stage 2: Policy Check for Definitive Diagnostic Certitude Claims
        for pattern in self.PROHIBITED_CERTITUDE_PATTERNS:
            match = pattern.search(text_corpus)
            if match:
                flag = f"PROHIBITED_CERTITUDE: Output contains unsupported claim '{match.group(0)}'."
                safety_flags.append(flag)
                logger.warning(f"SafetyGuard Policy Violation: {flag}")

        # Stage 3: Pattern Check for Drug Dosages & Prescriptions
        for pattern in self.PROHIBITED_DOSAGE_PATTERNS:
            match = pattern.search(text_corpus)
            if match:
                flag = f"PROHIBITED_DOSAGE: Output contains prohibited medication/dosage pattern '{match.group(0)}'."
                safety_flags.append(flag)
                logger.warning(f"SafetyGuard Dosage Violation: {flag}")

        is_safe = len(safety_flags) == 0

        # Update output safety field
        output.safety.is_safe = is_safe
        output.safety.safety_flags = safety_flags

        if not is_safe:
            logger.error(f"SafetyGuard rejected output with {len(safety_flags)} safety violations.")
            raise MedicalSafetyViolationError(
                f"AI Reasoning output violated medical safety policy: {'; '.join(safety_flags)}"
            )

        return True, []


# Global Singleton SafetyGuard Instance
safety_guard = SafetyGuard()
