import React from "react";
import { RiskBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RiskLevel } from "@/types/analysis";

export function ClinicalSummaryCard({
  riskLevel = "MODERATE" as RiskLevel,
  urgencyScore = 6.5,
  primaryFinding = "Sinus Tachycardia with mild elevated Blood Pressure",
  clinicalSummary = "Patient presents with chest tightness, heart rate of 95 bpm, and BP of 138/88 mmHg. Multimodal analysis indicates moderate risk requiring non-urgent cardiology referral.",
  recommendedAction = "Recommend routine cardiology evaluation & ECG monitoring within 48 hours.",
}: {
  riskLevel?: RiskLevel;
  urgencyScore?: number;
  primaryFinding?: string;
  clinicalSummary?: string;
  recommendedAction?: string;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Assessed Primary Clinical Finding
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {primaryFinding}
          </h3>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {urgencyScore.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">/ 10 URGENCY</span>
          </div>
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <p className="font-semibold text-slate-900 dark:text-white">Clinical Assessment Summary:</p>
        <p className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          {clinicalSummary}
        </p>
      </div>

      <div className="p-3 bg-teal-50/60 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 space-y-1">
        <span className="font-bold uppercase tracking-wider text-[10px] text-teal-700 dark:text-teal-400 block">
          Recommended Action Step:
        </span>
        <p className="font-medium">{recommendedAction}</p>
      </div>
    </Card>
  );
}
