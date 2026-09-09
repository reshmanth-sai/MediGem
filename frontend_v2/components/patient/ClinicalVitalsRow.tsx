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
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Vital Signs</h2>
        <span className="text-xs text-slate-400 font-normal">Today, 10:12 AM</span>
      </div>

      {/* 6 Clean Columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-1 pb-4">
        {/* Blood Pressure */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">
                150/90
              </span>
              <span className="text-xs font-semibold text-red-600 ml-1">
                mmHg
              </span>
            </div>
            <div className="text-xs font-semibold text-red-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>Elevated</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 mt-3 font-normal">Blood Pressure</span>
        </div>

        {/* Pulse */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              88
            </span>
            <span className="text-xs text-slate-500 ml-1">
              bpm
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-6 font-normal">Pulse</span>
        </div>

        {/* Temperature */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              37.2
            </span>
            <span className="text-xs text-slate-500 ml-1">
              °C
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-6 font-normal">Temperature</span>
        </div>

        {/* SpO2 */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              96%
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-6 font-normal">SpO2</span>
        </div>

        {/* Respiratory Rate */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              20
            </span>
            <span className="text-xs text-slate-500 ml-1">
              /min
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-6 font-normal">Respiratory Rate</span>
        </div>

        {/* Weight */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {caseData.weightKg || 58}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              kg
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-6 font-normal">Weight</span>
        </div>
      </div>
    </div>
  );
}
