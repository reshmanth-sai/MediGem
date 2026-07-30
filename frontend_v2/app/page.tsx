import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeroHeader } from "@/components/dashboard/HeroHeader";
import { WhyMediGem } from "@/components/dashboard/WhyMediGem";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentCasesPanel } from "@/components/dashboard/RecentCasesPanel";
import { SystemOverview } from "@/components/dashboard/SystemOverview";
import { AnalysisTypesGrid } from "@/components/dashboard/AnalysisTypesGrid";
import { PipelineWorkflow } from "@/components/dashboard/PipelineWorkflow";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { EducationalTips } from "@/components/dashboard/EducationalTips";
import { Footer } from "@/components/dashboard/Footer";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-6">
        {/* Section 1: Hero Header Banner */}
        <HeroHeader />

        {/* MANDATORY BONUS: Why MediGem Feature Cards */}
        <WhyMediGem />

        {/* Section 2: Quick Action Cards */}
        <QuickActions />

        {/* Section 3: Recent Patient Cases Panel */}
        <RecentCasesPanel />

        {/* Section 4: System Overview Metrics */}
        <SystemOverview />

        {/* Section 5: Supported Analysis Types Grid */}
        <AnalysisTypesGrid />

        {/* Section 6: AI Pipeline Workflow Visualization */}
        <PipelineWorkflow />

        {/* Section 7 & 8: Recent Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityTimeline />
          <EducationalTips />
        </div>

        {/* Section 9: Clinical SaaS Footer */}
        <Footer />
      </div>
    </AppShell>
  );
}
