"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";
import { capture } from "@/components/landing/data";
import { useCaseDraft } from "@/lib/store/caseDraft";

/*
 * The pipeline in the order backend/services/orchestrator.py and
 * backend/pipeline/medical_pipeline.py run it. Figures are the capture
 * script's measurements or the last run in this tab; a stage without a
 * separate measurement says so rather than showing a number.
 */
const fmtMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms.toFixed(2)} ms`);

export function PipelineInspector() {
  const last = useCaseDraft((s) => s.result?.pipeline ?? null);
  const inputMs = Object.values(capture.modalities).map((m) => m.input.input_processing_ms);
  const inputRange = `${fmtMs(Math.min(...inputMs))} to ${fmtMs(Math.max(...inputMs))}`;

  const stages = [
    { name: "Request validation", where: "backend/validation", measured: "not measured separately" },
    { name: "Emergency gate", where: "backend/emergency", measured: `${capture.gate.latency_ms.match_median.toFixed(2)} ms median, p95 ${capture.gate.latency_ms.match_p95.toFixed(2)} ms, ${capture.gate.iterations.toLocaleString("en-US")} evaluations` },
    { name: "Strategy routing", where: "backend/pipeline/router.py", measured: "not measured separately" },
    { name: "Input processing (quality, OCR)", where: "backend/input", measured: `${inputRange} across the four sample inputs` },
    { name: "Context fusion and prompt composition", where: "backend/reasoning", measured: "not measured separately" },
    { name: "Model inference", where: `backend/ai (${capture.meta.model} via Ollama)`, measured: `end to end ${fmtMs(capture.summary.pipeline_ms_median)} median, ${fmtMs(capture.summary.pipeline_ms_min)} to ${fmtMs(capture.summary.pipeline_ms_max)}` },
    { name: "Output validation and safety guard", where: "backend/reasoning/validator.py, safety.py", measured: `${capture.summary.validated_runs} / ${capture.summary.total_runs} recorded runs validated` },
  ];

  return (
    <Section
      heading={
        <span className="inline-flex items-center gap-2">
          <Terminal className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          Pipeline, in execution order
        </span>
      }
      headingAs="h3"
    >
      <BodySm className="text-ink-muted">
        Measured {capture.meta.captured_at.slice(0, 10)} on {capture.meta.hardware.chip} by evaluation/capture_landing_data.py. Stages without a figure are not timed individually by the capture.
      </BodySm>
      <ol className="divide-y divide-rule border-t border-rule mt-3">
        {stages.map((s, i) => (
          <li key={s.name} className="py-3 grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_16rem_1fr] gap-x-3 gap-y-1 text-body-sm">
            <span className="font-mono text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-semibold text-ink">{s.name}</span>
            <span className="text-ink-muted">
              <span className="font-mono">{s.where}</span> · {s.measured}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-4 border-t border-rule pt-3">
        <p className="text-body-sm font-semibold text-ink">Last run in this tab</p>
        {last ? (
          <dl className="mt-2 grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-y-1 gap-x-4 text-body-sm">
            <dt className="text-ink-muted">Request</dt>
            <dd className="font-mono text-ink">{last.requestId}{last.replay ? ` · replay of ${last.replay.label} (${last.replay.capturedAt})` : ""}</dd>
            <dt className="text-ink-muted">Status</dt>
            <dd className="font-mono text-ink">{last.status}</dd>
            <dt className="text-ink-muted">Duration</dt>
            <dd className="font-mono text-ink">{last.durationMs != null ? fmtMs(last.durationMs) : "not recorded"}</dd>
            <dt className="text-ink-muted">Input stage</dt>
            <dd className="font-mono text-ink">
              {last.inputSummary
                ? `${fmtMs(last.inputSummary.processing_time_ms)} · quality ${last.inputSummary.quality?.quality_level ?? "n/a"} · OCR ${last.inputSummary.ocr_performed ? "yes" : "no"}`
                : "no file processed"}
            </dd>
            <dt className="text-ink-muted">Reasoning card</dt>
            <dd className="font-mono text-ink">{last.reasoning ? `${last.reasoning.observations.length} observations, ${last.reasoning.limitations.length} limitations` : "none (gate stop or degraded)"}</dd>
          </dl>
        ) : (
          <BodySm className="text-ink-muted mt-1">No assessment has run in this tab yet.</BodySm>
        )}
      </div>
    </Section>
  );
}
