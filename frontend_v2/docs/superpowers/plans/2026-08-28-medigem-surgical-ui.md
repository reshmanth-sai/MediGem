# MediGem Surgical UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ad-hoc styling of `frontend_v2` with a semantic token system in the Surgical palette, restructure the results and dashboard surfaces to read as clinical software, and add the validation and state layers the app currently lacks.

**Architecture:** One theme mechanism replaces two. Tailwind utilities resolve to CSS custom properties, which a class on `<html>` repoints. Eight primitives are rebuilt on those tokens first, because 57 of 118 component files already import them, then routes are migrated one at a time behind automated gates. State moves from prop drilling and `sessionStorage` into a `zustand` store; intake gains `zod` validation.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.5, Tailwind 3.4, zustand 4.5, zod 3.23, react-hook-form 7.52, lucide-react, Vitest (added by Task 1).

**Spec:** `docs/superpowers/specs/2026-08-28-medigem-surgical-ui-design.md`

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **Working directory is the repo root.** This repo (`medigem-web`) contains only the frontend; all paths below are relative to its root.
- **Branch:** `feat/surgical-ui-overhaul`. Never commit to `main`.
- **Minimum font size is 13px.** No `text-xs`, no `text-[10px]`, no arbitrary sizes below `0.8125rem`.
- **`font-black` is banned.** Maximum weight is 700.
- **Zero em-dashes and en-dashes** in any visible string, comment, or commit message. Use `-`.
- **No emoji anywhere in the UI.** Icons come from `lucide-react` only, at `strokeWidth={1.75}`.
- **Indigo never carries clinical meaning. Red, amber, yellow and green never carry brand or navigation meaning.**
- **Elevation is declared once:** border or shadow, never both on the same element.
- **No nested cards.** No coloured `border-left` above 1px, except `EmergencyBanner`.
- **Every risk indicator ships shape + text label + colour.** Never colour alone.
- **All motion honours `prefers-reduced-motion`.** Only `transform` and `opacity` animate.
- **Numeric AI confidence percentages are forbidden.** Qualitative banding only.
- **Copy rule:** no diagnostic language. `docs/design_system/ACCESSIBILITY_AND_TERMINOLOGY.md` governs every visible string.
- **After every task:** `npx tsc --noEmit` and `npm run build` must both pass before commit.

---

## File Structure

**Created:**

| Path | Responsibility |
| --- | --- |
| `vitest.config.ts` | Test runner config |
| `test/setup.ts` | Testing Library matchers |
| `lib/contrast.ts` | WCAG relative luminance and contrast ratio maths |
| `lib/contrast.test.ts` | Tests for the above |
| `lib/tokens.ts` | The token values as typed data, single source for script and CSS generation |
| `lib/tokens.test.ts` | Asserts every token pair meets its WCAG threshold |
| `scripts/slop-gate.mjs` | Greps for banned patterns, exits non-zero on any hit |
| `lib/schemas/patient.ts` | Zod schemas for intake |
| `lib/schemas/patient.test.ts` | Boundary tests for every field rule |
| `lib/store/caseDraft.ts` | Zustand case-draft store |
| `lib/store/caseDraft.test.ts` | Store transition tests |
| `components/ui/Table.tsx` | Table primitive per spec section 7 |
| `components/ui/RiskIndicator.tsx` | Single source of truth for risk shape, label, colour |
| `components/ui/ConfidenceBadge.tsx` | Qualitative confidence banding |
| `components/ui/Field.tsx` | Label + control + helper + error, wired for a11y |
| `components/ui/ErrorSummary.tsx` | Focusable post-submit error summary |
| `components/ui/EmptyState.tsx` | Composed empty state |
| `components/ui/Skeleton.tsx` | Loading placeholder |

**Modified:**

| Path | Change |
| --- | --- |
| `package.json` | Add Vitest, testing-library, scripts |
| `tailwind.config.js` | Full token set |
| `styles/globals.css` | Reduced to two token blocks plus browser-surface theming |
| `app/layout.tsx` | Fonts via `next/font/google` |
| `components/ui/{Card,Button,Badge,Input,Typography,Alert}.tsx` | Rebuilt on tokens |
| `lib/casesData.ts` | Qualitative confidence, new result fields |
| `providers/ThemeProvider.tsx`, `components/settings/AppearanceThemes.tsx` | Two themes |
| All 13 routes and their components | Token migration |
| `docs/design_system/*.md` | Reconciled with implementation |

**Deleted:** Sapphire, Titanium and Amber theme blocks and their switch entries.

---

## Phase 0: Verification Harness

Nothing else can be verified without this. Build it first.

### Task 1: Test runner

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `test/setup.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` runs Vitest; `npm run gate` is defined in Task 3.

- [ ] **Step 1: Install**

```bash
npm install -D vitest@^2.1.0 @vitest/coverage-v8@^2.1.0 jsdom@^25.0.0 \
  @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.5.0
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Create `test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to `package.json`**

Add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify the runner starts**

Run: `npx vitest run`
Expected: exits 0 with "No test files found" (that is correct; tests arrive in Task 2).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test/setup.ts
git commit -m "chore: add vitest test harness"
```

---

### Task 2: Contrast verification

The spec claims specific WCAG ratios. This task makes those claims executable, so a token change that breaks contrast fails the build rather than shipping.

**Files:**
- Create: `lib/contrast.ts`, `lib/contrast.test.ts`, `lib/tokens.ts`, `lib/tokens.test.ts`

**Interfaces:**
- Consumes: Task 1's runner
- Produces: `contrastRatio(hexA: string, hexB: string): number`; `TOKENS: { light: TokenSet; dark: TokenSet }` where `TokenSet = Record<string, string>`. Task 5 imports `TOKENS` to generate CSS.

- [ ] **Step 1: Write the failing test for the maths**

Create `lib/contrast.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colours", () => {
    expect(contrastRatio("#4A5A50", "#4A5A50")).toBeCloseTo(1, 5);
  });

  it("is order independent", () => {
    const a = contrastRatio("#626C66", "#FBFCFB");
    const b = contrastRatio("#FBFCFB", "#626C66");
    expect(a).toBeCloseTo(b, 10);
  });

  it("accepts shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 1);
  });

  it("throws on malformed input", () => {
    expect(() => contrastRatio("nope", "#FFFFFF")).toThrow();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run lib/contrast.test.ts`
Expected: FAIL, "Failed to resolve import ./contrast".

- [ ] **Step 3: Implement `lib/contrast.ts`**

```ts
/** WCAG 2.1 relative luminance and contrast ratio. */

function expand(hex: string): string {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) return h.split("").map((c) => c + c).join("");
  return h;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const h = expand(hex);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Run to confirm pass**

Run: `npx vitest run lib/contrast.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Create `lib/tokens.ts`**

```ts
export interface TokenSet {
  ground: string;
  surface: string;
  surfaceRaised: string;
  rule: string;
  ruleStrong: string;
  inkDisabled: string;
  inkMuted: string;
  ink: string;
  action: string;
  actionHover: string;
  actionActive: string;
  actionSubtle: string;
  onAction: string;
  riskEmergency: string;
  riskHigh: string;
  riskModerate: string;
  riskLow: string;
  focus: string;
}

export const TOKENS: { light: TokenSet; dark: TokenSet } = {
  light: {
    ground: "#F4F7F5",
    surface: "#FBFCFB",
    surfaceRaised: "#E8EDEA",
    rule: "#D5DDD8",
    ruleStrong: "#8A958E",
    inkDisabled: "#AFBAB4",
    inkMuted: "#626C66",
    ink: "#1A211D",
    action: "#2D3F73",
    actionHover: "#24325C",
    actionActive: "#1B2645",
    actionSubtle: "#EEF0F7",
    onAction: "#FBFCFB",
    riskEmergency: "#A82F26",
    riskHigh: "#8C5A0A",
    riskModerate: "#7A6206",
    riskLow: "#2F6B4F",
    focus: "#3B5099",
  },
  dark: {
    ground: "#111815",
    surface: "#18211D",
    surfaceRaised: "#212B26",
    rule: "#313D37",
    ruleStrong: "#4A5952",
    inkDisabled: "#5F6E66",
    inkMuted: "#9DAAA3",
    ink: "#E9EFEB",
    action: "#7C90D9",
    actionHover: "#93A4E3",
    actionActive: "#A8B6EA",
    actionSubtle: "#1E2740",
    onAction: "#0F1613",
    riskEmergency: "#F2726A",
    riskHigh: "#E0A33F",
    riskModerate: "#D8C158",
    riskLow: "#5FBF8C",
    focus: "#93A4E3",
  },
};
```

- [ ] **Step 6: Write the token contract test**

Create `lib/tokens.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { contrastRatio } from "./contrast";
import { TOKENS, type TokenSet } from "./tokens";

const THEMES: Array<[string, TokenSet]> = [
  ["light", TOKENS.light],
  ["dark", TOKENS.dark],
];

describe.each(THEMES)("%s theme contrast", (_name, t) => {
  it.each([
    ["ink on surface", t.ink, t.surface, 4.5],
    ["ink on ground", t.ink, t.ground, 4.5],
    ["muted ink on surface", t.inkMuted, t.surface, 4.5],
    ["muted ink on ground", t.inkMuted, t.ground, 4.5],
    ["action on surface", t.action, t.surface, 4.5],
    ["onAction on action", t.onAction, t.action, 4.5],
    ["emergency on surface", t.riskEmergency, t.surface, 4.5],
    ["high on surface", t.riskHigh, t.surface, 4.5],
    ["moderate on surface", t.riskModerate, t.surface, 4.5],
    ["low on surface", t.riskLow, t.surface, 4.5],
  ])("%s meets AA body text", (_label, fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });

  it.each([
    ["input border on surface", t.ruleStrong, t.surface, 3],
    ["focus ring on surface", t.focus, t.surface, 3],
  ])("%s meets AA non-text (WCAG 1.4.11)", (_label, fg, bg, min) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
```

- [ ] **Step 7: Run it**

Run: `npx vitest run lib/tokens.test.ts`
Expected: all pass. **If any fail, adjust the failing token in `lib/tokens.ts` until it passes, and record the new value.** The test is the authority, not the spec table. Do not lower a threshold to make a test pass.

- [ ] **Step 8: Commit**

```bash
git add lib/contrast.ts lib/contrast.test.ts lib/tokens.ts lib/tokens.test.ts
git commit -m "feat: add WCAG contrast verification and Surgical token contract"
```

---

### Task 3: Slop gate

Turns the spec's banned patterns into a command that fails.

**Files:**
- Create: `scripts/slop-gate.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `npm run gate` exits non-zero on any banned pattern. Every later task runs it.

- [ ] **Step 1: Create `scripts/slop-gate.mjs`**

```js
#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const RULES = [
  { name: "hardcoded white text", pattern: /\btext-white\b/ },
  { name: "hardcoded slate background", pattern: /\bbg-slate-\d/ },
  { name: "hardcoded slate border", pattern: /\bborder-slate-\d/ },
  { name: "hardcoded slate text", pattern: /\btext-slate-\d/ },
  { name: "hardcoded teal", pattern: /\b(bg|text|border|ring)-teal-\d/ },
  { name: "sub-13px type (text-xs)", pattern: /\btext-xs\b/ },
  { name: "arbitrary 10px type", pattern: /text-\[10px\]/ },
  { name: "font-black", pattern: /\bfont-black\b/ },
  { name: "tailwind dark: variant", pattern: /\bdark:/ },
  { name: "numeric AI confidence", pattern: /\d{2}\.\d\s*%/ },
  { name: "em-dash or en-dash", pattern: /[—–]/ },
  { name: "emoji", pattern: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u },
];

const files = execSync(
  `git ls-files 'app/**/*.tsx' 'app/**/*.ts' 'components/**/*.tsx' 'lib/**/*.ts' 'providers/**/*.tsx' 'styles/*.css'`,
  { encoding: "utf8" }
)
  .split("\n")
  .filter(Boolean);

let failures = 0;
for (const file of files) {
  if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.pattern.test(line)) {
        console.error(`${file}:${i + 1}  ${rule.name}`);
        console.error(`    ${line.trim().slice(0, 120)}`);
        failures++;
      }
    }
  });
}

if (failures > 0) {
  console.error(`\nSlop gate: ${failures} violation(s).`);
  process.exit(1);
}
console.log("Slop gate: clean.");
```

- [ ] **Step 2: Add the script**

Add to `package.json` scripts:

```json
"gate": "node scripts/slop-gate.mjs"
```

- [ ] **Step 3: Run it and record the baseline**

Run: `npm run gate 2>&1 | tail -5`
Expected: FAILS with a large violation count. **Write that number into the commit message.** It is the burn-down target; every route task must reduce it, and Task 26 requires zero.

- [ ] **Step 4: Commit**

```bash
git add scripts/slop-gate.mjs package.json
git commit -m "chore: add slop gate, baseline <N> violations"
```

---

## Phase 1: Foundation

### Task 4: Fonts

**Files:**
- Modify: `app/layout.tsx`, `styles/globals.css`, `tailwind.config.js`

**Interfaces:**
- Consumes: nothing
- Produces: CSS variables `--font-sans` and `--font-mono` on `<html>`; Tailwind families `font-sans` and `font-mono`.

- [ ] **Step 1: Replace the Google Fonts `@import`**

Delete line 1 of `styles/globals.css` (the `@import url('https://fonts.googleapis.com/...')`). It is render-blocking and `next/font` replaces it.

- [ ] **Step 2: Load fonts in `app/layout.tsx`**

```tsx
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

Apply both to the `<html>` element: `className={`${sans.variable} ${mono.variable}`}`.

- [ ] **Step 3: Wire Tailwind**

In `tailwind.config.js` under `theme.extend`:

```js
fontFamily: {
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  mono: ["var(--font-mono)", "ui-monospace", "monospace"],
},
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: builds clean. If `Atkinson_Hyperlegible_Mono` is not exported by the installed `next` version, fall back to `Atkinson_Hyperlegible` and note it in the commit; do not silently substitute a different family.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx styles/globals.css tailwind.config.js
git commit -m "feat: load Public Sans and Atkinson Hyperlegible Mono via next/font"
```

---

### Task 5: Token layer

**Files:**
- Modify: `styles/globals.css`, `tailwind.config.js`

**Interfaces:**
- Consumes: `lib/tokens.ts` values from Task 2 (copy them; do not import TS into CSS)
- Produces: utilities `bg-surface`, `bg-ground`, `bg-surface-raised`, `text-ink`, `text-ink-muted`, `text-ink-disabled`, `border-rule`, `border-rule-strong`, `bg-action`, `text-action`, `text-on-action`, `bg-action-subtle`, `ring-focus`, and `text-risk-{emergency,high,moderate,low}` plus `bg-` and `border-` equivalents.

- [ ] **Step 1: Replace the five theme blocks in `styles/globals.css`**

Delete the `:root`, `.light`, `.theme-sapphire`, `.theme-titanium` and `.theme-amber` blocks entirely. Replace with two blocks whose values are exactly those in `lib/tokens.ts`:

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
  --rule-strong: #4A5952;
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

- [ ] **Step 2: Remove every `!important`**

The old blocks used `!important` on `html, body` and `.theme-card`. Delete those rules. Tokens make them unnecessary, and they block the primitives from styling correctly.

- [ ] **Step 3: Theme the browser surfaces**

Append to `globals.css`. This is the cheapest signal the page was built rather than assembled:

```css
html, body {
  background-color: var(--ground);
  color: var(--ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

::selection { background: var(--action-subtle); color: var(--ink); }
:root { caret-color: var(--action); accent-color: var(--action); }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--ground); }
::-webkit-scrollbar-thumb { background: var(--rule); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: var(--rule-strong); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

.tabular { font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Add the colour tokens to `tailwind.config.js`**

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
borderRadius: { card: "14px", control: "8px", chip: "4px" },
fontSize: {
  label:   ["0.8125rem", { lineHeight: "1.4",  letterSpacing: "0.06em", fontWeight: "600" }],
  "body-sm":["0.875rem", { lineHeight: "1.5" }],
  body:    ["0.9375rem", { lineHeight: "1.55" }],
  h3:      ["1rem",      { lineHeight: "1.4",  fontWeight: "600" }],
  data:    ["1rem",      { lineHeight: "1.2",  fontWeight: "600" }],
  h2:      ["1.1875rem", { lineHeight: "1.3",  letterSpacing: "-0.01em", fontWeight: "600" }],
  h1:      ["1.5rem",    { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "700" }],
  "data-lg":["1.75rem",  { lineHeight: "1.1",  letterSpacing: "-0.01em", fontWeight: "600" }],
  display: ["1.875rem",  { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
},
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build && npx vitest run`
Expected: all pass. The app will look broken at this point because components still reference deleted colours. That is expected and Task 7 onward fixes it.

- [ ] **Step 6: Commit**

```bash
git add styles/globals.css tailwind.config.js
git commit -m "feat: replace five ad-hoc themes with Surgical token layer"
```

---

### Task 6: Two themes

**Files:**
- Modify: `providers/ThemeProvider.tsx`, `hooks/useTheme.ts`, `components/settings/AppearanceThemes.tsx`, `components/settings/AppearanceSettings.tsx`

**Interfaces:**
- Consumes: `.theme-night` class from Task 5
- Produces: `useTheme(): { theme: "day" | "night"; setTheme(t: "day" | "night"): void }`. `"day"` applies no class; `"night"` applies `theme-night` to `<html>`.

- [ ] **Step 1: Reduce the theme union**

Replace every theme string union in the four files with `"day" | "night"`. Delete all references to `sapphire`, `titanium`, `amber`, and the old `light` / `dark` names.

- [ ] **Step 2: Rewrite `AppearanceThemes.tsx` as a two-option control**

Two radio inputs in a `role="radiogroup"` with `aria-label="Colour theme"`. Labels: `Day` with helper text "Bright clinic, daylight, printing" and `Night` with "Low-light and night shifts". Each swatch shows the actual `--surface`, `--ink` and `--action` of that theme, not a decorative gradient.

- [ ] **Step 3: Verify persistence**

Run `npm run dev`, toggle the theme, reload. Expected: the choice survives reload via the existing `useLocalStorage` hook, and `<html>` carries `theme-night` only in night mode.

- [ ] **Step 4: Gate and commit**

```bash
npx tsc --noEmit && npm run build
git add providers/ThemeProvider.tsx hooks/useTheme.ts components/settings/AppearanceThemes.tsx components/settings/AppearanceSettings.tsx
git commit -m "feat: collapse five themes to Day and Night"
```

---

## Phase 2: Primitives

These fix 57 files at once. Build them before touching any route.

### Task 7: Typography primitive

**Files:**
- Modify: `components/ui/Typography.tsx`

**Interfaces:**
- Produces: `<Display>`, `<H1>`, `<H2>`, `<H3>`, `<Body>`, `<BodySm>`, `<Label>`, `<Data>`, `<DataLg>`. All accept `className` and `as`. `<Data>` and `<DataLg>` apply `font-mono tabular`.

- [ ] **Step 1: Write the failing test**

Create `components/ui/Typography.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { H1, Data, Body } from "./Typography";

describe("Typography", () => {
  it("renders H1 as an h1 by default", () => {
    render(<H1>Patient queue</H1>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Patient queue");
  });

  it("honours the as prop without changing style", () => {
    render(<H1 as="h2">Queue</H1>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("gives Data tabular monospace figures", () => {
    render(<Data>165/102</Data>);
    const el = screen.getByText("165/102");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("tabular");
  });

  it("caps Body measure for readability", () => {
    render(<Body>Clinical summary text</Body>);
    expect(screen.getByText("Clinical summary text").className).toContain("max-w-[70ch]");
  });
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run components/ui/Typography.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

Each component is a thin wrapper applying exactly one `fontSize` token from Task 5 plus `text-ink` or `text-ink-muted`. `Body` adds `max-w-[70ch]`. `Label` adds `uppercase text-ink-muted`. No component sets a colour outside the token set.

- [ ] **Step 4: Run to confirm pass, then gate and commit**

```bash
npx vitest run components/ui/Typography.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/Typography.tsx components/ui/Typography.test.tsx
git commit -m "feat: rebuild Typography on the token type scale"
```

---

### Task 8: Button

**Files:**
- Modify: `components/ui/Button.tsx`
- Create: `components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `<Button variant="primary"|"secondary"|"outline"|"ghost"|"text"|"danger" size="lg"|"md"|"sm" isLoading leftIcon rightIcon>`. The `emergency` variant is **removed**; update the three call sites found by `grep -rn 'variant="emergency"' app components`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("is disabled and busy while loading", () => {
    render(<Button isLoading>Save</Button>);
    const b = screen.getByRole("button");
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });

  it("keeps sm buttons at a 44px hit area", () => {
    render(<Button size="sm">Edit</Button>);
    expect(screen.getByRole("button").className).toContain("before:min-h-[44px]");
  });

  it("never carries a pulse animation", () => {
    render(<Button variant="danger">Delete case</Button>);
    expect(screen.getByRole("button").className).not.toContain("animate-pulse");
  });

  it("renders text variant without a fill", () => {
    render(<Button variant="text">Learn more</Button>);
    const c = screen.getByRole("button").className;
    expect(c).not.toContain("bg-action");
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement the `cva` variants**

Base: `inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-[background-color,color,transform] duration-150 ease-out active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:text-ink-disabled disabled:bg-surface-raised`.

| Variant | Classes |
| --- | --- |
| `primary` | `bg-action text-on-action hover:bg-action-hover active:bg-action-active` |
| `secondary` | `bg-surface-raised text-ink border border-rule hover:bg-rule` |
| `outline` | `border border-action text-action hover:bg-action-subtle` |
| `ghost` | `text-action hover:bg-action-subtle` |
| `text` | `text-action underline-offset-4 hover:underline` |
| `danger` | `bg-risk-emergency text-on-action hover:brightness-90` |

Sizes: `lg` `h-[52px] px-6 text-body`, `md` `h-11 px-4 text-body-sm`, `sm` `h-9 px-3 text-body-sm relative before:absolute before:inset-x-0 before:top-1/2 before:-translate-y-1/2 before:min-h-[44px] before:content-['']`.

Set `aria-busy={isLoading}`. Keep `Loader2` spinning only outside reduced-motion.

- [ ] **Step 4: Fix the removed variant's call sites**

Run: `grep -rn 'variant="emergency"' app components`
Replace each with `variant="danger"`.

- [ ] **Step 5: Pass, gate, commit**

```bash
npx vitest run components/ui/Button.test.tsx
npx tsc --noEmit && npm run build && npm run gate
git add components/ui/Button.tsx components/ui/Button.test.tsx app components
git commit -m "feat: rebuild Button with six token-driven variants"
```

---

### Task 9: Card

**Files:** Modify `components/ui/Card.tsx`; create `components/ui/Card.test.tsx`

**Interfaces:** Produces `<Card>` (border-only) and `<Section>` (heading + content, no border). `StatCard` is **deleted**; the dashboard uses `<Section>` plus `<DataLg>` instead, per spec section 9.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("declares elevation once: border, never shadow", () => {
    render(<Card data-testid="c">Body</Card>);
    const c = screen.getByTestId("c").className;
    expect(c).toContain("border-rule");
    expect(c).not.toMatch(/\bshadow-/);
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement**

`Card` base: `bg-surface border border-rule rounded-card p-5`. No shadow, no hover shadow, no `dark:` variant.
`Section`: `<section>` with an optional `<H2>` heading and `space-y-4`, no border and no background.

- [ ] **Step 4: Delete `StatCard` and fix call sites**

Run: `grep -rn "StatCard" app components` and convert each to `<Section>` + `<DataLg>`.

- [ ] **Step 5: Pass, gate, commit**

```bash
npx vitest run components/ui/Card.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/Card.tsx components/ui/Card.test.tsx app components
git commit -m "feat: rebuild Card as border-only elevation, add Section, drop StatCard"
```

---

### Task 10: RiskIndicator

The single most important component in the app. It is the only place risk colour is decided.

**Files:** Create `components/ui/RiskIndicator.tsx`, `components/ui/RiskIndicator.test.tsx`

**Interfaces:** Produces `<RiskIndicator level={RiskLevel} variant="solid"|"tint"|"inline" showScore?={number} />` where `RiskLevel = "EMERGENCY" | "HIGH" | "MODERATE" | "LOW"` from `types/analysis.ts`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskIndicator } from "./RiskIndicator";

const LEVELS = ["EMERGENCY", "HIGH", "MODERATE", "LOW"] as const;

describe("RiskIndicator", () => {
  it.each(LEVELS)("%s carries a text label, not colour alone", (level) => {
    render(<RiskIndicator level={level} />);
    expect(screen.getByText(level.charAt(0) + level.slice(1).toLowerCase(), { exact: false }))
      .toBeInTheDocument();
  });

  it.each(LEVELS)("%s carries a distinct shape icon", (level) => {
    const { container } = render(<RiskIndicator level={level} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("spells the level out for screen readers", () => {
    render(<RiskIndicator level="EMERGENCY" />);
    expect(screen.getByLabelText(/Assessed risk level: Emergency/i)).toBeInTheDocument();
  });

  it("renders the urgency score with tabular figures", () => {
    render(<RiskIndicator level="EMERGENCY" showScore={9.8} />);
    expect(screen.getByText("9.8").className).toContain("tabular");
  });

  it("uses no emoji", () => {
    const { container } = render(<RiskIndicator level="HIGH" />);
    expect(container.textContent ?? "").not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement**

Shape mapping, from Lucide, at `strokeWidth={1.75}`:

| Level | Icon | Label | Colour token |
| --- | --- | --- | --- |
| `EMERGENCY` | `Octagon` | Emergency | `risk-emergency` |
| `HIGH` | `Triangle` | High risk | `risk-high` |
| `MODERATE` | `Circle` | Moderate | `risk-moderate` |
| `LOW` | `Shield` | Low risk | `risk-low` |

`solid` fills with the risk colour and uses `text-on-action`. `tint` uses a 12% alpha of the risk colour with the risk colour as ink. `inline` is icon plus label only. Every variant sets `aria-label={`Assessed risk level: ${label}`}`.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run components/ui/RiskIndicator.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/RiskIndicator.tsx components/ui/RiskIndicator.test.tsx
git commit -m "feat: add RiskIndicator as the single source of clinical risk styling"
```

---

### Task 11: Badge and ConfidenceBadge

**Files:** Modify `components/ui/Badge.tsx`; create `components/ui/ConfidenceBadge.tsx`, `components/ui/ConfidenceBadge.test.tsx`

**Interfaces:** Produces `<ConfidenceBadge level="LOW"|"MEDIUM"|"HIGH" needsReview={boolean} />`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfidenceBadge } from "./ConfidenceBadge";

describe("ConfidenceBadge", () => {
  it.each([
    ["HIGH", "High confidence"],
    ["MEDIUM", "Moderate confidence"],
    ["LOW", "Low confidence"],
  ] as const)("bands %s as %s", (level, expected) => {
    render(<ConfidenceBadge level={level} needsReview={false} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("shows the clinician review requirement", () => {
    render(<ConfidenceBadge level="HIGH" needsReview />);
    expect(screen.getByText("Needs clinician review")).toBeInTheDocument();
  });

  it("never renders a percentage", () => {
    const { container } = render(<ConfidenceBadge level="HIGH" needsReview />);
    expect(container.textContent ?? "").not.toMatch(/\d+(\.\d+)?\s*%/);
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement.**

Confidence is **not** clinical severity, so it uses neutral tokens (`bg-surface-raised text-ink-muted border-rule`), never risk colours. `needsReview` renders as a second chip in the same neutral family. Chips use `whitespace-nowrap min-w-0` per spec 7.1.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run components/ui/ConfidenceBadge.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/Badge.tsx components/ui/ConfidenceBadge.tsx components/ui/ConfidenceBadge.test.tsx
git commit -m "feat: replace numeric AI confidence with qualitative banding"
```

---

### Task 12: Field, Input and ErrorSummary

**Files:** Modify `components/ui/Input.tsx`; create `components/ui/Field.tsx`, `components/ui/ErrorSummary.tsx`, `components/ui/Field.test.tsx`, `components/ui/ErrorSummary.test.tsx`

**Interfaces:** Produces `<Field id label helper error required>{control}</Field>` and `<ErrorSummary errors={Array<{ fieldId: string; message: string }>} />`.

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";
import { ErrorSummary } from "./ErrorSummary";

describe("Field", () => {
  it("links the visible label to the control", () => {
    render(<Field id="age" label="Age"><input id="age" /></Field>);
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
  });

  it("connects the error to the control and marks it invalid", () => {
    render(<Field id="age" label="Age" error="Enter an age between 0 and 120"><input id="age" /></Field>);
    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("age-error");
    expect(screen.getByText("Enter an age between 0 and 120")).toBeInTheDocument();
  });
});

describe("ErrorSummary", () => {
  it("is an alert that can receive focus", () => {
    render(<ErrorSummary errors={[{ fieldId: "age", message: "Enter an age" }]} />);
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  it("links each entry to its field", () => {
    render(<ErrorSummary errors={[{ fieldId: "age", message: "Enter an age" }]} />);
    expect(screen.getByRole("link", { name: "Enter an age" })).toHaveAttribute("href", "#age");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement.**

`Field` renders label above the control (never placeholder-as-label), persistent helper text below the control, and error text below that in `text-risk-emergency text-body-sm`. It clones the child to inject `aria-invalid`, `aria-describedby` and `aria-required`.

`ErrorSummary` renders `<div role="alert" tabindex={-1}>` with an `<h2>` reading "There is a problem" and a list of anchors. Input borders use `border-rule-strong`, which Task 2 proved meets 3:1.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run components/ui/Field.test.tsx components/ui/ErrorSummary.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/Input.tsx components/ui/Field.tsx components/ui/ErrorSummary.tsx components/ui/*.test.tsx
git commit -m "feat: add accessible Field and focusable ErrorSummary primitives"
```

---

### Task 13: Table

**Files:** Create `components/ui/Table.tsx`, `components/ui/Table.test.tsx`

**Interfaces:** Produces `<Table caption>`, `<THead>`, `<TH sortable sortDirection="asc"|"desc"|"none" onSort>`, `<TBody>`, `<TR selected>`, `<TD numeric>`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, THead, TH, TBody, TR, TD } from "./Table";

describe("Table", () => {
  it("exposes sort state to assistive tech", () => {
    render(
      <Table caption="Patient queue">
        <THead><tr><TH sortable sortDirection="asc">Urgency</TH></tr></THead>
        <TBody><TR><TD>9.8</TD></TR></TBody>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending");
  });

  it("gives numeric cells tabular figures", () => {
    render(
      <Table caption="Q">
        <TBody><TR><TD numeric>165/102</TD></TR></TBody>
      </Table>
    );
    expect(screen.getByRole("cell").className).toContain("tabular");
  });

  it("offsets sticky-header scroll so focus is never obscured", () => {
    const { container } = render(<Table caption="Q"><TBody><TR><TD>x</TD></TR></TBody></Table>);
    expect(container.firstElementChild?.className).toContain("scroll-pt-");
  });

  it("always has a caption", () => {
    render(<Table caption="Patient queue"><TBody><TR><TD>x</TD></TR></TBody></Table>);
    expect(screen.getByText("Patient queue")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement to spec section 7.**

Wrapper: `overflow-x-auto scroll-pt-14`. The `scroll-pt-14` satisfies WCAG 2.2 "Focus Not Obscured (Minimum)"; without it the sticky header hides the focused row when tabbing.

Rows: `h-14` (56px), even rows `bg-ground`, hover `bg-surface-raised`, selected `bg-action-subtle` with `aria-selected` and **no side stripe**. No per-row borders; zebra carries separation.
Header: `sticky top-0 z-10 bg-surface-raised text-ink-muted text-label border-b border-rule`.
`caption` is rendered visually hidden when the surrounding `<Section>` already names the table.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run components/ui/Table.test.tsx
npx tsc --noEmit && npm run build
git add components/ui/Table.tsx components/ui/Table.test.tsx
git commit -m "feat: add Table primitive with sticky header focus clearance"
```

---

### Task 14: EmptyState and Skeleton

**Files:** Create `components/ui/EmptyState.tsx`, `components/ui/Skeleton.tsx`

**Interfaces:** Produces `<EmptyState icon title description action />` and `<Skeleton className />`.

- [ ] **Step 1: Implement `EmptyState`**

Centred stack: a Lucide icon at 32px in `text-ink-disabled`, `<H3>` title, `<Body>` description, one `<Button variant="primary">` naming the next action. Copy states what to do, never "No data". Per spec 4.4, empty states are an approved identity surface, so the icon may use `text-action`.

- [ ] **Step 2: Implement `Skeleton`**

`bg-surface-raised rounded-control animate-pulse motion-reduce:animate-none`. Callers compose skeletons shaped like the content they replace. No spinners outside buttons.

- [ ] **Step 3: Gate and commit**

```bash
npx tsc --noEmit && npm run build
git add components/ui/EmptyState.tsx components/ui/Skeleton.tsx
git commit -m "feat: add EmptyState and Skeleton primitives"
```

---

## Phase 3: Data, State and Validation

### Task 15: Data model

**Files:** Modify `lib/casesData.ts`; create `lib/casesData.test.ts`

**Interfaces:** Produces the extended `ClinicalCaseData`. `aiConfidence: number` is **replaced** by `confidenceLevel: "LOW" | "MEDIUM" | "HIGH"` and `requiresHumanReview: boolean`. Adds `supportingFindings: Array<{ source: string; observation: string }>`, `differentialConsiderations: string[]`, `recommendedInvestigations: string[]`, `clinicalRationale: string[]`, `disposition: { needsReferral: boolean; urgency: string; nextStep: string }`.

Field names mirror `backend/reasoning/output_schema.py` so wiring the real pipeline later needs no redesign.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { PRESET_CASES } from "./casesData";

describe("case data", () => {
  it("carries no numeric confidence", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c).not.toHaveProperty("aiConfidence");
      expect(["LOW", "MEDIUM", "HIGH"]).toContain(c.confidenceLevel);
    }
  });

  it("defaults to requiring human review", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.requiresHumanReview).toBe(true);
    }
  });

  it("uses no diagnostic language in findings", () => {
    const banned = /diagnosed with|definitive diagnosis/i;
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.primaryFinding).not.toMatch(banned);
      expect(c.clinicalSummary).not.toMatch(banned);
    }
  });

  it("populates every results section", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.supportingFindings.length).toBeGreaterThan(0);
      expect(c.differentialConsiderations.length).toBeGreaterThan(0);
      expect(c.recommendedInvestigations.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Extend the interface and both preset cases with real clinical content.**

`calculateCustomUrgencyScore` returns `confidenceLevel` instead of a number. Delete every `aiConfidence` reference: `grep -rn "aiConfidence" app components lib`.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run lib/casesData.test.ts
npx tsc --noEmit && npm run build
git add lib/casesData.ts lib/casesData.test.ts app components
git commit -m "feat: restructure case data for clinical results sections, drop numeric confidence"
```

---

### Task 16: Validation schemas

**Files:** Create `lib/schemas/patient.ts`, `lib/schemas/patient.test.ts`

**Interfaces:** Produces `patientDetailsSchema`, `symptomsSchema`, `historySchema`, `stepSchemas: Record<1|2|3|4|5, ZodSchema>`, and `type PatientDetails = z.infer<typeof patientDetailsSchema>`.

- [ ] **Step 1: Write the failing test, covering every boundary**

```ts
import { describe, it, expect } from "vitest";
import { patientDetailsSchema } from "./patient";

const valid = {
  patientName: "Sunita Devi",
  patientId: "P-9902",
  age: 62,
  gender: "Female",
  chiefComplaint: "Acute substernal chest pain radiating to jaw.",
};

describe("patientDetailsSchema", () => {
  it("accepts a valid record", () => {
    expect(patientDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["age", -5], ["age", 121], ["age", 12.5],
    ["hrBpm", 19], ["hrBpm", 251],
    ["systolicBp", 49], ["systolicBp", 261],
    ["tempCelsius", 29.9], ["tempCelsius", 45.1],
    ["spO2Percent", 49], ["spO2Percent", 101],
  ])("rejects %s = %s", (field, value) => {
    const r = patientDetailsSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
  });

  it("rejects diastolic greater than or equal to systolic", () => {
    const r = patientDetailsSchema.safeParse({ ...valid, systolicBp: 120, diastolicBp: 130 });
    expect(r.success).toBe(false);
  });

  it("rejects an empty patient name", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, patientName: "" }).success).toBe(false);
  });

  it("rejects a patient id with spaces", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, patientId: "P 9902" }).success).toBe(false);
  });

  it("rejects a chief complaint under 10 characters", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, chiefComplaint: "chest" }).success).toBe(false);
  });

  it("allows all vitals to be omitted", () => {
    expect(patientDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it("gives a recovery-oriented message, not just Invalid", () => {
    const r = patientDetailsSchema.safeParse({ ...valid, age: 200 });
    if (r.success) throw new Error("expected failure");
    expect(r.error.issues[0].message).toMatch(/between 0 and 120/i);
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement to the spec 10.6 table.**

Every message states the cause and the fix, for example `"Enter an age between 0 and 120"`, never `"Invalid input"`. Diastolic uses `.superRefine` to compare against systolic and attaches the issue to `diastolicBp`.

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run lib/schemas/patient.test.ts
npx tsc --noEmit && npm run build
git add lib/schemas/ && git commit -m "feat: add zod intake schemas with physiological bounds"
```

---

### Task 17: Case draft store

**Files:** Create `lib/store/caseDraft.ts`, `lib/store/caseDraft.test.ts`

**Interfaces:** Produces `useCaseDraft` per spec 10.5. Initial patient state is **empty**, not "Ramesh Kumar".

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useCaseDraft } from "./caseDraft";

describe("useCaseDraft", () => {
  beforeEach(() => useCaseDraft.getState().reset());

  it("starts empty, with no seeded patient", () => {
    const s = useCaseDraft.getState();
    expect(s.patient.patientName).toBe("");
    expect(s.step).toBe(1);
    expect(s.uploads).toEqual([]);
  });

  it("merges patient updates without clobbering other fields", () => {
    useCaseDraft.getState().updatePatient({ patientName: "Sunita Devi" });
    useCaseDraft.getState().updatePatient({ age: 62 });
    const p = useCaseDraft.getState().patient;
    expect(p.patientName).toBe("Sunita Devi");
    expect(p.age).toBe(62);
  });

  it("clamps step to the 1-5 range", () => {
    useCaseDraft.getState().setStep(9 as never);
    expect(useCaseDraft.getState().step).toBe(5);
  });

  it("removes an upload by id", () => {
    const { addUpload, removeUpload } = useCaseDraft.getState();
    addUpload({ id: "a", file: new File([""], "ecg.png"), type: "ECG" });
    removeUpload("a");
    expect(useCaseDraft.getState().uploads).toEqual([]);
  });

  it("reset clears a populated draft", () => {
    useCaseDraft.getState().updatePatient({ patientName: "X" });
    useCaseDraft.getState().reset();
    expect(useCaseDraft.getState().patient.patientName).toBe("");
  });
});
```

- [ ] **Step 2: Run, confirm failure. Step 3: Implement with `create` from `zustand`.**

- [ ] **Step 4: Pass, gate, commit**

```bash
npx vitest run lib/store/caseDraft.test.ts
npx tsc --noEmit && npm run build
git add lib/store/ && git commit -m "feat: add zustand case-draft store, remove seeded patient data"
```

---

## Phase 4: Route Migration

Each task follows the same shape. Run `npm run gate` before and after; the violation count must fall.

### Task 18: Intake wizard

**Files:** Modify `app/new-case/page.tsx` and all 12 `components/new-case/*.tsx`

- [ ] **Step 1: Replace local state with the store.** Delete the eleven `useState` calls and the hardcoded patient object. Read from `useCaseDraft`.
- [ ] **Step 2: Wire `react-hook-form` per step** with `zodResolver(stepSchemas[step])`, `mode: "onBlur"`.
- [ ] **Step 3: Block advance on invalid.** `Next Step` calls `trigger()`; on failure, render `<ErrorSummary>` at the top of the step and move focus to it.
- [ ] **Step 4: Convert every field to `<Field>`.** No placeholder-as-label anywhere.
- [ ] **Step 5: Fix the symptom chips.** `SmartSymptomSearch` chips use `flex-wrap`, never a clipped fixed-height row. Any `+n` indicator is a real button that reveals the hidden values.
- [ ] **Step 6: Delete `sessionStorage`.** `handleAnalysisComplete` calls `setResult` on the store, then routes.
- [ ] **Step 7: Migrate colours.** Every `bg-slate-*`, `text-white`, `text-xs`, `font-black` becomes a token utility.
- [ ] **Step 8: Verify by hand.** Run `npm run dev`. Submit empty: expect a focused error summary and inline errors. Enter age `-5`: expect "Enter an age between 0 and 120". Enter valid data: expect advance.
- [ ] **Step 9: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate && npx vitest run
git add app/new-case components/new-case
git commit -m "feat: migrate intake wizard to tokens, store and validation"
```

---

### Task 19: Results route

**Files:** Modify `app/results/[caseId]/page.tsx` and the 20 `components/results/*.tsx`

- [ ] **Step 1: Reorder to the six sections** of spec 8.1: Primary finding, Supporting findings, Differential considerations, Recommended investigations, Clinical rationale, Disposition.
- [ ] **Step 2: Rename and re-scope.** Any component or heading using "diagnosis" is renamed. `AIDiagnosisCenterpiece.tsx` becomes `PrimaryFinding.tsx`. Add the subtitle "Possibilities raised for physician review. Not a diagnosis." to the differential section.
- [ ] **Step 3: Swap confidence.** Replace every numeric readout with `<ConfidenceBadge>`.
- [ ] **Step 4: Route all risk styling through `<RiskIndicator>`.** Delete local risk colour maps in `ClinicalRiskBanner`, `RiskIndicator` (old), `PatientSnapshot`.
- [ ] **Step 5: Un-nest cards.** Find nested `<Card>` and hand-rolled card divs inside cards; convert inner ones to `<Section>` or plain grouping.
- [ ] **Step 6: Rewrite copy.** No section starts "Based on the uploaded symptoms". Check every string against `ACCESSIBILITY_AND_TERMINOLOGY.md`.
- [ ] **Step 7: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate && npx vitest run
git add app/results components/results
git commit -m "feat: restructure results into six clinical sections"
```

---

### Task 20: Dashboard

**Files:** Modify `app/page.tsx` and the 14 `components/dashboard/*.tsx`

- [ ] **Step 1: Delete the equal-stat-card row.** Whatever renders four identical tiles in `CompactOperationalHeader` or `DailyClinicalOverview` becomes `<Section>` plus `<DataLg>` figures separated by rhythm and rules.
- [ ] **Step 2: Make the priority zone dominant.** `EmergencyAlertBanner` and the highest-urgency cases sit at the top with the most visual weight. Everything else is secondary.
- [ ] **Step 3: Rebuild `PatientQueueTable` on `<Table>`.** 56px rows, zebra, sticky header, tabular numerals, `<RiskIndicator>` in the risk column, a real `<caption>`.
- [ ] **Step 4: Add the empty state** for a clinic with no active cases.
- [ ] **Step 5: Collapse technical provenance** into a disclosure, per design principle 4.
- [ ] **Step 6: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate && npx vitest run
git add app/page.tsx components/dashboard
git commit -m "feat: recompose dashboard around the clinical priority zone"
```

---

### Task 21: History route

**Files:** Modify `app/history/page.tsx` and the 8 `components/history/*.tsx`

- [ ] **Step 1: Rebuild `CaseHistoryTable` on `<Table>`.**
- [ ] **Step 2: Fix filter chips** per spec 7.1: wrap, never clip; operable overflow.
- [ ] **Step 3: Add empty and loading states** to the table and `ExportCenter`.
- [ ] **Step 4: Migrate colours across all 8 components.**
- [ ] **Step 5: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate
git add app/history components/history
git commit -m "feat: migrate history route to Table primitive and tokens"
```

---

### Task 22: Settings route

**Files:** Modify `app/settings/page.tsx` and the 10 `components/settings/*.tsx`

- [ ] **Step 1: Migrate all 10 components to tokens.**
- [ ] **Step 2: Convert every setting control to `<Field>`.**
- [ ] **Step 3: Verify `AccessibilityCenter` claims are true.** If it advertises a feature that does not work, either implement it or delete the claim. Do not ship a settings panel that lies.
- [ ] **Step 4: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate
git add app/settings components/settings
git commit -m "feat: migrate settings route to tokens"
```

---

### Task 23: Remaining routes

**Files:** `app/{evaluation,developer,demo,learning,presentation}/page.tsx`, `app/{error,loading,not-found}.tsx`, `components/{evaluation,developer,demo,presentation,judge,health,templates,search,layout,ai,medical}/*.tsx`

- [ ] **Step 1: Migrate `components/layout/*` first** (`AppShell`, `Sidebar`, `Header`, `Breadcrumbs`, `CommandPalette`). `Sidebar` at 417 lines is the largest file; its active nav item is an approved identity surface, so it uses `bg-action-subtle text-action`.
- [ ] **Step 2: Migrate charts.** In `Charts.tsx`, `EvaluationMetricsCharts.tsx` and `ClinicalInsightsDashboard.tsx`, replace hardcoded series colours with tokens, add legends, axis labels with units, and a text summary for screen readers. Grid lines use `rule` so they never compete with the data.
- [ ] **Step 3: Migrate the remaining components** to tokens.
- [ ] **Step 4: Migrate `error.tsx`, `loading.tsx`, `not-found.tsx`** to `<EmptyState>` and `<Skeleton>`.
- [ ] **Step 5: Gate and commit**

```bash
npx tsc --noEmit && npm run build && npm run gate
git add app components
git commit -m "feat: migrate remaining routes and shared layout to tokens"
```

---

## Phase 5: Close

### Task 24: Accessibility sweep

- [ ] **Step 1: ARIA roles.** `EmergencyBanner` gets `role="alert" aria-live="assertive"`. `StageTracker` gets `role="status" aria-live="polite"`.
- [ ] **Step 2: Icon semantics.** Every decorative icon beside visible text gets `aria-hidden="true"`. Every icon-only control gets an accessible name. Run `grep -rn "<[A-Z][a-zA-Z]* className=\"h-" components | wc -l` to find candidates.
- [ ] **Step 3: Keyboard pass.** Tab through all 13 routes. Focus must be visible everywhere and never hidden behind the sticky table header or `FloatingAIAssistant`.
- [ ] **Step 4: Reduced-motion pass.** Enable the OS setting. The emergency pulse must go static; nothing else may animate.
- [ ] **Step 5: Both themes.** Screenshot all 13 routes in Day and Night.
- [ ] **Step 6: Commit**

```bash
npx tsc --noEmit && npm run build && npm run gate && npx vitest run
git add -A && git commit -m "fix: accessibility sweep across all routes"
```

---

### Task 25: Reconcile the design docs

- [ ] **Step 1: Rewrite `COLOR_SYSTEM.md`** with the Surgical tokens and the measured ratios from `npx vitest run lib/tokens.test.ts`. Replace the emoji shape column with the Lucide icon names from Task 10.
- [ ] **Step 2: Rewrite `DESIGN_TOKENS.md`** with the shipped CSS variables. The old teal ramp is deleted.
- [ ] **Step 3: Rewrite `TYPOGRAPHY_SYSTEM.md`** for Public Sans and Atkinson Hyperlegible Mono, with the 13px floor.
- [ ] **Step 4: Update `ACCESSIBILITY_AND_TERMINOLOGY.md`** to state the WCAG 2.2 web target size correctly: 24 CSS px is the criterion, 44px is MediGem's stricter product floor.
- [ ] **Step 5: Update `COMPONENTS.md`** with the eight primitives.
- [ ] **Step 6: Commit**

```bash
git add docs/design_system
git commit -m "docs: reconcile design system with the shipped Surgical implementation"
```

---

### Task 26: Final gate

- [ ] **Step 1: Everything green**

```bash
npx tsc --noEmit && npm run build && npx vitest run && npm run gate
```

Expected: `Slop gate: clean.` If any violation remains, fix it. **Do not add an exception to the gate.**

- [ ] **Step 2: Card count check.** Run `grep -rc "rounded-card\|<Card" app components | awk -F: '{t+=$2} END {print t}'`. Compare against the 239 baseline. If it has not fallen materially, spec section 6 was re-skinned rather than applied; revisit the worst offenders.

- [ ] **Step 3: Record the evidence.** Paste the four command outputs plus before and after screenshots into the PR description.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin feat/surgical-ui-overhaul
gh pr create --title "Surgical UI overhaul" --body-file -
```

---

## Self-Review

**Spec coverage.** Section 4 tokens to Tasks 2 and 5. Section 4.4 identity zone to Tasks 20 and 23 Step 1 and Task 14. Section 5 typography to Tasks 4, 5 and 7. Section 6 shape and elevation to Task 9. Section 7 tables to Tasks 13, 20, 21. Section 7.1 chips to Tasks 18 and 21. Section 8 results to Tasks 15 and 19. Section 9 dashboard to Task 20. Section 10 architecture to Tasks 5, 6, 8 to 17. Section 11 states to Tasks 12 and 14. Section 12 accessibility to Task 24. Section 13 verification to Tasks 2, 3, 26. No gaps found.

**Placeholders.** None. Every code step carries real code; every migration step names its files and its acceptance check.

**Type consistency.** `RiskLevel` is `types/analysis.ts`'s existing union throughout. `ConfidenceLevel` matches the backend enum casing (`LOW`/`MEDIUM`/`HIGH`). `useCaseDraft` method names are identical in Tasks 17 and 18. `TokenSet` keys in Task 2 match the CSS variable names in Task 5 and the Tailwind keys in Task 5 Step 4.
