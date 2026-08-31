"use client";

import React, { use, useEffect, useState } from "react";
import { FileQuestion } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StickyPatientSnapshot } from "@/components/results/StickyPatientSnapshot";
import { PrimaryFinding } from "@/components/results/PrimaryFinding";
import { SupportingFindings } from "@/components/results/SupportingFindings";
import { DifferentialConsiderations } from "@/components/results/DifferentialConsiderations";
import { RecommendedInvestigations } from "@/components/results/RecommendedInvestigations";
import { ClinicalRationale } from "@/components/results/ClinicalRationale";
import { Disposition } from "@/components/results/Disposition";
import { StickyDecisionFooter } from "@/components/results/StickyDecisionFooter";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { EmptyState } from "@/components/ui/EmptyState";
import { Body } from "@/components/ui/Typography";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { useCaseDraft } from "@/lib/store/caseDraft";

/**
 * The clinical results panel, in the fixed section order of spec 8.1:
 * primary finding, supporting findings, differential considerations,
 * recommended investigations, clinical rationale, disposition.
 *
 * The four-tab click-through this route used to present is gone. Every section
 * is independently scannable in one vertical pass, so a clinician never has to
 * discover that a tab is hiding the reason behind an assessment.
 */
export default function CaseResultsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  /**
   * A case submitted through the intake wizard is read from the shared draft
   * store, which persists `result` to sessionStorage. The wizard calls
   * `setResult` and routes here; subscribing to the store (rather than reading
   * it once) keeps this client component correct if the result lands after
   * mount, and the persistence keeps it correct across a reload.
   *
   * The stored result is only accepted when its own `caseId` matches the route,
   * so a stale draft can never be served under a different case's URL.
   */
  const storedResult = useCaseDraft((state) => state.result);

  /**
   * sessionStorage does not exist during server rendering, so the persisted
   * result is unavailable on the first paint. Rendering the not-found state
   * before rehydration would both flash a false negative and desync hydration,
   * so an unknown id waits one commit before it is judged missing.
   */
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const preset: ClinicalCaseData | undefined = PRESET_CASES[caseId];
  const stored = storedResult?.caseId === caseId ? storedResult : null;

  /**
   * There is deliberately no preset fallback here. Falling through to
   * `PRESET_CASES["CASE-8901"]` for an unrecognised id rendered a real-looking
   * but entirely different patient (name, vitals, risk level, findings) under
   * the requested case URL, with nothing on screen to signal the substitution.
   * An honest empty state is the only safe answer for an id we cannot resolve.
   */
  const caseData: ClinicalCaseData | null = preset ?? stored;

  if (!caseData) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1500px]">
          {isHydrated ? (
            <EmptyState
              icon={FileQuestion}
              title="Case not found"
              description={`No case matching "${caseId}" is available in this session. It may have expired, or the link may be incorrect.`}
              action={{ label: "Start a new case", href: "/new-case" }}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <Body>Loading case...</Body>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] space-y-6 pb-24">
        <StickyPatientSnapshot caseData={caseData} />

        <PrimaryFinding caseData={caseData} />
        <SupportingFindings caseData={caseData} />
        <DifferentialConsiderations caseData={caseData} />
        <RecommendedInvestigations caseData={caseData} />
        <ClinicalRationale caseData={caseData} />
        <Disposition caseData={caseData} />
      </div>

      <StickyDecisionFooter
        caseData={caseData}
        onOpenReferral={() => setIsReferralOpen(true)}
      />

      <QuickReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={caseData}
      />

      <FloatingAIAssistant />
    </AppShell>
  );
}
