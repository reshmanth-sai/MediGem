import React from "react";
import { Activity, ChevronDown } from "lucide-react";
import { Label, BodySm } from "@/components/ui/Typography";

export function ActivityTimeline() {
  const activities = [
    {
      title: "Analysis Executed (CASE-8901)",
      time: "12:00 PM",
      desc: "ECG rhythm strip analyzed with sinus tachycardia findings.",
    },
    {
      title: "Emergency Interception (CASE-8902)",
      time: "11:30 AM",
      desc: "Severe crushing chest pain trigger (under 0.3ms). Emergency referral note generated.",
    },
    {
      title: "Demo Preset Loaded",
      time: "10:15 AM",
      desc: "Synthetic lab report PDF loaded and processed.",
    },
  ];

  return (
    <details className="rounded-card border border-rule bg-surface px-4 py-3 group">
      <summary className="flex items-center justify-between gap-3 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-body-sm font-semibold text-ink">
          <Activity className="h-4 w-4 text-action" aria-hidden="true" />
          Recent System Activity Feed
        </span>
        <span className="flex items-center gap-1 text-label text-ink-muted">
          Details
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>

      <div className="space-y-2 pt-3 mt-3 border-t border-rule">
        {activities.map((act) => (
          <div key={act.title} className="p-2.5 rounded-control bg-surface-raised border border-rule space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-body-sm font-semibold text-ink">{act.title}</span>
              <Label className="normal-case font-mono">{act.time}</Label>
            </div>
            <BodySm className="text-ink-muted">{act.desc}</BodySm>
          </div>
        ))}
      </div>
    </details>
  );
}
