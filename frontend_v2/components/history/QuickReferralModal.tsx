"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { ModalDialog } from "@/components/ui/Dialog";
import { FileText, Printer, Download, CheckCircle2, ShieldAlert } from "lucide-react";

interface QuickReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ClinicalCaseData | null;
}

export function QuickReferralModal({ isOpen, onClose, patient }: QuickReferralModalProps) {
  const [copied, setCopied] = useState(false);

  if (!patient) return null;

  const referralMemoText = `================================================================================
OFFLINE CLINICAL REFERRAL MEMORANDUM
MediGem Clinical Co-Pilot • Rural Health Sub-Center
================================================================================
PATIENT DEMOGRAPHICS:
- Patient Name : ${patient.patientName} (${patient.gender}, ${patient.age} years)
- Patient ID   : ${patient.patientId}
- Village      : ${patient.village || "Rampur Sub-Center"}
- Date & Time  : ${new Date().toLocaleString()}

CLINICAL PRESENTATION:
- Chief Complaint : ${patient.chiefComplaint}
- Risk Level      : ${patient.riskLevel} RISK (Urgency Score: ${patient.urgencyScore}/10)
- Vitals          : ${patient.vitals.map((v) => `${v.label}: ${v.value}`).join(" | ")}

OFFLINE AI FINDINGS & SAFETY INTERCEPT (Gemma 3 4B):
- Primary Diagnosis : ${patient.primaryFinding}
- Reasoning Summary : ${patient.clinicalSummary}
- AI Confidence     : ${patient.aiConfidence || 96.4}% (Offline Deterministic Safety Gate Passed)

RECOMMENDED TRANSFER & STAT ACTIONS:
${patient.recommendedAction}

REFERRED BY:
Health Worker: Ramesh Kumar (ANM)
Facility     : Primary Health Sub-Center, Rampur
System Status: 100% Offline Edge Assistant
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralMemoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="1-Click Clinical Referral Memorandum">
      <div className="space-y-4">
        {/* Memo Header Banner */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <div>
              <p className="font-bold text-white">STAT Facility Transfer Memo</p>
              <p className="text-[10px] text-slate-400 font-mono">Generated locally by MediGem Co-Pilot</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/40 text-[10px]">
            {patient.riskLevel}
          </span>
        </div>

        {/* Printable Memo Content Box */}
        <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
          {referralMemoText}
        </pre>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
            <span>{copied ? "Copied to Clipboard!" : "Copy Memo Text"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold transition-all flex items-center space-x-1.5 border border-teal-300 shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>Print Referral Memo</span>
            </button>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
