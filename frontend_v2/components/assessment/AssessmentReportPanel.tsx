"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Edit3,
  XCircle,
  FileEdit,
} from "lucide-react";
import { ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";

export interface AssessmentReportPanelProps {
  caseData: ClinicalCaseData;
  onOpenReferralModal?: () => void;
  onModifyAssessment?: () => void;
  onRejectAssessment?: () => void;
  onAddNote?: () => void;
}

export function AssessmentReportPanel({
  caseData,
  onOpenReferralModal,
  onModifyAssessment,
  onRejectAssessment,
  onAddNote,
}: AssessmentReportPanelProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Everything below reads from the case. Observations come from the case's
  // own list, or from its supporting findings when no summary list exists.
  const keyObservations =
    caseData.keyObservations ??
    caseData.supportingFindings.map((f) => ({ label: f.source, detail: f.observation }));
  const redFlags = caseData.safetyScreening?.hasRedFlags ?? caseData.riskLevel === "EMERGENCY";
  const analysedIn = caseData.provenance?.analysisTime;
  const replay = caseData.pipeline?.replay;

  return (
    <div className="space-y-6 pt-4" aria-label="Clinical Assessment Report">
      <div className="flex items-center justify-between">
        <h2 className="text-body-sm font-semibold uppercase tracking-wider text-ink-muted">Clinical Assessment</h2>
        <span className="text-body-sm text-ink-muted font-normal text-right">
          {replay ? `Replay · ${replay.label}, ${replay.capturedAt} · ${analysedIn}` : analysedIn ? `Analysed in ${analysedIn}` : "Bundled example"}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug">{caseData.primaryFinding}</h3>
          <RiskIndicator level={caseData.riskLevel} variant="tint" />
        </div>
        <p className="text-body-sm text-ink-muted font-normal">
          {CONFIDENCE_LABELS[caseData.confidenceLevel]}
          {caseData.requiresHumanReview ? " · Requires clinician review" : ""}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-body-sm font-bold text-ink">Key Observations</h4>
        <div className="space-y-2.5 text-body-sm">
          {keyObservations.length === 0 && <p className="text-ink-muted">No observations recorded.</p>}
          {keyObservations.map((obs) => (
            <div key={`${obs.label}-${obs.detail}`} className="flex items-start justify-between gap-4">
              <span className="text-ink-muted shrink-0">{obs.label}</span>
              <span className="text-ink text-right">{obs.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-body-sm font-bold text-ink">Clinical Summary</h4>
        <p className="text-body-sm text-ink leading-relaxed">{caseData.clinicalSummary}</p>
      </div>

      <div className="space-y-2">
        <h4 className="text-body-sm font-bold text-ink">Safety Screen</h4>
        <div className="flex items-start gap-3 pt-0.5">
          <div
            className={
              redFlags
                ? "h-6 w-6 rounded-full bg-risk-emergency-subtle border border-risk-emergency-border flex items-center justify-center shrink-0 mt-0.5"
                : "h-6 w-6 rounded-full bg-risk-low-subtle border border-risk-low-border flex items-center justify-center shrink-0 mt-0.5"
            }
          >
            {redFlags ? (
              <AlertTriangle className="h-4 w-4 text-risk-emergency" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-risk-low" aria-hidden="true" />
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-body-sm font-semibold text-ink">
              {caseData.safetyScreening?.title ?? (redFlags ? "Emergency red flags present" : "No emergency red flags detected")}
            </p>
            <p className="text-body-sm text-ink-muted">
              {caseData.safetyScreening?.description ??
                (redFlags ? "The deterministic emergency rules matched this presentation." : "Rule-based emergency screening completed with no match.")}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Actions (2x2 Grid matching Image 1) */}
      <div className="space-y-3">
        <h4 className="text-body-sm font-bold text-ink">
          Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Approve referral */}
          <button
            type="button"
            onClick={onOpenReferralModal}
            className="h-10 px-3.5 bg-action hover:bg-action-hover text-on-action font-medium text-body-sm rounded-card flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>Approve referral</span>
          </button>

          {/* Modify assessment */}
          <button
            type="button"
            onClick={onModifyAssessment}
            className="h-10 px-3.5 bg-surface border border-rule hover:bg-hover text-ink font-medium text-body-sm rounded-card flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <span>Modify assessment</span>
          </button>

          {/* Reject assessment */}
          <button
            type="button"
            onClick={onRejectAssessment}
            className="h-10 px-3.5 bg-surface border border-rule hover:bg-hover text-ink font-medium text-body-sm rounded-card flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <XCircle className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <span>Reject assessment</span>
          </button>

          {/* Add clinician note */}
          <button
            type="button"
            onClick={() => {
              if (onAddNote) onAddNote();
              else setShowNoteInput((v) => !v);
            }}
            className="h-10 px-3.5 bg-surface border border-rule hover:bg-hover text-ink font-medium text-body-sm rounded-card flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileEdit className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <span>Add clinician note</span>
          </button>
        </div>

        {showNoteInput && (
          <div className="pt-2 space-y-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter clinician observation or note..."
              rows={3}
              className="w-full p-2.5 text-body-sm border border-rule rounded-card bg-surface-sunken text-ink focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteInput(false)}
                className="px-2.5 py-1 text-body-sm text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Note added to clinical dossier.");
                  setShowNoteInput(false);
                  setNoteText("");
                }}
                className="px-3 py-1 text-body-sm bg-action text-on-action rounded-control font-medium hover:bg-action-hover cursor-pointer"
              >
                Save note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. Footer Timestamp */}
      <div className="pt-2 text-body-sm text-ink-muted font-normal">
        Last updated: Sep 7, 2025, 10:12 AM
      </div>
    </div>
  );
}
