"use client";

import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, UserCheck } from "lucide-react";

interface ClinicalRiskBannerProps {
  caseData: ClinicalCaseData;
}

export function ClinicalRiskBanner({ caseData }: ClinicalRiskBannerProps) {
  const isEmergency = caseData.riskLevel === "EMERGENCY";
  const isHigh = caseData.riskLevel === "HIGH";

  return (
    <div
      className={`rounded-2xl p-4 border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs transition-all ${
        isEmergency
          ? "bg-rose-950/90 border-rose-500/80 text-rose-100 shadow-rose-950/40"
          : isHigh
          ? "bg-amber-950/80 border-amber-500/80 text-amber-100 shadow-amber-950/40"
          : "bg-teal-950/50 border-teal-500/50 text-teal-100"
      }`}
    >
      {/* Risk Level & Severity Alert Header */}
      <div className="flex items-center space-x-3">
        <div
          className={`p-2.5 rounded-xl border shrink-0 ${
            isEmergency
              ? "bg-rose-500 text-slate-950 border-rose-400 animate-pulse"
              : isHigh
              ? "bg-amber-500 text-slate-950 border-amber-400"
              : "bg-teal-500/20 text-teal-300 border-teal-500/40"
          }`}
        >
          {isEmergency ? (
            <ShieldAlert className="h-6 w-6" />
          ) : (
            <AlertTriangle className="h-6 w-6" />
          )}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider">
              {caseData.riskLevel} CLINICAL RISK STATUS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-950/80 border border-slate-800 text-slate-300">
              Urgency: {caseData.urgencyScore} / 10
            </span>
          </div>
          <p className="text-xs font-medium opacity-90">
            {isEmergency
              ? "CRITICAL EMERGENCY DETECTED: Immediate physician referral & STAT stabilization required."
              : isHigh
              ? "HIGH CLINICAL RISK: Priority evaluation recommended within 60 minutes."
              : "MODERATE CLINICAL RISK: Elevated physiological parameters. Monitor vitals Q4H."}
          </p>
        </div>
      </div>

      {/* Human Review & Response Time Badges */}
      <div className="flex items-center space-x-3 shrink-0 text-[11px]">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
          <UserCheck className="h-4 w-4 text-teal-400" />
          <span className="font-bold">Human Review Required</span>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
          <Clock className="h-4 w-4 text-amber-400" />
          <span>Response: <strong className="text-white font-bold">{isEmergency ? "< 5 mins" : "< 15 mins"}</strong></span>
        </div>
      </div>
    </div>
  );
}
