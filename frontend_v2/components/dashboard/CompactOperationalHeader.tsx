"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck, Cpu, WifiOff, Users, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";
import { Card, Section } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { MetricStat } from "@/components/ui/MetricStat";
import { H1, Body } from "@/components/ui/Typography";
import { SESSION, greetingFor } from "@/lib/session";
import { caseCounters } from "@/lib/caseStats";
import { capture } from "@/components/landing/data";

export function CompactOperationalHeader() {
  const counters = caseCounters();
  // Measured by evaluation/capture_landing_data.py, the same figure the
  // landing page quotes. Replaced by /health once the pipeline API is wired.
  const gateMs = capture.summary.gate_latency_ms_median;
  const greeting = greetingFor();
  return (
    <Card className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-chip text-label bg-risk-low/12 text-risk-low border border-risk-low/30">
              <WifiOff className="h-3.5 w-3.5" aria-hidden="true" /> Offline ready
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
              <Cpu className="h-3.5 w-3.5" aria-hidden="true" /> {capture.meta.model}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-chip text-label bg-surface-raised text-ink-muted border border-rule">
              <ShieldCheck className="h-3.5 w-3.5 text-action" aria-hidden="true" /> Emergency gate, {gateMs.toFixed(2)} ms median
            </span>
          </div>

          <H1>
            {greeting}, <span className="text-action">{SESSION.clinician.shortName}</span>
          </H1>
          <Body className="text-ink-muted">
            {SESSION.facility.name} · {SESSION.clinician.role}. Assessment runs on this machine.
          </Body>
        </div>

        <div className="shrink-0">
          <Link href="/new-case" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            <span className="inline-flex" aria-hidden="true">
              <PlusCircle className="h-4 w-4" />
            </span>
            Start new patient intake
          </Link>
        </div>
      </div>

      <Section heading="Today's operational counters" headingAs="h3" className="pt-3 border-t border-rule">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          <MetricStat icon={Users} label="Patients in queue" value={counters.total} />
          <MetricStat
            icon={AlertTriangle}
            iconClassName="text-risk-emergency"
            label="Emergency"
            value={counters.emergency === 0 ? "None" : `${counters.emergency} critical`}
          />
          <MetricStat
            icon={Clock}
            iconClassName="text-risk-moderate"
            label="Pending review"
            value={`${counters.pendingReview} cases`}
          />
          <MetricStat icon={ArrowUpRight} label="Referrals" value={`${counters.referrals} open`} />
        </div>
      </Section>
    </Card>
  );
}
