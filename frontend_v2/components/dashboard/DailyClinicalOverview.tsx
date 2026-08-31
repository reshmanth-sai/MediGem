"use client";

import React from "react";
import { CheckCircle2, Cpu, Server } from "lucide-react";
import { Card, Section } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/ui/ConfidenceBadge";
import { Label, BodySm } from "@/components/ui/Typography";

const symptomTrends = [
  { label: "Chest discomfort or tightness", pct: 35 },
  { label: "High fever and rigors", pct: 25 },
  { label: "Hypertension or elevated BP", pct: 20 },
  { label: "Surgical or wound check", pct: 15 },
];

const safetyChecks = [
  "Zero deterministic safety violations",
  "11 emergency rules active and verified",
  "No cloud API dependencies",
];

export function DailyClinicalOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <Section
          heading="Today's symptom trends"
          headingAs="h3"
          headingAdornment={<Label className="normal-case">14 cases</Label>}
        >
          <div className="space-y-3">
            {symptomTrends.map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <BodySm>{s.label}</BodySm>
                  <Label className="normal-case shrink-0">{s.pct}%</Label>
                </div>
                <div className="w-full bg-surface-raised h-1.5 rounded-chip overflow-hidden">
                  <div className="h-full rounded-chip bg-action" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Card>

      <Card>
        <Section
          heading="AI calibration and safety"
          headingAs="h3"
          headingAdornment={<Label className="normal-case text-risk-low">All checks passing</Label>}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Cpu className="h-4 w-4 text-action shrink-0" aria-hidden="true" />
            <BodySm className="text-ink-muted">Average case confidence:</BodySm>
            <ConfidenceBadge level="HIGH" />
          </div>

          <ul className="space-y-1.5 pt-1">
            {safetyChecks.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-risk-low shrink-0" aria-hidden="true" />
                <BodySm>{c}</BodySm>
              </li>
            ))}
          </ul>

          <details className="pt-3 mt-2 border-t border-rule group">
            <summary className="flex items-center justify-between cursor-pointer select-none text-label text-ink-muted">
              <span>Storage and sync detail</span>
              <span className="group-open:hidden">Show</span>
              <span className="hidden group-open:inline">Hide</span>
            </summary>
            <div className="pt-3 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">Local volume</span>
                  <span className="text-ink font-semibold">14.2 GB free of 64 GB</span>
                </div>
                <div className="w-full bg-surface-raised h-2 rounded-chip overflow-hidden">
                  <div className="bg-action h-full rounded-chip" style={{ width: "22%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-ink-muted flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5" aria-hidden="true" />
                  Pending cloud sync
                </span>
                <span className="text-risk-low font-semibold">0 pending, local autonomous</span>
              </div>
            </div>
          </details>
        </Section>
      </Card>
    </div>
  );
}
