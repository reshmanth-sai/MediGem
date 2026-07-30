import React from "react";
import { Folder, ShieldAlert, Brain, Zap, BarChart2 } from "lucide-react";
import { StatCard } from "@/components/ui/Card";

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>📊 Clinical Insights & Case History Dashboard</span>
        </h2>
        <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-semibold">
          128 TOTAL ANALYSES RECORDED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="📁 Total Cases"
          value={totalCases.toString()}
          subtitle="Processed Patients"
          icon={<Folder />}
        />
        <StatCard
          title="🚨 Emergency Cases"
          value={`${emergencyCases} (${emergencyPercent}%)`}
          subtitle="Immediate Referrals"
          icon={<ShieldAlert className="text-red-500" />}
          className="border-l-4 border-l-red-600"
        />
        <StatCard
          title="🧠 Avg AI Confidence"
          value={`${avgConfidence.toFixed(1)}%`}
          subtitle="Overall Reasoning Score"
          icon={<Brain />}
        />
        <StatCard
          title="⚡ Avg Processing Time"
          value={`${(avgProcessingTimeMs / 1000).toFixed(2)}s`}
          subtitle="End-to-End Latency"
          icon={<Zap />}
        />
        <StatCard
          title="📊 Top Analysis Type"
          value={mostCommonType}
          subtitle="Most Common Input"
          icon={<BarChart2 />}
        />
      </div>
    </div>
  );
}
