"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Body, BodySm, H2, Label } from "@/components/ui/Typography";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

interface PrimaryFindingProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 1 of the results panel: the single most important conclusion, set in
 * an h2 with the risk indicator adjacent (spec 8.1).
 *
 * This component previously rendered an invented probability model: a
 * hardcoded differentials array of percentages, confidence intervals and
 * evidence counts written into the file itself and read from no real field.
 * All of it is gone. Alternative possibilities now live in the
 * DifferentialConsiderations section, sourced from
 * `caseData.differentialConsiderations`, and model certainty is rendered as a
 * qualitative band by ConfidenceBadge rather than a ring gauge implying a
 * calibrated number.
 */
export function PrimaryFinding({ caseData }: PrimaryFindingProps) {
  return (
    <section
      className="space-y-4 rounded-card border border-rule bg-surface p-5"
      aria-labelledby="primary-finding-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Label>Primary finding</Label>
          <H2 id="primary-finding-heading">{caseData.primaryFinding}</H2>
        </div>
        <div className="shrink-0">
          <RiskIndicator
            level={caseData.riskLevel}
            variant="tint"
            showScore={caseData.urgencyScore}
          />
        </div>
      </div>

      <ConfidenceBadge
        level={caseData.confidenceLevel}
        needsReview={caseData.requiresHumanReview}
      />

      <Body className="text-ink-muted">{caseData.clinicalSummary}</Body>

      <div className="space-y-1 border-t border-rule pt-4">
        <Label className="flex items-center gap-1.5">
          <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Recommended next step
        </Label>
        <BodySm className="font-semibold">{caseData.recommendedAction}</BodySm>
      </div>
    </section>
  );
}
