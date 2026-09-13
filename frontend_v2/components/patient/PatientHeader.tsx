"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, MoreHorizontal, Edit3 } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";

export type PatientTabId = "overview" | "assessment" | "documents" | "history";

export interface PatientHeaderProps {
  caseData: ClinicalCaseData;
  activeTab: PatientTabId;
  onTabChange: (tab: PatientTabId) => void;
  onEditPatient?: () => void;
}

const TABS: Array<{ id: PatientTabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "assessment", label: "Assessment" },
  { id: "documents", label: "Documents (3)" },
  { id: "history", label: "History" },
];

export function PatientHeader({
  caseData,
  activeTab,
  onTabChange,
  onEditPatient,
}: PatientHeaderProps) {
  return (
    <header className="space-y-4">
      {/* Back to queue navigation */}
      <div>
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to queue</span>
        </Link>
      </div>

      {/* Patient Name, Badges & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {caseData.patientName}
            </h1>
            <span className="px-2.5 py-1 text-xs font-mono font-medium text-slate-600 bg-slate-100 rounded-md border border-slate-200/70">
              {caseData.patientId}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-[2px] inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>
                {caseData.riskLevel === "MODERATE" ? "Moderate" : caseData.riskLevel} ({caseData.urgencyScore || 6.4})
              </span>
            </span>
          </div>

          {/* Demographic Metadata */}
          <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>{caseData.age} years</span>
            <span>·</span>
            <span>{caseData.gender}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              {caseData.village || "Kovilpatti, Tamil Nadu"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              Last visit: {caseData.lastVisit || "Sep 7, 2025"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
              <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
              Follow-up: {caseData.followUp || "In 3 days"}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEditPatient}
            className="h-9 px-3.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Edit3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>Edit patient</span>
          </button>
          <button
            type="button"
            aria-label="More options"
            className="h-9 px-2.5 border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 text-xs sm:text-sm font-medium rounded-lg inline-flex items-center justify-center shadow-xs transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Underline Tabs Bar */}
      <nav
        role="tablist"
        aria-label="Patient workspace tabs"
        className="flex items-center gap-8 border-b border-slate-200 pt-2"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`-mb-px pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                isActive
                  ? "text-blue-600 border-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
