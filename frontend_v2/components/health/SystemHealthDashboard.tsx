import React from "react";
import { Activity, CheckCircle2, Cpu, HardDrive, ShieldCheck, Clock } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { Label, BodySm } from "@/components/ui/Typography";

export function SystemHealthDashboard() {
  const telemetry = [
    { label: "Pipeline Status", value: "Healthy", icon: CheckCircle2 },
    { label: "Gemma Model Engine", value: "gemma3:4b online", icon: Cpu },
    { label: "Emergency Safety Gate", value: "0.28ms latency", icon: ShieldCheck },
    { label: "Local SQLite Cache", value: "4.2 MB / 50 MB", icon: HardDrive },
    { label: "System Version", value: "v2.0.0-production", icon: Activity },
    { label: "Last Analysis", value: "Just now (CASE-8901)", icon: Clock },
  ];

  return (
    <Section
      heading="System Telemetry & Engine Health"
      headingAs="h3"
      headingAdornment={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-label bg-risk-low/12 text-risk-low border border-risk-low/30">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          All systems operational
        </span>
      }
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
        {telemetry.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col gap-1 pt-4 sm:pt-0 first:pt-0">
              <dt className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
                <Label>{item.label}</Label>
              </dt>
              <dd>
                <BodySm className="font-semibold text-ink truncate">{item.value}</BodySm>
              </dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
