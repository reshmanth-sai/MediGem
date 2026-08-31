import React from "react";
import { CheckCircle2, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Body, BodySm, H2, Label } from "@/components/ui/Typography";
import { RiskLevel } from "@/types/analysis";

export interface ClinicalSummaryCardProps {
  riskLevel?: RiskLevel;
  urgencyScore?: number;
  primaryFinding?: string;
  clinicalSummary?: string;
  recommendedAction?: string;
  onApprove?: () => void;
  onEdit?: () => void;
}

/**
 * Condensed assessment card used by the presentation flow.
 *
 * Risk is rendered through RiskIndicator, which carries shape, label and colour
 * together; the emoji-and-hue RiskBadge that used to sit here is gone, as is
 * the oversized standalone urgency figure, now folded into the indicator.
 */
export function ClinicalSummaryCard({
  riskLevel = "MODERATE" as RiskLevel,
  urgencyScore = 6.5,
  primaryFinding = "Sinus tachycardia with mildly elevated blood pressure",
  clinicalSummary = "Chest tightness reported alongside a heart rate of 98 bpm and blood pressure of 132/88 mmHg. These parameters are flagged for physician evaluation rather than urgent escalation.",
  recommendedAction = "Arrange a 12-lead ECG review with a cardiology specialist within 48 hours and recheck vitals every 4 hours.",
  onApprove = () => {},
  onEdit = () => {},
}: ClinicalSummaryCardProps) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-col justify-between gap-4 border-b border-rule pb-4 md:flex-row md:items-start">
        <div className="space-y-2">
          <Label>Primary finding</Label>
          <H2>{primaryFinding}</H2>
        </div>
        <div className="shrink-0">
          <RiskIndicator level={riskLevel} variant="tint" showScore={urgencyScore} />
        </div>
      </div>

      <Body className="text-ink-muted">{clinicalSummary}</Body>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
        <div className="space-y-1 md:col-span-8">
          <Label>Recommended next step</Label>
          <BodySm className="font-semibold">{recommendedAction}</BodySm>
        </div>

        <div className="flex flex-col gap-2 md:col-span-4">
          <Button
            variant="primary"
            size="md"
            leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            onClick={onApprove}
          >
            Approve and generate referral
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit3 className="h-4 w-4" aria-hidden="true" />}
            onClick={onEdit}
          >
            Modify finding
          </Button>
        </div>
      </div>
    </Card>
  );
}
