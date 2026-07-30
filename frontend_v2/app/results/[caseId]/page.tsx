"use client";

import React, { use, useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StickyPatientSnapshot } from "@/components/results/StickyPatientSnapshot";
import { ClinicalRiskBanner } from "@/components/results/ClinicalRiskBanner";
import { AIDiagnosisCenterpiece } from "@/components/results/AIDiagnosisCenterpiece";
import { ExplainableAIDashboard } from "@/components/results/ExplainableAIDashboard";
import { PrioritizedActions } from "@/components/results/PrioritizedActions";
import { CategorizedEvidence } from "@/components/results/CategorizedEvidence";
import { DocumentViewer } from "@/components/results/DocumentViewer";
import { ClinicalJourneyTimeline } from "@/components/results/ClinicalJourneyTimeline";
import { StickyDecisionFooter } from "@/components/results/StickyDecisionFooter";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { Stethoscope, ClipboardList, Brain, FileText } from "lucide-react";

export default function CaseResultsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const [caseData, setCaseData] = useState<ClinicalCaseData>(
    PRESET_CASES[caseId] || PRESET_CASES["CASE-8901"]
  );
  const [activeTab, setActiveTab] = useState<"assessment" | "actions" | "evidence" | "documents">("assessment");
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (PRESET_CASES[caseId]) {
        setCaseData(PRESET_CASES[caseId]);
      } else {
        const stored = sessionStorage.getItem("medigem_custom_case");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setCaseData(parsed);
          } catch (e) {
            console.error("Failed to parse custom case from sessionStorage", e);
          }
        }
      }
    }
  }, [caseId]);

  const tabs = [
    { id: "assessment", label: "Clinical Assessment", icon: Stethoscope, badge: "PRIMARY" },
    { id: "actions", label: "Care Action Plan", icon: ClipboardList, badge: "3 TASKS" },
    { id: "evidence", label: "AI Evidence & Provenance", icon: Brain, badge: "XAI" },
    { id: "documents", label: "Docs & Timeline", icon: FileText, badge: "FILES" },
  ] as const;

  return (
    <AppShell>
      <div className="space-y-4 max-w-[1500px] mx-auto pb-24">
        {/* Integrated Patient Command Header */}
        <StickyPatientSnapshot caseData={caseData} onOpenReferral={() => setIsReferralOpen(true)} />

        {/* Clean Sub-Tabs Switcher */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 font-mono text-xs shadow-md">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-[180px] py-2 px-3 rounded-xl transition-all flex items-center justify-between border ${
                  isActive
                    ? "bg-slate-900 border-teal-500/60 text-white font-extrabold shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                  <span>{t.label}</span>
                </div>
                <span
                  className={`text-[9.5px] px-2 py-0.5 rounded font-mono font-bold ${
                    isActive ? "bg-teal-950 text-teal-300 border border-teal-500/30" : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Clinical Assessment & Decision View */}
        {activeTab === "assessment" && (
          <div className="space-y-4 animate-fadeIn">
            <ClinicalRiskBanner caseData={caseData} />
            <AIDiagnosisCenterpiece caseData={caseData} />
          </div>
        )}

        {/* TAB 2: Care Action Plan View */}
        {activeTab === "actions" && (
          <div className="animate-fadeIn">
            <PrioritizedActions caseData={caseData} />
          </div>
        )}

        {/* TAB 3: AI Evidence & Provenance View */}
        {activeTab === "evidence" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start animate-fadeIn">
            <div className="lg:col-span-6">
              <ExplainableAIDashboard caseData={caseData} />
            </div>
            <div className="lg:col-span-6">
              <CategorizedEvidence caseData={caseData} />
            </div>
          </div>
        )}

        {/* TAB 4: Docs & Timeline View */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start animate-fadeIn">
            <div className="lg:col-span-7">
              <DocumentViewer caseData={caseData} />
            </div>
            <div className="lg:col-span-5">
              <ClinicalJourneyTimeline caseData={caseData} />
            </div>
          </div>
        )}
      </div>

      {/* Fitts's Law Sticky Decision Footer */}
      <StickyDecisionFooter caseData={caseData} onOpenReferral={() => setIsReferralOpen(true)} />

      {/* 1-Click Quick Referral Memorandum Modal */}
      <QuickReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={caseData}
      />

      {/* Floating Offline AI Clinical Assistant */}
      <FloatingAIAssistant />
    </AppShell>
  );
}
