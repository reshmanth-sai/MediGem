import React from "react";
import { cn } from "@/lib/utils";

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  needsReview?: boolean;
  className?: string;
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  HIGH: "High confidence",
  MEDIUM: "Moderate confidence",
  LOW: "Low confidence",
};

/**
 * ConfidenceBadge displays AI model confidence in qualitative bands (High/Moderate/Low),
 * never numeric percentages. Prevents false precision about model certainty.
 *
 * Uses neutral tokens (surface-raised, ink-muted, rule) exclusively.
 * Confidence level is not clinical severity, so it never uses risk color tokens.
 */
export function ConfidenceBadge({
  level,
  needsReview = false,
  className,
}: ConfidenceBadgeProps) {
  const label = CONFIDENCE_LABELS[level];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-body-sm font-semibold",
        "bg-surface-raised text-ink-muted border border-rule",
        "whitespace-nowrap min-w-0"
      )}>
        {label}
      </span>
      {needsReview && (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-body-sm font-semibold",
          "bg-surface-raised text-ink-muted border border-rule",
          "whitespace-nowrap min-w-0"
        )}>
          Needs clinician review
        </span>
      )}
    </div>
  );
}
