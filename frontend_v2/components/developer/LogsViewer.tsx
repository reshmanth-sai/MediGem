"use client";

import React, { useState } from "react";
import { Terminal, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/Typography";

export function LogsViewer() {
  const [filter, setFilter] = useState("");

  const logs = [
    "[12:00:01] INFO  EmergencyEngine initialized with 11 rules and 12 synonym groups.",
    "[12:00:01] WARN  [EMG-028B62BB] EMERGENCY DETECTED! Rule=R-CARDIAC-01, Category=CARDIAC, Duration=0.09ms",
    "[12:00:02] INFO  PyMuPDF extracted 100% text layer from Lab_Report_CBC.pdf",
    "[12:00:02] INFO  OpenCV Laplacian blur score variance: 245.2 (PASS)",
    "[12:00:03] INFO  Executing Ollama local inference with model gemma3:4b",
    "[12:00:08] INFO  Pydantic v2 schema validation passed cleanly in 2.1ms",
  ];

  const filtered = logs.filter((l) => l.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Card className="space-y-3 bg-slate-900 text-white border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-400">
          <Terminal className="h-4 w-4" />
          <span>REAL-TIME SYSTEM LOGS & TELEMETRY</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs..."
            className="pl-7 pr-2 py-1 text-[11px] bg-slate-800 border border-slate-700 rounded focus:outline-none text-white"
          />
        </div>
      </div>

      <CodeBlock>{filtered.join("\n")}</CodeBlock>
    </Card>
  );
}
