import React from "react";
import { ListChecks, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { ReferralMemo } from "@/components/medical/ReferralMemo";
import { Card } from "@/components/ui/Card";

export function RecommendationCards() {
  const recommendations = [
    {
      priority: "HIGH",
      title: "Routine Cardiology Consultation",
      desc: "Schedule 12-lead ECG review with regional cardiology specialist within 48 hours.",
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      badgeStyle: "bg-amber-950/80 text-amber-300 border-amber-800/60",
    },
    {
      priority: "MEDIUM",
      title: "Monitor Baseline Vitals",
      desc: "Record blood pressure and heart rate every 4 hours during clinic observation.",
      icon: <Clock className="h-4 w-4 text-cyan-400" />,
      badgeStyle: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60",
    },
    {
      priority: "ROUTINE",
      title: "Patient Lifestyle Advice",
      desc: "Counsel on sodium reduction and compliance with anti-hypertensive regimen.",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      badgeStyle: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="space-y-3.5 bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <ListChecks className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Prioritized Clinical Action Recommendations
          </h3>
        </div>

        <div className="space-y-2.5">
          {recommendations.map((rec) => (
            <div
              key={rec.title}
              className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center space-x-2">
                  {rec.icon}
                  <span className="text-slate-100">{rec.title}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${rec.badgeStyle}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-slate-300 pl-6 leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <ReferralMemo
        patientId="P-101"
        priority="ROUTINE"
        reason="Cardiology evaluation requested for sinus tachycardia with mild BP elevation"
        summary="Patient presented with chest tightness. HR 98 bpm, BP 132/88 mmHg. ECG shows sinus rhythm pattern without acute ST-segment changes."
      />
    </div>
  );
}

