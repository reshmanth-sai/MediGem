import React from "react";
import { Stethoscope, FileText, Zap, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/ui/Card";

export function ConfidenceDashboard({
  clinicalConfidence = 95.2,
  evidenceCoverage = 98.5,
  processingTimeMs = 5420,
  safetyPassRate = 100,
}: {
  clinicalConfidence?: number;
  evidenceCoverage?: number;
  processingTimeMs?: number;
  safetyPassRate?: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>📊 AI Clinical Confidence & Validation Dashboard</span>
        </h2>
        <span className="text-xs text-teal-600 dark:text-teal-400 font-mono font-semibold">
          GEMMA 3 4B INFERS LOCAL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="🩺 Clinical Confidence"
          value={`${clinicalConfidence.toFixed(1)}%`}
          subtitle="High Alignment Score"
          icon={<Stethoscope />}
          className="border-l-4 border-l-teal-600 bg-gradient-to-br from-teal-50/50 to-white dark:from-slate-800 dark:to-slate-900"
        />
        <StatCard
          title="📄 Evidence Coverage"
          value={`${evidenceCoverage.toFixed(1)}%`}
          subtitle="Multimodal File Contribution"
          icon={<FileText />}
          className="border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50/50 to-white dark:from-slate-800 dark:to-slate-900"
        />
        <StatCard
          title="⚡ Processing Time"
          value={`${(processingTimeMs / 1000).toFixed(2)}s`}
          subtitle="End-to-End Local Latency"
          icon={<Zap />}
          className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-800 dark:to-slate-900"
        />
        <StatCard
          title="🛡️ Safety Validation"
          value={`${safetyPassRate}% PASSED`}
          subtitle="Emergency Engine & Guard"
          icon={<ShieldCheck />}
          className="border-l-4 border-l-purple-600 bg-gradient-to-br from-purple-50/50 to-white dark:from-slate-800 dark:to-slate-900"
        />
      </div>
    </div>
  );
}
