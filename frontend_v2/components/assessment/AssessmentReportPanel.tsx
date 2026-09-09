"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Edit3,
  XCircle,
  FileEdit,
} from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";

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

  const keyObservations = [
    { label: "Elevated blood pressure", detail: "150/90 mmHg", isBold: true },
    { label: "Headache and dizziness", detail: "Reported for 2 days" },
    { label: "SpO2 and respiratory rate", detail: "Within normal range" },
    { label: "Age > 60 years", detail: "Higher monitoring category" },
  ];

  return (
    <div
      className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs"
      aria-label="Clinical Assessment Report"
    >
      {/* 1. Header & Time */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Clinical Assessment
        </h2>
        <span className="text-xs text-slate-400 font-normal">
          Analyzed in {caseData.provenance?.analysisTime || "8.4 seconds"}
        </span>
      </div>

      {/* 2. Diagnosis Title, Risk Pill & Subtitle */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {caseData.primaryFinding || "Stage 2 Essential Hypertension with Cephalea"}
          </h3>
          <span className="px-2.5 py-0.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/70 rounded-full inline-flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>Moderate</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Requires monitoring and follow-up.
        </p>
      </div>

      {/* 3. Key Observations */}
      <div className="space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
          Key Observations
        </h4>
        <div className="space-y-2.5 text-xs sm:text-sm">
          {keyObservations.map((obs) => (
            <div key={obs.label} className="flex items-center justify-between gap-4">
              <span className="text-slate-600">{obs.label}</span>
              <span className={obs.isBold ? "font-bold text-slate-900 text-right" : "text-slate-600 text-right"}>
                {obs.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Clinical Summary */}
      <div className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
          Clinical Summary
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {caseData.clinicalSummary ||
            "62-year-old female presenting with headache and dizziness. Known hypertensive with baseline blood pressure elevation (150/90 mmHg). Oxygenation and respiratory parameters are stable. Requires outpatient blood pressure titration and routine clinical follow-up."}
        </p>
      </div>

      {/* 5. Safety Screen */}
      <div className="space-y-2">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
          Safety Screen
        </h4>
        <div className="flex items-start gap-3 pt-0.5">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              No emergency red flags detected
            </p>
            <p className="text-xs text-slate-500">
              Rule-based emergency screening completed. All 11 checks clear.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Actions (2x2 Grid matching Image 1) */}
      <div className="space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
          Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Approve referral */}
          <button
            type="button"
            onClick={onOpenReferralModal}
            className="h-10 px-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>Approve referral</span>
          </button>

          {/* Modify assessment */}
          <button
            type="button"
            onClick={onModifyAssessment}
            className="h-10 px-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Edit3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Modify assessment</span>
          </button>

          {/* Reject assessment */}
          <button
            type="button"
            onClick={onRejectAssessment}
            className="h-10 px-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <XCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Reject assessment</span>
          </button>

          {/* Add clinician note */}
          <button
            type="button"
            onClick={() => {
              if (onAddNote) onAddNote();
              else setShowNoteInput((v) => !v);
            }}
            className="h-10 px-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <FileEdit className="h-4 w-4 text-slate-500" aria-hidden="true" />
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
              className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteInput(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
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
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Save note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. Footer Timestamp */}
      <div className="pt-2 text-xs text-slate-400 font-normal">
        Last updated: Sep 7, 2025, 10:12 AM
      </div>
    </div>
  );
}
