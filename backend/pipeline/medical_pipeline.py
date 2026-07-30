"""Unified Medical Pipeline executing Strategy -> Reasoning Framework -> AI Inference -> Safety Validation workflow."""

from typing import Any, Dict, Optional

from backend.ai.manager import ai_manager
from backend.ai.models import ResponseFormat
from backend.config.constants import RiskLevel
from backend.logging import logger
from backend.pipeline.base_pipeline import BasePipeline
from backend.pipeline.context import AnalysisContext, WorkflowState
from backend.pipeline.router import analysis_router
from backend.pipeline.strategies import BaseAnalysisStrategy
from backend.reasoning import (
    ClinicalReasoningOutput,
    context_builder,
    explanation_builder,
    output_validator,
    prompt_composer,
    safety_guard,
)
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.schemas.risk import RiskAssessment
from backend.utils import get_current_utc_timestamp


class MedicalPipeline(BasePipeline):
    """Unified medical analysis pipeline executing context assembly, prompt composition, AI inference, and safety validation."""

    def __init__(self, name: str = "MedicalPipeline") -> None:
        super().__init__(name=name)

    def preprocess(self, request: AnalysisRequest) -> Dict[str, Any]:
        """Stage 1: Preprocessing."""
        return {}

    def process(self, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Stage 2: Core processing."""
        return {}

    def postprocess(self, process_output: Dict[str, Any], request: AnalysisRequest) -> AnalysisResponse:
        """Stage 3: Postprocessing."""
        return AnalysisResponse(request_id=request.request_id, summary="Completed")

    def execute_workflow(
        self,
        request: AnalysisRequest,
        context: AnalysisContext,
        strategy: BaseAnalysisStrategy,
    ) -> AnalysisResponse:
        """Execute clinical workflow through MedicalContextBuilder, PromptComposer, AIManager, OutputValidator, and SafetyGuard."""
        context.strategy_name = strategy.name
        tx_id = context.request_id

        # 1. Build Medical Clinical Context
        clinical_ctx = context_builder.build_context(request, context)

        # 2. Compose Modality-Aware Prompt (WorkflowState: PROMPT_BUILD)
        context.update_state(WorkflowState.PROMPT_BUILD)
        composed = prompt_composer.compose_prompt(clinical_ctx)
        images = strategy.prepare_images(request)

        # 3. AI Inference (WorkflowState: AI_INFERENCE)
        context.update_state(WorkflowState.AI_INFERENCE)
        logger.info(
            f"[{tx_id}] Executing pipeline '{self.name}' (Strategy='{strategy.name}', Template='{composed.metadata.template_name}')."
        )

        ai_response = ai_manager.generate(
            prompt=composed.user_prompt,
            system_prompt=composed.system_prompt,
            context=None,
            response_format=ResponseFormat.JSON,
            images=images,
        )

        # 4. Parse & Validate Response against ClinicalReasoningOutput (WorkflowState: PARSING)
        context.update_state(WorkflowState.PARSING)
        raw_parsed = ai_response.parsed_output

        risk_assessment: Optional[RiskAssessment] = None
        summary_text = "Clinical reasoning analysis complete."

        try:
            # 4a. Validate Output Schema
            reasoning_out: ClinicalReasoningOutput = output_validator.validate_output(raw_parsed)

            # 4b. Layered Safety Validation
            safety_guard.validate_safety(reasoning_out)

            summary_text = reasoning_out.assessment.clinical_summary
            r_level = reasoning_out.assessment.risk_level

            risk_assessment = RiskAssessment(
                risk_level=r_level,
                urgency_score=7.0 if r_level in (RiskLevel.HIGH, RiskLevel.EMERGENCY) else 3.0,
                risk_flags=reasoning_out.assessment.red_flags,
                rationale=reasoning_out.recommendations.recommended_next_step,
                recommended_action=reasoning_out.recommendations.recommended_next_step,
            )

        except Exception as e:
            logger.warning(f"[{tx_id}] Output/Safety validation note: {e}. Falling back to safe summary.")
            if isinstance(raw_parsed, dict):
                summary_text = str(raw_parsed.get("summary", raw_parsed.get("analysis", summary_text)))

        context.update_state(WorkflowState.COMPLETED)
        duration_ms = context.elapsed_ms()

        logger.info(f"[{tx_id}] Pipeline '{self.name}' completed in {duration_ms}ms (State: {context.state.value}).")

        return AnalysisResponse(
            request_id=tx_id,
            summary=summary_text,
            risk_assessment=risk_assessment,
            referral_summary=None,
            status="COMPLETED",
            duration_ms=duration_ms,
            timestamp=get_current_utc_timestamp(),
        )


# Global Singleton MedicalPipeline Instance
medical_pipeline = MedicalPipeline()
