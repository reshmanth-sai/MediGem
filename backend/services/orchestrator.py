"""Master Orchestrator coordinating validation, emergency gate, router, and medical pipeline execution."""

from typing import Optional

from backend.config.constants import RiskLevel
from backend.emergency import emergency_engine
from backend.emergency.constants import RulePriority
from backend.exceptions import ApplicationError
from backend.logging import logger
from backend.pipeline import (
    AnalysisContext,
    AnalysisRouter,
    MedicalPipeline,
    WorkflowState,
    analysis_router,
    medical_pipeline,
)
from backend.schemas.analysis import AnalysisRequest, AnalysisResponse
from backend.schemas.referral import ReferralSummary
from backend.schemas.risk import RiskAssessment
from backend.utils import get_current_utc_timestamp
from backend.validation import request_validator


class MediGemOrchestrator:
    """Master workflow orchestrator coordinating Request Validation, Emergency Safety Gate, Strategy Routing, and Medical Pipeline execution."""

    def __init__(
        self,
        router: Optional[AnalysisRouter] = None,
        pipeline: Optional[MedicalPipeline] = None,
    ) -> None:
        self.router: AnalysisRouter = router or analysis_router
        self.pipeline: MedicalPipeline = pipeline or medical_pipeline

    def process_analysis_request(self, request: AnalysisRequest) -> AnalysisResponse:
        """Process clinical analysis request through the complete MediGem workflow."""
        context = AnalysisContext(
            request_id=request.request_id,
            patient_id=request.patient.patient_id if request.patient else "UNKNOWN",
        )
        tx_id = context.request_id

        try:
            # Stage 1: Request Validation (State: VALIDATING)
            modality = request_validator.validate_request(request, context)

            # Stage 2: Emergency Safety Gate (State: EMERGENCY_CHECK)
            context.update_state(WorkflowState.EMERGENCY_CHECK)
            symptoms = request.patient.symptoms if request.patient else []
            emg_response = emergency_engine.evaluate(
                symptoms=symptoms,
                patient_id=context.patient_id,
                request_id=tx_id,
            )

            context.safe_for_ai_processing = emg_response.safe_for_ai_processing

            # SAFETY INTERCEPTION: If acute emergency detected, BLOCK Gemma and return immediate emergency response!
            if emg_response.emergency_detected or not emg_response.safe_for_ai_processing:
                context.update_state(WorkflowState.EMERGENCY_INTERCEPTED)
                duration_ms = context.elapsed_ms()

                logger.warning(
                    f"[{tx_id}] SAFETY GATE INTERCEPTED: Acute emergency detected ({emg_response.emergency_category.value if emg_response.emergency_category else 'EMERGENCY'}). "
                    f"Blocking LLM inference. Immediate referral generated in {duration_ms}ms."
                )

                # Map priority to RiskLevel
                p_str = str(emg_response.priority).upper()
                if p_str == "CRITICAL" or p_str == "4":
                    risk_lvl = RiskLevel.EMERGENCY
                    u_score = 9.5
                elif p_str == "HIGH" or p_str == "3":
                    risk_lvl = RiskLevel.HIGH
                    u_score = 8.0
                elif p_str == "MEDIUM" or p_str == "2":
                    risk_lvl = RiskLevel.MODERATE
                    u_score = 5.0
                else:
                    risk_lvl = RiskLevel.LOW
                    u_score = 2.0

                risk_assessment = RiskAssessment(
                    risk_level=risk_lvl,
                    urgency_score=u_score,
                    risk_flags=emg_response.matched_symptoms,
                    rationale=emg_response.matched_reason,
                    recommended_action=emg_response.recommended_action,
                )

                referral = None
                if emg_response.should_refer_immediately:
                    referral = ReferralSummary(
                        referral_id=f"REF-{tx_id}",
                        patient_id=context.patient_id or "UNKNOWN",
                        facility_level=emg_response.recommended_action,
                        key_findings=emg_response.matched_symptoms,
                        summary_notes=emg_response.reason,
                        timestamp=get_current_utc_timestamp(),
                    )

                return AnalysisResponse(
                    request_id=tx_id,
                    summary=f"EMERGENCY GATE INTERCEPTION: {emg_response.reason}",
                    risk_assessment=risk_assessment,
                    referral_summary=referral,
                    status="EMERGENCY_INTERCEPTED",
                    duration_ms=duration_ms,
                    timestamp=get_current_utc_timestamp(),
                )

            # Stage 3: Strategy Routing (State: ROUTING)
            context.update_state(WorkflowState.ROUTING)
            strategy = self.router.get_strategy(modality)

            # Stage 4: Unified Medical Pipeline Execution (PROMPT_BUILD -> AI_INFERENCE -> PARSING -> COMPLETED)
            response = self.pipeline.execute_workflow(request, context, strategy)
            return response

        except Exception as e:
            context.update_state(WorkflowState.FAILED)
            duration_ms = context.elapsed_ms()
            logger.error(f"[{tx_id}] Master Orchestrator workflow failed at state {context.state.value}: {e}")

            if isinstance(e, ApplicationError):
                raise

            return AnalysisResponse(
                request_id=tx_id,
                summary=f"Workflow processing error: {e}",
                risk_assessment=None,
                referral_summary=None,
                status="FAILED",
                duration_ms=duration_ms,
                timestamp=get_current_utc_timestamp(),
            )


# Global Singleton Orchestrator Instance
orchestrator = MediGemOrchestrator()
