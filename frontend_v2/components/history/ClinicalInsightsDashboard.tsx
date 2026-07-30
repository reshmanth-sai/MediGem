"use client";

import React from "react";
import { Folder, ShieldAlert, Brain, Zap, BarChart2 } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
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
    { risk: "Low", count: 31, fill: "#10B981" },
    { risk: "Moderate", count: 51, fill: "#EAB308" },
    { risk: "High", count: 32, fill: "#F97316" },
    { risk: "Emergency", count: 14, fill: "#EF4444" },
  ];

  return (
    <div className="space-y-4">
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

      {/* Recharts Risk Distribution Chart */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
          Risk Distribution Across All Processed Cases
        </h4>
        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="risk" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
