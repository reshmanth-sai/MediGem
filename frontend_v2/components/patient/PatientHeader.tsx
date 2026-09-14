"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, MoreHorizontal, Edit3 } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";
import { cn } from "@/lib/utils";

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
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-action hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to queue</span>
        </Link>
      </div>

      {/* Patient Name, Badges & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {caseData.patientName}
            </h1>
            <span className="px-2.5 py-1 text-body-sm font-mono font-medium text-ink-muted bg-surface-sunken rounded-md border border-rule">
              {caseData.patientId}
            </span>
            <span
              className={cn(
                "px-2.5 py-1 text-body-sm font-medium rounded-[2px] inline-flex items-center gap-1.5 border",
                caseData.riskLevel === "EMERGENCY"
                  ? "text-risk-emergency bg-risk-emergency-subtle border-risk-emergency-border"
                  : caseData.riskLevel === "HIGH"
                  ? "text-risk-high bg-risk-high-subtle border-risk-high-border"
                  : caseData.riskLevel === "LOW"
                  ? "text-risk-low bg-risk-low-subtle border-risk-low-border"
                  : "text-risk-moderate bg-risk-moderate-subtle border-risk-moderate-border"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  caseData.riskLevel === "EMERGENCY"
                    ? "bg-risk-emergency"
                    : caseData.riskLevel === "HIGH"
                    ? "bg-risk-high"
                    : caseData.riskLevel === "LOW"
                    ? "bg-risk-low"
                    : "bg-risk-moderate"
                )}
              />
              <span>
                {caseData.riskLevel === "MODERATE" ? "Moderate" : caseData.riskLevel} ({caseData.urgencyScore || 6.4})
              </span>
            </span>
          </div>

          {/* Demographic Metadata */}
          <div className="text-body-sm text-ink-muted flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>{caseData.age} years</span>
            <span>·</span>
            <span>{caseData.gender}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <MapPin className="h-3.5 w-3.5 text-ink-subtle shrink-0" aria-hidden="true" />
              {caseData.village || "Kovilpatti, Tamil Nadu"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <Calendar className="h-3.5 w-3.5 text-ink-subtle shrink-0" aria-hidden="true" />
              Last visit: {caseData.lastVisit || "Sep 7, 2025"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-action font-medium">
              <Clock className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
              Follow-up: {caseData.followUp || "In 3 days"}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEditPatient}
            className="h-9 px-3.5 border border-rule bg-surface text-ink hover:bg-hover text-body-sm font-medium rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <span>Edit patient</span>
          </button>
          <button
            type="button"
            aria-label="More options"
            className="h-9 px-2.5 border border-rule bg-surface text-ink-muted hover:text-ink hover:bg-hover text-body-sm font-medium rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Underline Tabs Bar */}
      <nav
        role="tablist"
        aria-label="Patient workspace tabs"
        className="flex items-center gap-8 border-b border-rule pt-2"
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
              className={`-mb-px pb-3 text-body-sm font-medium transition-colors border-b-2 cursor-pointer ${
                isActive
                  ? "text-action border-action font-semibold"
                  : "text-ink-muted hover:text-ink border-transparent"
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
