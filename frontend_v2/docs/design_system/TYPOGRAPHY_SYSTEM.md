# MediGem Typography System

> Font hierarchy, type scale, line heights, and clinical usage rules, as actually shipped.

This document replaces the earlier Inter/JetBrains Mono specification. Neither typeface is loaded in the shipped app.

---

## Font families

Source: `app/layout.tsx`, loaded through `next/font/google` (not a render-blocking `@import`):

```ts
import { Public_Sans, Atkinson_Hyperlegible_Mono } from "next/font/google";

const sans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
```

These bind to the `--font-sans` and `--font-mono` CSS variables, which `tailwind.config.js` exposes as the `font-sans` and `font-mono` utility classes (with `system-ui, sans-serif` and `ui-monospace, monospace` as fallback stacks respectively). `styles/globals.css` also sets `--font-sans` as the base `html, body` font family.

- **Public Sans** is the interface typeface: all body text, headings, labels, and UI chrome. Weights 400 to 700 are loaded.
- **Atkinson Hyperlegible Mono** is used exclusively for measured, numeric, or identifier data: vitals, patient IDs, timings, blood pressure readings, tabular figures. It is not used for interface text generally. Weights 400 to 600 are loaded here, though the typeface itself ships a 200 to 800 variable weight axis.

Atkinson Hyperlegible was designed by the Braille Institute specifically to disambiguate characters that are easily confused at a glance: `0` from `O`, `1` from `l` from `I`, `5` from `S`, `6` from `b`, `8` from `B`. In a clinical tool, the data layer (vitals, dosages, patient identifiers) is exactly where a misread character has real consequences, which is why it is reserved for that layer rather than used as a general "technical-looking" typeface.

---

## Type scale

Source: `tailwind.config.js`, `theme.extend.fontSize`. Each entry below is a Tailwind utility (`text-<name>`) that bundles size, line height, letter spacing and weight together, exposed to components through the typography primitives in `components/ui/Typography.tsx` (`Display`, `H1`, `H2`, `H3`, `Body`, `BodySm`, `Label`, `Data`, `DataLg`).

| Token | Utility class | Size | Weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- | --- |
| `display` | `text-display` | 30px (`1.875rem`) | 700 | 1.15 | -0.02em | Page titles |
| `h1` | `text-h1` | 24px (`1.5rem`) | 700 | 1.25 | -0.02em | Route headings |
| `h2` | `text-h2` | 19px (`1.1875rem`) | 600 | 1.30 | -0.01em | Section headings |
| `h3` | `text-h3` | 16px (`1rem`) | 600 | 1.40 | (none) | Card titles |
| `body` | `text-body` | 15px (`0.9375rem`) | 400 (set by component) | 1.55 | (none) | Clinical summaries, prose |
| `body-sm` | `text-body-sm` | 14px (`0.875rem`) | 400 (set by component) | 1.50 | (none) | Table cells, secondary text |
| `label` | `text-label` | 13px (`0.8125rem`) | 600 | 1.40 | 0.06em | Field labels, uppercase |
| `data` | `text-data` | 16px (`1rem`) | 600 | 1.20 | (none) | Measured values, tabular, mono |
| `data-lg` | `text-data-lg` | 28px (`1.75rem`) | 600 | 1.10 | -0.01em | Hero vitals, urgency score |

`Data` and `DataLg` in `components/ui/Typography.tsx` additionally apply `font-mono tabular` (the mono font family plus `font-variant-numeric: tabular-nums` via the `.tabular` utility defined in `styles/globals.css`), which is how the Atkinson Hyperlegible Mono assignment above is actually wired to the `data` and `data-lg` scale steps.

`Body` additionally caps prose width at `max-w-[70ch]`.

---

## The 13px minimum size floor

**13px (`text-label`, `0.8125rem`) is the smallest font size in the shipped type scale.** There is no `text-xs` (12px) or `text-[10px]` size anywhere in the scale, and none of the current, canonical typography primitives in `components/ui/Typography.tsx` (`Display`, `H1`, `H2`, `H3`, `Body`, `BodySm`, `Label`, `Data`, `DataLg`) render below 13px.

This floor was enforced across the app during this design overhaul specifically to eliminate the pre-overhaul `text-xs` (369 occurrences) and `text-[10px]` (97 occurrences) usage documented in `docs/superpowers/specs/2026-08-28-medigem-surgical-ui-design.md` section 1.

`components/ui/Alert.tsx`, `components/ui/Badge.tsx`, and `components/ui/Feedback.tsx` were dead, unmigrated pre-Surgical code containing the last `text-xs` occurrences outside the type scale, along with a legacy-labeled block at the bottom of `components/ui/Typography.tsx` (the `PageTitle`, `SectionTitle`, `CardTitle`, `Subtitle`, `BodyText`, `Caption`, `MutedText`, `CodeBlock`, `MedicalLabel` exports). None of the three files were used by any shipped route, and the final gate task deleted all of them along with the legacy block, so no code following this typography system contains a `text-xs` occurrence.

---

## Weight and emphasis

Public Sans is loaded at weights 400, 500, 600 and 700. There is no 900/black weight loaded, and no shipped typography primitive uses `font-black`. Emphasis is expressed through the 600 or 700 weights already built into the scale steps above, and through size, not through a heavier weight.
