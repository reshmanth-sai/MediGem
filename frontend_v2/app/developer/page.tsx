"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { PipelineInspector } from "@/components/developer/PipelineInspector";
import { PromptExplorer } from "@/components/developer/PromptExplorer";
import { LogsViewer } from "@/components/developer/LogsViewer";
import { SystemHealthDashboard } from "@/components/health/SystemHealthDashboard";

export default function DeveloperPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Developer Workspace & Pipeline Inspector" subtitle="8-Stage AI pipeline inspection, system logs & live telemetry">
        <div className="space-y-6 max-w-7xl mx-auto pb-8">
          <SystemHealthDashboard />
          <PipelineInspector />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PromptExplorer />
            <LogsViewer />
          </div>
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
