"use client";

import React from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

interface SamplePreset {
  id: string;
  label: string;
  caseId: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  { id: "emergency", label: "Emergency", caseId: "DEMO-ACUTE-CARDIAC" },
  { id: "hypertension", label: "Hypertension", caseId: "CASE-8901" },
  { id: "ecg", label: "12-Lead ECG", caseId: "DEMO-ECG" },
  { id: "lab", label: "CBC Lab Report", caseId: "DEMO-LAB-CBC" },
  { id: "wound", label: "Wound Care", caseId: "DEMO-WOUND" },
  { id: "prescription", label: "Prescription", caseId: "DEMO-PRESCRIPTION" },
];

export function TodaysClinicalWork() {
  return (
    <section className="space-y-4 pb-4 border-b border-rule" aria-label="Today's Clinical Work">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-h1 font-bold text-ink tracking-tight">
            Today&apos;s Clinical Work
          </h1>
          <p className="text-body-sm text-ink-muted">
            Primary Health Sub-Center, Rampur · Shift Active
          </p>
        </div>

        <Link
          href="/new-case"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          <span className="inline-flex" aria-hidden="true">
            <Plus className="h-4 w-4" />
          </span>
          New Patient Intake
        </Link>
      </div>

      {/* Structured Metric Separators (No giant cards) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body py-2 border-y border-rule">
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-ink">14</span>
          <span className="text-body-sm text-ink-muted">patients</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-risk-emergency">1</span>
          <span className="text-body-sm text-ink-muted">emergency</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-risk-high">3</span>
          <span className="text-body-sm text-ink-muted">awaiting review</span>
        </div>
        <span className="text-rule-strong hidden sm:inline" aria-hidden="true">|</span>
        <div className="flex items-baseline gap-2">
          <span className="text-h2 font-bold font-mono tabular text-ink">4</span>
          <span className="text-body-sm text-ink-muted">referrals</span>
        </div>
      </div>

      {/* Compact Sample Case Switcher (Section 24) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-label uppercase tracking-wider text-ink-muted font-semibold mr-1">
          Load sample case:
        </span>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sample cases">
          {SAMPLE_PRESETS.map((preset) => (
            <Link
              key={preset.id}
              href={`/results/${preset.caseId}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-raised border border-rule text-body-sm text-ink hover:text-action hover:border-rule-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <span>{preset.label}</span>
              <ChevronRight className="h-3 w-3 text-ink-muted" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
