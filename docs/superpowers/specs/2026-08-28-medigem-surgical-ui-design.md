# MediGem frontend_v2: Surgical UI Overhaul

**Date:** 2026-08-28
**Status:** Awaiting review
**Scope:** `frontend_v2/` only. Mock data stays. No backend work.

---

## 1. Context

`frontend_v2/` is a Next.js 15 / React 19 app, roughly 10,200 lines across 118 components and 13 routes. It renders entirely from mock data in `lib/casesData.ts`; `lib/api-client.ts` is a stub. That is deliberate and stays that way for this work.

The visual problem is measurable, not a matter of taste:

| Measurement | Count |
| --- | --- |
| Hardcoded `text-white` | 228 |
| Hardcoded `border-slate-800` | 236 |
| Hardcoded `bg-slate-900` | 142 |
| `text-xs` (12px) | 369 |
| `text-[10px]` | 97 |
| `font-black` | 41 |
| Files using the theme tokens defined in `globals.css` | 4 of 118 |
| Hand-rolled card divs bypassing `ui/Card` | 239 across 67 files |
| Forms with validation | 0 |

### 1.1 Root cause

Two theme mechanisms are running at once and neither is aware of the other:

1. `tailwind.config.js` sets `darkMode: "class"`, and the `ui/` primitives style through Tailwind's `dark:` variant.
2. `styles/globals.css` defines five palettes as CSS custom properties applied with `!important`.

Components name their colours directly rather than asking the theme, so the CSS variables have almost nothing to act on. This is why theme switching does not work. The missing token layer is the symptom; the duplicated mechanism is the cause.

### 1.2 Drift from the documented system

`docs/design_system/` already specifies a light-first, white-surface clinical system with WCAG AA ratios, a colourblind matrix, 44px touch targets, ARIA roles and non-diagnostic copy rules. The shipped implementation contradicts nearly all of it. Part of this work is making the documentation and the code agree again.

---

## 2. Goals and non-goals

### Goals

1. One theme mechanism, driven by semantic tokens.
2. The Surgical palette applied consistently across all 13 routes.
3. Public Sans throughout, on a type scale with a real minimum size.
4. Clinical colour reserved exclusively for clinical meaning.
5. Validated patient intake using the already-installed `zod` and `react-hook-form`.
6. Case state in `zustand`, replacing prop drilling and the `sessionStorage` handoff.
7. `docs/design_system/` updated to describe what actually ships.

### Non-goals

- No backend, no FastAPI gateway, no real inference. `api-client.ts` stays a stub.
- No changes to routes, slugs, nav labels, or information architecture.
- No component library migration. Carbon and Fluent are references, not dependencies.
- No rewrite of clinical copy beyond fixing non-diagnostic violations.
- No new features. This is a visual and correctness pass over what exists.

---

## 3. Direction

**Design read:** Clinical product UI for rural health workers and reviewing clinicians, in a restrained enterprise-medical language, built on a token-driven Tailwind system.

**Dials:** `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 5`. Safety-critical and accessibility-critical products suppress variance and motion. `DESIGN_PRINCIPLES.md` principle 10 already prohibits jarring animation.

**Redesign mode:** Overhaul on visuals, Preserve on information architecture.

**Reference set:** Epic, Cerner, Philips, GE Healthcare, Apple Health, Stripe. Calm, dense, legible, unfashionable in a good way. Explicitly not the generated-SaaS-dashboard look.

### 3.1 Applicability of the design-taste-frontend skill

That skill excludes dashboards, dense product UI, data tables and multi-step wizards, which is exactly what MediGem is. Applied here: its AI-tell bans, colour calibration, typography discipline, button and form contrast checks, interactive state requirements and dark-mode protocol. Not applied: hero composition, marquees, scroll hijacking, bento grids, logo walls, landing-page content density.

### 3.2 Icon library exception

The skill discourages `lucide-react`. The project already depends on it and uses it throughout, which is the skill's stated override condition. Lucide stays, at a single global `strokeWidth` of 1.75. No second icon family is introduced.

---

## 4. Colour system

Desaturated eucalyptus neutrals, deep indigo action, clinical semantics held separate.

### 4.1 Neutral ramp (light)

Green-grey, deliberately biased away from Tailwind's blue-grey `slate`.

| Token | Hex | Use |
| --- | --- | --- |
| `n-50` | `#F7FAF8` | Card and surface fill |
| `n-100` | `#EDF2EF` | Page ground |
| `n-200` | `#DFE7E2` | Subtle fill, hover, table stripe |
| `n-300` | `#C9D6CD` | Borders and rules |
| `n-400` | `#A3B3A9` | Disabled text, decorative icons |
| `n-500` | `#7C8C82` | Placeholder text |
| `n-600` | `#546056` | Muted and secondary text |
| `n-700` | `#3D473F` | Body text on tinted fills |
| `n-800` | `#28312A` | Secondary headings |
| `n-900` | `#16211B` | Primary ink |

### 4.2 Action (indigo)

Interactive only. Never used to signal clinical state.

| Token | Hex | Use |
| --- | --- | --- |
| `action-50` | `#EEF0F7` | Selected row, active nav fill |
| `action-100` | `#D8DDEC` | Hover on subtle action surfaces |
| `action-500` | `#3B5099` | Focus ring |
| `action-600` | `#2D3F73` | Primary button, links |
| `action-700` | `#24325C` | Primary button hover |
| `action-800` | `#1B2645` | Primary button active |

### 4.3 Clinical semantics

Reserved exclusively for clinical state. Mapping follows `COLOR_SYSTEM.md`.

| Level | Text / solid | Tint fill | Border | Shape |
| --- | --- | --- | --- | --- |
| Emergency | `#A82F26` | `#FBEAE8` | `#E8B4AE` | Octagon |
| High | `#8C5A0A` | `#FBF1E3` | `#E5C99A` | Triangle |
| Moderate | `#7A6206` | `#FAF4DC` | `#DFD08F` | Circle |
| Low | `#2F6B4F` | `#E7F2EC` | `#A9CDB9` | Shield |

Vital status maps onto the same scale: `alert` to Emergency, `warning` to High, `normal` to Low.

### 4.4 Dark counterpart (Surgical Night)

| Token | Hex |
| --- | --- |
| Ground | `#0F1613` |
| Surface | `#16201B` |
| Raised | `#1E2A23` |
| Rule | `#2E3C34` |
| Ink | `#E8EFEA` |
| Muted | `#9BAEA2` |
| Action | `#7C90D9` |
| Emergency | `#F2726A` |
| High | `#E0A33F` |
| Moderate | `#D8C158` |
| Low | `#5FBF8C` |

### 4.5 Rules

- Indigo never carries clinical meaning. Red, amber, yellow and green never carry brand or navigation meaning.
- Colour is never the only signal. Every risk indicator ships shape plus text label plus colour, per the existing colourblind matrix.
- Emoji are not icons. The matrix's shape requirement is preserved using drawn Lucide glyphs; the emoji are removed.
- One accent per application. No section introduces a colour outside this system.

---

## 5. Typography

**Public Sans** for all interface text. **JetBrains Mono** for measured values only: vitals, patient IDs, timings, confidence percentages. Monospace is for data and measurement, never as a costume for looking technical.

Both are loaded through `next/font/google`, replacing the render-blocking `@import` currently at the top of `globals.css`.

| Token | Size | Weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| `display` | 30px | 700 | 1.15 | -0.02em | Page titles |
| `h1` | 24px | 700 | 1.25 | -0.02em | Route headings |
| `h2` | 19px | 600 | 1.30 | -0.01em | Section headings |
| `h3` | 16px | 600 | 1.40 | 0 | Card titles |
| `body` | 15px | 400 | 1.55 | 0 | Clinical summaries, prose |
| `body-sm` | 14px | 400 | 1.50 | 0 | Table cells, secondary text |
| `label` | 13px | 600 | 1.40 | 0.06em | Field labels, uppercase |
| `data` | 16px | 600 | 1.20 | 0 | Measured values, tabular, mono |

**Minimum size is 13px.** This eliminates all 369 `text-xs` and all 97 `text-[10px]` occurrences.

`font-black` is removed. Emphasis comes from weight 600 or 700 and from size, never from weight 900. Running prose is capped at 70ch. Tracking never goes below -0.04em.

---

## 6. Shape, elevation and motion

**Radius scale**, carried over from `DESIGN_TOKENS.md` and inside impeccable's 12-16px guidance: cards `14px`, controls and inputs `8px`, small chips `4px`, status pills full. This rule is documented and applied everywhere.

**Elevation is declared once.** Either a border or a shadow, never both. `ui/Card.tsx` currently sets a 1px border and `shadow-sm` with `hover:shadow-md`, which is the ghost-card pattern. Resolution: cards use a 1px `n-300` border and no shadow at rest. Shadow is reserved for genuinely floating layers, meaning modals, dropdowns, popovers and toasts, and those carry no border. Shadows are tinted toward the neutral hue rather than pure black.

**No decorative side stripes.** Coloured `border-left` above 1px is removed from cards and list items. The one exception is the emergency interception banner, where `AI_AND_MEDICAL_COMPONENTS.md` specifies a 6px left accent. That is a documented, semantically motivated choice and it stays.

**No nested cards.** Card inside card is removed wherever it occurs. Interior grouping uses `divide-y`, a `border-t`, or spacing.

**Motion at intensity 3.** Hover raises by 1px, transitions run 150-200ms on an ease-out curve, and only `transform` and `opacity` animate. The emergency banner keeps its pulse because it signals real state. Every animation honours `prefers-reduced-motion`; the pulse collapses to static. No entrance animation on page sections.

**Browser surfaces are themed**, not left at browser defaults: text selection, caret colour, focus rings, scrollbars, and `font-variant-numeric: tabular-nums` on every column of digits.

---

## 7. Architecture

### 7.1 Token layer

`tailwind.config.js` gains the full token set, with each colour resolving to a CSS custom property:

```js
colors: {
  surface: "var(--surface)",
  ground: "var(--ground)",
  ink: { DEFAULT: "var(--ink)", muted: "var(--ink-muted)" },
  rule: "var(--rule)",
  action: { DEFAULT: "var(--action)", hover: "var(--action-hover)" },
  risk: {
    emergency: "var(--risk-emergency)",
    high: "var(--risk-high)",
    moderate: "var(--risk-moderate)",
    low: "var(--risk-low)",
  },
}
```

`globals.css` is reduced to two token blocks, light and dark. `darkMode: "class"` stays for the toggle, but the `dark:` variant is removed from component code. Theme switching becomes a class swap on `<html>` that repoints the variables.

The five existing themes collapse to two: Surgical (default) and Surgical Night. `AppearanceThemes.tsx` becomes a two-way switch. Sapphire, Titanium and Amber are deleted.

### 7.2 Primitives

Rebuilt on tokens first, since they are the leverage point for 57 files:

- `Card` - border-only elevation, 14px radius, no nesting
- `Button` - variants `primary`, `secondary`, `outline`, `ghost`, `danger`; minimum 44px touch target; visible focus ring; contrast verified per variant
- `Badge` - risk variants carrying shape, label and colour together
- `Input` - label above, helper text slot, error below, never placeholder-as-label
- `Typography` - the scale from Section 5
- `RiskIndicator` - single source of truth for risk shape, label and colour

The `emergency` Button variant loses `animate-pulse`. Pulsing belongs to the banner, not to buttons.

### 7.3 Migration

Route by route, with `tsc --noEmit` and `next build` after each. Both pass today, so any failure is attributable to the change in flight.

1. Tokens, fonts, primitives
2. `app/page.tsx` dashboard and its 14 components
3. `app/new-case` intake wizard, including validation and state
4. `app/results/[caseId]` and its 20 components
5. `history`, `settings`, `evaluation`, `developer`, `demo`, `learning`, `presentation`, plus error, loading and not-found

The 239 hand-rolled card divs are migrated onto `<Card>` as their route is reached.

### 7.4 State

A `zustand` store replaces prop drilling in the 284-line `app/new-case/page.tsx` and the `sessionStorage` handoff into results:

```ts
interface CaseDraftStore {
  step: 1 | 2 | 3 | 4 | 5;
  patient: PatientDetails;
  symptoms: SymptomEntry;
  history: MedicalHistoryData;
  uploads: UploadedFileItem[];
  result: ClinicalCaseData | null;
  setStep, updatePatient, updateSymptoms, updateHistory,
  addUpload, removeUpload, setResult, reset
}
```

The hardcoded "Ramesh Kumar" default is removed. The form starts empty. `Load Demo Case` remains, and is the only path that fills the form.

### 7.5 Validation

`zod` schemas with `react-hook-form`, per step. Physiologically plausible bounds:

| Field | Rule |
| --- | --- |
| `patientName` | required, 2-80 characters |
| `patientId` | required, matches `^[A-Za-z0-9-]{2,20}$` |
| `age` | required, integer 0-120 |
| `gender` | required, from enum |
| `hrBpm` | optional, integer 20-250 |
| `systolicBp` | optional, integer 50-260 |
| `diastolicBp` | optional, integer 30-160, less than systolic |
| `tempCelsius` | optional, 30-45, one decimal |
| `spO2Percent` | optional, integer 50-100 |
| `chiefComplaint` | required, 10-500 characters |
| `symptoms` | at least one |

Errors render below the field in `risk.emergency` text at 13px, with `aria-invalid` and `aria-describedby` wired. `Next Step` is blocked while the current step is invalid. Submission is blocked while any step is invalid.

---

## 8. States

Every interactive surface ships the full cycle. Currently only the success state exists.

- **Loading** - skeletons shaped like the content they replace, built from `n-200`. No spinners except inside buttons.
- **Empty** - the patient queue, case history, upload workspace and export centre each get a composed empty state naming the next action.
- **Error** - inline and field-level in forms; `role="alert"` for clinical alerts; toasts only for transient confirmations.
- **Disabled** - `n-400` text on `n-200`, with `aria-disabled`.
- **Focus** - 2px `action-500` ring at 2px offset, on every interactive element, never removed.

---

## 9. Accessibility

Restoring what `ACCESSIBILITY_AND_TERMINOLOGY.md` already requires.

- Every text and background pair verified at WCAG AA by script, in both themes. Body and placeholder text at 4.5:1 minimum, large text at 3:1.
- Interactive targets at least 44px by 44px.
- `role="alert"` with `aria-live="assertive"` on emergency interception; `role="status"` with `aria-live="polite"` on the stage tracker.
- Risk badges carry an `aria-label` spelling out the level.
- Keyboard reachability through every route, with visible focus.
- Tables get real `<th>`, `scope`, and captions.
- Non-diagnostic copy rules enforced on every visible string.

---

## 10. Verification

Evidence, not assertion. Nothing is reported complete without the command output behind it.

1. `npx tsc --noEmit` clean after every route.
2. `npm run build` clean after every route.
3. A contrast script over the token pairs in both themes, output recorded in the PR.
4. `grep` gates that must return zero: `text-white`, `bg-slate-`, `border-slate-`, `text-xs`, `text-\[10px\]`, `font-black`, `dark:`.
5. Every route driven in a real browser in both themes, with screenshots.
6. Intake wizard exercised with empty, out-of-range and valid input.
7. Reduced-motion and keyboard-only passes.

---

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| 118 components is a large mechanical surface with room for silent regressions | Route-by-route, with type-check and build gates between each |
| Removing three themes may be unwanted later | Deleted in one commit, easy to revert; tokens make re-adding cheap |
| Green-tinted neutrals sit close to the `low` risk green | Shape plus text label required on every risk indicator; verified in the colourblind pass |
| Validation may reject data a worker legitimately needs to record | Bounds are physiological, not clinical; all vitals stay optional; only identity and complaint are required |
| Design docs drift again | `docs/design_system/` updated in the same branch as the code |

---

## 12. Deliverables

1. Token layer in `tailwind.config.js` and a reduced `globals.css`.
2. Fonts via `next/font/google`.
3. Six rebuilt primitives.
4. 13 routes and 118 components migrated.
5. `zustand` case-draft store.
6. `zod` schemas and wired validation.
7. Loading, empty, error, disabled and focus states.
8. Accessibility pass.
9. `docs/design_system/` reconciled with the implementation.
