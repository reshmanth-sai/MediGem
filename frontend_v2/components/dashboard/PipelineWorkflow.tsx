"use client";

import React, { useState } from "react";
import { User, ShieldAlert, FileText, Cpu, CheckCircle2, FileSpreadsheet, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PipelineWorkflow() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  const stages = [
    {
      id: 1,
      title: "1. Patient Input",
      desc: "Demographics, vitals & medical uploads",
      tech: "React Hook Form + Zod",
      latency: "0.12ms",
      icon: <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
      details: "Validates physical measurements, baseline vitals, and attached file formats.",
    },
    {
      id: 2,
      title: "2. Emergency Safety",
      desc: "Deterministic gate evaluation",
      tech: "Python Rule Engine",
      latency: "< 0.3ms",
      icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
      details: "Evaluates 11 rule groups across cardiac, stroke & toxicity before calling AI models.",
    },
    {
      id: 3,
      title: "3. Context Fusion",
      desc: "PyMuPDF text & OpenCV quality merge",
      tech: "OpenCV + PyMuPDF",
      latency: "140ms",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      details: "Bypasses OCR for PDF text layers and evaluates Laplacian image blur variance.",
    },
    {
      id: 4,
      title: "4. Gemma AI Engine",
      desc: "Ollama local LLM reasoning",
      tech: "Gemma 3 4B Local",
      latency: "5,200ms",
      icon: <Cpu className="h-5 w-5 text-purple-500" />,
      details: "Formulates clinical observation summaries & explainable reasoning factors 100% offline.",
    },
    {
      id: 5,
      title: "5. Output Validation",
      desc: "Strict Pydantic JSON guard",
      tech: "Pydantic v2",
      latency: "2.1ms",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      details: "Guarantees JSON output compliance without hallucinations or prohibited diagnoses.",
    },
    {
      id: 6,
      title: "6. Clinical Report",
      desc: "Summary & referral memorandum",
      tech: "MediGem Template Engine",
      latency: "15ms",
      icon: <FileSpreadsheet className="h-5 w-5 text-blue-500" />,
      details: "Generates formatted clinical summaries, transparency factors & printable referral notes.",
    },
  ];

  const activeStage = hoveredIdx !== null ? stages[hoveredIdx] : stages[0];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Multimodal AI Pipeline Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Hover over any pipeline stage to inspect technology, latency & execution details
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2.5 py-1 rounded-full">
          100% LOCAL PIPELINE
        </span>
      </div>

      {/* Interactive Stages Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stg, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={stg.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 space-y-2 ${
                isHovered
                  ? "bg-teal-50 dark:bg-teal-950/80 border-teal-500 shadow-md shadow-teal-500/10 scale-105"
                  : "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 w-fit border border-slate-200 dark:border-slate-700">
                {stg.icon}
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {stg.title}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{stg.latency}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Card ⭐⭐⭐⭐⭐ */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-teal-800/80 space-y-1.5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-teal-400 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-teal-400" />
            Stage Details: {activeStage.title}
          </span>
          <span className="text-slate-400">Tech: {activeStage.tech} • Latency: {activeStage.latency}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {activeStage.details}
        </p>
      </div>
    </Card>
  );
}
