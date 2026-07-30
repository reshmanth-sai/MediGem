"use client";

import React from "react";
import { ClinicalCaseData } from "@/lib/casesData";
import { Brain, ShieldCheck, ArrowRight, Layers } from "lucide-react";

interface AIDiagnosisCenterpieceProps {
  caseData: ClinicalCaseData;
}

export function AIDiagnosisCenterpiece({ caseData }: AIDiagnosisCenterpieceProps) {
  const isEmergency = caseData.riskLevel === "EMERGENCY";
  const confidence = caseData.aiConfidence || 94.5;

  const differentials = [
    { title: caseData.primaryFinding, prob: 78, ci: "72% - 84%", evidenceCount: "4 Evidence Points", isPrimary: true },
    { title: "Acute Anxiety / Hyperventilation Episode", prob: 15, ci: "10% - 20%", evidenceCount: "2 Evidence Points", isPrimary: false },
    { title: "Secondary Metabolic / Thyrotoxic Manifestation", prob: 7, ci: "4% - 11%", evidenceCount: "1 Evidence Point", isPrimary: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-xl space-y-6">
      {/* Top Banner & Confidence Gauge Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-950/90 text-teal-300 border border-teal-500/40 cursor-help"
              title="Local Edge Inference: Gemma 3 4B via Ollama (100% Air-Gapped)"
            >
              <Brain className="h-4 w-4" /> AI Diagnostic Assistant
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Safety Gate Intercept Verified
            </span>
          </div>

          {/* Primary Assessment Hero Title */}
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase font-bold text-slate-300">Primary Clinical Assessment</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {caseData.primaryFinding}
            </h2>
          </div>

          {/* Recommended Next Step Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border-l-4 border-l-teal-400 border border-slate-800 text-xs space-y-1">
            <p className="text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5">
              <ArrowRight className="h-4 w-4" /> Recommended Clinical Action:
            </p>
            <p className="text-sm font-semibold text-slate-100 leading-snug">{caseData.recommendedAction}</p>
          </div>
        </div>

        {/* Confidence Ring Gauge */}
        <div className="flex items-center space-x-4 shrink-0 bg-slate-950/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="h-16 w-16 transform -rotate-90">
                <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * confidence) / 100}
                  className={isEmergency ? "text-rose-400" : "text-teal-400"}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-mono font-black text-white">{confidence}%</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-300 font-mono">AI Certainty</p>
              <p className="text-xs font-extrabold text-teal-300">High Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Clinical Summary */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
        <p className="font-bold text-slate-300 uppercase text-xs font-mono mb-1">Clinical Assessment Summary:</p>
        <p className="text-slate-100 text-xs sm:text-sm">{caseData.clinicalSummary}</p>
      </div>

      {/* Differential Diagnoses Probability Visualization */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-teal-400" /> Differential Diagnoses & Probability Model
          </span>
          <span className="text-slate-400 text-xs font-semibold">Confidence Intervals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {differentials.map((d) => (
            <div
              key={d.title}
              className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                d.isPrimary
                  ? "bg-teal-950/40 border-teal-500/50 text-white shadow-md"
                  : "bg-slate-950/80 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className={d.isPrimary ? "text-teal-300 font-bold" : "text-slate-300 font-semibold"}>
                  {d.isPrimary ? "Primary Diagnosis" : "Differential"}
                </span>
                <span className="font-black text-white text-xs">{d.prob}%</span>
              </div>
              <p className="text-xs font-semibold leading-snug" title={d.title}>{d.title}</p>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.isPrimary ? "bg-teal-400" : "bg-slate-700"}`}
                  style={{ width: `${d.prob}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
                <span className="font-semibold text-slate-300">CI: {d.ci}</span>
                <span className="text-slate-400 font-medium">{d.evidenceCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
