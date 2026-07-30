import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ResultsTemplate } from "@/components/templates/Templates";
import { ConfidenceDashboard } from "@/components/results/ConfidenceDashboard";
import { AiVsHumanAttention } from "@/components/results/AiVsHumanAttention";
import { ClinicalSummaryCard } from "@/components/results/ClinicalSummaryCard";
import { PatientSnapshot } from "@/components/results/PatientSnapshot";
import { SupportingFindings } from "@/components/results/SupportingFindings";
import { MedicalUploadReviewer } from "@/components/results/MedicalUploadReviewer";
import { AiExplainability } from "@/components/results/AiExplainability";
import { RecommendationCards } from "@/components/results/RecommendationCards";
import { MedicalTimeline } from "@/components/results/MedicalTimeline";
import { TechnicalInspector } from "@/components/results/TechnicalInspector";
import { ExportWorkspace } from "@/components/results/ExportWorkspace";

export default async function CaseResultsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  return (
    <AppShell>
      <ResultsTemplate title={`AI Clinical Analysis Results: ${caseId}`}>
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
          {/* MANDATORY BONUS: AI Confidence Dashboard */}
          <ConfidenceDashboard />

          {/* USER RECOMMENDATION: AI vs. Human Attention Panel */}
          <AiVsHumanAttention />

          {/* Primary Clinical Summary Card */}
          <ClinicalSummaryCard />

          {/* Patient Snapshot & Vitals Overview */}
          <PatientSnapshot />

          {/* Supporting Findings & Multimodal Upload Reviewer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SupportingFindings />
            <MedicalUploadReviewer />
          </div>

          {/* AI Explainability & Recommendation Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AiExplainability />
            <RecommendationCards />
          </div>

          {/* Chronological Medical Timeline */}
          <MedicalTimeline />

          {/* Export Workspace & Technical Inspector */}
          <ExportWorkspace caseId={caseId} />
          <TechnicalInspector />
        </div>
      </ResultsTemplate>
    </AppShell>
  );
}
