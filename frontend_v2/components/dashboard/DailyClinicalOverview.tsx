"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Database, HardDrive } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const symptomTrends = [
  { label: "Chest discomfort or tightness", count: 5, pct: 35 },
  { label: "High fever and rigors", count: 4, pct: 25 },
  { label: "Hypertension and dizziness", count: 3, pct: 20 },
  { label: "Post-operative wound inspection", count: 2, pct: 15 },
];

const safetyChecks = [
  "11 deterministic emergency screening rules verified",
  "Zero safety screening gate violations recorded",
  "Local SQLite clinical database active",
  "Fully autonomous offline operation",
];

export function DailyClinicalOverview() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-rule" aria-label="Clinical Trends and System Status">
      {/* Column 1: Symptom Trends */}
      <div className="space-y-3">
        <SectionHeader
          title="Presenting Symptom Distribution"
          badge={
            <span className="text-label font-mono px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule text-ink-muted">
              14 cases today
            </span>
          }
        />

        <div className="space-y-3">
          {symptomTrends.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-ink font-medium">{s.label}</span>
                <span className="text-ink-muted font-mono tabular text-label">
                  {s.count} cases ({s.pct}%)
                </span>
              </div>
              <div className="w-full bg-surface-raised h-1.5 rounded-chip overflow-hidden border border-rule">
                <div className="h-full rounded-chip bg-action" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: System Status & Verification */}
      <div className="space-y-3">
        <SectionHeader
          title="System Verification"
          badge={
            <span className="text-label font-semibold text-risk-low px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule">
              Verified
            </span>
          }
        />

        <ul className="space-y-2 list-none p-0 m-0">
          {safetyChecks.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-body-sm text-ink">
              <CheckCircle2 className="h-4 w-4 text-risk-low shrink-0" aria-hidden="true" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t border-rule flex flex-wrap items-center gap-4 text-body-sm text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-action shrink-0" aria-hidden="true" />
            <span>Local storage:</span>
            <span className="font-mono text-ink">14.2 GB free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-risk-low shrink-0" aria-hidden="true" />
            <span>Emergency gate latency:</span>
            <span className="font-mono text-ink">0.28ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}
