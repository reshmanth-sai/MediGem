"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileQuestion, History, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PatientHeader, PatientTabId } from "@/components/patient/PatientHeader";
import { ClinicalVitalsRow } from "@/components/patient/ClinicalVitalsRow";
import { ClinicalNotesRecord } from "@/components/patient/ClinicalNotesRecord";
import { ClinicalDocumentsList } from "@/components/patient/ClinicalDocumentsList";
import { AssessmentReportPanel } from "@/components/assessment/AssessmentReportPanel";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { useCaseDraft } from "@/lib/store/caseDraft";

export default function CaseResultsPage() {
  const routerParams = useParams();
  const caseId = (routerParams?.caseId as string) || "";
  const [activeTab, setActiveTab] = useState<PatientTabId>("overview");
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const storedResult = useCaseDraft((state) => state.result);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  const preset: ClinicalCaseData | undefined = PRESET_CASES[caseId];
  const stored = storedResult?.caseId === caseId ? storedResult : null;
  const caseData: ClinicalCaseData | null = preset ?? stored ?? PRESET_CASES["CASE-8901"];

  if (!caseData) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1560px]">
          {isHydrated ? (
            <EmptyState
              icon={FileQuestion}
              title="Case not found"
              description={`No case matching "${caseId}" is available in this session.`}
              action={{ label: "View patient queue", href: "/history" }}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-500">Loading case...</p>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1560px] space-y-8 pb-16">
        {/* Patient Header with demographics, risk badge & underline tabs */}
        <PatientHeader
          caseData={caseData}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Master Clinical Split-Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">
          {/* LEFT: Patient Clinical Record */}
          <section className="lg:col-span-7 space-y-8" aria-label="Patient Clinical Record">
            {activeTab === "overview" && (
              <>
                <div>
                  <ClinicalVitalsRow caseData={caseData} />
                </div>
                <div className="border-t border-slate-200/80 pt-6">
                  <ClinicalNotesRecord
                    initialNotes={caseData.clinicalNotes}
                    chiefComplaint={caseData.chiefComplaint}
                  />
                </div>
                <div className="border-t border-slate-200/80 pt-6">
                  <ClinicalDocumentsList documents={caseData.clinicalDocuments} />
                </div>
              </>
            )}

            {activeTab === "assessment" && (
              <>
                <div>
                  <ClinicalVitalsRow caseData={caseData} />
                </div>
                <div className="border-t border-slate-200/80 pt-6 space-y-4">
                  <SectionHeader title="Differential Considerations" />
                  <ul className="divide-y divide-slate-100 border-t border-slate-200">
                    {caseData.differentialConsiderations.map((item) => (
                      <li key={item} className="py-2.5 text-xs sm:text-sm text-slate-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-200/80 pt-6 space-y-4">
                  <SectionHeader title="Recommended Investigations" />
                  <ul className="divide-y divide-slate-100 border-t border-slate-200">
                    {caseData.recommendedInvestigations.map((item) => (
                      <li key={item} className="py-2.5 text-xs sm:text-sm text-slate-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-slate-200/80 pt-6">
                  <ClinicalNotesRecord
                    initialNotes={caseData.clinicalNotes}
                    chiefComplaint={caseData.chiefComplaint}
                  />
                </div>
              </>
            )}

            {activeTab === "documents" && (
              <div>
                <ClinicalDocumentsList documents={caseData.clinicalDocuments} />
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <SectionHeader title="Patient Longitudinal History" />
                <div className="border-y border-slate-200 py-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <History className="h-5 w-5 text-slate-400 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        Prior Sub-Center Visit: {caseData.lastVisit || "Sep 7, 2025"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Recorded by {caseData.assignedWorker}. Baseline blood pressure checked; routine outpatient counsel given.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        Current Visit: Today ({caseData.arrivalTime})
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Presenting complaint: {caseData.chiefComplaint}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: Assessment Report Panel */}
          <div className="lg:col-span-5">
            <AssessmentReportPanel
              caseData={caseData}
              onOpenReferralModal={() => setIsReferralOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Clinical Referral Memorandum Modal */}
      <QuickReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={caseData}
      />
    </AppShell>
  );
}
