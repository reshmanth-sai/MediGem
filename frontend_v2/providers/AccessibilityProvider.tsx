"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const REDUCED_MOTION_STORAGE_KEY = "medigem-reduced-motion";
export const HIGH_CONTRAST_STORAGE_KEY = "medigem-high-contrast";
export const LARGE_TEXT_STORAGE_KEY = "medigem-large-text";

interface AccessibilityContextValue {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  largeText: boolean;
  setLargeText: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

/**
 * Runs before hydration, as the first child rendered by AccessibilityProvider
 * (the same positional trick used by ThemeProvider's own NO_FLASH_SCRIPT, see
 * providers/ThemeProvider.tsx). Reads the three persisted accessibility
 * preferences straight from localStorage and applies their data attributes to
 * <html> synchronously, so a hard reload never paints a frame with the wrong
 * motion, contrast, or text-scale state.
 */
const NO_FLASH_SCRIPT = `(function(){try{
var read=function(k){var v=window.localStorage.getItem(k);return v?JSON.parse(v):false;};
var root=document.documentElement;
if(read(${JSON.stringify(REDUCED_MOTION_STORAGE_KEY)})){root.setAttribute("data-motion","reduce");}
if(read(${JSON.stringify(HIGH_CONTRAST_STORAGE_KEY)})){root.setAttribute("data-contrast","high");}
if(read(${JSON.stringify(LARGE_TEXT_STORAGE_KEY)})){root.setAttribute("data-text-scale","large");}
}catch(e){}})();`;

/**
 * Single source of truth for the three Accessibility & Human Factors
 * preferences (reduced motion, high contrast, large text). Every call to
 * useAccessibility() reads and writes this one context, so toggling a
 * preference from one mounted consumer is reflected immediately in every
 * other mounted consumer, with no remount required, mirroring
 * providers/ThemeProvider.tsx. Persistence is handled by the existing
 * useLocalStorage hook. Each preference drives a data attribute on <html>
 * (data-motion, data-contrast, data-text-scale) with matching CSS blocks in
 * styles/globals.css, so the effect is real and app-wide, not confined to
 * whichever settings panel happens to be mounted.
 */
export function AccessibilityProvider({ children }: React.PropsWithChildren) {
  const [reducedMotion, setReducedMotion] = useLocalStorage<boolean>(REDUCED_MOTION_STORAGE_KEY, false);
  const [highContrast, setHighContrast] = useLocalStorage<boolean>(HIGH_CONTRAST_STORAGE_KEY, false);
  const [largeText, setLargeText] = useLocalStorage<boolean>(LARGE_TEXT_STORAGE_KEY, false);

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.setAttribute("data-motion", "reduce");
    } else {
      root.removeAttribute("data-motion");
    }
  }, [reducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.setAttribute("data-text-scale", "large");
    } else {
      root.removeAttribute("data-text-scale");
    }
  }, [largeText]);

  return (
    <AccessibilityContext.Provider
      value={{ reducedMotion, setReducedMotion, highContrast, setHighContrast, largeText, setLargeText }}
    >
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}
    </AccessibilityContext.Provider>
  );
}

/** Internal accessor used by hooks/useAccessibility.ts; not meant to be imported directly elsewhere. */
export function useAccessibilityContext(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibilityContext must be used within AccessibilityProvider");
  }
  return ctx;
}
