"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type Theme = "day" | "night";

export const THEME_STORAGE_KEY = "medigem-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Runs before hydration, as the first child rendered by ThemeProvider (the
 * same positional trick libraries like next-themes use to beat React to the
 * paint). Reads the persisted choice straight from localStorage and, if it
 * is "night", adds theme-night to <html> synchronously, so a hard reload
 * never paints the Day tokens first. Deliberately tiny and dependency-free
 * so it cannot throw the way next-themes' own class-value mapping did when
 * we tried mapping a theme to an empty string (verified: a real
 * `classList.remove("", "theme-night")` throws a SyntaxError in the
 * browser). "day" applies no class here, matching the :root default.
 */
const NO_FLASH_SCRIPT = `(function(){try{var v=window.localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var t=v?JSON.parse(v):"day";if(t==="night"){document.documentElement.classList.add("theme-night");}}catch(e){}})();`;

type ThemeProviderProps = React.PropsWithChildren<{
  /** Legacy props kept optional for call-site compatibility; the provider no longer reads them. */
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}>;

/**
 * Single source of truth for the Day/Night theme. Every call to useTheme()
 * reads and writes this one context, so toggling the theme in one mounted
 * consumer (e.g. the Settings page) is reflected immediately in every other
 * mounted consumer (e.g. a header toggle button), with no remount required.
 * Persistence is handled by the existing useLocalStorage hook. Pairs with
 * the blocking inline script above for a flash-free initial paint.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, "day");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "night") {
      root.classList.add("theme-night");
    } else {
      root.classList.remove("theme-night");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}
    </ThemeContext.Provider>
  );
}

/** Internal accessor used by hooks/useTheme.ts; not meant to be imported directly elsewhere. */
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
