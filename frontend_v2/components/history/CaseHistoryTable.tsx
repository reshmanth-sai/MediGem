"use client";

import React from "react";
import Link from "next/link";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { RiskBadge } from "@/components/ui/Badge";
import { User, ArrowRight, FileText, CheckCircle2, ChevronRight } from "lucide-react";

interface CaseHistoryTableProps {
  searchQuery: string;
  selectedRisk: string;
  selectedStatus: string;
  selectedPatientId: string | null;
  onSelectPatient: (patient: ClinicalCaseData) => void;
  onOpenReferralModal: (patient: ClinicalCaseData) => void;
}

export function CaseHistoryTable({
  searchQuery,
  selectedRisk,
  selectedStatus,
  selectedPatientId,
  onSelectPatient,
  onOpenReferralModal,
}: CaseHistoryTableProps) {
  const riskWeight: Record<string, number> = {
    EMERGENCY: 4,
    HIGH: 3,
    MODERATE: 2,
    LOW: 1,
  };

  const casesList: ClinicalCaseData[] = Object.values(PRESET_CASES).sort(
    (a, b) => (riskWeight[b.riskLevel] || 0) - (riskWeight[a.riskLevel] || 0)
  );

  const filteredCases = casesList.filter((c) => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.village && c.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.primaryFinding.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === "ALL" || c.riskLevel === selectedRisk;
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "TODAY" && c.arrivalTime?.includes("min")) ||
      (selectedStatus === "PENDING" && (c.status === "waiting" || c.status === "analyzing")) ||
      (selectedStatus === "REFERRED" && c.status === "referred") ||
      (selectedStatus === "COMPLETED" && c.status === "completed");

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-0">
      {/* Table Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
          <span>Active Patient Queue</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-teal-300 border border-slate-800 text-[10px]">
            {filteredCases.length} Patients
          </span>
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Select row to view AI summary</span>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="py-3 px-4">Patient & Village</th>
              <th className="py-3 px-4">Age/Sex</th>
              <th className="py-3 px-4">Chief Complaint</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">AI Conf</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredCases.length > 0 ? (
              filteredCases.map((patient) => {
                const isSelected = selectedPatientId === patient.caseId;
                const isEmergency = patient.riskLevel === "EMERGENCY";

                return (
                  <tr
                    key={patient.caseId}
                    onClick={() => onSelectPatient(patient)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "bg-teal-950/50 border-l-4 border-l-teal-400"
                        : isEmergency
                        ? "bg-rose-950/20 hover:bg-rose-900/30"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Patient Name & Village */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {patient.patientName}
                          <span className="text-[10px] font-mono text-slate-400">({patient.patientId})</span>
                        </p>
                        <p className="text-[11px] text-slate-400">{patient.village || "Rural Clinic"}</p>
                      </div>
                    </td>

                    {/* Age / Sex */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {patient.age}y / {patient.gender.charAt(0)}
                    </td>

                    {/* Chief Complaint */}
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate" title={patient.chiefComplaint}>
                      {patient.chiefComplaint}
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-3.5 px-4">
                      <RiskBadge level={patient.riskLevel} />
                    </td>

                    {/* AI Confidence Gauge */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-teal-300 font-bold">{patient.aiConfidence || 96.4}%</span>
                    </td>

                    {/* Quick Row Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenReferralModal(patient)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 transition-colors border border-slate-700"
                          title="Generate Referral Memo"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <Link href={`/results/${patient.caseId}`}>
                          <button
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white transition-colors border border-slate-700"
                            title="Open Case Results"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No matching patients found. Try adjusting your search query or risk filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
