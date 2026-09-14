#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
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
  // A Tailwind variant is always glued straight to the utility it modifies
  // (dark:text-white). Requiring a non-space after the colon keeps this from
  // firing on an ordinary TypeScript or CSS property that happens to be
  // named "dark", such as the `dark: { ... }` half of lib/tokens.ts.
  { name: "tailwind dark: variant", pattern: /\bdark:\S/ },
  { name: "numeric AI confidence", pattern: /\d{2}\.\d\s*%/ },
  { name: "em-dash or en-dash", pattern: /[—–]/ },
  { name: "emoji", pattern: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u },
  // Three, four, six or eight hex digits, the only lengths that are actually
  // a CSS colour. Bounding the length this way keeps the rule off ordinary
  // strings that merely start with a hash. A dead Charts.tsx carrying
  // #0F172A / #FFFFFF / #0D9488, the pre-Surgical palette, sat unnoticed in
  // the tree until it was deleted; this is the rule that would have caught it.
  {
    name: "hex colour literal",
    pattern: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/,
    // The palette has to be written out as literal hex exactly twice: once as
    // the CSS custom properties every token resolves to, and once in TS for
    // the code that needs both themes' values at the same time (the theme
    // swatches cannot use a CSS variable, which would only ever resolve to
    // whichever theme is currently active). Everywhere else, use the tokens.
    // styles/landing.css is the landing page palette, scoped under .landing
    // and separate from the workstation tokens on purpose.
    // app/opengraph-image.tsx renders at the edge with no stylesheet, so it
    // repeats the landing palette literally.
    allow: ["styles/globals.css", "lib/tokens.ts", "styles/landing.css", "app/opengraph-image.tsx"],
  },
  // Spec section 6: a surface carries either a border or a shadow, never
  // both, and a shadow only where the layer genuinely floats above the page
  // (dialogs, dropdowns, popovers, toasts). Every hit is flagged rather than
  // path-allowlisted, matching this gate's existing flag-for-review style: a
  // real floating layer is rare enough to be worth a deliberate conversation
  // when one is added.
  { name: "shadow utility", pattern: /\bshadow-(?:sm|md|lg|xl|2xl|inner|\[)/ },
  // Spec section 6 bans a decorative coloured left border above 1px on cards
  // and list items. Widths are matched explicitly so a plain 1px `border-l`
  // divider stays legal.
  {
    name: "decorative left border",
    pattern: /\bborder-l-(?:2|4|8)\b/,
    // The single named exception in the spec is emergency context: the
    // emergency row stripe in the case history queue.
    allow: ["components/history/CaseHistoryTable.tsx"],
  },
];

// Git matches pathspecs with wildmatch in its default mode, where `*` matches
// slashes and `**` carries no special meaning. The old `app/**/*.tsx` form
// therefore demanded a literal directory segment and silently skipped every
// top-level file: all five of app/{error,loading,not-found,page,layout}.tsx,
// and the whole of providers/, which has no subdirectories at all and so
// matched nothing whatsoever. The single-`*` form below already recurses, so
// it covers top-level and nested files alike.
const PATHSPECS = [
  "app/*.tsx",
  "app/*.ts",
  "components/*.tsx",
  "lib/*.ts",
  "hooks/*.ts",
  "providers/*.tsx",
  "styles/*.css",
];

const files = [
  ...new Set(
    execSync(`git ls-files --cached --others --exclude-standard ${PATHSPECS.map((p) => `'${p}'`).join(" ")}`, {
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean)
  ),
].sort();

let failures = 0;
for (const file of files) {
  if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
  // ls-files still lists a deletion that is staged but not yet committed.
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.allow?.includes(file)) continue;
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
