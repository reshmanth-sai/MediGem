"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { PipelineInspector } from "@/components/developer/PipelineInspector";
import { GateCoverage } from "@/components/developer/GateCoverage";
import { PromptExplorer } from "@/components/developer/PromptExplorer";
import { SystemHealthDashboard } from "@/components/health/SystemHealthDashboard";

export default function DeveloperPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Pipeline Inspector" subtitle="Stage order, measured figures, and the last run in this tab. Logs are written by the API process, not streamed here.">
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
          <SystemHealthDashboard />
          <PipelineInspector />
          <GateCoverage />
          <PromptExplorer />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
