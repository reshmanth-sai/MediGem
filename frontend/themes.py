"""Custom Clinical SaaS Theme, Micro-Interactions, and CSS styling for MediGem Gradio Application."""

import gradio as gr

CLINICAL_CSS = """
/* MediGem Clinical SaaS Global CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --primary-teal: #0D9488;
    --primary-teal-dark: #0F766E;
    --primary-teal-light: #F0FDFA;
    --slate-dark: #0F172A;
    --slate-muted: #64748B;
    --border-color: #E2E8F0;
    --card-bg: #FFFFFF;
    --body-bg: #F8FAFC;
}

body, .gradio-container {
    background-color: var(--body-bg) !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
    color: var(--slate-dark) !important;
}

/* Header Styling */
.medigem-header {
    background: linear-gradient(135deg, #0F766E 0%, #0D9488 100%);
    color: white;
    padding: 1.25rem 2rem;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.medigem-header:hover {
    box-shadow: 0 6px 16px rgba(13, 148, 136, 0.25);
}

.medigem-header h1 {
    font-size: 1.75rem !important;
    font-weight: 700 !important;
    color: white !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.medigem-header p {
    color: #CCFBF1 !important;
    margin-top: 0.25rem !important;
    font-size: 0.95rem !important;
}

/* Card Styling & Micro-Interactions */
.medigem-card {
    background-color: var(--card-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 14px !important;
    padding: 1.25rem !important;
    margin-bottom: 1rem !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.medigem-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -2px rgba(15, 23, 42, 0.08) !important;
    border-color: #CBD5E1 !important;
}

/* Empty State Styling */
.empty-state-card {
    background-color: #F8FAFC !important;
    border: 2px dashed #E2E8F0 !important;
    border-radius: 14px !important;
    padding: 2rem 1.5rem !important;
    text-align: center !important;
    color: #94A3B8 !important;
    transition: all 0.2s ease !important;
}

.empty-state-card:hover {
    border-color: #0D9488 !important;
    background-color: #F0FDFA !important;
}

/* Demo Gallery Preset Cards */
.demo-preset-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
}

.demo-preset-card:hover {
    border-color: #0D9488;
    background-color: #F0FDFA;
    transform: translateY(-2px);
}

/* Risk Badges */
.risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.025em;
    text-transform: uppercase;
}

.risk-badge.LOW {
    background-color: #DCFCE7;
    color: #15803D;
    border: 1px solid #86EFAC;
}

.risk-badge.MODERATE {
    background-color: #FEF9C3;
    color: #A16207;
    border: 1px solid #FDE047;
}

.risk-badge.HIGH {
    background-color: #FFEDD5;
    color: #C2410C;
    border: 1px solid #FDBA74;
}

.risk-badge.EMERGENCY {
    background-color: #FEE2E2;
    color: #B91C1C;
    border: 1px solid #FCA5A5;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Live Stage Tracker */
.stage-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
    padding: 0.3rem 0;
    color: #64748B;
}

.stage-item.completed {
    color: #0F766E;
    font-weight: 600;
}

.stage-item.active {
    color: #0D9488;
    font-weight: 700;
    animation: pulse 1.5s infinite;
}

/* Footer Styling */
.medigem-footer {
    text-align: center;
    padding: 1.5rem;
    color: var(--slate-muted);
    font-size: 0.85rem;
    border-top: 1px solid var(--border-color);
    margin-top: 2rem;
}
"""


def get_clinical_theme() -> gr.Theme:
    """Create custom Gradio theme adhering to Clinical SaaS design guidelines."""
    return gr.themes.Soft(
        primary_hue=gr.themes.colors.teal,
        secondary_hue=gr.themes.colors.slate,
        neutral_hue=gr.themes.colors.slate,
        font=[gr.themes.GoogleFont("Inter"), "system-ui", "sans-serif"],
    ).set(
        body_background_fill="#F8FAFC",
        block_background_fill="#FFFFFF",
        block_border_width="1px",
        block_border_color="#E2E8F0",
        block_radius="14px",
        button_primary_background_fill="#0D9488",
        button_primary_background_fill_hover="#0F766E",
        button_primary_text_color="#FFFFFF",
    )
