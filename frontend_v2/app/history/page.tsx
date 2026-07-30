"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HistoryQueueHeader } from "@/components/history/HistoryQueueHeader";
import { SegmentedQueueFilters } from "@/components/history/SegmentedQueueFilters";
import { CaseHistoryTable } from "@/components/history/CaseHistoryTable";
import { ClinicalPatientWorkspace } from "@/components/history/ClinicalPatientWorkspace";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { FloatingAIAssistant } from "@/components/ai/FloatingAIAssistant";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Default selected patient to first case (CASE-8901)
  const defaultPatient = PRESET_CASES["CASE-8901"] || null;
  const [selectedPatient, setSelectedPatient] = useState<ClinicalCaseData | null>(defaultPatient);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralTargetPatient, setReferralTargetPatient] = useState<ClinicalCaseData | null>(null);

  const handleOpenReferralModal = (patientToRefer?: ClinicalCaseData) => {
    setReferralTargetPatient(patientToRefer || selectedPatient);
    setIsReferralOpen(true);
  };

  return (
    <AppShell>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-16">
        {/* Top Operational Header */}
        <HistoryQueueHeader />

        {/* Segmented Risk & Status Filter Controls */}
        <SegmentedQueueFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRisk={selectedRisk}
          setSelectedRisk={setSelectedRisk}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {/* Master Split-Panel Clinical Workstation (60% Queue List / 40% Interactive Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7">
            <CaseHistoryTable
              searchQuery={searchQuery}
              selectedRisk={selectedRisk}
              selectedStatus={selectedStatus}
              selectedPatientId={selectedPatient?.caseId || null}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onOpenReferralModal={(p) => handleOpenReferralModal(p)}
            />
          </div>

          <div className="lg:col-span-5">
            <ClinicalPatientWorkspace
              patient={selectedPatient}
              onOpenReferralModal={() => handleOpenReferralModal()}
            />
          </div>
        </div>
      </div>

      {/* 1-Click Quick Referral Memorandum Modal */}
      <QuickReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={referralTargetPatient}
      />

      {/* Floating Offline AI Clinical Assistant */}
      <FloatingAIAssistant />
    </AppShell>
  );
}
