# MediGem Accessibility (WCAG 2.1/2.2 AA) & Medical Terminology Standards

> **Accessibility Requirements & Non-Diagnostic Clinical Writing Guidelines**

---

## ♿ Accessibility Requirements (WCAG 2.1/2.2 AA Compliance)

Contrast, keyboard, and ARIA requirements below are cited against WCAG 2.1 AA. The touch-target requirement in item 4 is cited against WCAG 2.2, since the Target Size (Minimum) criterion (2.5.8) was introduced in that version.

1. **Text Contrast Ratios** (measured by `npx vitest run lib/tokens.test.ts` against the shipped tokens in `lib/tokens.ts`, which mirror `styles/globals.css`; see `COLOR_SYSTEM.md` for the full matrix in both themes):
   - Primary text (`--ink`, `#1A211D`) on surface (`--surface`, `#FBFCFB`), Day theme: **15.96:1** (exceeds the WCAG AA body-text threshold of 4.5:1).
   - Muted text (`--ink-muted`, `#626C66`) on surface, Day theme: **5.30:1** (exceeds AA 4.5:1).
   - Action color (`--action`, `#2D3F73`) on surface, Day theme: **9.86:1** (exceeds AA 4.5:1).
   - Form input border (`--rule-strong`, `#8A958E`) on surface, Day theme: **3.02:1** (meets the separate WCAG 1.4.11 non-text threshold of 3:1, which applies to interactive component boundaries rather than body text).
   - Night theme equivalents and the full pair-by-pair matrix are in `COLOR_SYSTEM.md`.

2. **Keyboard Navigation & Focus Rings**:
   - All interactive controls (buttons, inputs, file upload zones, demo presets, accordions, sortable table headers) must be accessible via keyboard `Tab` / `Shift+Tab`, with focus never removed.
   - Focus indicator, set globally in `styles/globals.css`: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }`, where `--focus` is `#3B5099` in the Day theme and `#93A4E3` in the Night theme.

3. **Screen Reader ARIA Roles**:
   - Emergency alerts use `role="alert"` and `aria-live="assertive"`.
   - Live stage tracker updates use `role="status"` and `aria-live="polite"`.
   - Risk assessment badges include ARIA labels spelling out the level, produced by `components/ui/RiskIndicator.tsx` as `aria-label={\`Assessed risk level: ${label}\`}` (for example, "Assessed risk level: High risk").
   - Form validation summaries use `role="alert"` with `tabIndex={-1}` so focus can move to them programmatically after a failed submit or step advance, per `components/ui/ErrorSummary.tsx`.

4. **Minimum Touch & Click Target Sizes: two distinct numbers, not one.**

   These are not interchangeable, and the difference matters for anyone citing a conformance claim:

   - **WCAG 2.2's actual Success Criterion 2.5.8 (Target Size, Minimum) requires 24 by 24 CSS pixels.** This is the number that governs a conformance claim against WCAG 2.2 AA for the web. It is not 44px; 44px does not appear anywhere in the WCAG 2.2 specification's target-size criterion.
   - **44px by 44px is MediGem's own, stricter product floor**, applied everywhere in this app: buttons, checkboxes, table row actions, and every other interactive control. It is a deliberate design choice, not a requirement WCAG imposes. It is adopted because the primary device for this product is a tablet operated with gloved hands in clinical settings, where 24px is workable on the standard but not comfortable in practice. It is the same figure used in Apple's Human Interface Guidelines (44pt) for touch targets, borrowed here as a stricter internal bar, not cited as a WCAG number.
   - Concretely, in `components/ui/Button.tsx`: the `md` size is `h-11` (44px) and `lg` is `52px`, both clearing the 44px product floor directly through height. The `sm` size is only `h-9` (36px) tall, so it adds an invisible `before:` pseudo-element sized to a 44px hit area (`before:min-h-[44px]`) centered on the visible control, so the click/tap target still meets the 44px product floor even though the visible button is smaller. This `sm` size is permitted only in dense desktop contexts such as table row actions.
   - Do not describe 44px as "the WCAG minimum." State it as MediGem's product floor, which exceeds the WCAG 2.2 AA criterion of 24px.

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
