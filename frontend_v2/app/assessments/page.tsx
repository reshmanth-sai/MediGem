"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ClipboardCheck, ShieldAlert, UserCheck, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricStat } from "@/components/ui/MetricStat";
import { Button } from "@/components/ui/Button";
import { CaseFilterBar } from "@/components/cases/CaseFilterBar";
import { CaseTable, OpenCaseAction, columns } from "@/components/cases/CaseTable";
import { useCaseFilter } from "@/hooks/useCaseFilter";
import { allCases } from "@/lib/caseStats";
import type { ClinicalCaseData } from "@/lib/casesData";

type ReviewFilter = "ALL" | "REVIEW_REQUIRED" | "CLEARED";

const COLS = [columns.patient, columns.finding, columns.priorityScore, columns.confidence, columns.review];

export default function ClinicalAssessmentsPage() {
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("ALL");
  const cases = useMemo(() => allCases(), []);
  const reviewPredicate = useCallback(
    (c: ClinicalCaseData) =>
      reviewFilter === "ALL" || (reviewFilter === "REVIEW_REQUIRED" && c.requiresHumanReview) || (reviewFilter === "CLEARED" && !c.requiresHumanReview),
    [reviewFilter]
  );
  const f = useCaseFilter(cases, reviewPredicate, reviewFilter !== "ALL");

  const emergency = cases.filter((c) => c.riskLevel === "EMERGENCY").length;
  const review = cases.filter((c) => c.requiresHumanReview).length;
  const cleared = cases.filter((c) => !c.safetyScreening?.hasRedFlags).length;

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <PageHeader
          title="Assessments"
          subtitle="One row per completed assessment: risk level, qualitative confidence, and whether a clinician still has to sign it off."
        />

        <section aria-label="Assessment counters" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          <MetricStat icon={ClipboardCheck} label="Assessed" value={cases.length} />
          <MetricStat icon={ShieldAlert} iconClassName="text-risk-emergency" label="Gate intercepts" value={emergency} />
          <MetricStat icon={UserCheck} iconClassName="text-risk-high" label="Awaiting clinician" value={review} />
          <MetricStat icon={CheckCircle2} iconClassName="text-risk-low" label="No red flags" value={cleared} />
        </section>

        <CaseFilterBar query={f.query} onQueryChange={f.setQuery} risk={f.risk} onRiskChange={f.setRisk} placeholder="Search patient, finding, complaint">
          <Button
            type="button"
            size="sm"
            variant={reviewFilter === "ALL" ? "secondary" : "outline"}
            aria-pressed={reviewFilter !== "ALL"}
            onClick={() => setReviewFilter(reviewFilter === "ALL" ? "REVIEW_REQUIRED" : reviewFilter === "REVIEW_REQUIRED" ? "CLEARED" : "ALL")}
          >
            {reviewFilter === "ALL" ? "All reviews" : reviewFilter === "REVIEW_REQUIRED" ? "Review required" : "Cleared"}
          </Button>
        </CaseFilterBar>

        <CaseTable
          cases={f.filtered}
          total={cases.length}
          columns={COLS}
          caption="Completed assessments"
          renderAction={(c) => <OpenCaseAction c={c} label="Open report" />}
          onClearFilters={() => {
            f.clear();
            setReviewFilter("ALL");
          }}
          emptyTitle="No assessments yet"
          emptyDescription="Run an intake and its assessment will appear here."
        />
      </div>
    </AppShell>
  );
}
