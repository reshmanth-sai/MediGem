"""Unified Medical Pipeline executing Input Processing -> Context Fusion -> Reasoning -> Gemma Inference -> Safety Validation."""

from typing import Any, Dict, Optional

from backend.ai.manager import ai_manager
from backend.ai.models import ResponseFormat
from backend.config.constants import RiskLevel
from backend.input.models import ProcessedMedicalInput
from backend.input.router import input_router
from backend.logging import logger
from backend.pipeline.base_pipeline import BasePipeline
from backend.pipeline.context import AnalysisContext, WorkflowState
from backend.pipeline.router import analysis_router
from backend.pipeline.strategies import BaseAnalysisStrategy
from backend.reasoning import (
    ClinicalReasoningOutput,
    context_builder,
    context_fusion_engine,
    explanation_builder,
    output_validator,
    prompt_composer,
    safety_guard,
)
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.schemas.risk import RiskAssessment
from backend.utils import get_current_utc_timestamp


class MedicalPipeline(BasePipeline):
    """Unified medical analysis pipeline executing input processing, context fusion, prompt composition, Gemma inference, and safety validation."""

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
        """Execute clinical workflow through Input Processing, Context Fusion, PromptComposer, AIManager, OutputValidator, and SafetyGuard."""
        context.strategy_name = strategy.name
        tx_id = context.request_id

        # 1. Process Input File/Text through Input Processing Framework
        processed_input: Optional[ProcessedMedicalInput] = None
        file_path = request.image.file_path if (request.image and request.image.file_path) else None

        if file_path or request.notes:
            try:
                processed_input = input_router.process_input(
                    request_id=tx_id,
                    modality=strategy.modality,
                    file_path=file_path,
                    raw_text=request.notes,
                )
            except Exception as e:
                logger.warning(f"[{tx_id}] Input processing note: {e}")

        # 2. Build Clinical Context & Fuse into ReasoningContext
        clinical_ctx = context_builder.build_context(request, context, processed_input)
        reasoning_ctx = context_fusion_engine.fuse_context(clinical_ctx, processed_input)

        # 3. Compose Modality-Aware Prompt (WorkflowState: PROMPT_BUILD)
        context.update_state(WorkflowState.PROMPT_BUILD)
        composed = prompt_composer.compose_prompt(clinical_ctx)
        images = strategy.prepare_images(request)

        # 4. Gemma AI Inference (WorkflowState: AI_INFERENCE)
        context.update_state(WorkflowState.AI_INFERENCE)
        logger.info(
            f"[{tx_id}] Executing pipeline '{self.name}' (Strategy='{strategy.name}', Completeness='{reasoning_ctx.completeness.value}')."
        )

        ai_response = ai_manager.generate(
            prompt=composed.user_prompt,
            system_prompt=composed.system_prompt,
            context=None,
            response_format=ResponseFormat.JSON,
            schema_model=ClinicalReasoningOutput,
            images=images,
        )

        # A model can satisfy a JSON-mode request with a bare "{}" when it
        # decides it must not answer. That is not an assessment. Ask once more,
        # naming the failure, before treating the run as degraded.
        if not self._has_payload(ai_response.parsed_output):
            logger.warning(f"[{tx_id}] Model returned an empty payload. Retrying once with an explicit instruction.")
            ai_response = ai_manager.generate(
                prompt=composed.user_prompt + self.EMPTY_PAYLOAD_NUDGE,
                system_prompt=composed.system_prompt,
                context=None,
                response_format=ResponseFormat.JSON,
                schema_model=ClinicalReasoningOutput,
                images=images,
            )

        # 5. Parse & Validate Response against ClinicalReasoningOutput (WorkflowState: PARSING)
        context.update_state(WorkflowState.PARSING)
        raw_parsed = ai_response.parsed_output

        risk_assessment: Optional[RiskAssessment] = None
        reasoning_json: Optional[Dict[str, Any]] = None
        summary_text = "Clinical reasoning analysis complete."

        try:
            # 5a. Validate Output Schema
            reasoning_out: ClinicalReasoningOutput = output_validator.validate_output(raw_parsed)

            # 5b. Layered Safety Validation
            safety_guard.validate_safety(reasoning_out)

            summary_text = reasoning_out.assessment.clinical_summary
            r_level = reasoning_out.assessment.risk_level
            reasoning_json = reasoning_out.model_dump(mode="json")

            risk_assessment = RiskAssessment(
                risk_level=r_level,
                urgency_score=7.0 if r_level in (RiskLevel.HIGH, RiskLevel.EMERGENCY) else 3.0,
                risk_flags=reasoning_out.assessment.red_flags,
                rationale=reasoning_out.recommendations.recommended_next_step,
                recommended_action=reasoning_out.recommendations.recommended_next_step,
            )

        except Exception as e:
            # No validated assessment exists. The response must say so rather
            # than pass a placeholder off as a completed run.
            logger.warning(f"[{tx_id}] Output/Safety validation failed: {e}. Marking run DEGRADED.")
            degraded = True
            summary_text = (
                "No validated assessment was produced: the model returned an empty or invalid payload. "
                "A health worker must review this case directly."
            )
            if isinstance(raw_parsed, dict) and raw_parsed:
                summary_text = str(raw_parsed.get("summary", raw_parsed.get("analysis", summary_text)))
        else:
            degraded = False

        context.update_state(WorkflowState.DEGRADED if degraded else WorkflowState.COMPLETED)
        duration_ms = context.elapsed_ms()

        logger.info(f"[{tx_id}] Pipeline '{self.name}' finished in {duration_ms}ms (State: {context.state.value}).")

        return AnalysisResponse(
            request_id=tx_id,
            summary=summary_text,
            risk_assessment=risk_assessment,
            referral_summary=None,
            status=context.state.value,
            duration_ms=duration_ms,
            timestamp=get_current_utc_timestamp(),
            reasoning=reasoning_json,
            input_summary=self._input_summary(processed_input),
        )

    @staticmethod
    def _input_summary(p: Optional[ProcessedMedicalInput]) -> Optional[Dict[str, Any]]:
        """The input stage's findings, in the shape the landing capture already documents."""
        if p is None:
            return None
        q = p.quality
        e = p.extracted_content
        m = getattr(p, "image_metadata", None)
        return {
            "ocr_performed": p.summary.ocr_performed,
            "processing_time_ms": round(p.summary.processing_time_ms, 2),
            "quality": None
            if q is None
            else {
                "blur_score": round(q.blur_score, 2),
                "brightness_score": round(q.brightness_score, 2),
                "contrast_score": round(q.contrast_score, 2),
                "resolution_score": round(q.resolution_score, 3),
                "quality_level": q.quality_level.value,
                "warnings": list(q.warnings),
            },
            "extracted": None
            if e is None
            else {"text": e.text, "confidence": round(e.confidence, 4), "language": e.language},
            "image": None
            if m is None
            else {"width": m.width, "height": m.height, "file_size_bytes": m.file_size_bytes},
        }

    EMPTY_PAYLOAD_NUDGE = (
        "\n\n--- RETRY ---\n"
        "Your previous reply was an empty JSON object, which is not an acceptable answer. "
        "Return the complete ClinicalReasoningOutput object with every field populated. "
        "Transcribing an existing prescription is verification, not a recommendation, and is required."
    )

    @staticmethod
    def _has_payload(parsed: Any) -> bool:
        return isinstance(parsed, dict) and len(parsed) > 0


# Global Singleton MedicalPipeline Instance
medical_pipeline = MedicalPipeline()
