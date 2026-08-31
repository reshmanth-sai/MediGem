import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Section } from "@/components/ui/Card";
import { BodySm, Data } from "@/components/ui/Typography";

interface RecommendedInvestigationsProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 4 of the results panel: what to obtain next (spec 8.1).
 *
 * Reads `caseData.recommendedInvestigations`. This replaces the previous
 * "Workflow Clinical Action Center", whose three actions, priorities, owning
 * roles and expected outcomes were all hardcoded in the component and bore no
 * relation to the case being viewed.
 */
export function RecommendedInvestigations({ caseData }: RecommendedInvestigationsProps) {
  const investigations = caseData.recommendedInvestigations ?? [];

  return (
    <Section heading="Recommended investigations" headingAs="h2">
      {investigations.length === 0 ? (
        <BodySm className="text-ink-muted">
          No further investigations were recommended for this case.
        </BodySm>
      ) : (
        <ol className="divide-y divide-rule border-t border-rule">
          {investigations.map((investigation, index) => (
            <li key={investigation} className="flex items-baseline gap-3 py-3">
              <Data className="text-ink-muted" aria-hidden="true">
                {index + 1}
              </Data>
              <BodySm>{investigation}</BodySm>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
