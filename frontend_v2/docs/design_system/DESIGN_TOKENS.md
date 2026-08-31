# MediGem Design Tokens

> The shipped CSS custom properties, exactly as they exist in `styles/globals.css`, and how `tailwind.config.js` exposes them as Tailwind utilities.

This document replaces the earlier teal color ramp (`--medigem-teal-*`) and slate neutral ramp (`--medigem-slate-*`). Neither exists in the shipped app. The shipped palette is desaturated eucalyptus-green neutrals with deep indigo as the sole action color, per `docs/superpowers/specs/2026-08-28-medigem-surgical-ui-design.md` section 4.

There are two themes only: the default (Day) defined on `:root`, and Night defined under a `.theme-night` class selector. `app/layout.tsx` applies `className="dark ..."` to `<html>`; the actual palette swap is driven by the `.theme-night` class applied by the theme provider, not by Tailwind's `dark:` variant, which per the design spec is removed from component code entirely.

---

## CSS variables, as shipped

Verbatim from `styles/globals.css`:

```css
:root {
  --ground: #F4F7F5;
  --surface: #FBFCFB;
  --surface-raised: #E8EDEA;
  --rule: #D5DDD8;
  --rule-strong: #8A958E;
  --ink-disabled: #AFBAB4;
  --ink-muted: #626C66;
  --ink: #1A211D;
  --action: #2D3F73;
  --action-hover: #24325C;
  --action-active: #1B2645;
  --action-subtle: #EEF0F7;
  --on-action: #FBFCFB;
  --risk-emergency: #A82F26;
  --risk-high: #8C5A0A;
  --risk-moderate: #7A6206;
  --risk-low: #2F6B4F;
  --focus: #3B5099;
}

.theme-night {
  --ground: #111815;
  --surface: #18211D;
  --surface-raised: #212B26;
  --rule: #313D37;
  --rule-strong: #64736C;
  --ink-disabled: #5F6E66;
  --ink-muted: #9DAAA3;
  --ink: #E9EFEB;
  --action: #7C90D9;
  --action-hover: #93A4E3;
  --action-active: #A8B6EA;
  --action-subtle: #1E2740;
  --on-action: #0F1613;
  --risk-emergency: #F2726A;
  --risk-high: #E0A33F;
  --risk-moderate: #D8C158;
  --risk-low: #5FBF8C;
  --focus: #93A4E3;
}
```

For the meaning and use of each token, see `COLOR_SYSTEM.md` in this directory.

There is no separate JSON token export in this codebase. `lib/tokens.ts` mirrors these same values as a TypeScript `TokenSet` object, used only by `lib/contrast.ts` and `lib/tokens.test.ts` for automated contrast verification, not as a distributable design-token package.

---

## High contrast and text scale overrides

Also defined in `styles/globals.css` (lines 92 to 108), toggled by `data-*` attributes on `<html>` from `providers/AccessibilityProvider.tsx`:

```css
[data-contrast="high"] {
  --rule: #4B564F;
  --rule-strong: #10140F;
  --ink-muted: #33392F;
}

.theme-night[data-contrast="high"] {
  --rule: #8FA098;
  --rule-strong: #F4F7F5;
  --ink-muted: #C7D2CC;
}

[data-text-scale="large"] {
  font-size: 118%;
}
```

`data-motion="reduce"` is also defined there, forcing the same animation suppression as `prefers-reduced-motion: reduce` regardless of the OS-level setting.

---

## Tailwind exposure

Source: `tailwind.config.js`. Every color resolves through a CSS variable, so a theme switch is a single class swap on `<html>`, not a re-render.

```js
colors: {
  ground: "var(--ground)",
  surface: { DEFAULT: "var(--surface)", raised: "var(--surface-raised)" },
  rule: { DEFAULT: "var(--rule)", strong: "var(--rule-strong)" },
  ink: {
    DEFAULT: "var(--ink)",
    muted: "var(--ink-muted)",
    disabled: "var(--ink-disabled)",
  },
  action: {
    DEFAULT: "var(--action)",
    hover: "var(--action-hover)",
    active: "var(--action-active)",
    subtle: "var(--action-subtle)",
  },
  "on-action": "var(--on-action)",
  risk: {
    emergency: "var(--risk-emergency)",
    high: "var(--risk-high)",
    moderate: "var(--risk-moderate)",
    low: "var(--risk-low)",
  },
  focus: "var(--focus)",
},
```

This produces utility classes such as `bg-surface`, `text-ink-muted`, `border-rule-strong`, `bg-risk-emergency`, `text-on-action`, and `outline-focus`.

### Radius scale

```js
borderRadius: { card: "14px", control: "8px", chip: "4px" },
```

Producing `rounded-card` (14px, used on `Card`), `rounded-control` (8px, used on inputs and buttons), and `rounded-chip` (4px, used on small chips and risk pills). Status pills that need a full pill shape use Tailwind's built-in `rounded-full`, not a custom token.

### Type scale

```js
fontSize: {
  label:    ["0.8125rem", { lineHeight: "1.4",  letterSpacing: "0.06em", fontWeight: "600" }],
  "body-sm":["0.875rem",  { lineHeight: "1.5" }],
  body:     ["0.9375rem", { lineHeight: "1.55" }],
  h3:       ["1rem",      { lineHeight: "1.4",  fontWeight: "600" }],
  data:     ["1rem",      { lineHeight: "1.2",  fontWeight: "600" }],
  h2:       ["1.1875rem", { lineHeight: "1.3",  letterSpacing: "-0.01em", fontWeight: "600" }],
  h1:       ["1.5rem",    { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" }],
  "data-lg":["1.75rem",   { lineHeight: "1.1",  letterSpacing: "-0.01em", fontWeight: "600" }],
  display:  ["1.875rem",  { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
},
```

This maps to `text-label`, `text-body-sm`, `text-body`, `text-h3`, `text-data`, `text-h2`, `text-h1`, `text-data-lg`, `text-display`. See `TYPOGRAPHY_SYSTEM.md` for the full type scale and its rationale, including the 13px minimum size floor. There is no `text-xs` (or smaller) entry in this scale; the smallest defined size is `label` at 13px (`0.8125rem`).

### Font families

```js
fontFamily: {
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  mono: ["var(--font-mono)", "ui-monospace", "monospace"],
},
```

`--font-sans` and `--font-mono` are CSS variables set by `next/font/google` in `app/layout.tsx` (Public Sans and Atkinson Hyperlegible Mono respectively), not hardcoded font-family strings. See `TYPOGRAPHY_SYSTEM.md`.

---

## Spacing, shadow and motion

There is no custom spacing scale in `tailwind.config.js`; the app uses Tailwind's default spacing scale directly (`p-4`, `gap-2`, and so on).

There are no custom shadow tokens in `tailwind.config.js`. Per the design spec (section 6), elevation is declared once per surface: cards use a 1px `border-rule` border and no shadow at rest; shadow is reserved for genuinely floating layers (modals, dropdowns, popovers, toasts), which carry no border, using Tailwind's built-in shadow utilities rather than a custom token.

There are no custom motion/duration tokens in `tailwind.config.js`. Transitions in shipped components (for example `components/ui/Button.tsx`) are written directly as Tailwind utility classes, such as `transition-[background-color,color,transform] duration-150 ease-out`.
