"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Ambulance, FileText, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricStat } from "@/components/ui/MetricStat";
import { Button, buttonVariants } from "@/components/ui/Button";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { CaseFilterBar } from "@/components/cases/CaseFilterBar";
import { CaseTable, columns, type CaseColumn } from "@/components/cases/CaseTable";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { useCaseFilter } from "@/hooks/useCaseFilter";
import { useCaseList } from "@/providers/CasesProvider";
import { sortBySeverity } from "@/lib/caseStats";
import type { ClinicalCaseData } from "@/lib/casesData";

/*
 * Referrals are cases whose disposition needs one. Nothing here is a separate
 * record: the urgency, next step and destination level come from the case's
 * own disposition, so this page can never disagree with the queue.
 */

const urgencyCol: CaseColumn = {
  id: "urgency",
  header: "Referral",
  cell: (c) => (
    <span className={c.riskLevel === "EMERGENCY" ? "text-body-sm font-semibold text-risk-emergency" : "text-body-sm text-ink"}>{c.disposition.urgency}</span>
  ),
};

const COLS = [columns.patient, columns.finding, columns.priority, urgencyCol];

export default function ReferralsPage() {
  const list = useCaseList();
  const referrals = useMemo(() => sortBySeverity(list.cases).filter((c) => c.disposition?.needsReferral), [list.cases]);
  const f = useCaseFilter(referrals);
  const [selected, setSelected] = useState<ClinicalCaseData | null>(referrals[0] ?? null);
  const [memoOpen, setMemoOpen] = useState(false);

  const immediate = referrals.filter((c) => c.riskLevel === "EMERGENCY").length;

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <PageHeader
          title="Referrals"
          subtitle="Cases whose assessment calls for transfer or specialist review. Select a row to see the disposition and write the referral note."
        />

        <section aria-label="Referral counters" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          <MetricStat icon={ArrowRightLeft} label="Open referrals" value={referrals.length} />
          <MetricStat icon={Ambulance} iconClassName="text-risk-emergency" label="Immediate" value={immediate} />
          <MetricStat icon={Clock} iconClassName="text-risk-moderate" label="Routine" value={referrals.length - immediate} />
          <MetricStat icon={FileText} label="Awaiting sign-off" value={referrals.filter((c) => c.requiresHumanReview).length} />
        </section>

        <CaseFilterBar query={f.query} onQueryChange={f.setQuery} risk={f.risk} onRiskChange={f.setRisk} placeholder="Search patient, finding" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <CaseTable
              cases={f.filtered}
              total={referrals.length}
              columns={COLS}
              caption="Open referrals"
              selectedCaseId={selected?.caseId ?? null}
              onSelect={setSelected}
              onClearFilters={f.clear}
              emptyTitle="No referrals"
              emptyDescription="Cases whose assessment needs a transfer or a specialist will appear here."
            />
          </div>

          <aside className="lg:col-span-5 border border-rule bg-surface p-5 space-y-5 lg:sticky lg:top-24" aria-label="Referral detail">
            {selected ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-h3 text-ink">{selected.patientName}</h2>
                    <RiskIndicator level={selected.riskLevel} variant="tint" />
                  </div>
                  <p className="text-body-sm text-ink-muted font-mono">
                    {selected.patientId} · {selected.age}y {selected.gender.charAt(0)} · {selected.village}
                  </p>
                </div>

                <dl className="divide-y divide-rule border-t border-rule text-body-sm">
                  <div className="py-2.5 grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-ink-muted">Urgency</dt>
                    <dd className={selected.riskLevel === "EMERGENCY" ? "font-semibold text-risk-emergency" : "text-ink"}>{selected.disposition.urgency}</dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-ink-muted">Finding</dt>
                    <dd className="text-ink">{selected.primaryFinding}</dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-ink-muted">Next step</dt>
                    <dd className="text-ink">{selected.disposition.nextStep}</dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-ink-muted">Vitals</dt>
                    <dd className="font-mono text-ink">{selected.vitals.map((v) => `${v.label} ${v.value}`).join(" · ")}</dd>
                  </div>
                  <div className="py-2.5 grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-ink-muted">Review</dt>
                    <dd className="text-ink">{selected.requiresHumanReview ? "Clinician sign-off required before transfer" : "Cleared"}</dd>
                  </div>
                </dl>

                <p className="text-body-sm text-ink-muted">
                  Destination facility, transport and handover are recorded by the receiving system; this workstation writes the referral note only.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button type="button" onClick={() => setMemoOpen(true)} leftIcon={<FileText className="h-4 w-4" aria-hidden="true" />}>
                    Write referral note
                  </Button>
                  <Link href={`/results/${selected.caseId}`} className={buttonVariants({ variant: "secondary" })}>
                    Open case
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-body-sm text-ink-muted">Select a referral to see its disposition.</p>
            )}
          </aside>
        </div>
      </div>

      <QuickReferralModal isOpen={memoOpen} onClose={() => setMemoOpen(false)} patient={selected} />
    </AppShell>
  );
}
