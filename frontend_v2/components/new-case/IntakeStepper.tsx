"use client";

import React from "react";
import { Check, Clock, ShieldCheck } from "lucide-react";

interface IntakeStepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  progressPct: number;
}

export function IntakeStepper({ currentStep, setCurrentStep, progressPct }: IntakeStepperProps) {
  const steps = [
    { num: 1, label: "Patient Details", desc: "Demographics & Vitals" },
    { num: 2, label: "Presenting Symptoms", desc: "Symptoms & Onset" },
    { num: 3, label: "Medical History", desc: "Illnesses & Meds" },
    { num: 4, label: "Clinical Uploads", desc: "ECG, Labs & Scans" },
    { num: 5, label: "Review & AI Reasoning", desc: "Validation & Pipeline" },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/95 border border-slate-800 p-4 shadow-xl space-y-3">
      {/* Top Header & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-teal-950 text-teal-300 border border-teal-500/30">
            GUIDED CLINICAL INTAKE
          </span>
          <span className="text-xs font-mono text-slate-400 font-medium">
            Step {currentStep} of 5 • <span className="text-teal-300 font-bold">{progressPct}% Complete</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-teal-400" /> ~2 mins remaining
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% Offline Edge
          </span>
        </div>
      </div>

      {/* Modern Stepper Timeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {steps.map((s) => {
          const isCompleted = currentStep > s.num;
          const isActive = currentStep === s.num;
          const isClickable = isCompleted;

          return (
            <div
              key={s.num}
              onClick={() => isClickable && setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                isClickable ? "cursor-pointer hover:border-teal-500/60" : "cursor-default"
              } ${
                isActive
                  ? "bg-teal-950/60 border-teal-500 text-white shadow-md shadow-teal-950/40"
                  : isCompleted
                  ? "bg-slate-950 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold uppercase opacity-80">
                  Step 0{s.num}
                </span>
                {isCompleted ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                ) : (
                  <span
                    className={`h-4 w-4 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                      isActive ? "bg-teal-400 text-slate-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.num}
                  </span>
                )}
              </div>
              <p className="font-bold text-xs truncate">{s.label}</p>
              <p className="text-[10px] text-slate-400 truncate opacity-90">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
