import React from "react";
import { Clock, FileCheck, ShieldAlert, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ActivityTimeline() {
  const events = [
    {
      time: "12:00 PM",
      title: "Analysis Executed (CASE-8901)",
      desc: "ECG Rhythm assessment completed for Patient P-101 (Risk: MODERATE).",
      icon: <FileCheck className="h-4 w-4 text-teal-600" />,
    },
    {
      time: "11:30 AM",
      title: "Emergency Interception (CASE-8902)",
      desc: "Severe crushing chest pain rule triggered (< 0.3ms). Emergency referral memo generated.",
      icon: <ShieldAlert className="h-4 w-4 text-red-600" />,
    },
    {
      time: "10:15 AM",
      title: "Demo Preset Loaded",
      desc: "Synthetic Lab Report PDF loaded and processed.",
      icon: <Clock className="h-4 w-4 text-amber-600" />,
    },
    {
      time: "09:00 AM",
      title: "Benchmark Evaluation Completed",
      desc: "100% safety pass rate verified across 5 test runs.",
      icon: <Award className="h-4 w-4 text-purple-600" />,
    },
  ];

  return (
    <Card className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent System Activity Feed</h2>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 font-mono before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {events.map((ev) => (
          <div key={ev.title} className="relative group">
            <div className="absolute -left-[25px] top-1 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              {ev.icon}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                  {ev.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">• {ev.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-0.5 leading-relaxed">
                {ev.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
