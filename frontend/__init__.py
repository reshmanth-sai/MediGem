"""Frontend UI package for MediGem Clinical Co-Pilot."""

from frontend.app import build_app
from frontend.callbacks import handle_analysis_request, handle_demo_selection
from frontend.formatting import (
    format_analysis_quality,
    format_observation_list,
    format_reasoning_transparency,
    format_referral_letter,
    format_risk_card,
)
from frontend.themes import CLINICAL_CSS, get_clinical_theme

__all__ = [
    "build_app",
    "handle_analysis_request",
    "handle_demo_selection",
    "format_risk_card",
    "format_reasoning_transparency",
    "format_analysis_quality",
    "format_observation_list",
    "format_referral_letter",
    "get_clinical_theme",
    "CLINICAL_CSS",
]
