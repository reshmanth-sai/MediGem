import React from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { Label } from "@/components/ui/Typography";
import { MetricStat } from "@/components/ui/MetricStat";
import { ConfidenceBadge, type ConfidenceLevel } from "@/components/ui/ConfidenceBadge";

export interface ConfidenceDashboardProps {
  confidenceLevel?: ConfidenceLevel;
  requiresHumanReview?: boolean;
  processingTimeMs?: number;
  safetyChecksPassed?: boolean;
}

/**
 * Model execution summary.
 *
 * The two headline percentages this panel used to lead with, a "Clinical
 * Confidence" figure and an "Evidence Coverage" figure, were frontend
 * inventions carrying one decimal place of false precision. The backend
 * emits confidence as a qualitative LOW / MEDIUM / HIGH enum and emits no
 * coverage figure at all, so both are gone: certainty is now shown as a band
 * through ConfidenceBadge. What remains are measured runtime facts (elapsed
 * time, whether the deterministic safety checks passed), not model self-report.
 */
export function ConfidenceDashboard({
  confidenceLevel = "HIGH",
  requiresHumanReview = true,
  processingTimeMs = 5420,
  safetyChecksPassed = true,
}: ConfidenceDashboardProps) {
  return (
    <Section
      heading="Model execution summary"
      headingAdornment={<Label>Gemma 3 4B, local inference</Label>}
    >
      <div className="space-y-1">
        <Label>Assessment confidence</Label>
        <ConfidenceBadge level={confidenceLevel} needsReview={requiresHumanReview} />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 divide-y divide-rule sm:grid-cols-2 sm:divide-y-0">
        <MetricStat
          icon={Zap}
          label="Processing time"
          value={`${(processingTimeMs / 1000).toFixed(2)}s`}
          subtitle="End to end, on device"
        />
        <MetricStat
          icon={ShieldCheck}
          label="Safety checks"
          value={safetyChecksPassed ? "Passed" : "Flagged"}
          subtitle="Deterministic rule evaluation"
        />
      </div>
    </Section>
  );
}
