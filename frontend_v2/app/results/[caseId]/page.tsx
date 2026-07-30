import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ResultsTemplate } from "@/components/templates/Templates";
import { RiskIndicator } from "@/components/medical/RiskIndicator";
import { ReasoningTransparency } from "@/components/ai/ReasoningTransparency";
import { ReferralMemo } from "@/components/medical/ReferralMemo";

export default async function CaseResultsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  return (
    <AppShell>
      <ResultsTemplate title={`Analysis Results: ${caseId}`}>
        <RiskIndicator level="MODERATE" urgencyScore={6.5} rationale="Elevated blood pressure and rhythm observation." />
        <ReasoningTransparency modality="ECG" />
        <ReferralMemo
          patientId="P-101"
          priority="ROUTINE"
          reason="Cardiology evaluation requested for sinus tachycardia"
          summary="Patient presented with chest tightness. HR 95 bpm, BP 138/88 mmHg."
        />
      </ResultsTemplate>
    </AppShell>
  );
}
