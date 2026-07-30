"use client";

import React, { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EducationalTips() {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    { title: "Capture Clear Images", text: "Ensure decent lighting and focus so OpenCV image quality evaluation passes blur checks." },
    { title: "Enter Full Symptoms", text: "Include chest tightness, fever, or onset duration to trigger safety checks immediately." },
    { title: "Check Emergency Engine", text: "Acute presentations trigger immediate referral guidelines without waiting for LLM inference." },
  ];

  return (
    <Card className="space-y-3">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Clinical Co-Pilot Tips & Best Practices
          </h3>
        </div>
        <button className="text-xs text-slate-400 font-semibold flex items-center gap-1 hover:text-slate-200">
          <span>{isOpen ? "Collapse" : "Expand"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs animate-in fade-in duration-200">
          {tips.map((t) => (
            <div key={t.title} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{t.title}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
