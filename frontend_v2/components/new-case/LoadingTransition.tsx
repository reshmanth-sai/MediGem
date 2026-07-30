"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

const LOADING_STAGES = [
  "Preparing Patient Clinical Context",
  "Checking Emergency Indicators (< 0.3ms)",
  "Organizing Multimodal File Inputs",
  "Executing Local Gemma 3 4B Reasoning",
  "Validating Output Safety Contract",
  "Building Clinical Referral Summary",
];

export function LoadingTransition({ onComplete }: { onComplete?: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <Card className="max-w-md mx-auto py-10 px-6 text-center space-y-6">
      <div className="mx-auto w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Executing Clinical AI Analysis
        </h3>
        <p className="text-xs text-slate-500">
          Local Ollama Gemma 3 4B engine is reasoning over patient context...
        </p>
      </div>

      <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        {LOADING_STAGES.map((stg, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={stg}
              className={`flex items-center space-x-3 text-xs p-1.5 rounded transition-colors ${
                isCurrent
                  ? "font-bold text-teal-600 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/60"
                  : isDone
                  ? "text-slate-500 line-through"
                  : "text-slate-400 opacity-50"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-teal-600 animate-spin shrink-0" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 inline-block" />
              )}
              <span className="truncate">{stg}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
