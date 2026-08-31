"use client";

import React from "react";
import { Clock, MapPin, UserCheck } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { BodySm, Data, H1, Label } from "@/components/ui/Typography";

interface StickyPatientSnapshotProps {
  caseData: ClinicalCaseData;
}

/**
 * Persistent patient header for the results route: who this is, where they were
 * seen, what they presented with, and the assessed risk.
 *
 * Risk is rendered only through RiskIndicator, which ships shape, text label
 * and colour together. The hand-rolled RiskBadge that used to sit here paired
 * an emoji with a hardcoded palette and conveyed level partly by hue alone.
 */
export function StickyPatientSnapshot({ caseData }: StickyPatientSnapshotProps) {
  const initials = caseData.patientName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <header className="sticky top-0 z-30 space-y-3 rounded-card border border-rule bg-surface p-4">
      <div className="flex flex-col justify-between gap-3 border-b border-rule pb-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-rule bg-surface-raised text-body-sm font-semibold text-ink-muted"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <H1>{caseData.patientName}</H1>
              <Data className="text-ink-muted">{caseData.patientId}</Data>
              <BodySm className="text-ink-muted">
                {caseData.age}y / {caseData.gender}
              </BodySm>
            </div>
            <BodySm className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {caseData.village || "Not recorded"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {caseData.arrivalTime || "Not recorded"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                Triaged by {caseData.assignedWorker || "Not recorded"}
              </span>
            </BodySm>
          </div>
        </div>

        <div className="shrink-0">
          <RiskIndicator
            level={caseData.riskLevel}
            variant="tint"
            showScore={caseData.urgencyScore}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="min-w-0 space-y-1">
          <Label>Chief complaint</Label>
          <BodySm className="truncate" title={caseData.chiefComplaint}>
            {caseData.chiefComplaint}
          </BodySm>
        </div>

        <ul className="flex flex-wrap items-center gap-2">
          {caseData.vitals.map((vital) => (
            <li
              key={vital.label}
              className="inline-flex items-center gap-1.5 rounded-chip border border-rule bg-surface-raised px-2.5 py-1"
            >
              <Label>{vital.label}</Label>
              <Data>{vital.value}</Data>
              {vital.status !== "normal" && (
                <BodySm className="text-ink-muted">
                  {vital.status === "alert" ? "Out of range" : "Borderline"}
                </BodySm>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
