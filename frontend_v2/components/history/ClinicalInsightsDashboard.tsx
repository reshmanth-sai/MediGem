"use client";

import React from "react";
import { Folder, ShieldAlert, Activity, Clock, BarChart2 } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { Label } from "@/components/ui/Typography";
import { MetricStat } from "@/components/ui/MetricStat";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function ClinicalInsightsDashboard({
  totalCases = 128,
  emergencyCases = 14,
  avgConfidence = 96.4,
  avgProcessingTimeMs = 4820,
  mostCommonType = "12-Lead ECG (42%)",
}: {
  totalCases?: number;
  emergencyCases?: number;
  avgConfidence?: number;
  avgProcessingTimeMs?: number;
  mostCommonType?: string;
}) {
  const emergencyPercent = ((emergencyCases / totalCases) * 100).toFixed(1);

  const riskChartData = [
    { risk: "Low", count: 31, fill: "var(--risk-low)" },
    { risk: "Moderate", count: 51, fill: "var(--risk-moderate)" },
    { risk: "High", count: 32, fill: "var(--risk-high)" },
    { risk: "Emergency", count: 14, fill: "var(--risk-emergency)" },
  ];

  const metrics = [
    {
      icon: Folder,
      label: "Total Cases",
      value: totalCases.toString(),
      subtitle: "Processed Patients",
    },
    {
      icon: ShieldAlert,
      label: "Emergency Cases",
      value: `${emergencyCases} (${emergencyPercent}%)`,
      subtitle: "Immediate Referrals",
      iconClassName: "text-risk-emergency",
    },
    {
      icon: Activity,
      label: "Assessment Quality",
      value: "High (0.96)",
      subtitle: "Clinical Provenance Score",
    },
    {
      icon: Clock,
      label: "Avg Processing Time",
      value: `${(avgProcessingTimeMs / 1000).toFixed(2)}s`,
      subtitle: "End-to-End Latency",
    },
    {
      icon: BarChart2,
      label: "Top Analysis Type",
      value: mostCommonType,
      subtitle: "Most Common Input",
    },
  ];

  return (
    <div className="space-y-6">
      <Section
        heading="Clinical Insights & Case History Dashboard"
        headingAdornment={<Label className="text-ink-muted">128 total analyses recorded</Label>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          {metrics.map((metric) => (
            <MetricStat key={metric.label} {...metric} />
          ))}
        </div>
      </Section>

      {/* Recharts Risk Distribution Chart */}
      <div className="p-4 bg-surface rounded-card border border-rule space-y-2">
        <Label>Risk Distribution Across All Processed Cases</Label>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="var(--rule)" />
              <XAxis dataKey="risk" tick={{ fontSize: 13, fill: "var(--ink-muted)" }} />
              <YAxis tick={{ fontSize: 13, fill: "var(--ink-muted)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-raised)",
                  color: "var(--ink)",
                  borderRadius: 8,
                  border: "1px solid var(--rule)",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
