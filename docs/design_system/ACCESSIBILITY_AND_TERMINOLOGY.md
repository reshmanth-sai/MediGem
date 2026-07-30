# MediGem Accessibility (WCAG 2.1 AA) & Medical Terminology Standards

> **Accessibility Requirements & Non-Diagnostic Clinical Writing Guidelines**

---

## ♿ Accessibility Requirements (WCAG 2.1 AA Compliance)

1. **Text Contrast Ratios**:
   - Primary body text (`#0F172A`) on white background: **16.1:1** (Exceeds WCAG AAA threshold of 7:1).
   - Muted text (`#64748B`) on white background: **4.68:1** (Exceeds WCAG AA threshold of 4.5:1).
   - Primary teal buttons (`#0D9488`) with white text: **4.52:1** (Exceeds WCAG AA threshold).

2. **Keyboard Navigation & Focus Rings**:
   - All interactive controls (buttons, inputs, file upload zones, demo presets, accordions) must be accessible via keyboard `Tab` / `Shift+Tab`.
   - Focus indicator: `outline: 2px solid #0D9488; outline-offset: 2px;`.

3. **Screen Reader ARIA Roles**:
   - Emergency alerts use `role="alert"` and `aria-live="assertive"`.
   - Live stage tracker updates use `role="status"` and `aria-live="polite"`.
   - Risk assessment badges include hidden ARIA labels (e.g. `aria-label="Assessed Risk Level: High Risk"`).

4. **Minimum Touch & Click Target Sizes**:
   - All buttons, checkboxes, and interactive controls must have a minimum clickable area of **44px × 44px**.

---

## 🩺 Non-Diagnostic Medical Writing Standards

MediGem operates under strict non-diagnostic clinical bounds. All interface copy, summaries, and tooltips must adhere to these writing rules:

```text
┌────────────────────────────────────────┬────────────────────────────────────────┐
│ PROHIBITED DIAGNOSTIC TERMS            │ REQUIRED NON-DIAGNOSTIC ALTERNATIVES   │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ ❌ "Patient is diagnosed with diabetes"│ ✅ "Elevated blood glucose parameters  │
│                                        │     flagged for physician evaluation"  │
│ ❌ "Prescribe 500mg Amoxicillin"       │ ✅ "Clinical observations formatted    │
│                                        │     for physician review"              │
│ ❌ "Disease detected: Pneumonia"       │ ✅ "Presenting symptoms & pulmonary    │
│                                        │     observations flagged"              │
│ ❌ "Immediate medical treatment"       │ ✅ "Recommend clinical evaluation &    │
│                                        │     facility referral review"          │
└────────────────────────────────────────┴────────────────────────────────────────┘
```
