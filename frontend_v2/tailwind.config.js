/** @type {import('tailwindcss').Config} */
module.exports = {
  // No darkMode setting. This project themes through the .theme-night class
  // and CSS custom properties (providers/ThemeProvider.tsx, styles/globals.css),
  // never through Tailwind's dark: variant. Zero dark: utilities remain in the
  // codebase, so the setting has nothing left to gate.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
