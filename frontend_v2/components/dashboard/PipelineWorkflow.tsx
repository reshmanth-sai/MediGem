"use client";

import React, { useState } from "react";
import { User, ShieldAlert, FileText, Cpu, CheckCircle2, FileSpreadsheet, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { H2, BodySm, Label, Data } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function PipelineWorkflow() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

  const stages = [
    {
      id: 1,
      title: "1. Patient Input",
      desc: "Demographics, vitals & medical uploads",
      tech: "React Hook Form + Zod",
      latency: "0.12ms",
      icon: <User className="h-5 w-5 text-action" aria-hidden="true" />,
      details: "Validates physical measurements, baseline vitals, and attached file formats.",
    },
    {
      id: 2,
      title: "2. Emergency Safety",
      desc: "Deterministic gate evaluation",
      tech: "Python Rule Engine",
      latency: "< 0.3ms",
      icon: <ShieldAlert className="h-5 w-5 text-risk-emergency" aria-hidden="true" />,
      details: "Evaluates 11 rule groups across cardiac, stroke and toxicity before calling AI models.",
    },
    {
      id: 3,
      title: "3. Context Fusion",
      desc: "PyMuPDF text & OpenCV quality merge",
      tech: "OpenCV + PyMuPDF",
      latency: "140ms",
      icon: <FileText className="h-5 w-5 text-risk-moderate" aria-hidden="true" />,
      details: "Bypasses OCR for PDF text layers and evaluates Laplacian image blur variance.",
    },
    {
      id: 4,
      title: "4. Gemma AI Engine",
      desc: "Ollama local LLM reasoning",
      tech: "Gemma 3 4B Local",
      latency: "5,200ms",
      icon: <Cpu className="h-5 w-5 text-ink-muted" aria-hidden="true" />,
      details: "Formulates clinical observation summaries and explainable reasoning factors 100% offline.",
    },
    {
      id: 5,
      title: "5. Output Validation",
      desc: "Strict Pydantic JSON guard",
      tech: "Pydantic v2",
      latency: "2.1ms",
      icon: <CheckCircle2 className="h-5 w-5 text-risk-low" aria-hidden="true" />,
      details: "Guarantees JSON output compliance without hallucinations or prohibited diagnoses.",
    },
    {
      id: 6,
      title: "6. Clinical Report",
      desc: "Summary & referral memorandum",
      tech: "MediGem Template Engine",
      latency: "15ms",
      icon: <FileSpreadsheet className="h-5 w-5 text-action" aria-hidden="true" />,
      details: "Generates formatted clinical summaries, transparency factors and printable referral notes.",
    },
  ];

  const activeStage = hoveredIdx !== null ? stages[hoveredIdx] : stages[0];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-body font-bold text-ink tracking-tight">
            Multimodal AI Pipeline Architecture
          </h2>
          <BodySm className="text-ink-muted">
            Hover over any pipeline stage to inspect technology, latency and execution details
          </BodySm>
        </div>
        <span className="font-mono font-bold bg-action-subtle text-action px-2.5 py-1 rounded-chip text-label">
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
              className={cn(
                "p-3.5 rounded-card border text-left cursor-pointer transition-colors duration-300 space-y-2",
                isHovered
                  ? "bg-action-subtle border-action"
                  : "bg-surface-raised border-rule hover:border-rule-strong"
              )}
            >
              <div className="p-2 rounded-control bg-surface w-fit border border-rule">
                {stg.icon}
              </div>
              <div>
                <p className="text-body-sm font-bold text-ink truncate">
                  {stg.title}
                </p>
                <Data className="text-ink-muted mt-0.5 text-body-sm">{stg.latency}</Data>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Panel */}
      <div className="p-4 rounded-card bg-surface-raised text-ink border border-rule-strong space-y-1.5">
        <div className="flex items-center justify-between font-mono text-body-sm">
          <span className="font-bold text-action flex items-center gap-1.5">
            <Info className="h-4 w-4 text-action" aria-hidden="true" />
            Stage Details: {activeStage.title}
          </span>
          <span className="text-ink-muted">Tech: {activeStage.tech}. Latency: {activeStage.latency}</span>
        </div>
        <BodySm className="text-ink-muted leading-relaxed font-normal">
          {activeStage.details}
        </BodySm>
      </div>
    </Card>
  );
}
