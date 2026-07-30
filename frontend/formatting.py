"""HTML and Visual Formatters for MediGem Gradio UI."""

from typing import Any, Dict, List, Optional


def format_empty_state(title: str = "No Analysis Executed", message: str = "Upload a medical file or click a Demo Mode preset to begin analysis.") -> str:
    """Format standardized friendly empty state card."""
    return f"""
    <div class="empty-state-card">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🩺</div>
        <h4 style="margin: 0; color: #475569; font-weight: 600;">{title}</h4>
        <p style="margin: 0.3rem 0 0 0; font-size: 0.88rem; color: #94A3B8;">{message}</p>
    </div>
    """


def format_risk_card(risk_level: str, urgency_score: float = 0.0, emergency_intercepted: bool = False) -> str:
    """Format Risk Assessment Badge Card with color coding."""
    r_upper = str(risk_level).upper()

    icon_map = {
        "LOW": "🟢",
        "MODERATE": "🟡",
        "HIGH": "🟠",
        "EMERGENCY": "🚨",
    }
    icon = icon_map.get(r_upper, "⚠️")

    if emergency_intercepted:
        return f"""
        <div class="medigem-card" style="border-left: 6px solid #DC2626; background-color: #FEF2F2;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div class="risk-badge EMERGENCY">
                    🚨 ACUTE EMERGENCY INTERCEPTED
                </div>
                <span style="font-weight: 700; color: #DC2626; font-size: 1.1rem;">URGENCY: 10/10</span>
            </div>
            <p style="color: #991B1B; margin-top: 0.75rem; font-weight: 600; font-size: 0.95rem;">
                ⚠️ Deterministic Emergency Safety Engine intercepted critical symptoms. LLM inference blocked for immediate safety.
            </p>
        </div>
        """

    return f"""
    <div class="medigem-card">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <span style="font-size: 0.85rem; color: #64748B; font-weight: 600; text-transform: uppercase;">Assessed Risk Level</span>
                <div style="margin-top: 0.25rem;">
                    <span class="risk-badge {r_upper}">
                        {icon} {r_upper} RISK
                    </span>
                </div>
            </div>
            {f'<div style="text-align: right;"><span style="font-size: 0.85rem; color: #64748B; font-weight: 600;">URGENCY SCORE</span><div style="font-size: 1.25rem; font-weight: 700; color: #0F172A;">{urgency_score:.1f} / 10</div></div>' if urgency_score > 0 else ''}
        </div>
    </div>
    """


def format_reasoning_transparency(reasons: List[str]) -> str:
    """Format 'Why was this recommendation generated?' reasoning transparency card."""
    if not reasons:
        reasons = [
            "Clinical presentation and symptoms analyzed.",
            "Emergency rule checks passed without triggering critical alert.",
            "Reasoning constrained by non-diagnostic healthcare safety bounds.",
        ]

    bullets = "".join([f"<li style='margin-bottom: 0.4rem; color: #334155;'>{r}</li>" for r in reasons])

    return f"""
    <div class="medigem-card" style="background-color: #F0FDFA; border-color: #CCFBF1;">
        <div class="section-title" style="color: #0F766E;">
            💡 Why was this recommendation generated? (Reasoning Transparency)
        </div>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.9rem;">
            {bullets}
        </ul>
    </div>
    """


def format_analysis_quality(
    confidence: str = "MEDIUM",
    completeness: str = "PARTIAL",
    quality_level: str = "GOOD",
    ocr_confidence: Optional[float] = None,
    validation_status: str = "VALIDATED",
) -> str:
    """Format Analysis Quality Card."""
    ocr_str = f"{ocr_confidence * 100:.0f}%" if ocr_confidence is not None else "N/A (Layer/Text)"

    return f"""
    <div class="medigem-card">
        <div class="section-title">
            📊 Analysis Quality & Provenance
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-size: 0.88rem;">
            <div><strong style="color: #64748B;">AI Confidence:</strong> <span style="font-weight: 600; color: #0F766E;">{confidence}</span></div>
            <div><strong style="color: #64748B;">Completeness:</strong> <span style="font-weight: 600; color: #0F766E;">{completeness}</span></div>
            <div><strong style="color: #64748B;">Input Quality:</strong> <span style="font-weight: 600; color: #0F766E;">{quality_level}</span></div>
            <div><strong style="color: #64748B;">OCR Confidence:</strong> <span style="font-weight: 600; color: #0F766E;">{ocr_str}</span></div>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #16A34A; font-weight: 600; display: flex; align-items: center; gap: 0.3rem;">
            ✓ Validation Status: {validation_status} (SafetyGuard Verified)
        </div>
    </div>
    """


def format_observation_list(observations: List[Dict[str, Any]]) -> str:
    """Format clinical observations into structured HTML cards."""
    if not observations:
        return "<p style='color: #64748B; font-style: italic;'>No specific clinical observations flagged.</p>"

    cards = []
    for obs in observations:
        finding = obs.get("finding", "Observation")
        ev = obs.get("evidence", "")
        conf = obs.get("confidence", "MEDIUM")
        imp = obs.get("clinical_importance", "")

        cards.append(
            f"""
            <div class="observation-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #0F172A; font-size: 0.95rem;">{finding}</strong>
                    <span style="font-size: 0.75rem; background-color: #E2E8F0; padding: 0.15rem 0.5rem; border-radius: 4px; color: #475569;">Conf: {conf}</span>
                </div>
                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #475569;">{ev}</p>
                {f'<div style="font-size: 0.8rem; color: #0D9488; margin-top: 0.2rem;">Importance: {imp}</div>' if imp else ''}
            </div>
            """
        )
    return "".join(cards)


def format_referral_letter(referral_data: Optional[Dict[str, Any]]) -> str:
    """Format clinical referral letter for export or display."""
    if not referral_data:
        return "<p style='color: #64748B;'>Referral summary not generated for this analysis.</p>"

    reason = referral_data.get("reason_for_referral", "Clinical evaluation required")
    priority = referral_data.get("priority", "ROUTINE")
    notes = referral_data.get("clinical_summary", "")

    return f"""
    <div style="border: 1px solid #CBD5E1; padding: 1.25rem; border-radius: 8px; background-color: #FFFFFF; font-family: monospace; font-size: 0.88rem;">
        <h4 style="margin: 0 0 0.5rem 0; color: #0F172A; text-decoration: underline;">CLINICAL REFERRAL MEMORANDUM</h4>
        <p><strong>PRIORITY:</strong> {priority}</p>
        <p><strong>REASON FOR REFERRAL:</strong> {reason}</p>
        <p><strong>CLINICAL NOTES:</strong> {notes}</p>
    </div>
    """


def format_stage_tracker(active_stage_index: int = 0) -> str:
    """Format live pipeline stage tracker HTML."""
    stages = [
        "Upload Complete",
        "Input Processing",
        "OCR Extraction",
        "Context Fusion",
        "Gemma Reasoning",
        "Output Validation",
        "Safety Guard",
        "Explanation Builder",
        "Completed",
    ]

    html_items = []
    for idx, stage in enumerate(stages):
        if idx < active_stage_index:
            cls = "stage-item completed"
            icon = "✓"
        elif idx == active_stage_index:
            cls = "stage-item active"
            icon = "⟳"
        else:
            cls = "stage-item"
            icon = "□"
        html_items.append(f"<div class='{cls}'><span>{icon}</span> {stage}</div>")

    return f"""
    <div class="medigem-card" style="padding: 0.75rem 1rem;">
        <div style="font-weight: 600; font-size: 0.85rem; color: #0F172A; margin-bottom: 0.4rem;">LIVE PIPELINE PROGRESS</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem;">
            {''.join(html_items)}
        </div>
    </div>
    """
