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
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
        },
        hover: "var(--bg-hover)",
        selected: "var(--bg-selected)",
        active: "var(--bg-active)",
        rule: { DEFAULT: "var(--rule)", strong: "var(--rule-strong)" },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          subtle: "var(--ink-subtle)",
          disabled: "var(--ink-disabled)",
        },
        action: {
          DEFAULT: "var(--action)",
          hover: "var(--action-hover)",
          active: "var(--action-active)",
          subtle: "var(--action-subtle)",
        },
        lavender: "var(--lavender)",
        "powder-blue": "var(--powder-blue)",
        sage: "var(--sage)",
        peach: "var(--peach)",
        "on-action": "var(--on-action)",
        risk: {
          emergency: {
            DEFAULT: "var(--risk-emergency)",
            subtle: "var(--risk-emergency-subtle)",
            border: "var(--risk-emergency-border)",
          },
          high: {
            DEFAULT: "var(--risk-high)",
            subtle: "var(--risk-high-subtle)",
            border: "var(--risk-high-border)",
          },
          moderate: {
            DEFAULT: "var(--risk-moderate)",
            subtle: "var(--risk-moderate-subtle)",
            border: "var(--risk-moderate-border)",
          },
          low: {
            DEFAULT: "var(--risk-low)",
            subtle: "var(--risk-low-subtle)",
            border: "var(--risk-low-border)",
          },
        },
        focus: "var(--focus)",
      },
      borderRadius: { card: "2px", control: "2px", chip: "9999px" },
      fontSize: {
        label:   ["0.8125rem", { lineHeight: "1.4",  letterSpacing: "0.05em", fontWeight: "600" }],
        "body-sm":["0.8125rem", { lineHeight: "1.5" }],
        body:    ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        h3:      ["1.0625rem", { lineHeight: "1.35", fontWeight: "600" }],
        data:    ["1.5rem",    { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.015em" }],
        h2:      ["1.75rem",   { lineHeight: "1.25", letterSpacing: "-0.025em", fontWeight: "600" }],
        h1:      ["3rem",      { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
        "data-lg":["1.5rem",  { lineHeight: "1.2",  letterSpacing: "-0.015em", fontWeight: "600" }],
        display: ["3rem",      { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Iowan Old Style", "serif"],
        // Identifiers, timestamps and readouts. Real mono, tabular by nature.
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
