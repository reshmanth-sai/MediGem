import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Section } from "@/components/ui/Card";
import { BodySm, Label } from "@/components/ui/Typography";
import { RiskIndicator } from "@/components/ui/RiskIndicator";

interface DispositionProps {
  caseData: ClinicalCaseData;
}

/**
 * Section 6 of the results panel: referral necessity, urgency and the human
 * review requirement (spec 8.1).
 *
 * Reads `caseData.disposition` and `caseData.requiresHumanReview`. Clinician
 * review is the schema default rather than an exception, so it is stated as a
 * standing requirement here, not as a warning that appears only sometimes.
 */
export function Disposition({ caseData }: DispositionProps) {
  const { disposition, requiresHumanReview } = caseData;

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: "Referral",
      value: disposition?.needsReferral
        ? "Referral required"
        : "No referral required at this time",
    },
    {
      label: "Urgency",
      value: disposition?.urgency ?? "Not specified",
    },
    {
      label: "Next step",
      value: disposition?.nextStep ?? "Not specified",
    },
    {
      label: "Human review",
      value: requiresHumanReview
        ? "A clinician must review this assessment before any action is taken."
        : "Clinician review recorded for this assessment.",
    },
  ];

  return (
    <Section
      heading="Disposition"
      headingAs="h2"
      headingAdornment={<RiskIndicator level={caseData.riskLevel} variant="tint" />}
    >
      <dl className="divide-y divide-rule border-t border-rule">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <dt className="sm:w-40 sm:shrink-0">
              <Label>{row.label}</Label>
            </dt>
            <dd>
              <BodySm>{row.value}</BodySm>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
