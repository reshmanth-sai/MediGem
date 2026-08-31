"use client";

import { useThemeContext, type Theme } from "@/providers/ThemeProvider";

export type { Theme };

/**
 * Hook exposing the shared Day/Night theme. Backed by a single React
 * context provided by ThemeProvider (see providers/ThemeProvider.tsx), so
 * every consumer reads and writes the same state: toggling the theme in
 * one mounted consumer is reflected in every other mounted consumer
 * without a remount. "day" applies no class to <html>; "night" applies
 * theme-night, matching the token blocks in styles/globals.css.
 */
export function useTheme() {
  const { theme, setTheme } = useThemeContext();

  const isDark = theme === "night";

  /** Kept for existing consumers (e.g. components/layout/Header.tsx) that toggle the theme with one control. */
  const toggleTheme = () => setTheme(theme === "night" ? "day" : "night");

  return { theme, setTheme, isDark, toggleTheme };
}
