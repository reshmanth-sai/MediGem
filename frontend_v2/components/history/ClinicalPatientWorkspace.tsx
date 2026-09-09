"use client";

import React from "react";
import Link from "next/link";
import { ClinicalCaseData, ConfidenceLevel, CONFIDENCE_LABELS } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Button, buttonVariants } from "@/components/ui/Button";
import { H2, H3, Label, BodySm, Data } from "@/components/ui/Typography";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  Printer,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

interface ClinicalPatientWorkspaceProps {
  patient: ClinicalCaseData | null;
  onOpenReferralModal: () => void;
}

const CONFIDENCE_BAR_FILL: Record<ConfidenceLevel, number> = {
  HIGH: 90,
  MEDIUM: 60,
  LOW: 30,
};

const VITAL_TONE: Record<string, string> = {
  alert: "bg-risk-emergency/10 border-risk-emergency/50 text-risk-emergency",
  warning: "bg-risk-high/10 border-risk-high/50 text-risk-high",
  normal: "bg-surface-raised border-rule text-ink",
};

export function ClinicalPatientWorkspace({
  patient,
  onOpenReferralModal,
}: ClinicalPatientWorkspaceProps) {
  if (!patient) {
    return (
      <div className="border border-rule rounded-control bg-surface p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[460px]">
        <div className="p-3 rounded-control bg-surface-raised border border-rule text-ink-muted">
          <User className="h-6 w-6" aria-hidden="true" />
        </div>
        <H3>No patient selected</H3>
        <BodySm className="text-ink-muted max-w-xs">
          Select any patient in the queue to review vitals, assessment summary, and referral status.
        </BodySm>
      </div>
    );
  }

  const isEmergency = patient.riskLevel === "EMERGENCY";

  return (
    <div className="border border-rule rounded-control bg-surface p-5 space-y-5 sticky top-20">
      {/* Patient Meta Header */}
      <div className="flex items-start justify-between pb-3 border-b border-rule">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <H2>{patient.patientName}</H2>
            <Data className="text-ink-muted">({patient.patientId})</Data>
          </div>
          <BodySm className="text-ink-muted">
            {patient.age}y · {patient.gender} ·{" "}
            <span className="text-ink font-medium">{patient.village || "Rural Sub-Center"}</span>
          </BodySm>
        </div>
        <RiskIndicator level={patient.riskLevel} variant="tint" />
      </div>

      {/* Vitals Grid */}
      <div className="space-y-2">
        <SectionHeader title="Patient Vitals" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {patient.vitals.map((v) => (
            <div
              key={v.label}
              className={cn("p-2 rounded-control border text-center", VITAL_TONE[v.status] || VITAL_TONE.normal)}
            >
              <span className="text-label uppercase tracking-wider block text-ink-muted">{v.label}</span>
              <span className="font-mono text-body-sm font-semibold block">{v.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Assessment Summary */}
      <div className="space-y-3 border-t border-rule pt-3">
        <SectionHeader title="Clinical Assessment" />

        {/* Primary Finding */}
        <div className="space-y-1">
          <Label>Primary Finding</Label>
          <p className="text-body-sm font-semibold text-ink leading-snug">
            {patient.primaryFinding}
          </p>
        </div>

        {/* Assessment Confidence */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <BodySm className="text-ink-muted">Assessment Confidence:</BodySm>
            <BodySm className="font-semibold text-ink font-mono">{CONFIDENCE_LABELS[patient.confidenceLevel]}</BodySm>
          </div>
          <div className="w-full bg-surface-raised h-1.5 rounded-chip overflow-hidden border border-rule">
            <div
              className={cn("h-full rounded-chip", isEmergency ? "bg-risk-emergency" : "bg-action")}
              style={{ width: `${CONFIDENCE_BAR_FILL[patient.confidenceLevel]}%` }}
            />
          </div>
          {patient.requiresHumanReview && (
            <Label className="text-ink-muted normal-case">Requires clinician review</Label>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-1 border-t border-rule pt-2">
          <Label>Clinical Summary</Label>
          <p className="text-body-sm text-ink leading-relaxed font-sans">{patient.clinicalSummary}</p>
        </div>

        {/* Red Flags / Emergency Warnings */}
        {(isEmergency || patient.riskLevel === "HIGH") && (
          <div className="p-2.5 rounded-control bg-risk-emergency/10 border border-risk-emergency/40 text-risk-emergency space-y-1">
            <div className="font-semibold text-body-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Safety Screen: Immediate Escalation</span>
            </div>
            <p className="text-body-sm text-ink leading-normal">
              High acute presentation requiring STAT referral protocol to tertiary hospital.
            </p>
          </div>
        )}
      </div>

      {/* Clinical Activity Progression */}
      <div className="space-y-2 border-t border-rule pt-3">
        <SectionHeader title="Clinical Progression" />
        <div className="space-y-1.5 text-body-sm text-ink">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <span>1. Patient intake ({patient.village || "Rural clinic"}) recorded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <span>2. Document text and image extraction verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-action shrink-0" aria-hidden="true" />
            <span>3. Multimodal assessment completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-risk-low shrink-0" aria-hidden="true" />
            <span>4. Deterministic safety screening verified</span>
          </div>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="space-y-2 pt-3 border-t border-rule">
        <Button
          variant={isEmergency ? "danger" : "primary"}
          className="w-full"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={onOpenReferralModal}
        >
          Generate Referral Memo
        </Button>

        <div className="flex gap-2">
          <Link
            href={`/results/${patient.caseId}`}
            className={buttonVariants({
              variant: "secondary",
              className: "flex-1 w-full",
            })}
          >
            Open Full Case
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Button
            variant="secondary"
            aria-label="Print patient file"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
