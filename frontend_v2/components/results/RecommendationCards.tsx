import React from "react";
import { ReferralMemo } from "@/components/medical/ReferralMemo";
import { Card } from "@/components/ui/Card";

export function RecommendationCards() {
  const recommendations = [
    { priority: "HIGH", title: "Routine Cardiology Consultation", desc: "Schedule 12-lead ECG review with regional cardiology specialist within 48 hours." },
    { priority: "MEDIUM", title: "Monitor Baseline Vitals", desc: "Record blood pressure and heart rate every 4 hours during clinic observation." },
    { priority: "ROUTINE", title: "Patient Lifestyle Advice", desc: "Counsel on sodium reduction and compliance with anti-hypertensive regimen." },
  ];

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Prioritized Clinical Action Recommendations
        </h3>
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div key={rec.title} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{rec.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  {rec.priority}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{rec.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <ReferralMemo
        patientId="P-101"
        priority="ROUTINE"
        reason="Cardiology evaluation requested for sinus tachycardia"
        summary="Patient presented with chest tightness. HR 95 bpm, BP 138/88 mmHg."
      />
    </div>
  );
}
