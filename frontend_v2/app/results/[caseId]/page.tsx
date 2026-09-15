"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileQuestion, History, Clock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PatientHeader, PatientTabId } from "@/components/patient/PatientHeader";
import { ClinicalVitalsRow } from "@/components/patient/ClinicalVitalsRow";
import { ClinicalNotesRecord } from "@/components/patient/ClinicalNotesRecord";
import { ClinicalDocumentsList } from "@/components/patient/ClinicalDocumentsList";
import { AssessmentReportPanel } from "@/components/assessment/AssessmentReportPanel";
import { ReasoningCard } from "@/components/results/ReasoningCard";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { useCaseDraft } from "@/lib/store/caseDraft";
import { isApiConfigured } from "@/lib/api-client";
import { getCase, reviewCase, updatePatient, setPlan, addNote, addDocument, deleteCase, type PatientPatch, type PlanInput } from "@/services/cases.service";
import { EditPatientDialog } from "@/components/patient/EditPatientDialog";
import { CarePlanPanel } from "@/components/patient/CarePlanPanel";
import { useToastContext } from "@/providers/ToastProvider";
import { mapStoredCase } from "@/lib/mapAnalysis";
import { useCaseList } from "@/providers/CasesProvider";

const ACTION_LABELS: Record<string, string> = {
  created: "Case created from intake",
  reviewed: "Assessment reviewed",
  patient_updated: "Patient details updated",
  plan_updated: "Care plan set",
  note_added: "Note added",
  document_added: "Document attached",
  deleted: "Case deleted",
};

function describeEvent(action: string, payload?: Record<string, unknown> | null): string {
  const base = ACTION_LABELS[action] ?? action.replace(/_/g, " ");
  if (!payload) return base;
  if (action === "reviewed" && typeof payload.decision === "string") return `${base}: ${payload.decision}`;
  if (action === "created" && typeof payload.status === "string") return `${base} · ${String(payload.status).toLowerCase().replace(/_/g, " ")}`;
  if (action === "patient_updated" && payload.fields && typeof payload.fields === "object") return `${base}: ${Object.keys(payload.fields as object).join(", ")}`;
  if (action === "document_added" && typeof payload.name === "string") return `${base}: ${payload.name}`;
  if (action === "plan_updated" && typeof payload.next_step === "string") return `${base}: ${payload.next_step}`;
  return base;
}

export default function CaseResultsPage() {
  const routerParams = useParams();
  const caseId = (routerParams?.caseId as string) || "";
  const [activeTab, setActiveTab] = useState<PatientTabId>("overview");
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  const storedResult = useCaseDraft((state) => state.result);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => setIsHydrated(true), []);

  // A case is a bundled preset, the one result this tab produced, or a case
  // stored on the API. There is deliberately no other fallback: an unknown id
  // renders "not found", never another patient's record under this URL.
  const preset: ClinicalCaseData | undefined = PRESET_CASES[caseId];
  const stored = storedResult?.caseId === caseId ? storedResult : null;
  const list = useCaseList();
  const [remote, setRemote] = useState<ClinicalCaseData | null>(null);
  const [remoteState, setRemoteState] = useState<"idle" | "loading" | "missing">("idle");
  const canFetch = isApiConfigured() && !preset && !stored;
  useEffect(() => {
    if (!canFetch) return;
    let cancelled = false;
    setRemoteState("loading");
    getCase(caseId)
      .then((c) => {
        if (!cancelled) {
          setRemote(mapStoredCase(c));
          setRemoteState("idle");
        }
      })
      .catch(() => {
        if (!cancelled) setRemoteState("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [caseId, canFetch]);
  const caseData: ClinicalCaseData | null = preset ?? stored ?? remote ?? null;
  const isLive = Boolean(remote) || (Boolean(stored?.pipeline) && !stored?.pipeline?.replay && caseId.startsWith("CASE-") && caseId !== "CASE-CUSTOM");
  const loading = !isHydrated || remoteState === "loading";
  const docs = caseData?.clinicalDocuments ?? caseData?.documents?.map((name) => ({ name, type: /\.pdf$/i.test(name) ? "PDF" : "Image", size: "", uploadedTime: caseData.arrivalTime }));

  const router = useRouter();
  const { addToast } = useToastContext();
  const [editOpen, setEditOpen] = useState(false);
  const notice = (text: string) => addToast({ type: "info", title: text });
  const applyUpdate = (updated: Parameters<typeof mapStoredCase>[0]) => {
    setRemote(mapStoredCase(updated));
    void list.refresh();
  };

  const handleReview = async (decision: "approved" | "modified" | "rejected", note: string) => {
    applyUpdate(await reviewCase(caseId, decision, note || undefined));
    addToast({ type: "success", title: decision === "approved" ? "Signed off" : decision === "modified" ? "Signed off with changes" : "Assessment rejected" });
  };
  const handleEditPatient = async (patch: PatientPatch) => {
    applyUpdate(await updatePatient(caseId, patch));
    addToast({ type: "success", title: "Patient details updated" });
  };
  const handlePlan = async (plan: PlanInput) => {
    applyUpdate(await setPlan(caseId, plan));
    addToast({ type: "success", title: "Care plan saved" });
  };
  const handleNote = async (text: string) => {
    applyUpdate(await addNote(caseId, text));
  };
  const handleFile = async (file: File) => {
    applyUpdate(await addDocument(caseId, file));
    addToast({ type: "success", title: `Attached ${file.name}` });
  };
  const handleDelete = async () => {
    await deleteCase(caseId);
    await list.refresh();
    addToast({ type: "info", title: `Deleted ${caseId}` });
    router.push("/history");
  };

  if (!caseData) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[1560px]">
          {!loading ? (
            <EmptyState
              icon={FileQuestion}
              title="Case not found"
              description={`No case matching "${caseId}" is available in this session.`}
              action={{ label: "View patient queue", href: "/history" }}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-ink-muted">Loading case...</p>
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
          onEditPatient={isLive ? () => setEditOpen(true) : undefined}
          onDelete={isLive ? handleDelete : undefined}
          onNotice={notice}
        />
        {isLive && <EditPatientDialog key={caseData.patientName + caseData.age} isOpen={editOpen} onClose={() => setEditOpen(false)} caseData={caseData} onSave={handleEditPatient} />}

        {/* Master Clinical Split-Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">
          {/* LEFT: Patient Clinical Record */}
          <section className="lg:col-span-7 space-y-8" aria-label="Patient Clinical Record">
            {activeTab === "overview" && (
              <>
                <div>
                  <ClinicalVitalsRow caseData={caseData} />
                </div>
                {caseData.pipeline && (
                  <div className="border-t border-rule pt-6">
                    <ReasoningCard record={caseData.pipeline} />
                  </div>
                )}
                <div className="border-t border-rule pt-6">
                  <CarePlanPanel caseData={caseData} onSave={isLive ? handlePlan : undefined} />
                </div>
                <div className="border-t border-rule pt-6">
                  <ClinicalNotesRecord initialNotes={caseData.clinicalNotes} chiefComplaint={caseData.chiefComplaint} notes={caseData.notes} onAddNote={isLive ? handleNote : undefined} />
                </div>
                <div className="border-t border-rule pt-6">
                  <ClinicalDocumentsList documents={docs} onAddFile={isLive ? handleFile : undefined} />
                </div>
              </>
            )}

            {activeTab === "assessment" && (
              <>
                <div>
                  <ClinicalVitalsRow caseData={caseData} />
                </div>
                {caseData.pipeline && (
                  <div className="border-t border-rule pt-6">
                    <ReasoningCard record={caseData.pipeline} />
                  </div>
                )}
                {caseData.differentialConsiderations.length > 0 && (
                <div className="border-t border-rule pt-6 space-y-4">
                  <SectionHeader title="Differential Considerations" />
                  <ul className="divide-y divide-rule border-t border-rule">
                    {caseData.differentialConsiderations.map((item) => (
                      <li key={item} className="py-2.5 text-body-sm text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                )}
                {caseData.recommendedInvestigations.length > 0 && (
                <div className="border-t border-rule pt-6 space-y-4">
                  <SectionHeader title="Recommended Investigations" />
                  <ul className="divide-y divide-rule border-t border-rule">
                    {caseData.recommendedInvestigations.map((item) => (
                      <li key={item} className="py-2.5 text-body-sm text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                )}
                <div className="border-t border-rule pt-6">
                  <CarePlanPanel caseData={caseData} onSave={isLive ? handlePlan : undefined} />
                </div>
                <div className="border-t border-rule pt-6">
                  <ClinicalNotesRecord initialNotes={caseData.clinicalNotes} chiefComplaint={caseData.chiefComplaint} notes={caseData.notes} onAddNote={isLive ? handleNote : undefined} />
                </div>
              </>
            )}

            {activeTab === "documents" && (
              <div>
                <ClinicalDocumentsList documents={docs} onAddFile={isLive ? handleFile : undefined} />
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <SectionHeader title="Case history" />
                {caseData.events && caseData.events.length > 0 ? (
                  <ol className="border-y border-rule divide-y divide-rule">
                    {caseData.events.map((e) => (
                      <li key={e.id} className="py-3 flex items-start gap-3">
                        <History className="h-5 w-5 text-ink-muted mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-body-sm font-semibold text-ink">{describeEvent(e.action, e.payload)}</p>
                          <p className="text-body-sm text-ink-muted font-mono">{e.actor} · {e.at.replace("T", " ").slice(0, 16)} UTC</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ol className="border-y border-rule divide-y divide-rule">
                    <li className="py-3 flex items-start gap-3">
                      <Clock className="h-5 w-5 text-action mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="space-y-0.5">
                        <p className="text-body-sm font-semibold text-ink">Intake {caseData.arrivalTime.toLowerCase()}</p>
                        <p className="text-body-sm text-ink-muted">Presenting complaint: {caseData.chiefComplaint}</p>
                      </div>
                    </li>
                    {caseData.pipeline && (
                      <li className="py-3 flex items-start gap-3">
                        <History className="h-5 w-5 text-ink-muted mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="space-y-0.5">
                          <p className="text-body-sm font-semibold text-ink">
                            Assessment {caseData.pipeline.status.toLowerCase().replace(/_/g, " ")}
                            {caseData.pipeline.durationMs != null ? ` in ${(caseData.pipeline.durationMs / 1000).toFixed(1)} s` : ""}
                          </p>
                          <p className="text-body-sm text-ink-muted font-mono">{caseData.pipeline.requestId}{caseData.pipeline.replay ? " · replay" : ""}</p>
                        </div>
                      </li>
                    )}
                  </ol>
                )}
                <p className="text-body-sm text-ink-muted">
                  {caseData.events?.length
                    ? "Every change to a stored case is recorded here and cannot be edited."
                    : caseData.lastVisit
                    ? `Last recorded visit: ${caseData.lastVisit}. Stored cases carry a full event log.`
                    : "Stored cases carry a full event log of every change."}
                </p>
              </div>
            )}
          </section>

          {/* RIGHT: Assessment Report Panel */}
          <div className="lg:col-span-5">
            <AssessmentReportPanel
              caseData={caseData}
              onOpenReferralModal={() => setIsReferralOpen(true)}
              onReview={isLive ? handleReview : undefined}
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
