"use client";

import React from "react";
import { type ClinicalCaseData } from "@/lib/casesData";
import { sortBySeverity } from "@/lib/caseStats";
import { useCaseList } from "@/providers/CasesProvider";
import { filterCases, RISK_FILTERS, type RiskFilter } from "@/lib/caseFilter";
import { CaseTable, columns } from "@/components/cases/CaseTable";

const COLS = [columns.patient, columns.complaint, columns.priorityScore];

interface CaseHistoryTableProps {
  searchQuery: string;
  selectedRisk: string;
  selectedStatus: string;
  selectedPatientId: string | null;
  onSelectPatient: (patient: ClinicalCaseData) => void;
  onOpenReferralModal: (patient: ClinicalCaseData) => void;
  onClearFilters: () => void;
}

export function CaseHistoryTable({
  searchQuery,
  selectedRisk,
  selectedStatus,
  selectedPatientId,
  onSelectPatient,
  onOpenReferralModal: _onOpenReferralModal,
  onClearFilters,
}: CaseHistoryTableProps) {
  const list = useCaseList();
  const casesList = React.useMemo(() => sortBySeverity(list.cases), [list.cases]);

  // The queue header owns the search and risk state (URL-synced), so the
  // shared filter runs here as a pure function with the status predicate.
  const filteredCases = React.useMemo(
    () =>
      filterCases(casesList, {
        query: searchQuery,
        risk: (RISK_FILTERS as readonly string[]).includes(selectedRisk) ? (selectedRisk as RiskFilter) : "ALL",
        extra: (c) =>
          selectedStatus === "ALL" ||
          (selectedStatus === "TODAY" && Boolean(c.arrivalTime?.includes("min"))) ||
          (selectedStatus === "PENDING" && (c.status === "waiting" || c.status === "analyzing" || c.requiresHumanReview)) ||
          (selectedStatus === "REFERRED" && (Boolean(c.disposition?.needsReferral) || c.riskLevel === "EMERGENCY" || c.status === "referred")) ||
          (selectedStatus === "COMPLETED" && (c.status === "completed" || c.riskLevel === "LOW")),
      }),
    [casesList, searchQuery, selectedRisk, selectedStatus]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-base sm:text-lg font-bold text-ink">Patients requiring attention</h2>
        <span className="text-body-sm font-medium text-ink-muted">
          {filteredCases.length} of {casesList.length} patients
        </span>
      </div>
      <CaseTable
        cases={filteredCases}
        total={casesList.length}
        columns={COLS}
        caption="Case history"
        selectedCaseId={selectedPatientId}
        onSelect={onSelectPatient}
        onClearFilters={onClearFilters}
        emptyTitle="No cases in history"
        emptyDescription="Cases will appear here once patient intakes have been recorded."
      />
    </div>
  );
}
