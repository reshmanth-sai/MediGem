import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";

interface DifferentialConsiderationsProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 3 of the results panel (spec 8.1 and 8.2).
 *
 * Deliberately titled "Differential considerations", never "Differential
 * diagnosis": the backend safety layer regex-blocks diagnostic phrasing, so a
 * panel named after the category that layer exists to prevent would contradict
 * the product's own bounds. The required subtitle states in one line that these
 * are possibilities for physician review rather than a diagnosis.
 *
 * Items come from `caseData.differentialConsiderations`. Nothing here carries a
 * probability, a confidence interval or an evidence count; the ranked
 * percentage model this route used to render was invented by the component
 * itself and has been removed.
 */
export function DifferentialConsiderations({ caseData }: DifferentialConsiderationsProps) {
  const considerations = caseData.differentialConsiderations ?? [];

  return (
    <Section heading="Differential considerations" headingAs="h2">
      <BodySm className="text-ink-muted">
        Possibilities raised for physician review. Not a diagnosis.
      </BodySm>

      {considerations.length === 0 ? (
        <BodySm className="text-ink-muted">
          No alternative possibilities were raised for this case.
        </BodySm>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {considerations.map((consideration) => (
            <li key={consideration} className="py-3">
              <BodySm>{consideration}</BodySm>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
