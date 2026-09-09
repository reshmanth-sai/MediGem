"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Stethoscope } from "lucide-react";
import { H3, BodySm, Label } from "@/components/ui/Typography";

export interface AIExecutionPipelineProps {
  onComplete: () => void;
}

const CLINICAL_STAGES = [
  {
    name: "Preparing assessment",
    desc: "Validating demographics and baseline physiological parameters",
  },
  {
    name: "Checking clinical inputs",
    desc: "Reviewing symptoms, vital ranges, and attached documents",
  },
  {
    name: "Running safety screening",
    desc: "Evaluating 11 deterministic emergency criteria",
  },
  {
    name: "Preparing report",
    desc: "Structuring observations, findings, and referral recommendations",
  },
];

export function AIExecutionPipeline({ onComplete }: AIExecutionPipelineProps) {
  const [activeStage, setActiveStage] = useState(0);
  const isLastStage = activeStage >= CLINICAL_STAGES.length - 1;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (isLastStage) {
      const done = setTimeout(() => onCompleteRef.current(), 600);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setActiveStage((prev) => prev + 1), 700);
    return () => clearTimeout(next);
  }, [activeStage, isLastStage]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pipeline-heading"
      className="fixed inset-0 z-50 bg-ground/80 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-control bg-surface border border-rule p-6 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-rule">
          <span className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
            <Stethoscope className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="space-y-0.5">
            <H3 id="pipeline-heading">Preparing Clinical Assessment</H3>
            <BodySm className="text-ink-muted">
              Evaluating parameters against offline clinical protocols
            </BodySm>
          </div>
        </div>

        <ol
          aria-live="polite"
          className="space-y-2.5 list-none p-0 m-0"
        >
          {CLINICAL_STAGES.map((stg, idx) => {
            const isFinished = idx < activeStage;
            const isCurrent = idx === activeStage;
            const statusLabel = isFinished
              ? "Completed"
              : isCurrent
              ? "In progress"
              : "Pending";

            return (
              <li
                key={stg.name}
                className={`p-3 rounded-control border flex items-center gap-3 transition-colors ${
                  isCurrent
                    ? "bg-action-subtle border-action text-ink"
                    : isFinished
                    ? "bg-surface-raised border-rule text-ink"
                    : "bg-surface border-rule text-ink-muted"
                }`}
              >
                <span className="shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-risk-low" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 text-action motion-safe:animate-spin" aria-hidden="true" />
                  ) : (
                    <span
                      className="h-5 w-5 rounded-full border border-rule-strong flex items-center justify-center text-label text-ink-muted font-mono"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                  )}
                </span>
                <span className="space-y-0.5 min-w-0 flex-1">
                  <span className="block text-body-sm font-semibold text-ink">
                    {stg.name}
                  </span>
                  <span className="block text-body-sm text-ink-muted">
                    {stg.desc}
                  </span>
                </span>
                <Label as="span" className="shrink-0 normal-case font-mono">
                  {statusLabel}
                </Label>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
