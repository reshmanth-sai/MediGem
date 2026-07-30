"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, ChevronUp, Cpu, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/Typography";
import { ConfidenceDashboard } from "@/components/results/ConfidenceDashboard";
import { AiVsHumanAttention } from "@/components/results/AiVsHumanAttention";

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
    <Card className="space-y-4 bg-slate-950 text-slate-100 border border-slate-800 shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer select-none py-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-teal-400">
          <Terminal className="h-4 w-4" />
          <span>DEVELOPER & TECHNICAL MODEL INSPECTOR (OLLAMA / GEMMA 3 4B)</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono text-slate-400">
            {isOpen ? "Hide Telemetry & Attention Maps" : "Show Telemetry & Attention Maps"}
          </span>
          <button className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pt-4 border-t border-slate-800 space-y-6">
          {/* AI Model Validation Metrics */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Cpu className="h-4 w-4 text-teal-400" />
              <span>Model Execution & Validation Telemetry</span>
            </div>
            <ConfidenceDashboard />
          </div>

          {/* Attention Mapping Visualization */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Activity className="h-4 w-4 text-purple-400" />
              <span>AI vs. Human Clinician Attention Distribution</span>
            </div>
            <AiVsHumanAttention />
          </div>

          {/* JSON Metadata Payload */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-slate-400">Raw JSON Execution Payload:</p>
            <CodeBlock>{JSON.stringify(meta, null, 2)}</CodeBlock>
          </div>
        </div>
      )}
    </Card>
  );
}

