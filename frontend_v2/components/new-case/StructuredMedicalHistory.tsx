"use client";

import React from "react";
import { MedicalHistoryData } from "./StepMedicalHistory";
import { Activity, ShieldAlert, Pill, FileText, CheckCircle2 } from "lucide-react";

interface StructuredMedicalHistoryProps {
  historyData: MedicalHistoryData;
  onChange: (field: keyof MedicalHistoryData, val: string) => void;
}

export function StructuredMedicalHistory({ historyData, onChange }: StructuredMedicalHistoryProps) {
  const commonConditions = ["Hypertension", "Type 2 Diabetes", "Asthma / COPD", "Chronic Kidney Disease", "Coronary Artery Disease"];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">Past Medical History & Medications</h2>
          <p className="text-xs text-slate-400">Document chronic illnesses, active prescription medications, and drug allergies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Known Allergies Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <span>Drug & Food Allergies</span>
          </label>
          <input
            type="text"
            value={historyData.allergies}
            onChange={(e) => onChange("allergies", e.target.value)}
            placeholder="e.g. Penicillin, Sulfa drugs, None known"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Current Medications Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-mono">
            <Pill className="h-4 w-4 text-teal-400" />
            <span>Current Active Medications</span>
          </label>
          <input
            type="text"
            value={historyData.medications}
            onChange={(e) => onChange("medications", e.target.value)}
            placeholder="e.g. Amlodipine 5mg OD, Metformin 500mg BD"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Chronic Conditions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <Activity className="h-4 w-4 text-amber-400" />
            <span>Chronic Conditions</span>
          </label>
          <input
            type="text"
            value={historyData.chronicConditions}
            onChange={(e) => onChange("chronicConditions", e.target.value)}
            placeholder="e.g. Hypertension (3 yrs), Diabetes"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Surgeries & Major Illnesses */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <FileText className="h-4 w-4 text-slate-400" />
            <span>Prior Surgeries / Hospitalizations</span>
          </label>
          <input
            type="text"
            value={historyData.surgeries}
            onChange={(e) => onChange("surgeries", e.target.value)}
            placeholder="e.g. Appendectomy (2020), None"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>
    </div>
  );
}
