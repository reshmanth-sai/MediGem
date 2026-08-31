import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Section } from "@/components/ui/Card";
import { BodySm, Label } from "@/components/ui/Typography";

interface SupportingFindingsProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 2 of the results panel: the evidence list, each item carrying its
 * own provenance (spec 8.1).
 *
 * Every row is read from `caseData.supportingFindings`, which pairs a `source`
 * with an `observation`. The component keeps no fallback fixture of its own, so
 * it can never present invented findings as if they came from the case.
 */
export function SupportingFindings({ caseData }: SupportingFindingsProps) {
  const findings = caseData.supportingFindings ?? [];

  return (
    <Section heading="Supporting findings" headingAs="h2">
      {findings.length === 0 ? (
        <BodySm className="text-ink-muted">
          No supporting observations were recorded for this case.
        </BodySm>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {findings.map((finding, index) => (
            <li key={`${finding.source}-${index}`} className="space-y-1 py-3">
              <Label>{finding.source}</Label>
              <BodySm>{finding.observation}</BodySm>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
