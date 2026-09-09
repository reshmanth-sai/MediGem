"use client";

import React from "react";
import Link from "next/link";
import { Activity, AlertCircle, Clock, Send, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface TelemetryCellProps {
  label: string;
  value: string | number;
  subtitle: string;
  indicatorText?: string;
  indicatorType?: "emergency" | "warning" | "success" | "neutral";
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function TelemetryCell({
  label,
  value,
  subtitle,
  indicatorText,
  indicatorType = "success",
  href = "/history",
  icon: Icon,
}: TelemetryCellProps) {
  return (
    <Link href={href as any} className="p-4 sm:p-5 flex flex-col justify-between hover:bg-lavender/35 transition-colors group focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus">
      <div className="flex items-center justify-between gap-2">
        <span className="text-label font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5 text-ink-muted group-hover:text-action transition-colors" />}
          {label}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2.5">
          <span className="text-data font-semibold tracking-tight text-ink tabular">
            {value}
          </span>
          {indicatorText && (
            <span
              className={cn(
                "text-label normal-case font-semibold",
                indicatorType === "emergency"
                  ? "text-risk-emergency"
                  : indicatorType === "warning"
                  ? "text-risk-high"
                  : indicatorType === "success"
                  ? "text-risk-low"
                  : "text-ink-muted"
              )}
            >
              {indicatorText}
            </span>
          )}
        </div>
        <p className="mt-1 text-[12px] text-ink-muted leading-tight truncate">{subtitle}</p>
      </div>
    </Link>
  );
}

export function ClinicalStatCards() {
  return (
    <section aria-label="Current clinical operations" className="border-y border-rule divide-y sm:divide-y-0 sm:divide-x divide-rule grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <TelemetryCell
        icon={Activity}
        label="Shift Census"
        value="14"
        subtitle="14 Consultations logged"
        indicatorText="+3 this hour"
        indicatorType="success"
        href="/history"
      />
      <TelemetryCell
        icon={AlertCircle}
        label="Acute Emergency"
        value="1"
        subtitle="Sunita Devi · ACS Protocol"
        indicatorText="IMMEDIATE STAT"
        indicatorType="emergency"
        href="/results/DEMO-ACUTE-CARDIAC"
      />
      <TelemetryCell
        icon={Clock}
        label="Diagnostic Review"
        value="3"
        subtitle="Awaiting lab/ECG fusion"
        indicatorText="3 Cases Actionable"
        indicatorType="warning"
        href="/history"
      />
      <TelemetryCell
        icon={Send}
        label="Referral Transfers"
        value="4"
        subtitle="District hospital memorandums"
        indicatorText="Transfers Ready"
        indicatorType="success"
        href="/history"
      />
      <TelemetryCell
        icon={Cpu}
        label="Edge AI Engine"
        value="Gemma 3"
        subtitle="100% Offline · 4B Parameters"
        indicatorText="&lt;0.3ms Gate"
        indicatorType="success"
        href="/settings"
      />
    </section>
  );
}
