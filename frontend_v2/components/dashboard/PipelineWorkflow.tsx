"use client";

import React from "react";
import { User, ShieldCheck, Database, Cpu, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PipelineWorkflow() {
  const steps = [
    { title: "1. Patient Input", desc: "Demographics & Medical Files", icon: <User className="h-5 w-5 text-teal-600" /> },
    { title: "2. Emergency Safety", desc: "Deterministic Gate (<0.3ms)", icon: <ShieldCheck className="h-5 w-5 text-red-500" /> },
    { title: "3. Context Fusion", desc: "Immutable ReasoningContext", icon: <Database className="h-5 w-5 text-amber-500" /> },
    { title: "4. Gemma AI Engine", desc: "Ollama Local Inference", icon: <Cpu className="h-5 w-5 text-purple-500" /> },
    { title: "5. Output Validation", desc: "Strict Pydantic v2 Guard", icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
    { title: "6. Clinical Report", desc: "Summary & Referral Memo", icon: <FileText className="h-5 w-5 text-blue-500" /> },
  ];

  return (
    <Card className="space-y-4 bg-slate-900 text-white border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Multimodal AI Pipeline Architecture</h2>
          <p className="text-xs text-slate-400">
            End-to-end local processing pipeline ensuring safety, speed, and transparency
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
          100% OFFLINE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((stg, idx) => (
          <div
            key={stg.title}
            className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="p-1.5 w-fit rounded bg-slate-900">{stg.icon}</div>
              <p className="text-xs font-bold text-slate-200">{stg.title}</p>
              <p className="text-[11px] text-slate-400">{stg.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="h-3.5 w-3.5 text-teal-400/60 hidden lg:block self-end mt-1" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
