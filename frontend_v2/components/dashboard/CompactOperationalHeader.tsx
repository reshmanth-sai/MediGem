"use client";

import React from "react";
import { Users, AlertTriangle, Clock, ArrowUpRight } from "lucide-react";
import { MetricStat } from "@/components/ui/MetricStat";
import { PageHeader } from "@/components/layout/PageHeader";
import { SESSION, greetingFor } from "@/lib/session";
import { caseCounters } from "@/lib/caseStats";
import { useCaseList } from "@/providers/CasesProvider";
import { capture } from "@/components/landing/data";

export function CompactOperationalHeader() {
  const list = useCaseList();
  const counters = caseCounters(list.cases);
  // Measured by evaluation/capture_landing_data.py, the same figure the
  // product page quotes. Replaced by /health once the pipeline API answers.
  const gateMs = capture.summary.gate_latency_ms_median;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greetingFor()}, ${SESSION.clinician.shortName}`}
        subtitle={`${SESSION.facility.name} · ${SESSION.clinician.role}. Assessment runs on this machine; no uplink is used.`}
        meta={[capture.meta.model, `emergency gate ${gateMs.toFixed(2)} ms median`, "offline ready"]}
      />
      <section aria-label="Queue counters" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
        <MetricStat icon={Users} label="In queue" value={counters.total} />
        <MetricStat icon={AlertTriangle} iconClassName="text-risk-emergency" label="Emergency" value={counters.emergency === 0 ? "None" : counters.emergency} />
        <MetricStat icon={Clock} iconClassName="text-risk-moderate" label="Pending review" value={counters.pendingReview} />
        <MetricStat icon={ArrowUpRight} label="Referrals open" value={counters.referrals} />
      </section>
    </div>
  );
}
