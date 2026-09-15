"use client";

import React from "react";
import Link from "next/link";
import { ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  User,
  MoreVertical,
  Clock,
  ChevronRight,
  BarChart2,
  UserCheck,
  Circle,
  Triangle,
  Shield,
  Octagon,
  ExternalLink,
  FileUp,
  AlertTriangle,
} from "lucide-react";

interface ClinicalPatientWorkspaceProps {
  patient: ClinicalCaseData | null;
  onOpenReferralModal: () => void;
}

function WorkspaceRiskBadge({ level }: { level: string }) {
  if (level === "EMERGENCY") {
    return (
      <div className="flex items-center gap-1.5 text-body-sm font-semibold text-risk-emergency">
        <Circle className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>Emergency</span>
      </div>
    );
  }
  if (level === "HIGH") {
    return (
      <div className="flex items-center gap-1.5 text-body-sm font-semibold text-risk-high">
        <Triangle className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>High risk</span>
      </div>
    );
  }
  if (level === "MODERATE") {
    return (
      <div className="flex items-center gap-1.5 text-body-sm font-semibold text-risk-moderate">
        <Circle className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>Moderate</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-body-sm font-semibold text-risk-low">
      <Shield className="h-3.5 w-3.5 stroke-[2.5]" />
      <span>Low risk</span>
    </div>
  );
}

export function ClinicalPatientWorkspace({
  patient,
  onOpenReferralModal,
}: ClinicalPatientWorkspaceProps) {
  if (!patient) {
    return (
      <div className="border border-rule rounded-card bg-surface p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[460px]">
        <div className="p-3 rounded-card bg-surface-raised border border-rule text-ink-muted">
          <User className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-ink">No patient selected</h3>
        <p className="text-body-sm text-ink-muted max-w-xs">
          Select any patient in the queue to review vitals, assessment summary, and referral status.
        </p>
      </div>
    );
  }

  const isEmergency = patient.riskLevel === "EMERGENCY";
  const confidenceLabel = CONFIDENCE_LABELS[patient.confidenceLevel] || "High confidence";

  return (
    <div className="border border-rule rounded-card bg-surface flex flex-col max-h-[calc(100vh-6rem)] sticky top-24 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Patient Meta Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{patient.patientName}</h2>
              <div className="text-body-sm font-mono text-ink-muted mt-0.5">{patient.patientId}</div>
              <div className="text-body-sm text-ink-muted mt-0.5">
                {patient.age}y · {patient.gender} · {patient.village || "Tamil Nadu"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WorkspaceRiskBadge level={patient.riskLevel} />
              <button
                type="button"
                className="p-1 text-ink-muted hover:text-ink rounded hover:bg-surface-raised transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="pt-1">
            <span className="text-body-sm font-semibold text-ink-muted">Chief complaint</span>
            <p className="text-body-sm font-semibold text-ink leading-snug mt-0.5">
              {patient.chiefComplaint}
            </p>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 text-body-sm text-ink-muted pt-0.5">
            <Clock className="h-3.5 w-3.5 text-ink-muted shrink-0" />
            <span>{patient.arrivalTime}{patient.lastVisit ? ` · last visit ${patient.lastVisit}` : ""}</span>
          </div>
        </div>

        <div className="border-t border-rule" />

        {/* Patient Vitals (Flat Minimalist Cards) */}
        <div className="space-y-2.5">
          <h3 className="text-body-sm font-bold text-ink">Patient Vitals</h3>
          <div className="grid grid-cols-4 gap-2">
            {patient.vitals.map((v) => {
              const isAbnormal = v.status !== "normal";
              const isCritical = v.status === "alert";
              return (
                <div
                  key={v.label}
                  className="border border-rule rounded-card p-2.5 bg-surface space-y-0.5"
                >
                  <span className="text-[11px] font-medium text-ink-muted">{v.label}</span>
                  <div
                    className={cn(
                      "text-body-sm font-bold font-mono",
                      isCritical
                        ? "text-risk-emergency"
                        : isAbnormal
                        ? "text-risk-high"
                        : "text-ink"
                    )}
                  >
                    {v.value}
                  </div>
                  <div
                    className={cn(
                      "text-body-sm",
                      isCritical
                        ? "text-risk-emergency font-semibold"
                        : isAbnormal
                        ? "text-risk-high font-medium"
                        : "text-ink-muted"
                    )}
                  >
                    {isCritical ? "Critical" : isAbnormal ? "Elevated" : "Normal"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Assessment Section */}
        <div className="space-y-3">
          <h3 className="text-body-sm font-bold text-ink">Clinical Assessment</h3>

          {/* Primary Finding Row */}
          <Link
            href={`/results/${patient.caseId}`}
            className="flex items-center justify-between text-body-sm font-bold text-action hover:text-action-hover group transition-colors"
          >
            <span>{patient.primaryFinding}</span>
            <ChevronRight className="h-4 w-4 text-action group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Assessment Confidence & Review Status Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border border-rule rounded-card p-2.5 bg-surface space-y-1">
              <div className="flex items-center gap-1.5 text-body-sm font-medium text-ink-muted">
                <BarChart2 className="h-3.5 w-3.5 text-action shrink-0" />
                <span>Assessment Confidence</span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-body-sm font-semibold text-ink">{confidenceLabel}</span>
              </div>
            </div>

            <div className="border border-rule rounded-card p-2.5 bg-surface space-y-1">
              <div className="flex items-center gap-1.5 text-body-sm font-medium text-ink-muted">
                <UserCheck className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                <span>Review Status</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5 text-body-sm font-medium text-risk-high">
                <span className="h-2 w-2 rounded-full bg-risk-high shrink-0" />
                <span>Requires clinician review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-body-sm font-bold text-ink">Clinical Summary</h3>
            <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />
          </div>
          <p className="text-body-sm text-ink-muted leading-relaxed font-normal">
            {patient.clinicalSummary}
          </p>

          {/* Emergency / Critical Safety Callout */}
          {(isEmergency || patient.riskLevel === "HIGH") && (
            <div className="p-3 rounded-card bg-risk-emergency/5 border border-risk-emergency/40 text-risk-emergency space-y-1 mt-2">
              <div className="font-semibold text-body-sm flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Safety Screen: Immediate Escalation</span>
              </div>
              <p className="text-body-sm text-ink leading-normal">
                High acute presentation requiring STAT referral protocol to tertiary hospital.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Sticky Actions Footer (Mockup: 3 buttons on one row) */}
      <div className="p-3 border-t border-rule bg-surface shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/results/${patient.caseId}#care-plan`}
            className="bg-action hover:bg-action-hover text-on-action px-3 py-2 rounded-card text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{patient.plan ? "Update care plan" : "Set care plan"}</span>
          </Link>
          <Link
            href={`/results/${patient.caseId}`}
            className="border border-rule bg-surface hover:bg-surface-raised text-ink px-2.5 py-2 rounded-card text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" />
            <span className="truncate">Open case</span>
          </Link>
          <button
            type="button"
            onClick={onOpenReferralModal}
            className="border border-rule bg-surface hover:bg-surface-raised text-ink px-2 py-2 rounded-card text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileUp className="h-3.5 w-3.5 text-ink-muted shrink-0" aria-hidden="true" />
            <span className="truncate">Referral note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
