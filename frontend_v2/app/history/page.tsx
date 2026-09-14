"use client";

import type { Route } from "next";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { HistoryQueueHeader } from "@/components/history/HistoryQueueHeader";
import { SegmentedQueueFilters } from "@/components/history/SegmentedQueueFilters";
import { CaseHistoryTable } from "@/components/history/CaseHistoryTable";
import { ClinicalPatientWorkspace } from "@/components/history/ClinicalPatientWorkspace";
import { QuickReferralModal } from "@/components/history/QuickReferralModal";
import { ModalDialog } from "@/components/ui/Dialog";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";

function HistoryQueueContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL, or fallback to defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedRisk, setSelectedRisk] = useState(searchParams.get("risk") || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "ALL");
  
  const initialPatientId = searchParams.get("patient") || "CASE-8901";
  const [selectedPatient, setSelectedPatient] = useState<ClinicalCaseData | null>(
    PRESET_CASES[initialPatientId as keyof typeof PRESET_CASES] || null
  );

  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [referralTargetPatient, setReferralTargetPatient] = useState<ClinicalCaseData | null>(null);

  // Mobile modal state
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Sync state when URL params change (e.g. from Sidebar links)
  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    const riskParam = searchParams.get("risk") || "ALL";
    const statusParam = searchParams.get("status") || "ALL";
    const patientParam = searchParams.get("patient");

    setSearchQuery(qParam);
    setSelectedRisk(riskParam);
    setSelectedStatus(statusParam);
    if (patientParam && PRESET_CASES[patientParam as keyof typeof PRESET_CASES]) {
      setSelectedPatient(PRESET_CASES[patientParam as keyof typeof PRESET_CASES]);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync state changes back to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedRisk && selectedRisk !== "ALL") params.set("risk", selectedRisk);
    if (selectedStatus && selectedStatus !== "ALL") params.set("status", selectedStatus);
    if (selectedPatient?.caseId) params.set("patient", selectedPatient.caseId);
    
    // Replace URL without triggering a full page reload or scroll
    router.replace(`/history?${params.toString()}` as Route, { scroll: false });
  }, [searchQuery, selectedRisk, selectedStatus, selectedPatient, pathname, router]);

  const handleOpenReferralModal = (patientToRefer?: ClinicalCaseData) => {
    setReferralTargetPatient(patientToRefer || selectedPatient);
    setIsReferralOpen(true);
  };

  const handleSelectPatient = (p: ClinicalCaseData) => {
    setSelectedPatient(p);
    if (isMobile) {
      setIsMobileModalOpen(true);
    }
  };

  return (
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

      {/* Master Split-Panel Clinical Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7">
          <CaseHistoryTable
            searchQuery={searchQuery}
            selectedRisk={selectedRisk}
            selectedStatus={selectedStatus}
            selectedPatientId={selectedPatient?.caseId || null}
            onSelectPatient={handleSelectPatient}
            onOpenReferralModal={(p: ClinicalCaseData) => handleOpenReferralModal(p)}
            onClearFilters={() => {
              setSearchQuery("");
              setSelectedRisk("ALL");
              setSelectedStatus("ALL");
            }}
          />
        </div>

        {/* Desktop Workspace (Hidden on mobile) */}
        {!isMobile && (
          <div className="hidden lg:block lg:col-span-5">
            <ClinicalPatientWorkspace
              patient={selectedPatient}
              onOpenReferralModal={() => handleOpenReferralModal()}
            />
          </div>
        )}
      </div>

      {/* Mobile Workspace Modal */}
      {isMobile && (
        <ModalDialog
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
          title="Clinical Assessment"
        >
          <div className="max-h-[70vh] overflow-y-auto -mx-2 px-2">
            <ClinicalPatientWorkspace
              patient={selectedPatient}
              onOpenReferralModal={() => {
                setIsMobileModalOpen(false);
                handleOpenReferralModal();
              }}
            />
          </div>
        </ModalDialog>
      )}

      {/* 1-Click Quick Referral Memorandum Modal */}
      <QuickReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        patient={referralTargetPatient}
      />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-ink-muted text-body">Loading clinical queue...</div>}>
        <HistoryQueueContent />
      </Suspense>
    </AppShell>
  );
}
