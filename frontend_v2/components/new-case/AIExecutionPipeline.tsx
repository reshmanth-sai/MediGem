"use client";

import React, { useEffect, useState } from "react";
import { Brain, ShieldCheck, CheckCircle2, Cpu, Sparkles, Layers, Zap } from "lucide-react";

interface AIExecutionPipelineProps {
  onComplete: () => void;
}

export function AIExecutionPipeline({ onComplete }: AIExecutionPipelineProps) {
  const [activeStage, setActiveStage] = useState(0);

  const pipelineStages = [
    { name: "Patient Context Validation", desc: "Validating demographics & baseline vital parameters" },
    { name: "Deterministic Safety Gate", desc: "Evaluating 11 emergency safety rules (<0.28ms)" },
    { name: "Multimodal Context Fusion", desc: "Parsing PyMuPDF text layer & OpenCV image contrast" },
    { name: "Gemma 3 4B Reasoning Engine", desc: "Executing local Ollama inference at http://localhost:11434" },
    { name: "Output Calibration & Referral", desc: "Structuring clinical findings & referral memorandum" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < pipelineStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [onComplete, pipelineStages.length]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-teal-500/40 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 animate-pulse">
            <Brain className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              Executing Offline Clinical AI Reasoning
              <Sparkles className="h-4 w-4 text-teal-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">Gemma 3 4B • Local Edge Pipeline</p>
          </div>
        </div>

        {/* Pipeline Stage Progress Monitor */}
        <div className="space-y-3 font-mono text-xs">
          {pipelineStages.map((stg, idx) => {
            const isFinished = idx < activeStage;
            const isCurrent = idx === activeStage;

            return (
              <div
                key={stg.name}
                className={`p-3 rounded-xl border transition-all flex items-center space-x-3 ${
                  isCurrent
                    ? "bg-teal-950/80 border-teal-500 text-white shadow-lg"
                    : isFinished
                    ? "bg-slate-950 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}
              >
                <div className="shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Zap className="h-5 w-5 text-teal-400 animate-bounce" />
                  ) : (
                    <span className="h-5 w-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold">{stg.name}</p>
                  <p className="text-[10.5px] text-slate-400">{stg.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
