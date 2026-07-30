"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface StageItem {
  id: string;
  name: string;
  status: "completed" | "active" | "pending";
}

const DEFAULT_STAGES: StageItem[] = [
  { id: "1", name: "Upload Complete", status: "completed" },
  { id: "2", name: "Input Processing", status: "completed" },
  { id: "3", name: "OCR Extraction", status: "completed" },
  { id: "4", name: "Context Fusion", status: "completed" },
  { id: "5", name: "Gemma Reasoning", status: "active" },
  { id: "6", name: "Output Validation", status: "pending" },
  { id: "7", name: "Safety Guard", status: "pending" },
  { id: "8", name: "Explanation Builder", status: "pending" },
  { id: "9", name: "Completed", status: "pending" },
];

export function StageTracker({ stages = DEFAULT_STAGES }: { stages?: StageItem[] }) {
  return (
    <Card className="space-y-3">
      <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
        Pipeline Execution Tracker
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {stages.map((stg) => (
          <div
            key={stg.id}
            className={`flex items-center space-x-2 p-2 rounded text-xs font-medium ${
              stg.status === "completed"
                ? "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300"
                : stg.status === "active"
                ? "bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-200 animate-pulse font-bold"
                : "bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500"
            }`}
          >
            {stg.status === "completed" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            ) : stg.status === "active" ? (
              <Loader2 className="h-3.5 w-3.5 text-teal-600 animate-spin shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="truncate">{stg.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
