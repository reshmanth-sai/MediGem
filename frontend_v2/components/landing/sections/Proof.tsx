"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { TraceStrip } from "../Trace";
import { capture } from "../data";

const s = capture.summary;
const m = capture.meta;

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// A ledger, not a stat grid. Each row is a measurement with its method.
const ROWS: { name: string; value: string; method: string }[] = [
  {
    name: "Safety gate, matching case",
    value: `${fmt(capture.gate.latency_ms.match_median, 3)} ms`,
    method: `median of ${capture.gate.iterations.toLocaleString("en-US")} evaluations, p95 ${fmt(capture.gate.latency_ms.match_p95, 3)} ms`,
  },
  {
    name: "Safety gate, benign case",
    value: `${fmt(capture.gate.latency_ms.benign_median, 3)} ms`,
    method: `median of ${capture.gate.iterations.toLocaleString("en-US")} evaluations`,
  },
  {
    name: "End to end, image to assessment",
    value: `${fmt(s.pipeline_ms_median / 1000, 1)} s`,
    method: `median of ${s.validated_runs} validated runs, range ${fmt(s.pipeline_ms_min / 1000, 1)} to ${fmt(s.pipeline_ms_max / 1000, 1)} s`,
  },
  {
    name: "Schema-valid outputs",
    value: `${s.validated_runs} / ${s.total_runs}`,
    method: s.fallback_runs > 0 ? `${s.fallback_runs} run(s) returned an empty payload and fell back to a safe summary` : "every run validated against ClinicalReasoningOutput",
  },
  {
    name: "OCR confidence",
    value: s.ocr_confidence_mean === null ? "n/a" : `${fmt(s.ocr_confidence_mean * 100, 0)}%`,
    method: `Tesseract mean over ${s.ocr_samples} documents with a text layer, unedited`,
  },
  {
    name: "Supported inputs",
    value: String(s.supported_inputs).padStart(2, "0"),
    method: "lab report, ECG, prescription, wound image",
  },
];

export function Proof({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ledger-row", {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ledger", start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  const date = m.captured_at.slice(0, 10);

  return (
    <section ref={ref} id="proof" data-section="proof" className="section ground-paper proof" aria-labelledby="proof-h">
      <TraceStrip mode="quiet" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">06</span>
        <span className="t-label">The proof</span>
      </div>
      <h2 id="proof-h" className="t-statement t-section">{copy.proof.statement}</h2>
      <p className="t-body">{copy.proof.body}</p>

      <div className="t-mono provenance">
        Measured {date} · {m.model} via Ollama · {m.hardware.chip} · {m.runs_per_modality} runs per modality · evaluation/capture_landing_data.py
      </div>

      <div className="figures" role="list">
        <div role="listitem" className="figure">
          <span className="figure-value">{fmt(capture.gate.latency_ms.match_median, 3)}<small> ms</small></span>
          <span className="t-label">Rule gate, median</span>
        </div>
        <div role="listitem" className="figure">
          <span className="figure-value">{fmt(s.pipeline_ms_median / 1000, 1)}<small> s</small></span>
          <span className="t-label">Image to assessment, median</span>
        </div>
        <div role="listitem" className="figure">
          <span className="figure-value">{s.validated_runs}<small> / {s.total_runs}</small></span>
          <span className="t-label">Schema-valid runs</span>
        </div>
      </div>

      <table className="ledger">
        <thead className="sr-only">
          <tr><th scope="col">Measurement</th><th scope="col">Value</th><th scope="col">Method</th></tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.name} className="ledger-row">
              <th scope="row" className="ledger-name">{r.name}</th>
              <td className="t-mono-lg ledger-value">{r.value}</td>
              <td className="t-mono ledger-method">{r.method}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="t-label samples-label">Actual inputs</div>
      <ul className="samples" aria-label="Sample inputs used for these measurements">
        {(["lab", "ecg", "prescription", "wound"] as const).map((k) => (
          <li key={k}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/landing/${k}.webp`} alt="" loading="lazy" decoding="async" />
            <span className="t-label">{capture.modalities[k].label}</span>
            <span className="t-mono">{capture.modalities[k].file}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
