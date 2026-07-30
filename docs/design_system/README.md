# MediGem Master Design System Specification

> **Single Source of Truth for Visual Identity, Layout, Components & Healthcare UX**

Welcome to the **MediGem Design System Specification**. This document suite defines the framework-independent visual identity, design tokens, color palette, typography scale, component library, accessibility standards, and page wireframe specifications for MediGem.

---

## 📚 Design System Document Index

1. [**Brand Identity (`BRAND_IDENTITY.md`)**](BRAND_IDENTITY.md): Mission, personality, visual tone (*Trustworthy, Calm, Professional, Human, Reliable, Transparent, Offline-first, Clinical*), logo guidelines.
2. [**Design Principles (`DESIGN_PRINCIPLES.md`)**](DESIGN_PRINCIPLES.md): 10 core healthcare and human-centered AI principles.
3. [**Design Tokens (`DESIGN_TOKENS.md`)**](DESIGN_TOKENS.md): CSS variables and JSON schema for colors, typography, spacing, border radii, elevation, and motion curves.
4. [**Color System & Night Mode (`COLOR_SYSTEM.md`)**](COLOR_SYSTEM.md): Semantic medical palette, WCAG 2.1 AA/AAA contrast values, colorblindness accessibility matrix (Deutan/Protan/Tritan), and low-light night mode.
5. [**Typography System (`TYPOGRAPHY_SYSTEM.md`)**](TYPOGRAPHY_SYSTEM.md): Inter font hierarchy, typescale table, line-heights, monospace rules.
6. [**Atomic Component Library (`COMPONENTS.md`)**](COMPONENTS.md): Visual specifications for buttons, text inputs, file upload dropzones, cards, and sliders.
7. [**AI & Medical UI Components (`AI_AND_MEDICAL_COMPONENTS.md`)**](AI_AND_MEDICAL_COMPONENTS.md): Emergency Interception Banner, Risk Assessment Badge Card, Reasoning Transparency Card, Live Stage Progress Tracker, and Clinical Referral Memorandum Drawer.
8. [**Accessibility & Terminology Standards (`ACCESSIBILITY_AND_TERMINOLOGY.md`)**](ACCESSIBILITY_AND_TERMINOLOGY.md): WCAG 2.1 AA contrast, ARIA roles, minimum touch targets (44px), and non-diagnostic medical writing rules (*"Clinical Summary"* vs *"Diagnosis"*).
9. [**Page Wireframes & State Machine (`PAGE_TEMPLATES.md`)**](PAGE_TEMPLATES.md): Layout grids, 3-column proportional workspace, and UI state transition matrix.

---

## ✅ UI Consistency Checklist

Every current and future MediGem screen must pass this 7-point consistency audit:

- [x] **Whitespace over Borders**: Uses 14px card border radius (`--radius-card`) and subtle border color (`#E2E8F0`) rather than heavy black outlines.
- [x] **Primary Brand Accent**: Uses Primary Teal (`#0D9488`) for primary action buttons, active tab indicators, and header highlights.
- [x] **Non-Diagnostic Copy**: Uses *"Clinical Summary"*, *"Possible Findings"*, and *"Recommend Medical Evaluation"* across all UI labels.
- [x] **Colorblind Safety**: Combines color with bold text labels, shapes, and icons for all medical risk badges.
- [x] **Offline Status Visibility**: Displays `🟢 OFFLINE FIRST` and `MODEL: GEMMA 3 4B` badges in top header.
- [x] **Reasoning Transparency**: Includes the *"Why was this recommendation generated?"* card on every analysis output.
- [x] **WCAG 2.1 AA Compliance**: All text elements meet or exceed 4.5:1 contrast ratios on white surfaces.
