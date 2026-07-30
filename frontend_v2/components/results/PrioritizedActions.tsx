"use client";

import React, { useState } from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { HeartPulse, CheckSquare, Square, AlertCircle, Clock, UserCheck } from "lucide-react";

interface PrioritizedActionsProps {
  caseData: ClinicalCaseData;
}

export function PrioritizedActions({ caseData }: PrioritizedActionsProps) {
  const isEmergency = caseData.riskLevel === "EMERGENCY";

  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleAction = (title: string) => {
    setCompleted((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const workflowActions = [
    {
      category: "IMMEDIATE (STAT)",
      priority: "CRITICAL",
      title: isEmergency ? "STAT Emergency Escalation & Ambulance Transfer" : "Repeat Baseline 12-Lead ECG Review",
      rationale: "Rule out acute coronary syndrome / myocardial ischemia.",
      outcome: "Immediate stabilization &Cath Lab activation if ST elevation detected.",
      role: "ANM / CHO",
      color: isEmergency ? "border-l-4 border-l-rose-500 bg-rose-950/20" : "border-l-4 border-l-teal-500 bg-slate-950",
    },
    {
      category: "RECOMMENDED TODAY",
      priority: "HIGH",
      title: "Evaluate Serum Electrolytes & Thyroid Panel",
      rationale: "Identify secondary metabolic or hyperthyroid etiology.",
      outcome: "Normal electrolyte balance verified.",
      role: "Laboratory Tech",
      color: "border-l-4 border-l-amber-500 bg-slate-950",
    },
    {
      category: "ROUTINE FOLLOW-UP & MONITORING",
      priority: "ROUTINE",
      title: "Monitor Vitals Q4H & Patient Lifestyle Counseling",
      rationale: "Track vital stability over 24-hour clinic observation.",
      outcome: "Vitals remain within normal baseline limits.",
      role: "ANM Staff",
      color: "border-l-4 border-l-slate-600 bg-slate-950",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-teal-400" />
          <span>Workflow Clinical Action Center</span>
        </h3>
        <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950 border border-teal-500/30 px-2.5 py-0.5 rounded">
          {workflowActions.length} Recommended Actions
        </span>
      </div>

      <div className="space-y-3">
        {workflowActions.map((act) => {
          const isDone = completed[act.title];

          return (
            <div
              key={act.title}
              className={`p-4 rounded-xl border border-slate-800 space-y-2 transition-all ${act.color} ${
                isDone ? "opacity-60 line-through" : ""
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-bold text-slate-400 uppercase tracking-wider">{act.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Role: <strong className="text-slate-200">{act.role}</strong></span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      act.priority === "CRITICAL"
                        ? "bg-rose-500 text-slate-950"
                        : act.priority === "HIGH"
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {act.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <button
                  onClick={() => toggleAction(act.title)}
                  className="mt-0.5 text-teal-400 hover:text-teal-300 shrink-0"
                >
                  {isDone ? <CheckSquare className="h-4 w-4 text-emerald-400" /> : <Square className="h-4 w-4" />}
                </button>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-tight">{act.title}</h4>
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-400 font-mono text-[10.5px]">Rationale:</strong> {act.rationale}
                  </p>
                  <p className="text-[11px] text-teal-300/90 font-mono">
                    <strong>Expected Outcome:</strong> {act.outcome}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
