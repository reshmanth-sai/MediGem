# MediGem Component Primitives

> The actual shipped UI primitives in `components/ui/`, as they exist on this branch after the Surgical UI overhaul.

This document replaces the earlier hex-table specification (Inter/teal buttons, `.medigem-card`), none of which exists in the shipped code.

## Which components are documented here, and why

`docs/superpowers/specs/2026-08-28-medigem-surgical-ui-design.md` section 10.3 names an intended list of eight primitives: Card, Button, Badge, Input, Typography, Table, RiskIndicator, ConfidenceBadge. What actually shipped in `components/ui/` diverged from that list in two ways, both deliberate:

- **`Badge.tsx` was superseded, not built out.** It had zero import sites anywhere in `app/` or `components/` (verified with `grep -rl` for its import path). Clinical risk display went entirely through the purpose-built `RiskIndicator`, and confidence display went through the purpose-built `ConfidenceBadge`. `Badge.tsx`, along with `Alert.tsx` and `Feedback.tsx`, was dead, unmigrated pre-Surgical code; the final gate task deleted all three files entirely rather than migrate dead code, so they no longer exist in `components/ui/`.
- **`Input.tsx` was joined by `Field.tsx`, and `Field` is the primitive the spec was describing.** The spec's own description of the "Input" primitive is "label above, helper text slot, error below, never placeholder-as-label", which is a description of `Field.tsx`'s job (label association, helper text, error text, ARIA wiring), not of a bare `<input>`. `Field.tsx` is the generic wrapper (9 import sites in `app/`/`components/`); `Input.tsx` supplies concrete controls (`TextField` and others, 6 import sites) built on top of `Field`. They are complementary, not competing, but `Field` is the primitive in the sense the spec means.

So the eight primitives documented below are: **Card** (and its sibling **Section**), **Button**, **Field**, **Typography**, **Table** (and its row/cell family), **RiskIndicator**, **ConfidenceBadge**, and **EmptyState**. `EmptyState` fills the eighth slot in place of `Badge`: it is a real, actively used (4 import sites), spec-required primitive (section 11, "Empty" states) with no equivalent in the original spec list, whereas `Badge` has none.

Two further components are real, shipped, and actively used, but sit a level below "primitive" (they compose the eight rather than standing alongside them), so they are documented briefly at the end rather than counted among the eight: **Skeleton** (1 import site, used for loading placeholders) and **MetricStat** (8 import sites, a compound of `Label` + `DataLg` + `BodySm` used for unboxed dashboard stats) and **ErrorSummary** (2 import sites, a focusable validation summary built from `H2` and links).

`Dialog.tsx` (3 import sites) is also real, shipped code for overlay surfaces, but is not covered in depth here since it was not named as a candidate primitive in scope for this pass.

---

## 1. Card and Section

Source: `components/ui/Card.tsx`.

**`Card`** is border-only elevation: `bg-surface border border-rule rounded-card p-5`, no shadow, no hover shadow, no `dark:` variant (the theme swap is a CSS variable repoint, not a class-based override). Per the design spec section 6, `Card` is used only when the content is a discrete, separately actionable object, such as a patient case, and cards are never nested.

**`Section`** is the preferred grouping mechanism everywhere elevation would not communicate real hierarchy: a heading (rendered as `H2` or `H3` via the `headingAs` prop) plus `space-y-4` content, no border, no background. It accepts an optional `headingAdornment` (a badge, timestamp, or tag) rendered as the heading's sibling rather than nested inside it, so it never pollutes the heading's accessible name.

---

## 2. Button

Source: `components/ui/Button.tsx`, built on `class-variance-authority`.

Six variants, all contrast-verified: `primary`, `secondary`, `outline`, `ghost`, `text`, `danger`. `danger` is for irreversible application actions (deleting a case), never for expressing clinical severity.

Three sizes: `lg` (`h-[52px]`), `md` (`h-11`, 44px, the default), `sm` (`h-9`, 36px visible height). `sm` compensates for its shorter visible height with an invisible `before:` pseudo-element sized to a 44px minimum hit area, so the tap target still meets the app's 44px product floor even though the rendered control is smaller; see `ACCESSIBILITY_AND_TERMINOLOGY.md` for why 44px is a product floor rather than the WCAG minimum.

`Button` accepts `isLoading` (swaps in a spinning `Loader2` icon and sets `aria-busy`), `leftIcon`, and `rightIcon` (both marked `aria-hidden`, suppressed while loading).

---

## 3. Field (and Input)

Source: `components/ui/Field.tsx`, consumed by `components/ui/Input.tsx`.

`Field` wraps a single form control and wires up:

- A `<label htmlFor>` association, rendering a `text-risk-emergency` asterisk when `required`.
- `aria-describedby`, joining helper text and error text ids.
- `aria-invalid` when an `error` is present.
- `aria-required` when `required` is set.

It uses `React.cloneElement` to inject these onto its child, with a generic type constraint (`FieldControlProps`) plus a development-only runtime check that warns loudly if the child never actually forwards the injected `id` to a real DOM node (covered by `Field.childForwarding.test.tsx`).

`Input.tsx` supplies concrete controls built on `Field`, such as `TextField`, styled with `bg-surface border border-rule-strong rounded-control text-ink`, switching to `border-risk-emergency` on error.

---

## 4. Typography

Source: `components/ui/Typography.tsx`.

The current, canonical exports, each a thin wrapper applying one type-scale utility class from `tailwind.config.js` plus `text-ink`: `Display`, `H1`, `H2`, `H3`, `Body` (also caps width at `max-w-[70ch]`), `BodySm`, `Label` (uppercase, `text-ink-muted`), `Data` and `DataLg` (both `font-mono tabular`, i.e. Atkinson Hyperlegible Mono with tabular figures). All accept an `as` prop to change the rendered element while keeping the visual style, so heading level and visual size can vary independently.

The file also still contains a block of legacy exports below a `/* Legacy components - kept for backward compatibility */` comment (`PageTitle`, `SectionTitle`, `CardTitle`, `Subtitle`, `BodyText`, `Caption`, `MutedText`, `CodeBlock`, `MedicalLabel`). These use `text-xs`, hardcoded `slate`/`teal` Tailwind colors, and `dark:` variants, none of which belong to the current token system. They are dead weight retained for backward compatibility, not part of the current typography primitive, and should not be used in new code.

---

## 5. Table

Source: `components/ui/Table.tsx`. The Section 7 table primitive: 56px rows (`h-14`), zebra striping (`even:bg-ground` against a `--surface` container), sticky header, tabular numerals on numeric columns.

The family: `Table` (wraps in a horizontally scrollable container and requires a `caption` prop, optionally visually hidden via `captionHidden` when a `Section` heading already names it), `THead` (sticky, `bg-surface-raised`), `TH` (real `scope="col"`, optional `sortable` with a wired `aria-sort` and an operable button, optional `numeric` right-alignment), `TBody`, `TR` (optional `selected` driving `aria-selected` and an `!bg-action-subtle` fill, `!important` used deliberately to win the cascade against the zebra-stripe pseudo-class), `TD` (optional `numeric` driving right-alignment plus `tabular font-mono`).

The container also sets `scroll-pt-14` to match the sticky header's height, so the browser's native scroll-into-view on keyboard focus does not land a focused row hidden behind the sticky header (WCAG 2.2 "Focus Not Obscured (Minimum)").

---

## 6. RiskIndicator

Source: `components/ui/RiskIndicator.tsx`. The single source of truth for how clinical risk is ever displayed. Every instance ships a Lucide shape (`Octagon` for Emergency, `Triangle` for High, `Circle` for Moderate, `Shield` for Low), a text label, and a `risk-*` color together, never color alone. See `COLOR_SYSTEM.md` for the full mapping.

Three variants (`solid`, `tint`, `inline`) and an optional `showScore` (0 to 10) rendered through `Data` with tabular figures. The accessible name is carried by the component's own `aria-label`, independent of the visible label text.

---

## 7. ConfidenceBadge

Source: `components/ui/ConfidenceBadge.tsx`. Displays AI model confidence in the qualitative bands the backend schema actually emits (`LOW`, `MEDIUM`, `HIGH`, rendered as "Low confidence", "Moderate confidence", "High confidence"), never a numeric percentage. Deliberately uses only neutral tokens (`surface-raised`, `ink-muted`, `rule`), because confidence is not clinical severity and must never borrow a `risk-*` color. An optional `needsReview` flag renders a second, separate "Needs clinician review" chip alongside the confidence chip.

---

## 8. EmptyState

Source: `components/ui/EmptyState.tsx`. A centered stack (icon at `h-8 w-8`, `H3` title, `Body` description, a primary `Button` action) shown when a list, table, or workspace has no content. Per the design spec section 4.4, the icon is allowed to render in `text-action` (indigo): empty states are one of the explicitly approved surfaces where MediGem's brand identity may appear outside the neutral/risk token separation, since an empty state carries no clinical meaning to conflict with.

---

## Supporting components (not counted among the eight)

- **Skeleton** (`components/ui/Skeleton.tsx`): a loading placeholder (`bg-surface-raised rounded-control animate-pulse`, with `motion-reduce:animate-none`). Callers stack multiple `Skeleton`s to approximate the shape of the real content, per the design spec's "no spinners except inside buttons" rule for loading states.
- **MetricStat** (`components/ui/MetricStat.tsx`): a single label/value/subtitle stat built from `Label`, `DataLg`, and `BodySm`, laid out with spacing rather than boxed into a card. It exists specifically to satisfy the design spec's "no four-equal-stat-card row" rule for the dashboard (section 9), replacing an earlier, deleted `StatCard`.
- **ErrorSummary** (`components/ui/ErrorSummary.tsx`): a focusable (`tabIndex={-1}`), `role="alert"` validation summary shown after a failed form submit or step advance, listing each error as a link to its field's `id`, per the WCAG 2.2 "focusable error summary" pattern. Renders nothing when there are no errors.
