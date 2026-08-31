import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";

interface ClinicalRationaleProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 5 of the results panel: why this assessment was produced (spec 8.1).
 *
 * Reads `caseData.clinicalRationale`. This replaces the previous explainability
 * dashboard, which attributed fixed percentage weights ("+35% Weight",
 * "+42% Weight") to individual inputs. Those weights were literals in the
 * component, not model output, and implied a feature-attribution the pipeline
 * does not produce. Certainty is stated as a qualitative band instead.
 */
export function ClinicalRationale({ caseData }: ClinicalRationaleProps) {
  const rationale = caseData.clinicalRationale ?? [];

  return (
    <Section
      heading="Clinical rationale"
      headingAs="h2"
      headingAdornment={
        <ConfidenceBadge
          level={caseData.confidenceLevel}
          needsReview={caseData.requiresHumanReview}
        />
      }
    >
      {rationale.length === 0 ? (
        <BodySm className="text-ink-muted">
          No reasoning trace was recorded for this assessment.
        </BodySm>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {rationale.map((reason) => (
            <li key={reason} className="py-3">
              <BodySm>{reason}</BodySm>
            </li>
          ))}
        </ul>
      )}

      <BodySm className="text-ink-muted">
        MediGem provides decision support only. Every observation above is
        flagged for physician evaluation and requires confirmation by a licensed
        clinician.
      </BodySm>
    </Section>
  );
}
