"""Custom Clinical SaaS Theme and CSS styling for MediGem Gradio Application."""

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
    box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.1), 0 2px 4px -1px rgba(13, 148, 136, 0.06);
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

/* Card Styling */
.medigem-card {
    background-color: var(--card-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: 14px !important;
    padding: 1.25rem !important;
    margin-bottom: 1rem !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
    transition: all 0.2s ease-in-out !important;
}

.medigem-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07) !important;
}

/* Risk Badges */
.risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.1rem;
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

/* Section Titles */
.section-title {
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    color: var(--slate-dark) !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem !important;
}

/* Observation Cards */
.observation-card {
    background-color: #F8FAFC;
    border-left: 4px solid var(--primary-teal);
    padding: 0.75rem 1rem;
    border-radius: 0 8px 8px 0;
    margin-bottom: 0.5rem;
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
