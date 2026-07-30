"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardTemplate } from "@/components/templates/Templates";
import { EvaluationMetricsCharts } from "@/components/evaluation/EvaluationMetricsCharts";

export default function EvaluationPage() {
  return (
    <AppShell>
      <DashboardTemplate title="System Evaluation & Quality Benchmarks" subtitle="Empirical benchmark performance across reasoning accuracy, latency & safety compliance">
        <div className="max-w-7xl mx-auto pb-8">
          <EvaluationMetricsCharts />
        </div>
      </DashboardTemplate>
    </AppShell>
  );
}
