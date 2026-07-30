"use client";

import { useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

/** Hook wrapping next-themes with typed light/dark mode helpers and hydration safety */
export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (theme === "dark" || (theme === "system" && systemTheme === "dark")) : true;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
    mounted,
  };
}
