"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { MeasuredPerformance } from "@/components/evaluation/MeasuredPerformance";

export default function EvaluationPage() {
  return (
    <AppShell>
      <DashboardTemplate title="Measured performance" subtitle="Latency, schema validity, and OCR confidence, read from a recorded capture run. Not a target, not a benchmark suite.">
        <div className="max-w-7xl mx-auto pb-8">
          <MeasuredPerformance />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
