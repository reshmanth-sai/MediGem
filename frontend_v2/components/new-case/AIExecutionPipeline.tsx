"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Stethoscope, ShieldAlert, AlertTriangle, XCircle } from "lucide-react";
import { H3, BodySm, Label } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api-client";
import type { ClinicalCaseData } from "@/lib/casesData";

/*
 * The overlay shown while one request runs against the pipeline API.
 *
 * The API answers once, so there is no per-stage progress to show; what is
 * shown is the order the pipeline actually runs in, an honest elapsed
 * counter, and then the outcome: every stage done, the gate stopping the run
 * before the model, a degraded run, or an error with the reason.
 */

export interface AIExecutionPipelineProps {
  // onStage fires as each stage starts. A real API call never calls it, so
  // the run stays on stage 0 (Emergency gate) throughout, same as today; a
  // replay calls it at each of its own recorded stage boundaries so the
  // overlay tracks which stage is actually running instead of one opaque wait.
  run: (signal: AbortSignal, onStage?: (index: number) => void) => Promise<ClinicalCaseData>;
  onComplete: (result: ClinicalCaseData) => void;
  onCancel: () => void;
}

const STAGES = [
  { name: "Emergency gate", desc: "Deterministic rules, before any model is called" },
  { name: "Input processing", desc: "Image quality, OCR where the document has a text layer" },
  { name: "Clinical reasoning", desc: "Local model produces one structured assessment" },
  { name: "Validation", desc: "Schema and safety checks on the output" },
] as const;

type Phase = { kind: "running" } | { kind: "done"; result: ClinicalCaseData } | { kind: "error"; error: ApiError | Error };

export function AIExecutionPipeline({ run, onComplete, onCancel }: AIExecutionPipelineProps) {
  const [phase, setPhase] = useState<Phase>({ kind: "running" });
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const ac = new AbortController();
    controller.current = ac;
    setPhase({ kind: "running" });
    setElapsed(0);
    setStage(0);
    const started = performance.now();
    const tick = setInterval(() => setElapsed((performance.now() - started) / 1000), 250);

    run(ac.signal, (i) => {
      if (!ac.signal.aborted) setStage(i);
    }).then(
      (result) => {
        if (ac.signal.aborted) return;
        setPhase({ kind: "done", result });
      },
      (error: unknown) => {
        if (ac.signal.aborted) return;
        setPhase({ kind: "error", error: error instanceof Error ? error : new Error(String(error)) });
      }
    );
    return () => {
      clearInterval(tick);
      ac.abort();
    };
  }, [run, attempt]);

  const cancel = useCallback(() => {
    controller.current?.abort();
    onCancel();
  }, [onCancel]);

  const intercepted = phase.kind === "done" && phase.result.status === "EMERGENCY_INTERCEPTED";
  const done = phase.kind === "done" ? phase.result : null;
  const replay = done?.pipeline?.replay;
  const recordedS = done?.pipeline?.durationMs != null ? `${(done.pipeline.durationMs / 1000).toFixed(1)} s` : "";
  const degraded = phase.kind === "done" && phase.result.status === "DEGRADED";

  const stageState = (idx: number): "done" | "current" | "pending" | "blocked" => {
    if (phase.kind === "running") return idx < stage ? "done" : idx === stage ? "current" : "pending";
    if (phase.kind === "error") return "pending";
    if (intercepted) return idx === 0 ? "done" : "blocked";
    return "done";
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="pipeline-heading" className="fixed inset-0 z-50 bg-ground/80 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-control bg-surface border border-rule p-6 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-rule">
          <span className="p-2.5 rounded-control bg-action-subtle text-action border border-rule">
            <Stethoscope className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="space-y-0.5 min-w-0 flex-1">
            <H3 id="pipeline-heading">
              {phase.kind === "running" ? "Running assessment" : phase.kind === "error" ? "Assessment did not run" : intercepted ? "Emergency gate matched" : "Assessment ready"}
            </H3>
            <BodySm className="text-ink-muted font-mono tabular">
              {phase.kind === "running"
                ? `${elapsed.toFixed(0)} s elapsed · ${STAGES[stage].name}`
                : replay
                ? `Replay of ${replay.label}, measured ${replay.capturedAt} · recorded ${recordedS}`
                : recordedS
                ? `${recordedS} on this machine`
                : ""}
            </BodySm>
          </div>
        </div>

        <ol aria-live="polite" className="space-y-2.5 list-none p-0 m-0">
          {STAGES.map((stg, idx) => {
            const st = stageState(idx);
            return (
              <li
                key={stg.name}
                className={`p-3 rounded-control border flex items-center gap-3 ${
                  st === "current" ? "bg-action-subtle border-action text-ink" : st === "done" ? "bg-surface-raised border-rule text-ink" : st === "blocked" ? "bg-surface border-rule text-ink-muted line-through" : "bg-surface border-rule text-ink-muted"
                }`}
              >
                <span className="shrink-0">
                  {st === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-risk-low" aria-hidden="true" />
                  ) : st === "current" ? (
                    <Loader2 className="h-5 w-5 text-action motion-safe:animate-spin" aria-hidden="true" />
                  ) : st === "blocked" ? (
                    <ShieldAlert className="h-5 w-5 text-risk-emergency" aria-hidden="true" />
                  ) : (
                    <span className="h-5 w-5 rounded-full border border-rule-strong flex items-center justify-center text-label text-ink-muted font-mono" aria-hidden="true">
                      {idx + 1}
                    </span>
                  )}
                </span>
                <span className="space-y-0.5 min-w-0 flex-1">
                  <span className="block text-body-sm font-semibold">{stg.name}</span>
                  <span className="block text-body-sm text-ink-muted no-underline">{stg.desc}</span>
                </span>
                <Label as="span" className="shrink-0 normal-case font-mono">
                  {st === "done" ? "Done" : st === "current" ? "Running" : st === "blocked" ? "Not run" : "Waiting"}
                </Label>
              </li>
            );
          })}
        </ol>

        {phase.kind === "done" && intercepted && (
          <p role="status" className="text-body-sm text-risk-emergency font-semibold flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            {phase.result.pipeline?.gateSummary ?? "The emergency rules matched. Model inference was blocked and a referral was written."}
          </p>
        )}
        {phase.kind === "done" && degraded && (
          <p role="status" className="text-body-sm text-risk-high font-semibold flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            The model did not return a valid assessment. The case is marked degraded and needs direct review.
          </p>
        )}
        {phase.kind === "error" && (
          <div role="alert" className="text-body-sm space-y-1">
            <p className="text-risk-emergency font-semibold flex items-start gap-2">
              <XCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              {phase.error instanceof ApiError ? phase.error.userMessage : phase.error.message}
            </p>
            {phase.error instanceof ApiError && phase.error.kind === "network" && (
              <p className="text-ink-muted font-mono">Start it with: uvicorn backend.api.app:app --port 8000</p>
            )}
            <p className="text-ink-muted">No result was produced and nothing was saved.</p>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-rule">
          {phase.kind === "running" && (
            <Button type="button" variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          )}
          {phase.kind === "error" && (
            <>
              <Button type="button" variant="secondary" onClick={cancel}>
                Back to intake
              </Button>
              <Button type="button" onClick={() => setAttempt((n) => n + 1)}>
                Try again
              </Button>
            </>
          )}
          {phase.kind === "done" && (
            <Button type="button" variant={intercepted ? "danger" : "primary"} onClick={() => onCompleteRef.current(phase.result)}>
              {intercepted ? "Open referral" : "Open assessment"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
