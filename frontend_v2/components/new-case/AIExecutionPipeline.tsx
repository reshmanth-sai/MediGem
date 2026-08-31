"use client";

import React, { useEffect, useRef, useState } from "react";
import { Brain, CheckCircle2, Zap } from "lucide-react";
import { H3, BodySm, Label } from "@/components/ui/Typography";

export interface AIExecutionPipelineProps {
  onComplete: () => void;
}

const PIPELINE_STAGES = [
  {
    name: "Patient context validation",
    desc: "Validating demographics and baseline vital parameters",
  },
  {
    name: "Deterministic safety gate",
    desc: "Evaluating 11 emergency safety rules",
  },
  {
    name: "Multimodal context fusion",
    desc: "Parsing the document text layer and image contrast",
  },
  {
    name: "Gemma 3 4B reasoning engine",
    desc: "Running local inference on this device",
  },
  {
    name: "Output calibration and referral",
    desc: "Structuring clinical findings and the referral memorandum",
  },
];

export function AIExecutionPipeline({ onComplete }: AIExecutionPipelineProps) {
  const [activeStage, setActiveStage] = useState(0);
  const isLastStage = activeStage >= PIPELINE_STAGES.length - 1;

  // Held in a ref so a caller passing an inline callback cannot restart the
  // run by changing the effect's identity mid-pipeline.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // One timer per stage, scheduled from an effect. The advance used to live
  // inside the setState updater, which meant the completion callback was a
  // side effect of a function React is free to call zero or several times.
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
      className="fixed inset-0 z-50 bg-ground/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-xl rounded-card bg-surface border border-rule p-6 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-rule">
          <span className="p-3 rounded-card bg-action-subtle text-action border border-rule">
            <Brain className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <H3 id="pipeline-heading">Running offline clinical reasoning</H3>
            <BodySm className="text-ink-muted">
              Gemma 3 4B on the local edge pipeline
            </BodySm>
          </div>
        </div>

        <ol
          aria-live="polite"
          className="space-y-3 list-none p-0 m-0"
        >
          {PIPELINE_STAGES.map((stg, idx) => {
            const isFinished = idx < activeStage;
            const isCurrent = idx === activeStage;
            const statusLabel = isFinished
              ? "Done"
              : isCurrent
              ? "Running"
              : "Waiting";

            return (
              <li
                key={stg.name}
                className={`p-3 rounded-control border flex items-center gap-3 ${
                  isCurrent
                    ? "bg-action-subtle border-action"
                    : isFinished
                    ? "bg-surface-raised border-risk-low"
                    : "bg-surface-raised border-rule"
                }`}
              >
                <span className="shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-risk-low" aria-hidden="true" />
                  ) : isCurrent ? (
                    <Zap className="h-5 w-5 text-action" aria-hidden="true" />
                  ) : (
                    <span
                      className="h-5 w-5 rounded-full border border-rule-strong flex items-center justify-center text-body-sm text-ink-muted font-mono"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                  )}
                </span>
                <span className="space-y-0.5">
                  <span className="block text-body-sm font-semibold text-ink">
                    {stg.name}
                  </span>
                  <span className="block text-body-sm text-ink-muted">
                    {stg.desc}
                  </span>
                </span>
                <Label as="span" className="ml-auto shrink-0">
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
