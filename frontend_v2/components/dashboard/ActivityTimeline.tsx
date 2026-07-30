"use client";

import React, { useState } from "react";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function ActivityTimeline() {
  const [isOpen, setIsOpen] = useState(false);

  const activities = [
    { title: "Analysis Executed (CASE-8901)", time: "12:00 PM", desc: "ECG Rhythm strip analyzed with Sinus Tachycardia findings." },
    { title: "Emergency Interception (CASE-8902)", time: "11:30 AM", desc: "Severe crushing chest pain trigger (< 0.3ms). Emergency referral note generated." },
    { title: "Demo Preset Loaded", time: "10:15 AM", desc: "Synthetic Lab Report PDF loaded and processed." },
  ];

  return (
    <Card className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent System Activity Feed
          </h3>
        </div>
        <button className="text-xs text-slate-400 font-semibold flex items-center gap-1 hover:text-slate-200">
          <span>{isOpen ? "Collapse" : "Expand"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs animate-in fade-in duration-200">
          {activities.map((act) => (
            <div key={act.title} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-0.5">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{act.title}</span>
                <span className="text-[10px] font-mono text-slate-400">{act.time}</span>
              </div>
              <p className="text-slate-500">{act.desc}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
