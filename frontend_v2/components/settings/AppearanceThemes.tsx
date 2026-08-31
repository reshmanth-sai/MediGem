"use client";

import React from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { H2, BodySm } from "@/components/ui/Typography";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/lib/tokens";

/**
 * Each option shows its own actual surface / ink / action colours rather
 * than a decorative gradient. These are read from the TOKENS table rather
 * than restated as hex here: this panel has to paint both themes at once,
 * so it cannot use the CSS custom properties, which only ever resolve to
 * whichever theme is currently active. TOKENS is the single TS-side copy of
 * the palette, kept in step with styles/globals.css.
 */
const THEME_OPTIONS: {
  id: Theme;
  label: string;
  helper: string;
  icon: typeof Sun;
  surface: string;
  ink: string;
  action: string;
}[] = [
  {
    id: "day",
    label: "Day",
    helper: "Bright clinic, daylight, printing",
    icon: Sun,
    surface: TOKENS.light.surface,
    ink: TOKENS.light.ink,
    action: TOKENS.light.action,
  },
  {
    id: "night",
    label: "Night",
    helper: "Low-light and night shifts",
    icon: Moon,
    surface: TOKENS.dark.surface,
    ink: TOKENS.dark.ink,
    action: TOKENS.dark.action,
  },
];

export function AppearanceThemes() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-card border border-rule bg-surface p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-rule">
        <div className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
          <Palette className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <H2>Colour Theme</H2>
          <BodySm className="text-ink-muted">Choose Day or Night. The choice is saved and applied on every reload.</BodySm>
        </div>
      </div>

      <div role="radiogroup" aria-label="Colour theme" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;

          return (
            <label key={opt.id} className="block cursor-pointer">
              {/*
                The native radio input stays focusable and is only visually
                hidden (sr-only clips it, including its own focus outline).
                It is marked `peer` and placed BEFORE the visible content
                below so `peer-focus-visible:` can draw a real focus ring on
                the visible sibling when the input has keyboard focus. Do
                not add `sr-only` styles to the visible span instead, that
                would hide the swatch, not just the input.
              */}
              <input
                type="radio"
                name="colour-theme"
                value={opt.id}
                checked={isActive}
                onChange={() => setTheme(opt.id)}
                className="peer sr-only"
              />

              <span
                className={cn(
                  "flex items-start gap-3 p-4 rounded-control border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface",
                  isActive ? "border-action" : "border-rule hover:border-rule-strong"
                )}
              >
                {/* Swatch showing this theme's actual surface / ink / action colours */}
                <span
                  className="relative shrink-0 h-12 w-12 rounded-control border border-rule flex items-center justify-center overflow-hidden"
                  style={{ background: opt.surface }}
                  aria-hidden="true"
                >
                  <span className="text-body-sm font-bold" style={{ color: opt.ink }}>
                    Aa
                  </span>
                  <span
                    className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full"
                    style={{ background: opt.action }}
                  />
                </span>

                <span className="space-y-1">
                  <span className="flex items-center gap-1.5 text-body-sm font-bold text-ink">
                    <Icon className="h-4 w-4 text-action" aria-hidden="true" />
                    {opt.label}
                  </span>
                  <span className="block text-body-sm text-ink-muted">{opt.helper}</span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
