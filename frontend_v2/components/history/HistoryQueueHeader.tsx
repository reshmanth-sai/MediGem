"use client";

import React from "react";
import Link from "next/link";
import { Users, PlusCircle, AlertTriangle, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { H1, Label, BodySm } from "@/components/ui/Typography";
import { MetricStat } from "@/components/ui/MetricStat";

export function HistoryQueueHeader() {
  return (
    <div className="rounded-card bg-surface border border-rule p-5 space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-chip bg-action-subtle text-action">
              <Users className="h-3 w-3" aria-hidden="true" /> Clinical Queue & Vault
            </Label>
            <Label className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-chip bg-risk-low/10 text-risk-low">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" /> 100% Offline DB
            </Label>
          </div>
          <H1>Patient Queue & Clinical History Workstation</H1>
          <BodySm className="text-ink-muted">
            Prioritized by clinical severity. Real-time explainable AI decision support.
          </BodySm>
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0">
          <Link href="/new-case" className={buttonVariants({ variant: "primary" })}>
            <span className="inline-flex" aria-hidden="true">
              <PlusCircle className="h-4 w-4" />
            </span>
            Start New Patient Intake
          </Link>
        </div>
      </div>

      {/* Operational Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-4 border-t border-rule divide-y divide-rule sm:divide-y-0">
        <MetricStat icon={Users} label="Total Cases Recorded" value={128} />
        <MetricStat
          icon={AlertTriangle}
          iconClassName="text-risk-emergency"
          label="Critical Emergencies"
          value="14 Cases"
        />
        <MetricStat icon={Clock} iconClassName="text-risk-high" label="Pending Review" value="3 Waiting" />
        <MetricStat icon={ArrowUpRight} iconClassName="text-risk-low" label="Referrals Today" value="4 Generated" />
      </div>
    </div>
  );
}
