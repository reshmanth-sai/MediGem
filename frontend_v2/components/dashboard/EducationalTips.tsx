import React from "react";
import { Lightbulb, ChevronDown } from "lucide-react";
import { BodySm } from "@/components/ui/Typography";

export function EducationalTips() {
  const tips = [
    {
      title: "Capture Clear Images",
      text: "Ensure decent lighting and focus so OpenCV image quality evaluation passes blur checks.",
    },
    {
      title: "Enter Full Symptoms",
      text: "Include chest tightness, fever, or onset duration to trigger safety checks immediately.",
    },
    {
      title: "Check Emergency Engine",
      text: "Acute presentations trigger immediate referral guidelines without waiting for LLM inference.",
    },
  ];

  return (
    <details className="rounded-card border border-rule bg-surface px-4 py-3 group">
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-body-sm font-semibold text-ink">
          <Lightbulb className="h-4 w-4 text-action" aria-hidden="true" />
          Clinical Co-Pilot Tips &amp; Best Practices
        </span>
        <span className="flex items-center gap-1 text-label text-ink-muted">
          Details
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 mt-3 border-t border-rule">
        {tips.map((t) => (
          <div key={t.title} className="p-2.5 rounded-control bg-surface-raised border border-rule space-y-1">
            <p className="text-body-sm font-semibold text-ink">{t.title}</p>
            <BodySm className="text-ink-muted">{t.text}</BodySm>
          </div>
        ))}
      </div>
    </details>
  );
}
