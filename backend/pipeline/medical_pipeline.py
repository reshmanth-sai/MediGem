"""Unified Medical Pipeline executing Strategy -> AI Inference -> Parser workflow."""

from typing import Any, Dict, Optional

from backend.ai.manager import ai_manager
from backend.ai.models import ResponseFormat
from backend.logging import logger
from backend.pipeline.base_pipeline import BasePipeline
from backend.pipeline.context import AnalysisContext, WorkflowState
from backend.pipeline.router import analysis_router
from backend.pipeline.strategies import BaseAnalysisStrategy
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.schemas.risk import RiskAssessment
from backend.utils import get_current_utc_timestamp


class MedicalPipeline(BasePipeline):
    """Unified medical analysis pipeline executing strategy prompt generation and AI inference."""

    def __init__(self, name: str = "MedicalPipeline") -> None:
        super().__init__(name=name)

    def preprocess(self, request: AnalysisRequest) -> Dict[str, Any]:
        """Stage 1: Resolve strategy and prepare images."""
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
        """Execute clinical workflow through resolved strategy, AI manager, and parser."""
        context.strategy_name = strategy.name
        tx_id = context.request_id

        # 1. Build Prompt (WorkflowState: PROMPT_BUILD)
        context.update_state(WorkflowState.PROMPT_BUILD)
        prompt_text = strategy.build_prompt(request, context)
        sys_prompt = strategy.get_system_prompt()
        images = strategy.prepare_images(request)

        # 2. AI Inference (WorkflowState: AI_INFERENCE)
        context.update_state(WorkflowState.AI_INFERENCE)
        logger.info(f"[{tx_id}] Executing pipeline '{self.name}' with strategy '{strategy.name}' for modality '{strategy.modality.value}'.")

        ai_response = ai_manager.generate(
            prompt=prompt_text,
            system_prompt=sys_prompt,
            context=None,
            response_format=ResponseFormat.JSON,
            images=images,
        )

        # 3. Parse & Construct Response (WorkflowState: PARSING)
        context.update_state(WorkflowState.PARSING)
        parsed_data = ai_response.parsed_output

        summary_text = "Clinical analysis completed."
        risk_assessment: Optional[RiskAssessment] = None

        if isinstance(parsed_data, dict):
            summary_text = parsed_data.get("summary", parsed_data.get("analysis", "Clinical assessment completed."))
            raw_risk = parsed_data.get("risk_assessment")
            if isinstance(raw_risk, dict):
                try:
                    risk_assessment = RiskAssessment.model_validate(raw_risk)
                except Exception as e:
                    logger.warning(f"[{tx_id}] Could not parse RiskAssessment sub-model: {e}")

        context.update_state(WorkflowState.COMPLETED)
        duration_ms = context.elapsed_ms()

        logger.info(f"[{tx_id}] Pipeline '{self.name}' completed in {duration_ms}ms (State: {context.state.value}).")

        return AnalysisResponse(
            request_id=tx_id,
            summary=str(summary_text),
            risk_assessment=risk_assessment,
            referral_summary=None,
            status="COMPLETED",
            duration_ms=duration_ms,
            timestamp=get_current_utc_timestamp(),
        )


# Global Singleton MedicalPipeline Instance
medical_pipeline = MedicalPipeline()
