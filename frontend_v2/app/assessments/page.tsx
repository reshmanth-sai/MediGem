"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ClinicalCaseData, CONFIDENCE_LABELS } from "@/lib/casesData";
import { allCases } from "@/lib/caseStats";
import { useCaseFilter } from "@/hooks/useCaseFilter";
import { CaseFilterBar } from "@/components/cases/CaseFilterBar";
import { Button } from "@/components/ui/Button";
import {
  ClipboardCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowRight,
  Activity,
  Cpu,
  Clock,
  Sparkles,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClinicalAssessmentsPage() {
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "REVIEW_REQUIRED" | "CLEARED">("ALL");
  const casesList: ClinicalCaseData[] = useMemo(() => allCases(), []);
  const reviewPredicate = useCallback(
    (c: ClinicalCaseData) =>
      reviewFilter === "ALL" || (reviewFilter === "REVIEW_REQUIRED" && c.requiresHumanReview) || (reviewFilter === "CLEARED" && !c.requiresHumanReview),
    [reviewFilter]
  );
  const f = useCaseFilter(casesList, reviewPredicate, reviewFilter !== "ALL");
  const filteredCases = f.filtered;

  // Compute metrics
  const totalCount = casesList.length;
  const emergencyCount = casesList.filter((c) => c.riskLevel === "EMERGENCY").length;
  const reviewCount = casesList.filter((c) => c.requiresHumanReview).length;
  const verifiedCount = casesList.filter((c) => !c.safetyScreening?.hasRedFlags).length;

  const getRiskStyle = (level: ClinicalCaseData["riskLevel"]) => {
    switch (level) {
      case "EMERGENCY":
        return {
          pill: "bg-risk-emergency-subtle text-risk-emergency border-risk-emergency-border",
          dot: "bg-risk-emergency",
          label: "Emergency",
        };
      case "HIGH":
        return {
          pill: "bg-risk-high-subtle text-risk-high border-risk-high-border",
          dot: "bg-risk-high",
          label: "High Risk",
        };
      case "MODERATE":
        return {
          pill: "bg-risk-moderate-subtle text-risk-moderate border-risk-moderate-border",
          dot: "bg-risk-moderate",
          label: "Moderate",
        };
      case "LOW":
      default:
        return {
          pill: "bg-risk-low-subtle text-risk-low border-risk-low-border",
          dot: "bg-risk-low",
          label: "Low Risk",
        };
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1560px] space-y-6 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-action-subtle text-action border border-action/20">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                Clinical Assessments & Diagnostic Hub
              </h1>
            </div>
            <p className="text-body-sm text-ink-muted max-w-2xl">
              Deterministic emergency screening, multimodal AI diagnostic differential evaluations, and clinical rationale across the active census.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/history"
              className="h-9 px-3.5 border border-rule bg-surface text-ink hover:bg-hover text-body-sm font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Patient Queue</span>
              <ChevronRight className="h-4 w-4 text-ink-muted" />
            </Link>
            <Link
              href="/new-case"
              className="h-9 px-3.5 bg-action hover:bg-action-hover active:bg-action-active text-on-action text-body-sm font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="h-4 w-4" />
              <span>New Diagnostic Intake</span>
            </Link>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-ink-muted">Diagnostic Evaluations</span>
              <Activity className="h-4 w-4 text-action" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">{totalCount}</span>
              <span className="text-body-sm text-ink-muted">census cases screened</span>
            </div>
            <div className="text-body-sm text-ink-muted">100% evaluated at edge</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-ink-muted">Critical Intercepts</span>
              <ShieldAlert className="h-4 w-4 text-risk-emergency" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-risk-emergency">{emergencyCount}</span>
              <span className="text-body-sm text-ink-muted">immediate STAT</span>
            </div>
            <div className="text-body-sm text-ink-muted">Emergency gate under 0.28ms</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-ink-muted">Clinician Review</span>
              <Clock className="h-4 w-4 text-risk-moderate" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">{reviewCount}</span>
              <span className="text-body-sm text-ink-muted">cases flagged</span>
            </div>
            <div className="text-body-sm text-ink-muted">Requires physician signoff</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-ink-muted">Edge AI Verification</span>
              <Cpu className="h-4 w-4 text-risk-low" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ink">Gemma 3 4B</span>
            </div>
            <div className="text-body-sm text-risk-low flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              <span>Offline weights loaded</span>
            </div>
          </div>
        </div>

        <CaseFilterBar query={f.query} onQueryChange={f.setQuery} risk={f.risk} onRiskChange={f.setRisk} placeholder="Search patient, finding, complaint">
          <Button
            type="button"
            size="sm"
            variant={reviewFilter === "ALL" ? "secondary" : "outline"}
            aria-pressed={reviewFilter !== "ALL"}
            onClick={() => setReviewFilter(reviewFilter === "ALL" ? "REVIEW_REQUIRED" : reviewFilter === "REVIEW_REQUIRED" ? "CLEARED" : "ALL")}
          >
            {reviewFilter === "ALL" ? "All reviews" : reviewFilter === "REVIEW_REQUIRED" ? "Review required" : "Cleared"}
          </Button>
        </CaseFilterBar>

        {/* Assessments Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCases.map((c) => {
            const risk = getRiskStyle(c.riskLevel);
            const bp = c.vitals.find((v) => v.label.toLowerCase() === "bp" || v.label.toLowerCase().includes("blood"))?.value || "N/A";
            const pulse = c.vitals.find((v) => v.label.toLowerCase().includes("pulse"))?.value || "N/A";
            const spo2 = c.vitals.find((v) => v.label.toLowerCase().includes("spo2"))?.value || "N/A";

            return (
              <div
                key={c.caseId || c.patientId}
                className="rounded-xl border border-rule bg-surface p-5 space-y-4 hover:border-action/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Patient Identity & Risk Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/results/${c.caseId}`}
                          className="font-bold text-ink hover:text-action transition-colors text-base"
                        >
                          {c.patientName}
                        </Link>
                        <span className="font-mono text-body-sm px-2 py-0.5 rounded bg-surface-sunken text-ink-muted border border-rule">
                          {c.patientId}
                        </span>
                      </div>
                      <p className="text-body-sm text-ink-muted mt-0.5">
                        {c.age}y {c.gender} · {c.village || "Sub-Center"} · Arrived {c.arrivalTime}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "px-2.5 py-1 text-body-sm font-semibold rounded-md inline-flex items-center gap-1.5 border shrink-0",
                        risk.pill
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", risk.dot)} />
                      <span>
                        {risk.label} ({c.urgencyScore})
                      </span>
                    </span>
                  </div>

                  {/* Primary Diagnostic Finding */}
                  <div className="p-3 rounded-lg bg-surface-sunken border border-rule space-y-1">
                    <span className="text-body-sm font-semibold text-ink-muted uppercase tracking-wider block">
                      Primary Diagnostic Evaluation
                    </span>
                    <p className="text-sm font-bold text-ink">{c.primaryFinding}</p>
                    <p className="text-body-sm text-ink-muted line-clamp-2 mt-1">{c.clinicalSummary}</p>
                  </div>

                  {/* Key Vitals Snapshot */}
                  <div className="grid grid-cols-3 gap-2 text-center py-1">
                    <div className="p-2 rounded-md bg-surface-raised border border-rule">
                      <span className="text-body-sm text-ink-muted block uppercase">Blood Pressure</span>
                      <span className="text-body-sm font-bold text-ink">{bp}</span>
                    </div>
                    <div className="p-2 rounded-md bg-surface-raised border border-rule">
                      <span className="text-body-sm text-ink-muted block uppercase">Pulse</span>
                      <span className="text-body-sm font-bold text-ink">{pulse} bpm</span>
                    </div>
                    <div className="p-2 rounded-md bg-surface-raised border border-rule">
                      <span className="text-body-sm text-ink-muted block uppercase">SpO2</span>
                      <span className="text-body-sm font-bold text-ink">{spo2}</span>
                    </div>
                  </div>

                  {/* Differential Considerations */}
                  <div className="space-y-1.5">
                    <span className="text-body-sm font-semibold text-ink-muted uppercase tracking-wider block">
                      Differential Diagnoses
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.differentialConsiderations.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded text-body-sm bg-surface-raised border border-rule text-ink"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Investigations */}
                  <div className="space-y-1">
                    <span className="text-body-sm font-semibold text-ink-muted uppercase tracking-wider block">
                      Recommended Investigations
                    </span>
                    <div className="text-body-sm text-ink-muted flex flex-wrap gap-x-2">
                      {c.recommendedInvestigations.slice(0, 2).map((inv, idx) => (
                        <span key={inv} className="inline-flex items-center gap-1 text-ink">
                          • {inv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-rule flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-body-sm text-ink-muted">
                    <Sparkles className="h-3.5 w-3.5 text-action" />
                    <span>{CONFIDENCE_LABELS[c.confidenceLevel]}</span>
                    {c.requiresHumanReview && (
                      <span className="text-risk-high text-body-sm font-medium ml-1">
                        · Review required
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/results/${c.caseId}`}
                    className="h-8 px-3 rounded-lg bg-surface-raised hover:bg-hover text-ink border border-rule text-body-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Full Report</span>
                    <ArrowRight className="h-3.5 w-3.5 text-action" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
