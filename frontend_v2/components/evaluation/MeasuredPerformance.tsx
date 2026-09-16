"use client";

import React from "react";
import { Activity, Clock, ListChecks, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { MetricStat } from "@/components/ui/MetricStat";
import { Label, BodySm } from "@/components/ui/Typography";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { capture } from "@/components/landing/data";

/*
 * Every number on this page is read from capture.json, written by
 * evaluation/capture_landing_data.py against a live pipeline -- the same
 * capture the product page and the Pipeline Inspector quote. Nothing here is
 * a synthetic sample or a rounded-up target; a run that fell back or came
 * back invalid would show here as it did (0 of 80 did).
 */

const MODALITY_LABELS: Record<string, string> = {
  lab: "Lab report",
  ecg: "ECG strip",
  prescription: "Prescription",
  wound: "Wound photo",
};

function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms.toFixed(2)} ms`;
}

export function MeasuredPerformance() {
  const { summary, gate, modalities, meta } = capture;
  const modalityKeys = Object.keys(modalities) as (keyof typeof modalities)[];

  // A shared domain across all four modalities, so the range bars below are
  // directly comparable -- lab visibly costs more than ecg because OCR runs
  // first, not because the bars use different scales.
  const allMs = modalityKeys.flatMap((k) => [modalities[k].pipeline_ms.min, modalities[k].pipeline_ms.max]);
  const domainMin = Math.min(...allMs);
  const domainMax = Math.max(...allMs);
  const pct = (v: number) => ((v - domainMin) / (domainMax - domainMin)) * 100;

  const metrics = [
    { icon: ListChecks, label: "Runs recorded", value: summary.total_runs, subtitle: `${meta.runs_per_modality} runs × ${summary.supported_inputs} modalities` },
    { icon: ShieldCheck, label: "Schema-valid", value: `${summary.validated_runs} / ${summary.total_runs}`, subtitle: `${summary.fallback_runs} fell back to a template response` },
    { icon: Clock, label: "Emergency gate", value: fmtMs(gate.latency_ms.match_median), subtitle: `${gate.rule_count} rules, matching-case median` },
    {
      icon: Activity,
      label: "OCR confidence",
      value: summary.ocr_confidence_mean != null ? `${(summary.ocr_confidence_mean * 100).toFixed(1)}%` : "Not measured",
      subtitle: `Mean over ${summary.ocr_samples} sample documents with a text layer`,
    },
  ];

  return (
    <div className="space-y-6">
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 divide-y divide-rule sm:divide-y-0">
          {metrics.map((metric) => (
            <MetricStat key={metric.label} {...metric} />
          ))}
        </div>
      </Section>

      <Section heading="End-to-end latency, by modality" headingAs="h3">
        <BodySm className="text-ink-muted">
          Image in, validated assessment out: gate, input processing, model, and validation together. {meta.runs_per_modality} runs each, on {meta.hardware.chip}. The bar spans the recorded min to max; the marker is the median.
        </BodySm>
        <div className="space-y-4 mt-3">
          {modalityKeys.map((k) => {
            const m = modalities[k].pipeline_ms;
            return (
              <div key={k} className="space-y-1">
                <div className="flex items-baseline justify-between text-body-sm">
                  <span className="text-ink font-medium">{MODALITY_LABELS[k]}</span>
                  <span className="text-ink-muted font-mono tabular text-label">
                    {fmtMs(m.median)} median · {fmtMs(m.min)} to {fmtMs(m.max)}
                  </span>
                </div>
                <div className="relative w-full bg-surface-raised h-1.5 rounded-chip border border-rule">
                  <div
                    className="absolute inset-y-0 rounded-chip bg-action/40"
                    style={{ left: `${pct(m.min)}%`, width: `${Math.max(pct(m.max) - pct(m.min), 1)}%` }}
                  />
                  <div
                    className="absolute -top-1 h-3.5 w-1 rounded-chip bg-action"
                    style={{ left: `calc(${pct(m.median)}% - 2px)` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section heading="Emergency gate, matching vs. benign input" headingAs="h3">
        <BodySm className="text-ink-muted">
          The rule match itself, not the request around it: {gate.iterations.toLocaleString("en-US")} evaluations each, symptoms that trip a rule against symptoms that do not. Neither case calls the model.
        </BodySm>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-3 divide-y divide-rule sm:divide-y-0 border-t border-rule sm:border-t-0 pt-3 sm:pt-0">
          <div className="space-y-1 pt-3 sm:pt-0">
            <dt className="text-label text-ink-muted">Matching case (a rule fires)</dt>
            <dd className="font-mono text-body-sm text-ink tabular">
              {fmtMs(gate.latency_ms.match_median)} median · {fmtMs(gate.latency_ms.match_p95)} p95 · {fmtMs(gate.latency_ms.match_max)} max
            </dd>
          </div>
          <div className="space-y-1 pt-3">
            <dt className="text-label text-ink-muted">Benign case (no rule fires)</dt>
            <dd className="font-mono text-body-sm text-ink tabular">
              {fmtMs(gate.latency_ms.benign_median)} median · {fmtMs(gate.latency_ms.benign_max)} max
            </dd>
          </div>
        </dl>
      </Section>

      <Section heading="Per-modality outcomes" headingAs="h3">
        <Table caption="Recorded run outcomes by modality">
          <THead>
            <tr>
              <TH>Modality</TH>
              <TH numeric>Runs</TH>
              <TH numeric>Validated</TH>
              <TH numeric>Fell back</TH>
              <TH>Input quality</TH>
              <TH numeric>OCR confidence</TH>
            </tr>
          </THead>
          <TBody>
            {modalityKeys.map((k) => {
              const m = modalities[k];
              return (
                <TR key={k}>
                  <TD>{MODALITY_LABELS[k]}</TD>
                  <TD numeric className="font-mono tabular">{m.runs}</TD>
                  <TD numeric className="font-mono tabular">{m.validated_runs}</TD>
                  <TD numeric className="font-mono tabular">{m.fallback_runs}</TD>
                  <TD>{m.input.quality?.quality_level ?? "Not assessed"}</TD>
                  <TD numeric className="font-mono tabular">
                    {m.input.extracted ? `${(m.input.extracted.confidence * 100).toFixed(0)}%` : "No text layer"}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </Section>

      <BodySm className="text-ink-muted max-w-3xl">
        What this does not measure: whether the assessments are clinically right. These are mechanical figures, latency and schema validity, not accuracy against a clinician&apos;s judgment. That evaluation needs a labelled case set reviewed by a clinician; see Limitations in the README.
      </BodySm>

      {/* break-words: the trailing script path is one unbreakable token and
          overran a 320px screen at the large-text scale. */}
      <Label as="p" className="text-ink-muted normal-case font-mono break-words">
        {meta.hardware.chip} · {meta.model} via Ollama · captured {meta.captured_at.slice(0, 10)} by evaluation/capture_landing_data.py
      </Label>
    </div>
  );
}
