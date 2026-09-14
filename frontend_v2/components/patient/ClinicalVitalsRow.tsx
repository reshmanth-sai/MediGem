"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { ClinicalCaseData } from "@/lib/casesData";

export interface ClinicalVitalsRowProps {
  caseData: ClinicalCaseData;
}

export function ClinicalVitalsRow({ caseData }: ClinicalVitalsRowProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-ink">Vital Signs</h2>
        <span className="text-body-sm text-ink-muted font-normal">Today, 10:12 AM</span>
      </div>

      {/* Responsive wrapped layout instead of strict 6 columns to prevent overlap */}
      <div className="flex flex-wrap gap-x-8 gap-y-6 pt-1 pb-4">
        {/* Blood Pressure */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-risk-emergency tracking-tight">
                150/90
              </span>
              <span className="text-body-sm font-semibold text-risk-emergency ml-1">
                mmHg
              </span>
            </div>
            <div className="text-body-sm font-semibold text-risk-emergency flex items-center gap-0.5 mt-0.5">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>Elevated</span>
            </div>
          </div>
          <span className="text-body-sm text-ink-muted mt-3 font-normal">Blood Pressure</span>
        </div>

        {/* Pulse */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              88
            </span>
            <span className="text-body-sm text-ink-muted ml-1">
              bpm
            </span>
          </div>
          <span className="text-body-sm text-ink-muted mt-6 font-normal">Pulse</span>
        </div>

        {/* Temperature */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              37.2
            </span>
            <span className="text-body-sm text-ink-muted ml-1">
              °C
            </span>
          </div>
          <span className="text-body-sm text-ink-muted mt-6 font-normal">Temperature</span>
        </div>

        {/* SpO2 */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              96%
            </span>
          </div>
          <span className="text-body-sm text-ink-muted mt-6 font-normal">SpO2</span>
        </div>

        {/* Respiratory Rate */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              20
            </span>
            <span className="text-body-sm text-ink-muted ml-1">
              /min
            </span>
          </div>
          <span className="text-body-sm text-ink-muted mt-6 font-normal">Respiratory Rate</span>
        </div>

        {/* Weight */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {caseData.weightKg || 58}
            </span>
            <span className="text-body-sm text-ink-muted ml-1">
              kg
            </span>
          </div>
          <span className="text-body-sm text-ink-muted mt-6 font-normal">Weight</span>
        </div>
      </div>
    </div>
  );
}
