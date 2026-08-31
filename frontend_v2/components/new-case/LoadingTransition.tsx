"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { H3, BodySm, Label } from "@/components/ui/Typography";

const LOADING_STAGES = [
  "Preparing patient clinical context",
  "Checking emergency indicators",
  "Organising multimodal file inputs",
  "Running local Gemma 3 4B reasoning",
  "Validating the output safety contract",
  "Building the clinical referral summary",
];

export function LoadingTransition({ onComplete }: { onComplete?: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const isLastStage = activeIdx >= LOADING_STAGES.length - 1;

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // One timer per stage, scheduled from an effect rather than from inside a
  // setState updater, so the completion callback fires exactly once.
  useEffect(() => {
    if (isLastStage) {
      if (!onCompleteRef.current) return;
      const done = setTimeout(() => onCompleteRef.current?.(), 800);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setActiveIdx((prev) => prev + 1), 900);
    return () => clearTimeout(next);
  }, [activeIdx, isLastStage]);

  return (
    <Card className="max-w-md mx-auto py-10 px-6 text-center space-y-6">
      <span className="mx-auto w-14 h-14 rounded-full bg-action-subtle border border-rule flex items-center justify-center text-action">
        <Loader2 className="h-8 w-8 motion-safe:animate-spin" aria-hidden="true" />
      </span>

      <div className="space-y-1">
        <H3>Running clinical analysis</H3>
        <BodySm className="text-ink-muted">
          The local Gemma 3 4B engine is reasoning over the patient context.
        </BodySm>
      </div>

      <ol
        aria-live="polite"
        className="space-y-2 text-left bg-surface-raised p-4 rounded-card border border-rule list-none m-0"
      >
        {LOADING_STAGES.map((stg, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <li
              key={stg}
              className={`flex items-center gap-3 text-body-sm p-1.5 rounded-control ${
                isCurrent
                  ? "font-semibold text-action bg-action-subtle"
                  : isDone
                  ? "text-ink-muted"
                  : "text-ink-disabled"
              }`}
            >
              {isDone ? (
                <CheckCircle2
                  className="h-4 w-4 text-risk-low shrink-0"
                  aria-hidden="true"
                />
              ) : isCurrent ? (
                <Loader2
                  className="h-4 w-4 text-action motion-safe:animate-spin shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="h-4 w-4 rounded-full border border-rule-strong shrink-0 inline-block"
                  aria-hidden="true"
                />
              )}
              <span>{stg}</span>
              <Label as="span" className="ml-auto shrink-0">
                {isDone ? "Done" : isCurrent ? "Running" : "Waiting"}
              </Label>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
