"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  label: string;
  description: string;
}

export const INTAKE_STEPS: StepItem[] = [
  { id: 1, label: "Patient Details", description: "Demographics & Vitals" },
  { id: 2, label: "Symptoms", description: "Chief Complaint & Duration" },
  { id: 3, label: "Medical History", description: "Illnesses, Meds & Allergies" },
  { id: 4, label: "Medical Uploads", description: "Files, ECG & Reports" },
  { id: 5, label: "Review Case", description: "Validation & Recap" },
  { id: 6, label: "AI Analysis", description: "Execution & Results" },
];

export function IntakeStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px]">
        {INTAKE_STEPS.map((stg, idx) => {
          const isCompleted = stg.id < currentStep;
          const isCurrent = stg.id === currentStep;

          return (
            <React.Fragment key={stg.id}>
              <div
                onClick={() => isCompleted && onStepClick && onStepClick(stg.id)}
                className={cn(
                  "flex items-center space-x-3 cursor-pointer select-none transition-colors",
                  isCompleted && "hover:opacity-80"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isCompleted && "bg-teal-600 text-white",
                    isCurrent && "bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-950",
                    !isCompleted && !isCurrent && "bg-slate-100 text-slate-400 dark:bg-slate-800"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stg.id}
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold truncate",
                      isCurrent && "text-teal-600 dark:text-teal-400",
                      isCompleted && "text-slate-900 dark:text-white",
                      !isCompleted && !isCurrent && "text-slate-400"
                    )}
                  >
                    {stg.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{stg.description}</p>
                </div>
              </div>

              {idx < INTAKE_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3 transition-colors",
                    stg.id < currentStep ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-800"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
