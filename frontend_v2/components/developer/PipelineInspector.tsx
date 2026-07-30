"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Terminal, Cpu } from "lucide-react";
import { Card } from "@/components/ui/Card";

const PIPELINE_STAGES = [
  { id: 1, name: "1. Patient Input Processing", status: "VALIDATED", latency: "0.12ms", details: "Pydantic v2 patient data validation" },
  { id: 2, name: "2. Emergency Safety Engine", status: "INTERCEPTED (<0.3ms)", latency: "0.28ms", details: "Evaluated 11 rule groups & 12 synonym groups" },
  { id: 3, name: "3. PyMuPDF OCR & Image Blur", status: "PROVENANCE HIGH", latency: "140ms", details: "Extracted PDF text layer & OpenCV blur score" },
  { id: 4, name: "4. Context Fusion Engine", status: "MERGED", latency: "8.5ms", details: "Merged vitals, symptoms & document extractions" },
  { id: 5, name: "5. System Prompt Composer", status: "COMPOSED", latency: "1.2ms", details: "Formulated clinical instruction context" },
  { id: 6, name: "6. Gemma 3 4B Local LLM", status: "INFERRED", latency: "5200ms", details: "Ollama local edge reasoning execution" },
  { id: 7, name: "7. Pydantic Output Guard", status: "PASSED", latency: "2.1ms", details: "Enforced JSON output schema contract" },
  { id: 8, name: "8. Clinical Report Builder", status: "GENERATED", latency: "15ms", details: "Built clinical summary & referral memorandum" },
];

export function PipelineInspector() {
  const [selectedStage, setSelectedStage] = useState(PIPELINE_STAGES[0]);

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="h-4 w-4 text-teal-600" />
          <span>8-Stage Interactive AI Pipeline Inspector</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono">TOTAL LATENCY: 5.36s</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          {PIPELINE_STAGES.map((stg) => (
            <div
              key={stg.id}
              onClick={() => setSelectedStage(stg)}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                selectedStage.id === stg.id
                  ? "bg-teal-50 dark:bg-teal-950 border-teal-600 font-bold"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <span className="truncate">{stg.name}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </div>
          ))}
        </div>

        <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-teal-400 font-bold">{selectedStage.name}</span>
            <span className="text-slate-400 text-[10px]">{selectedStage.latency}</span>
          </div>
          <p className="text-slate-300">{selectedStage.details}</p>
          <div className="p-2 rounded bg-slate-800 text-[11px] text-teal-300">
            Status: {selectedStage.status}
          </div>
        </div>
      </div>
    </Card>
  );
}
