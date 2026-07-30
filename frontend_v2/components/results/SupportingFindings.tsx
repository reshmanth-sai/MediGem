import React from "react";
import { CheckCircle2, FileText, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface FindingItem {
  id: string;
  finding: string;
  evidence: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  source: string;
}

export function SupportingFindings({ findings }: { findings?: FindingItem[] }) {
  const list = findings || [
    {
      id: "F1",
      finding: "Elevated Heart Rate Observation",
      evidence: "HR recorded at 95 bpm during intake assessment.",
      confidence: "HIGH",
      source: "Vital Signs Entry",
    },
    {
      id: "F2",
      finding: "Mild Systolic Blood Pressure Elevation",
      evidence: "BP recorded at 138/88 mmHg.",
      confidence: "HIGH",
      source: "Vital Signs Entry",
    },
    {
      id: "F3",
      finding: "ECG Sinus Tachycardia Pattern",
      evidence: "Regular sinus rhythm with HR > 90 bpm on 12-lead strip.",
      confidence: "MEDIUM",
      source: "ECG Rhythm Strip",
    },
  ];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-600" />
          <span>Supporting Clinical Findings & Evidence ({list.length})</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Verified by Context Fusion</span>
      </div>

      <div className="space-y-2">
        {list.map((f) => (
          <div
            key={f.id}
            className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
          >
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                <span>{f.finding}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold">
                {f.confidence} CONFIDENCE
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 pl-6">{f.evidence}</p>
            <p className="text-[11px] text-slate-400 pl-6 flex items-center gap-1">
              <FileText className="h-3 w-3 inline" /> Source: {f.source}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
