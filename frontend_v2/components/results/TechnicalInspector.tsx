"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/Typography";

export function TechnicalInspector() {
  const [isOpen, setIsOpen] = useState(false);

  const meta = {
    model: "gemma3:4b",
    provider: "Ollama Local Edge",
    emergencyGateLatencyMs: 0.28,
    inferenceDurationMs: 5420,
    ocrConfidence: 97.5,
    pydanticValidationScore: "1.00 (100% Valid)",
    promptVersion: "v1.0",
    reasoningVersion: "v1.0",
  };

  return (
    <Card className="space-y-3 bg-slate-900 text-white border-slate-800">
      <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-400">
          <Terminal className="h-4 w-4" />
          <span>DEVELOPER & TECHNICAL SYSTEM INSPECTOR</span>
        </div>
        <button className="text-slate-400 hover:text-white">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <p className="text-[11px] text-slate-400">
            Raw JSON system metadata and performance telemetry:
          </p>
          <CodeBlock>{JSON.stringify(meta, null, 2)}</CodeBlock>
        </div>
      )}
    </Card>
  );
}
