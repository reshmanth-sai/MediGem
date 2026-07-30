import React from "react";
import { Lightbulb, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EducationalTips() {
  const tips = [
    { title: "Capture Clear Images", desc: "Ensure good lighting and avoid camera motion blur to maximize OCR text extraction confidence." },
    { title: "Enter Full Symptoms", desc: "Include all present symptoms (e.g. chest tightness, fever, duration) to activate emergency rule evaluation." },
    { title: "Check Emergency Banners", desc: "If acute symptoms are detected, the Emergency Engine intercepts immediately with a red alert banner." },
    { title: "Review Provenance", desc: "Inspect 'Why was this recommendation generated?' to review empirical quality scores and PDF text layers." },
  ];

  return (
    <Card className="space-y-3 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900">
      <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-300 font-bold text-sm">
        <Lightbulb className="h-4 w-4 text-teal-600" />
        <span>Clinical Co-Pilot Tips & Best Practices</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tips.map((t) => (
          <div key={t.title} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-teal-100 dark:border-teal-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-900 dark:text-white">
              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>{t.title}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-5">{t.desc}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
