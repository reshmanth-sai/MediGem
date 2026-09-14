"use client";

import React from "react";
import { ClinicalCaseData, VitalSign } from "@/lib/casesData";
import { cn } from "@/lib/utils";

/*
 * The vitals recorded for this case, and nothing else. A vital that was not
 * taken is not shown; a case with none says so.
 */

const LABELS: Record<string, string> = {
  HR: "Pulse",
  BP: "Blood pressure",
  Temp: "Temperature",
  SpO2: "SpO2",
  RR: "Respiratory rate",
};

function splitValue(v: string): { number: string; unit: string } {
  const m = v.match(/^([\d./]+)\s*(.*)$/);
  return m ? { number: m[1], unit: m[2] } : { number: v, unit: "" };
}

function Vital({ v }: { v: VitalSign }) {
  const { number, unit } = splitValue(v.value);
  const tone = v.status === "alert" ? "text-risk-emergency" : v.status === "warning" ? "text-risk-high" : "text-ink";
  return (
    <div className="space-y-1 min-w-[6rem]">
      <div className="flex items-baseline gap-1">
        <span className={cn("text-data tabular", tone)}>{number}</span>
        {unit && <span className="text-body-sm text-ink-muted">{unit}</span>}
      </div>
      {v.status !== "normal" && <p className={cn("text-body-sm font-semibold", tone)}>{v.status === "alert" ? "Out of range" : "Elevated"}</p>}
      <p className="text-body-sm text-ink-muted">{LABELS[v.label] ?? v.label}</p>
    </div>
  );
}

export function ClinicalVitalsRow({ caseData }: { caseData: ClinicalCaseData }) {
  const recorded = caseData.vitals.filter((v) => v.value && !/not recorded/i.test(v.value));
  return (
    <section aria-label="Vital signs" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-ink">Vital signs</h2>
        <span className="text-body-sm text-ink-muted">{caseData.arrivalTime}</span>
      </div>
      {recorded.length === 0 ? (
        <p className="text-body-sm text-ink-muted">No vitals were recorded at intake.</p>
      ) : (
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {recorded.map((v) => (
            <Vital key={v.label} v={v} />
          ))}
          {caseData.weightKg != null && (
            <div className="space-y-1 min-w-[6rem]">
              <div className="flex items-baseline gap-1">
                <span className="text-data tabular text-ink">{caseData.weightKg}</span>
                <span className="text-body-sm text-ink-muted">kg</span>
              </div>
              <p className="text-body-sm text-ink-muted">Weight</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
