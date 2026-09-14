"use client";

import React from "react";
import { ShieldCheck, Cpu, FileCheck2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { H2, BodySm } from "@/components/ui/Typography";
import { useSystemReadouts } from "./SystemReadouts";
import { capture } from "@/components/landing/data";

/*
 * How assessment is configured, stated rather than pretended. The model,
 * the gate and the output contract are fixed by the backend; there is no
 * per-user threshold to tune and the gate cannot be switched off from here
 * or anywhere else in the UI.
 */
export function AIClinicalConfig() {
  const r = useSystemReadouts();
  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <H2>Clinical reasoning</H2>
        <BodySm className="text-ink-muted">What runs when an assessment is requested, in the order it runs.</BodySm>
      </div>

      <ol className="divide-y divide-rule border-t border-rule">
        <li className="py-4 grid grid-cols-[2rem_1fr] gap-x-3 gap-y-1">
          <ShieldCheck className="h-5 w-5 text-risk-low" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-body-sm font-semibold text-ink">Emergency gate, always on</p>
            <BodySm className="text-ink-muted">
              {r.gateRules} deterministic rules run on the symptoms before any model is called. A match stops inference and writes the referral. It cannot be disabled; there is no setting for it.
            </BodySm>
            <BodySm className="font-mono text-ink-muted">{r.gateMs.toFixed(2)} ms median · {r.gateSource}</BodySm>
          </div>
        </li>
        <li className="py-4 grid grid-cols-[2rem_1fr] gap-x-3 gap-y-1">
          <Cpu className="h-5 w-5 text-action" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-body-sm font-semibold text-ink">Local model</p>
            <BodySm className="text-ink-muted">
              <span className="font-mono text-ink">{r.model}</span> through Ollama on the API host. The model is set by the API&apos;s <span className="font-mono">MODEL_NAME</span>; there is no per-user choice and no fallback model.
            </BodySm>
            <BodySm className="font-mono text-ink-muted">{r.modelSource}</BodySm>
          </div>
        </li>
        <li className="py-4 grid grid-cols-[2rem_1fr] gap-x-3 gap-y-1">
          <FileCheck2 className="h-5 w-5 text-action" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-body-sm font-semibold text-ink">Output contract</p>
            <BodySm className="text-ink-muted">
              Every result is one <span className="font-mono">ClinicalReasoningOutput</span>: observations, assessment, recommendations, patient summary, limitations. Confidence is qualitative (low, medium, high), never a percentage. <span className="font-mono">requires_human_review</span> defaults to true, and a dose or a diagnosis in the output fails the safety check and marks the run degraded.
            </BodySm>
            <BodySm className="font-mono text-ink-muted">
              {capture.summary.validated_runs} / {capture.summary.total_runs} recorded runs validated against the schema, {capture.meta.captured_at.slice(0, 10)}
            </BodySm>
          </div>
        </li>
      </ol>
    </Card>
  );
}
