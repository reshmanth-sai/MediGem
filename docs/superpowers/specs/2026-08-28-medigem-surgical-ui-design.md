# MediGem frontend_v2: Surgical UI Overhaul

**Date:** 2026-08-28
**Status:** Revised after review
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

`docs/design_system/` already specifies a light-first clinical system with WCAG AA ratios, a colourblind matrix, 44px touch targets, ARIA roles and non-diagnostic copy rules. The shipped implementation contradicts nearly all of it. Part of this work is making the documentation and the code agree again.

---

## 2. Goals and non-goals

### Goals

1. One theme mechanism, driven by semantic tokens.
2. The Surgical palette applied consistently across all 13 routes.
3. Public Sans throughout, on a type scale with a real minimum size.
4. Clinical colour reserved exclusively for clinical meaning, with a defined zone where MediGem identity is still allowed to live.
5. A results panel that reads like clinician software rather than a chat transcript.
6. Validated patient intake using the already-installed `zod` and `react-hook-form`.
7. Case state in `zustand`, replacing prop drilling and the `sessionStorage` handoff.
8. `docs/design_system/` updated to describe what actually ships.

### Non-goals

- No backend, no FastAPI gateway, no real inference. `api-client.ts` stays a stub.
- No changes to routes, slugs, nav labels, or information architecture.
- No component library migration. Carbon and Fluent are references, not dependencies.
- No new features. This is a visual and correctness pass over what exists.

---

## 3. Direction

**Design read:** Clinical product UI for rural health workers and reviewing clinicians, in a restrained modern enterprise-medical language, built on a token-driven Tailwind system.

**Dials:** `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 5`. Safety-critical and accessibility-critical products suppress variance and motion. `DESIGN_PRINCIPLES.md` principle 10 already prohibits jarring animation.

**Redesign mode:** Overhaul on visuals, Preserve on information architecture.

### 3.1 Design intent

> While adopting the Surgical palette, the interface must not become overly sterile or resemble legacy hospital software. It should feel like a modern enterprise healthcare platform with Apple's typography, Stripe's refinement, and Microsoft Fluent's interaction quality, while maintaining Epic and Cerner level information density. A subtle MediGem identity is preserved outside of clinical status indicators, while red, amber and green remain reserved exclusively for clinical meaning.

**Reference set, decomposed by what is being borrowed:**

| Borrowed from | What specifically |
| --- | --- |
| Epic, Cerner | Information density. Many facts per screen without crowding. |
| Apple Health | Typographic hierarchy and calm. Large legible values, quiet labels. |
| Stripe | Polish. Precise spacing, restrained colour, considered empty states. |
| Microsoft Fluent | Interaction quality. Predictable, responsive, well-defined states. |

**Anti-goals, stated so they cannot be drifted into:** legacy hospital software circa 2015, grey-on-grey chrome, dense toolbars of tiny icon buttons, beveled controls, modal-heavy flows. Density is borrowed from Epic; the visual language is not.

### 3.2 Applicability of the design-taste-frontend skill

That skill excludes dashboards, dense product UI, data tables and multi-step wizards, which is exactly what MediGem is. Applied here: its AI-tell bans, colour calibration, typography discipline, button and form contrast checks, interactive state requirements and dark-mode protocol. Not applied: hero composition, marquees, scroll hijacking, bento grids, logo walls, landing-page content density.

### 3.3 Icon library exception

The skill discourages `lucide-react`. The project already depends on it and uses it throughout, which is the skill's stated override condition. Lucide stays, at a single global `strokeWidth` of 1.75. No second icon family is introduced.

---

## 4. Colour system

Desaturated eucalyptus neutrals, deep indigo action, clinical semantics held separate.

### 4.1 Neutral ramp (light)

Green-grey, biased away from Tailwind's blue-grey `slate`. Brightened and desaturated from the first draft so it reads clinical and modern rather than olive or governmental.

| Token | Hex | Use |
| --- | --- | --- |
| `n-50` | `#FBFCFB` | Card and surface fill |
| `n-100` | `#F4F7F5` | Page ground, zebra stripe |
| `n-200` | `#E8EDEA` | Subtle fill, row hover, table header |
| `n-300` | `#D5DDD8` | Decorative rules, card borders, dividers |
| `n-400` | `#AFBAB4` | Disabled text and controls |
| `n-500` | `#8A958E` | Form input borders, decorative icons |
| `n-600` | `#626C66` | Muted text, placeholder text |
| `n-700` | `#48514C` | Body text on tinted fills |
| `n-800` | `#2F3733` | Secondary headings |
| `n-900` | `#1A211D` | Primary ink |

**Border selection rule.** Decorative separation uses `n-300`. Form input borders use `n-500`, because WCAG 1.4.11 requires 3:1 for interactive component boundaries and `n-300` measures 1.35:1 against `n-50`. `n-500` measures 3.02:1.

**Text selection rule.** Placeholder text uses `n-600` at 5.24:1, not `n-500` at 3.02:1. Placeholder text is body text and takes the 4.5:1 threshold.

### 4.2 Action (indigo)

Interactive and brand. Never used to signal clinical state.

| Token | Hex | Use |
| --- | --- | --- |
| `action-50` | `#EEF0F7` | Selected row, active nav fill, ghost hover |
| `action-100` | `#D8DDEC` | Hover on subtle action surfaces |
| `action-500` | `#3B5099` | Focus ring |
| `action-600` | `#2D3F73` | Primary button, links, brand mark |
| `action-700` | `#24325C` | Primary hover, text-button ink |
| `action-800` | `#1B2645` | Primary active |

### 4.3 Clinical semantics

Reserved exclusively for clinical state. Mapping follows `COLOR_SYSTEM.md`.

| Level | Text / solid | Tint fill | Border | Shape |
| --- | --- | --- | --- | --- |
| Emergency | `#A82F26` | `#FBEAE8` | `#E8B4AE` | Octagon |
| High | `#8C5A0A` | `#FBF1E3` | `#E5C99A` | Triangle |
| Moderate | `#7A6206` | `#FAF4DC` | `#DFD08F` | Circle |
| Low | `#2F6B4F` | `#E7F2EC` | `#A9CDB9` | Shield |

Vital status maps onto the same scale: `alert` to Emergency, `warning` to High, `normal` to Low.

### 4.4 Brand identity zone

MediGem keeps a recognisable identity. It is confined to surfaces that carry no clinical state, so it can never be mistaken for a medical signal.

**Identity is allowed in:**

- Logo and wordmark, in `action-600`
- Active navigation item in the sidebar, as an `action-50` fill with `action-600` ink
- Loading and progress animation during analysis
- Empty state illustrations and their supporting copy
- The `presentation`, `demo` and `learning` routes, which are marketing and teaching surfaces
- Focus rings, in `action-500`

**Identity is forbidden in:**

- Risk badges, urgency scores, vital signs, the emergency banner
- The results verdict area and any element whose colour encodes patient state
- Any surface where a clinician could read colour as clinical meaning

### 4.5 Rules

- Indigo never carries clinical meaning. Red, amber, yellow and green never carry brand or navigation meaning.
- Colour is never the only signal. Every risk indicator ships shape plus text label plus colour, per the existing colourblind matrix.
- Emoji are not icons. The matrix's shape requirement is preserved using drawn Lucide glyphs; the emoji are removed.
- One accent per application. No route introduces a colour outside this system.

### 4.6 Dark counterpart (Surgical Night)

| Token | Hex |
| --- | --- |
| Ground | `#111815` |
| Surface | `#18211D` |
| Raised | `#212B26` |
| Rule | `#313D37` |
| Ink | `#E9EFEB` |
| Muted | `#9DAAA3` |
| Action | `#7C90D9` |
| Emergency | `#F2726A` |
| High | `#E0A33F` |
| Moderate | `#D8C158` |
| Low | `#5FBF8C` |

---

## 5. Typography

**Public Sans** for all interface text, as directed.

**Atkinson Hyperlegible Mono** for measured values only: vitals, patient IDs, timings, blood pressure readings. Monospace is for data and measurement, never as a costume for looking technical.

This replaces JetBrains Mono, which was my earlier choice rather than a requirement. Atkinson Hyperlegible was designed by the Braille Institute specifically to disambiguate characters that are easily confused at a glance: `0` from `O`, `1` from `l` from `I`, `5` from `S`, `6` from `b`, `8` from `B`. In a clinical tool the data layer is where a misread character becomes a misread dose, patient ID or blood pressure. A face engineered for exactly that disambiguation is the correct choice for the numerals, and it costs nothing. The mono variant ships a 200 to 800 variable weight axis. Interface text is unaffected.

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
| `data-lg` | 28px | 600 | 1.10 | -0.01em | Hero vitals, urgency score |

**Minimum size is 13px.** This eliminates all 369 `text-xs` and all 97 `text-[10px]` occurrences.

`font-black` is removed. Emphasis comes from weight 600 or 700 and from size, never from weight 900. Running prose is capped at 70ch. Tracking never goes below -0.04em.

---

## 6. Shape, elevation and motion

**Radius scale**, carried over from `DESIGN_TOKENS.md`: cards `14px`, controls and inputs `8px`, small chips `4px`, status pills full. Documented and applied everywhere.

**Elevation is declared once.** Either a border or a shadow, never both. `ui/Card.tsx` currently sets a 1px border and `shadow-sm` with `hover:shadow-md`, which is the ghost-card pattern. Resolution: cards use a 1px `n-300` border and no shadow at rest. Shadow is reserved for genuinely floating layers, meaning modals, dropdowns, popovers and toasts, and those carry no border. Shadows are tinted toward the neutral hue rather than pure black.

**Prefer sections over cards.** A card is used only when elevation communicates real hierarchy, meaning the content is a discrete, separately actionable object such as a patient case. Grouping, sequence and related fields use a heading plus spacing, a `border-t`, or `divide-y`. Over-carding is the single most recognisable generated-dashboard tell, and MediGem currently has 239 hand-rolled card divs. The migration is expected to reduce that count, not merely re-skin it.

**No nested cards.** Card inside card is removed wherever it occurs.

**No decorative side stripes.** Coloured `border-left` above 1px is removed from cards and list items, including the current `border-l-4 border-l-teal-600` in `ui/Alert.tsx`. The one exception is the emergency interception banner, where `AI_AND_MEDICAL_COMPONENTS.md` specifies a 6px left accent. That is documented and semantically motivated, so it stays.

**Motion at intensity 3.** Hover raises by 1px, transitions run 150-200ms on an ease-out curve, and only `transform` and `opacity` animate. The emergency banner keeps its pulse because it signals real state. Every animation honours `prefers-reduced-motion`; the pulse collapses to static. No entrance animation on page sections.

**Browser surfaces are themed**, not left at browser defaults: text selection, caret colour, focus rings, scrollbars, and `font-variant-numeric: tabular-nums` on every column of digits.

---

## 7. Tables

Healthcare software lives in tables. `PatientQueueTable`, `CaseHistoryTable` and the evaluation grids are primary surfaces, not afterthoughts.

| Property | Value |
| --- | --- |
| Row height | 56px |
| Zebra striping | Even rows `n-100` on an `n-50` surface |
| Row separators | None. Zebra carries the separation, so rows do not also get borders. |
| Header | Sticky, `n-200` fill, `n-700` ink, `label` type, 1px `n-300` bottom rule |
| Focus clearance | `scroll-padding-top` equal to the sticky header height, on the scroll container |
| Row hover | `n-200` fill |
| Row selected | `action-50` fill with `aria-selected`, no side stripe |
| Numeric columns | Right-aligned, `tabular-nums`, JetBrains Mono |
| Text columns | Left-aligned |
| Vertical rules | None |
| Overflow | `overflow-x: auto` on the container. The page body never scrolls sideways. |

### 7.1 Chips and compact labels

`SmartSymptomSearch` and the queue filters render chip collections. Two rules apply, both severity High:

- **Chips wrap, never clip.** The collection uses `flex-wrap`, not a fixed-height row with hidden overflow. Where overflow is genuinely unavoidable, the `+n` indicator is an operable disclosure that reveals the hidden values, not a decorative count.
- **A compact label stays on one line.** Badges, risk pills and status chips use `nowrap` with a shrinkable label and `min-width: 0`. Where a value must truncate, the full text is reachable by keyboard, pointer and touch, never by a hover-only `title` attribute.

### 7.2 Sorting and semantics

Sortable headers carry a visible sort state and `aria-sort`. Every table has real `<th>` with `scope`, a `<caption>` (visually hidden where the heading already names it), plus defined loading, empty and error states. Row actions use `sm` buttons with a 44px hit area.

---

## 8. Results panel

The results route is where credibility is won or lost. It must read like clinician software, not a chat response. No paragraph starts with "Based on the uploaded symptoms".

### 8.1 Structure

Fixed section order, each independently scannable:

1. **Primary finding** - the single most important conclusion, in `h2`, with the risk indicator adjacent.
2. **Supporting findings** - evidence list, each item carrying its provenance chip (symptoms, vital signs, ECG image, lab report).
3. **Differential considerations** - alternative possibilities raised for physician review.
4. **Recommended investigations** - what to obtain next.
5. **Clinical rationale** - why this assessment was produced, from the existing reasoning transparency data.
6. **Disposition** - referral necessity, urgency, and the human review requirement.

### 8.2 Naming constraint

The section at position 3 is **"Differential considerations"**, not "Differential diagnosis". `backend/reasoning/safety.py` regex-blocks `diagnosed with` and `definitive diagnosis` as prohibited output, and `ACCESSIBILITY_AND_TERMINOLOGY.md` requires non-diagnostic alternatives throughout. A panel titled "Differential diagnosis" would name the exact category the safety layer exists to prevent. The section carries a one-line subtitle stating these are possibilities for physician review, not a diagnosis.

### 8.3 Backend contract alignment

The structure maps onto `backend/reasoning/output_schema.py` so that wiring the real pipeline later needs no redesign:

| Panel section | Schema source |
| --- | --- |
| Primary finding | `ReasoningAssessment.clinical_summary`, `risk_level` |
| Supporting findings | `SupportingObservation[]` (`source`, `observation`) |
| Differential considerations | Not yet in schema. New field required when the backend is wired. |
| Recommended investigations | Not yet in schema. New field required when the backend is wired. |
| Clinical rationale | `ReasoningMetadata` plus explanation builder output |
| Disposition | `needs_referral`, `requires_human_review`, `recommended_next_step` |

The two missing fields are recorded here as a forward dependency. They are out of scope for this work; the mock data model in `casesData.ts` gains them so the UI is built against the shape it will eventually receive.

### 8.4 Confidence

**Numeric confidence percentages are removed.** `aiConfidence: 98.2` and `94.5` in `casesData.ts` are frontend inventions. `backend/reasoning/output_schema.py:12` defines `ConfidenceLevel` as a qualitative enum of `LOW`, `MEDIUM`, `HIGH`, and the backend never emits a percentage. Displaying two decimal places implies calibrated statistical certainty that the model does not have.

Rendered banding:

| Source | Displayed |
| --- | --- |
| `ConfidenceLevel.HIGH` | High confidence |
| `ConfidenceLevel.MEDIUM` | Moderate confidence |
| `ConfidenceLevel.LOW` | Low confidence |
| `requires_human_review: true` | Needs clinician review |

`requires_human_review` defaults to `true` in the schema, so **Needs clinician review** is the default state and is displayed as a persistent badge rather than an exception. The same banding replaces every numeric confidence readout across the dashboard, results and history routes.

---

## 9. Dashboard

The home dashboard is the first screen anyone sees, including evaluators and reviewers. It must not read as a Tailwind admin template: a row of four equal stat cards, a chart, and a table.

**Target composition:** Apple Health's calm hierarchy, Epic's density, Linear's precision.

- **One clear priority zone.** What needs attention now, meaning the emergency banner and the highest-urgency cases, occupies the top and is visually dominant. Everything else is secondary.
- **No four-equal-stat-card row.** Summary figures are set in `data-lg` on the ground surface, separated by spacing and rules, not boxed into identical tiles.
- **The queue is the centrepiece**, built to the Section 7 table spec, not a shrunken preview.
- **Density without crowding.** More facts per screen than a generic dashboard, achieved through tighter vertical rhythm and typographic hierarchy rather than smaller text. The 13px floor holds.
- **Progressive disclosure**, per `DESIGN_PRINCIPLES.md` principle 4. Technical provenance stays collapsed.
- **A composed empty state** for a clinic with no active cases, rather than an empty table.

---

## 10. Architecture

### 10.1 Token layer

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

### 10.2 Button variants

Defined explicitly so they are not improvised. Every variant is contrast-verified in both themes.

| Variant | Fill | Ink | Border | Hover | Use |
| --- | --- | --- | --- | --- | --- |
| `primary` | `action-600` | `n-50` | none | `action-700`, active `action-800` | One per view. The main action. |
| `secondary` | `n-200` | `n-800` | 1px `n-300` | `n-300` fill | Supporting actions beside a primary. |
| `outline` | transparent | `action-600` | 1px `action-600` | `action-50` fill | Actions on tinted or busy surfaces. |
| `ghost` | transparent | `action-700` | none | `action-50` fill | Toolbar and table-row actions. |
| `text` | transparent | `action-700` | none | underline, no fill | Inline in prose. Never beside another button. |
| `danger` | `risk-emergency` | `n-50` | none | darkened 8% | Destructive application actions only. |

**`danger` is not a clinical signal.** It is for irreversible application actions such as deleting a case. Clinical severity is never expressed as a button.

**Sizes:** `lg` 52px, `md` 44px, `sm` 36px. `sm` is permitted only in dense desktop contexts such as table row actions, and must carry a 44px hit area through padding so the touch target requirement still holds.

Every variant ships hover, active, focus, disabled and loading states. The `emergency` variant is removed along with its `animate-pulse`; pulsing belongs to the banner announcing a state, not to a button.

### 10.3 Primitives

Rebuilt on tokens first, since they are the leverage point for 57 files:

- `Card` - border-only elevation, 14px radius, no nesting
- `Button` - the six variants above
- `Badge` - risk variants carrying shape, label and colour together
- `Input` - label above, helper text slot, error below, never placeholder-as-label
- `Typography` - the scale from Section 5
- `Table` - the specification from Section 7
- `RiskIndicator` - single source of truth for risk shape, label and colour
- `ConfidenceBadge` - the banding from Section 8.4

### 10.4 Migration

Route by route, with `tsc --noEmit` and `next build` after each. Both pass today, so any failure is attributable to the change in flight.

1. Tokens, fonts, primitives
2. `app/page.tsx` dashboard and its 14 components
3. `app/new-case` intake wizard, including validation and state
4. `app/results/[caseId]` and its 20 components, including the Section 8 restructure
5. `history`, `settings`, `evaluation`, `developer`, `demo`, `learning`, `presentation`, plus error, loading and not-found

The 239 hand-rolled card divs are resolved as their route is reached, either onto `<Card>` or, per Section 6, into sections.

### 10.5 State

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

### 10.6 Validation

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

**Error summary.** Inline field errors alone are not sufficient. After a failed step advance or submit, a summary renders at the top of the step with `role="alert"` and `tabindex="-1"`, focus moves to it, and each entry is an anchor linking to its invalid field. Inline errors are retained, not replaced. Validation fires on blur, never on keystroke.

---

## 11. States

Every interactive surface ships the full cycle. Currently only the success state exists.

- **Loading** - skeletons shaped like the content they replace, built from `n-200`. No spinners except inside buttons.
- **Empty** - the patient queue, case history, upload workspace and export centre each get a composed empty state naming the next action. Empty states are an approved identity surface per Section 4.4.
- **Error** - inline and field-level in forms; `role="alert"` for clinical alerts; toasts only for transient confirmations.
- **Disabled** - `n-400` ink on `n-200`, with `aria-disabled`.
- **Focus** - 2px `action-500` ring at 2px offset, on every interactive element, never removed.

---

## 12. Accessibility

Restoring what `ACCESSIBILITY_AND_TERMINOLOGY.md` already requires.

- Every text and background pair verified at WCAG AA by script, in both themes. Body and placeholder text at 4.5:1 minimum, large text and interactive boundaries at 3:1.
- Interactive targets at least 44px by 44px, including `sm` buttons via hit-area padding. Stated precisely: WCAG 2.2 AA for web requires 24 by 24 CSS px, not the 44pt figure from Apple HIG. MediGem adopts 44px as a stricter product floor because the primary device is a tablet handled with gloves, but the conformance claim is the 24px web criterion. The two are not interchangeable and the distinction is recorded so the stricter number is never mistaken for the standard.
- `role="alert"` with `aria-live="assertive"` on emergency interception; `role="status"` with `aria-live="polite"` on the stage tracker.
- Risk badges carry an `aria-label` spelling out the level.
- Keyboard reachability through every route, with visible focus.
- Tables get real `<th>`, `scope`, `aria-sort` and captions.
- Non-diagnostic copy rules enforced on every visible string.

---

## 13. Verification

Evidence, not assertion. Nothing is reported complete without the command output behind it.

1. `npx tsc --noEmit` clean after every route.
2. `npm run build` clean after every route.
3. A contrast script over the token pairs in both themes, output recorded in the PR.
4. `grep` gates that must return zero: `text-white`, `bg-slate-`, `border-slate-`, `text-xs`, `text-\[10px\]`, `font-black`, `dark:`, and any numeric confidence pattern such as `\d\d\.\d%`.
5. Every route driven in a real browser in both themes, with screenshots.
6. Intake wizard exercised with empty, out-of-range and valid input.
7. Reduced-motion and keyboard-only passes.
8. Card count re-measured after migration to confirm Section 6 reduced it rather than re-skinned it.

---

## 14. Risks

| Risk | Mitigation |
| --- | --- |
| 118 components is a large mechanical surface with room for silent regressions | Route-by-route, with type-check and build gates between each |
| Removing three themes may be unwanted later | Deleted in one commit, easy to revert; tokens make re-adding cheap |
| Green-tinted neutrals sit close to the `low` risk green | Ramp brightened and desaturated in 4.1; shape plus text label required on every risk indicator; verified in the colourblind pass |
| Suppressing brand colour could leave the product visually anonymous | Section 4.4 defines an explicit identity zone rather than leaving it to judgment |
| Density borrowed from Epic could drift into legacy hospital chrome | Section 3.1 anti-goals are stated; density comes from rhythm and hierarchy, never from shrinking text below the 13px floor |
| Restructured results panel implies backend fields that do not exist | Section 8.3 records them as a forward dependency; mock data carries the shape |
| Validation may reject data a worker legitimately needs to record | Bounds are physiological, not clinical; all vitals stay optional; only identity and complaint are required |
| Design docs drift again | `docs/design_system/` updated in the same branch as the code |

---

## 15. Deliverables

1. Token layer in `tailwind.config.js` and a reduced `globals.css`.
2. Fonts via `next/font/google`.
3. Eight rebuilt primitives, including `Table`, `RiskIndicator` and `ConfidenceBadge`.
4. 13 routes and 118 components migrated.
5. Restructured results panel with qualitative confidence.
6. Recomposed dashboard.
7. `zustand` case-draft store.
8. `zod` schemas and wired validation.
9. Loading, empty, error, disabled and focus states.
10. Accessibility pass.
11. `docs/design_system/` reconciled with the implementation.
