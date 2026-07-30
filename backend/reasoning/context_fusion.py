"""Context Fusion Engine merging clinical context, processed input, and enrichments into an immutable ReasoningContext."""

from typing import Optional

from backend.input.models import ProcessedMedicalInput
from backend.logging import logger
from backend.reasoning.context_builder import ClinicalContext
from backend.reasoning.context_enhancers import context_enhancer
from backend.reasoning.output_schema import ReasoningMetadata
from backend.reasoning.reasoning_context import (
    AllowedCapabilities,
    ReasoningContext,
)


class ContextFusionEngine:
    """Engine responsible for fusing clinical context, processed medical inputs, and enrichment notes."""

    @staticmethod
    def fuse_context(
        clinical_context: ClinicalContext,
        processed_input: Optional[ProcessedMedicalInput] = None,
    ) -> ReasoningContext:
        """Fuse clinical context, processed input, and context enrichments into an immutable ReasoningContext."""
        tx_id = clinical_context.request_id

        # 1. Run Context Enhancer
        enrichments, completeness = context_enhancer.enhance_context(
            clinical_context=clinical_context,
            processed_input=processed_input,
        )

        metadata = ReasoningMetadata(
            reasoning_version="1.0",
            modality=clinical_context.modality,
        )

        reasoning_ctx = ReasoningContext(
            clinical_context=clinical_context,
            processed_input=processed_input,
            enrichments=enrichments,
            completeness=completeness,
            capabilities=AllowedCapabilities(),
            metadata=metadata,
        )

        logger.info(
            f"[{tx_id}] Context Fusion complete (Completeness: {completeness.value}, Enrichments: {len(enrichments)})."
        )
        return reasoning_ctx


# Global Singleton ContextFusionEngine Instance
context_fusion_engine = ContextFusionEngine()
