"use client";

import { useTheme as useNextTheme } from "next-themes";

/** Hook wrapping next-themes with typed light/dark mode helpers */
export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };
}
