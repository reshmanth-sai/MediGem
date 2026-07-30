"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeroHeader } from "@/components/dashboard/HeroHeader";
import { WhyMediGem } from "@/components/dashboard/WhyMediGem";
import { JudgeDashboard } from "@/components/judge/JudgeDashboard";
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
      <div className="space-y-10 max-w-7xl mx-auto pb-12">
        {/* Section 1: Hero Header Banner */}
        <HeroHeader />

        {/* Section 2: Why MediGem Feature Cards */}
        <WhyMediGem />

        {/* Section 3: Hackathon Judge Executive Summary */}
        <JudgeDashboard />

        {/* Section 4: Quick Action Cards */}
        <QuickActions />

        {/* Section 5: Recent Patient Cases Panel */}
        <RecentCasesPanel />

        {/* Section 6: System Overview Metrics */}
        <SystemOverview />

        {/* Section 7: Supported Analysis Modalities */}
        <AnalysisTypesGrid />

        {/* Section 8: Interactive Multimodal AI Pipeline */}
        <PipelineWorkflow />

        {/* Section 9: Collapsible System Activity & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityTimeline />
          <EducationalTips />
        </div>

        {/* Section 10: Clinical SaaS Footer */}
        <Footer />
      </div>
    </AppShell>
  );
}
