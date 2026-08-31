"use client";

import React, { useState } from "react";
import { ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { ModalDialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label, BodySm } from "@/components/ui/Typography";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Printer, CheckCircle2, ShieldAlert } from "lucide-react";

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
MediGem Clinical Co-Pilot - Rural Health Sub-Center
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
- AI Confidence     : ${CONFIDENCE_LABELS[patient.confidenceLevel]} (Offline Deterministic Safety Gate Passed)${patient.requiresHumanReview ? "\n- Review Status     : Needs clinician review" : ""}

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
        <div className="p-3 rounded-card bg-ground border border-rule flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-risk-emergency" aria-hidden="true" />
            <div>
              <BodySm className="font-semibold text-ink">STAT Facility Transfer Memo</BodySm>
              <Label className="normal-case text-ink-muted">Generated locally by MediGem Co-Pilot</Label>
            </div>
          </div>
          <RiskIndicator level={patient.riskLevel} variant="solid" />
        </div>

        {/* Printable Memo Content Box */}
        <pre className="p-3.5 rounded-card bg-ground border border-rule text-body-sm font-mono text-ink overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
          {referralMemoText}
        </pre>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-rule">
          <Button
            variant="secondary"
            leftIcon={<CheckCircle2 className="h-3.5 w-3.5 text-risk-low" />}
            onClick={handleCopy}
          >
            {copied ? "Copied to Clipboard!" : "Copy Memo Text"}
          </Button>

          <Button
            variant="primary"
            leftIcon={<Printer className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Print Referral Memo
          </Button>
        </div>
      </div>
    </ModalDialog>
  );
}
