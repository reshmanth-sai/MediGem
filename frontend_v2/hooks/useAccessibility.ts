"use client";

import { useAccessibilityContext } from "@/providers/AccessibilityProvider";

/**
 * Hook exposing the shared Accessibility & Human Factors preferences
 * (reduced motion, high contrast, large text). Backed by a single React
 * context provided by AccessibilityProvider (see
 * providers/AccessibilityProvider.tsx), so every consumer reads and writes
 * the same state, mirroring hooks/useTheme.ts.
 */
export function useAccessibility() {
  return useAccessibilityContext();
}
