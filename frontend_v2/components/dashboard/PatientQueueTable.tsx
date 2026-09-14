"use client";

import React from "react";
import { allCases } from "@/lib/caseStats";
import { useCaseFilter } from "@/hooks/useCaseFilter";
import { CaseFilterBar } from "@/components/cases/CaseFilterBar";
import { CaseTable, OpenCaseAction, columns } from "@/components/cases/CaseTable";
import { SectionHeader } from "@/components/ui/SectionHeader";

const COLS = [columns.patient, columns.ageSex, columns.complaint, columns.priority, columns.arrival, columns.status];

export function PatientQueueTable() {
  const cases = allCases();
  const f = useCaseFilter(cases);

  return (
    <section className="space-y-4 pt-2 border-t border-rule" aria-label="Patient queue">
      <SectionHeader
        title="Patient queue"
        badge={
          <span className="text-body-sm font-mono px-2 py-0.5 rounded-card bg-surface-raised border border-rule text-ink-muted">
            {f.filtered.length === cases.length ? `${cases.length} in queue` : `${f.filtered.length} of ${cases.length}`}
          </span>
        }
        subtitle="Ordered by the emergency gate first, then triage severity"
      />
      <CaseFilterBar query={f.query} onQueryChange={f.setQuery} risk={f.risk} onRiskChange={f.setRisk} />
      <CaseTable
        cases={f.filtered}
        total={cases.length}
        columns={COLS}
        caption="Today's patient triage queue, sorted by clinical priority"
        renderAction={(c) => <OpenCaseAction c={c} />}
        onClearFilters={f.clear}
        emptyTitle="No active cases today"
      />
    </section>
  );
}
