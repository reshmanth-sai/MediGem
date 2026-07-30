"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRESET_CASES, ClinicalCaseData } from "@/lib/casesData";
import { RiskBadge } from "@/components/ui/Badge";
import { Search, Filter, Stethoscope, FileText, Printer, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";

export function PatientQueueTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  // Convert preset cases to array sorted by risk priority: EMERGENCY -> HIGH -> MODERATE -> LOW
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
      (c.village && c.village.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = filterRisk === "ALL" || c.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-0">
      {/* Header & Controls Strip */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-950/40">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-teal-400" />
            <span>Today's Patient Intake & Queue</span>
          </h2>
          <p className="text-xs text-slate-400 font-normal">
            Prioritized by emergency severity • Clinical decision queue
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, ID, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            {["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[10.5px] uppercase tracking-wider ${
                  filterRisk === lvl
                    ? lvl === "EMERGENCY"
                      ? "bg-rose-500 text-slate-950 font-bold"
                      : "bg-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Patient & Village</th>
              <th className="py-3 px-4">Age / Sex</th>
              <th className="py-3 px-4">Chief Complaint</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">AI Confidence</th>
              <th className="py-3 px-4">Arrival</th>
              <th className="py-3 px-4 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredCases.map((patient) => {
              const isEmergency = patient.riskLevel === "EMERGENCY";
              return (
                <tr
                  key={patient.caseId}
                  className={`hover:bg-slate-800/40 transition-colors group ${
                    isEmergency ? "bg-rose-950/20" : ""
                  }`}
                >
                  {/* Patient Name & Village */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                        {patient.patientName}
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          ({patient.patientId})
                        </span>
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
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            patient.aiConfidence && patient.aiConfidence > 95
                              ? "bg-teal-400"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${patient.aiConfidence || 90}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-300 font-bold">
                        {patient.aiConfidence || 94.0}%
                      </span>
                    </div>
                  </td>

                  {/* Arrival Time */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {patient.arrivalTime || "15 mins ago"}
                  </td>

                  {/* Quick Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/results/${patient.caseId}`}>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ml-auto border ${
                          isEmergency
                            ? "bg-rose-500 hover:bg-rose-400 text-slate-950 border-rose-400"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <span>Open Case</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
