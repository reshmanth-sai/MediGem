"""Analysis context and workflow state tracking models for MediGem pipelines."""

from enum import Enum
from typing import Any, Dict, Optional
import uuid
from pydantic import BaseModel, Field

from backend.utils import get_current_epoch_ms


class MedicalModality(str, Enum):
    """Supported clinical content modalities."""
    GENERAL = "GENERAL"
    ECG = "ECG"
    LAB_REPORT = "LAB_REPORT"
    PRESCRIPTION = "PRESCRIPTION"
    WOUND = "WOUND"


class WorkflowState(str, Enum):
    """States tracking pipeline execution lifecycle for audit and debugging."""
    VALIDATING = "VALIDATING"
    EMERGENCY_CHECK = "EMERGENCY_CHECK"
    ROUTING = "ROUTING"
    PROMPT_BUILD = "PROMPT_BUILD"
    AI_INFERENCE = "AI_INFERENCE"
    PARSING = "PARSING"
    COMPLETED = "COMPLETED"
    EMERGENCY_INTERCEPTED = "EMERGENCY_INTERCEPTED"
    FAILED = "FAILED"


class AnalysisContext(BaseModel):
    """Stateful context object accompanying requests through pipeline execution."""

    request_id: str = Field(
        default_factory=lambda: f"REQ-{uuid.uuid4().hex[:8].upper()}",
        description="Transaction request identifier.",
    )
    session_id: Optional[str] = Field(default=None, description="Optional user/health-worker session ID.")
    patient_id: Optional[str] = Field(default="UNKNOWN", description="Patient record ID.")
    modality: MedicalModality = Field(default=MedicalModality.GENERAL, description="Target clinical modality.")
    state: WorkflowState = Field(default=WorkflowState.VALIDATING, description="Current workflow state.")
    safe_for_ai_processing: bool = Field(default=True, description="Safety gate status from Emergency Engine.")
    start_time: float = Field(default_factory=get_current_epoch_ms, description="Epoch start timestamp in ms.")
    duration_ms: float = Field(default=0.0, description="Total execution duration in ms.")
    strategy_name: Optional[str] = Field(default=None, description="Resolved analysis strategy name.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary context attributes.")

    def update_state(self, new_state: WorkflowState) -> None:
        """Update current workflow state."""
        self.state = new_state

    def elapsed_ms(self) -> float:
        """Calculate elapsed execution time in milliseconds."""
        self.duration_ms = round(get_current_epoch_ms() - self.start_time, 2)
        return self.duration_ms
