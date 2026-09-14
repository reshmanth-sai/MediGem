"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { PipelineRecord } from "@/lib/casesData";

/*
 * The validated ClinicalReasoningOutput, shown as the five-part object it is.
 * Same structure the landing page unfolds, in the workstation's own tokens.
 * Rendered only for cases that came from the pipeline API.
 */
export function ReasoningCard({ record }: { record: PipelineRecord }) {
  const r = record.reasoning;
  const input = record.inputSummary;

  return (
    <section aria-label="Pipeline reasoning card" className="space-y-5">
      <SectionHeader
        title="Reasoning card"
        badge={
          <span className="text-label font-mono px-1.5 py-0.2 rounded-chip bg-surface-raised border border-rule text-ink-muted">
            {record.requestId} · {record.status}
            {record.durationMs != null ? ` · ${(record.durationMs / 1000).toFixed(1)} s` : ""}
          </span>
        }
      />

      {record.replay && (
        <p className="text-body-sm text-ink-muted border border-rule bg-surface-sunken p-3 rounded-control">
          <span className="font-semibold text-ink">Replay.</span> This is the run recorded on {record.replay.capturedAt} for {record.replay.sourceFile}. It assesses that sample, not the patient entered above.
        </p>
      )}
      {record.gateSummary && (
        <p className="text-body-sm text-risk-emergency font-semibold border border-risk-emergency/40 bg-risk-emergency-subtle p-3 rounded-control">
          {record.gateSummary}
        </p>
      )}

      {input && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-body-sm border-t border-rule pt-3">
          <div>
            <dt className="text-ink-muted">Input quality</dt>
            <dd className="font-mono text-ink">{input.quality?.quality_level ?? "n/a"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">OCR</dt>
            <dd className="font-mono text-ink">
              {input.ocr_performed && input.extracted ? `${Math.round(input.extracted.confidence * 100)}% confidence` : "no text layer"}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Image</dt>
            <dd className="font-mono text-ink">{input.image ? `${input.image.width}×${input.image.height}` : "none"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Input stage</dt>
            <dd className="font-mono text-ink">{(input.processing_time_ms / 1000).toFixed(2)} s</dd>
          </div>
          {input.quality?.warnings.map((w) => (
            <div key={w} className="col-span-2 sm:col-span-4 text-ink-muted">
              {w}
            </div>
          ))}
        </dl>
      )}

      {r ? (
        <ol className="space-y-5 list-none p-0 m-0">
          <Part index="01" name="Observations">
            <ul className="space-y-1.5">
              {r.observations.map((o, i) => (
                <li key={i} className="text-body-sm">
                  <span className="font-mono text-ink-muted mr-2">{o.source}</span>
                  <span className="text-ink">{o.observation}</span>
                </li>
              ))}
            </ul>
          </Part>
          <Part index="02" name="Assessment">
            <p className="text-body-sm text-ink">{r.assessment.clinical_summary}</p>
            <p className="font-mono text-body-sm text-ink-muted">
              risk_level {r.assessment.risk_level} · confidence_level {r.assessment.confidence_level}
            </p>
            {r.assessment.red_flags.length > 0 && (
              <ul className="space-y-1">
                {r.assessment.red_flags.map((f) => (
                  <li key={f} className="text-body-sm text-risk-emergency">
                    <span className="font-mono mr-2">red_flag</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </Part>
          <Part index="03" name="Recommendations">
            <p className="text-body-sm text-ink">{r.recommendations.recommended_next_step}</p>
            <p className="font-mono text-body-sm text-ink-muted">
              needs_referral {String(r.recommendations.needs_referral)} · requires_human_review {String(r.recommendations.requires_human_review)}
            </p>
            {r.recommendations.follow_up_notes && <p className="text-body-sm text-ink-muted">{r.recommendations.follow_up_notes}</p>}
          </Part>
          <Part index="04" name="Patient summary">
            <p className="text-body-sm text-ink">{r.patient_summary}</p>
          </Part>
          <Part index="05" name="Limitations">
            <ul className="space-y-1">
              {r.limitations.map((l) => (
                <li key={l} className="text-body-sm text-ink-muted">
                  {l}
                </li>
              ))}
            </ul>
          </Part>
        </ol>
      ) : (
        <p className="text-body-sm text-ink-muted">
          {record.status === "EMERGENCY_INTERCEPTED"
            ? "No reasoning card: the emergency gate stopped the run before the model was called."
            : "No validated reasoning card was produced for this run."}
        </p>
      )}
    </section>
  );
}

function Part({ index, name, children }: { index: string; name: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-2 border-t border-rule pt-4">
      <span className="font-mono text-body-sm text-ink-muted pt-0.5">{index}</span>
      <div className="space-y-2 min-w-0">
        <h3 className="text-body-sm font-semibold text-ink">{name}</h3>
        {children}
      </div>
    </li>
  );
}
