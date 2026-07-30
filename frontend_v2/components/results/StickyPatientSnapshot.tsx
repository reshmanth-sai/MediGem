"use client";

import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { RiskBadge } from "@/components/ui/Badge";
import { User, Clock, MapPin, ShieldCheck, CloudOff, UserCheck, HeartPulse } from "lucide-react";

interface StickyPatientSnapshotProps {
  caseData: ClinicalCaseData;
  onOpenReferral?: () => void;
}

export function StickyPatientSnapshot({ caseData, onOpenReferral }: StickyPatientSnapshotProps) {
  return (
    <div className="sticky top-0 z-30 rounded-2xl bg-slate-900/95 border border-slate-800/80 p-4 shadow-xl backdrop-blur-md space-y-3">
      {/* Integrated Row 1: Demographics, Status & Offline Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        {/* Patient Identity & Demographics */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center font-black text-teal-300 text-sm shrink-0">
            {caseData.patientName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white">{caseData.patientName}</h1>
              <span className="text-xs font-mono text-slate-300 font-bold">({caseData.patientId})</span>
              <span className="text-xs font-mono text-slate-200 font-bold">
                {caseData.age}y / {caseData.gender}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 pt-0.5 font-medium">
              <span className="flex items-center gap-1 text-slate-200">
                <MapPin className="h-3.5 w-3.5 text-teal-400" />
                {caseData.village || "Rampur Sub-Center"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {caseData.arrivalTime || "Arrived 12m ago"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                Triaged by: <strong className="text-white">{caseData.assignedWorker || "Priya Sharma (ANM)"}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Offline & Risk Badges */}
        <div className="flex items-center space-x-2.5 shrink-0 font-mono text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[11px] shadow-sm">
            <CloudOff className="h-4 w-4 text-emerald-400" />
            <span className="font-bold">100% Edge Offline</span>
          </div>

          <RiskBadge level={caseData.riskLevel} />
        </div>
      </div>

      {/* Integrated Row 2: Dedicated Horizontal Vitals Strip & Chief Complaint */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-0.5">
        {/* Chief Complaint */}
        <div className="text-xs text-slate-200 truncate max-w-xl" title={caseData.chiefComplaint}>
          <span className="text-slate-300 font-bold uppercase text-[10px] mr-1.5 font-mono">Chief Complaint:</span>
          <span className="font-semibold text-white">{caseData.chiefComplaint}</span>
        </div>

        {/* High-Contrast Vitals Pills (Fixing Low-Contrast BP Chip) */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {caseData.vitals.map((v) => {
            const isAlert = v.status === "alert";
            const isWarning = v.status === "warning";

            return (
              <div
                key={v.label}
                className={`px-3 py-1.5 rounded-xl border text-[11px] flex items-center space-x-1.5 transition-all ${
                  isAlert
                    ? "bg-slate-950 border-rose-500/80 text-rose-300 font-extrabold shadow-md shadow-rose-950/40"
                    : isWarning
                    ? "bg-slate-950 border-amber-500/80 text-amber-300 font-extrabold shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-200 font-bold"
                }`}
              >
                <span className="text-slate-400 text-[10px] uppercase font-bold">{v.label}:</span>
                <span className="font-black text-white text-xs tracking-tight">{v.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
