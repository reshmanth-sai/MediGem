"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { capture } from "../data";
import { TraceStrip } from "../Trace";

const ORDER = ["lab", "ecg", "prescription", "wound"] as const;

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// The hero's negative space carries the instrument: a telemetry block of
// readouts and the twenty validated run durations from the capture, drawn
// as bars. Every value is measured; nothing here is decorative.
export function Signal({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // Five most recent runs per modality; the full set is in the proof ledger.
  const runs = useMemo(
    () => ORDER.flatMap((k) => capture.modalities[k].pipeline_ms.all.slice(-5).map((ms) => ({ k, ms }))),
    []
  );
  const max = Math.max(...runs.map((r) => r.ms));

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".mask > *", { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.09, delay: 0.2 });
      gsap.from(".signal-meta, .telemetry", { opacity: 0, duration: 1.2, ease: "power2.out", delay: 1.0 });
      gsap.from(".runs-bar", { scaleY: 0, transformOrigin: "bottom", duration: 0.8, ease: "power3.out", stagger: 0.04, delay: 1.2 });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  const s = capture.summary;

  return (
    <section ref={ref} id="signal" data-section="signal" className="section ground-ink signal" aria-labelledby="signal-h">
      <TraceStrip mode="rest" hero reduced={reduced} />
      <h1 id="signal-h" className="t-hero">
        {copy.signal.headline.map((line) => (
          <span key={line} className="mask">
            <span>{line}</span>
          </span>
        ))}
      </h1>

      <div className="signal-meta">
        <p className="t-lede">{copy.signal.lede}</p>
        <a href="#place" className="link t-mono">{copy.signal.explore}</a>
      </div>

      <div className="signal-grid">
        <div className="telemetry" aria-label="System telemetry">
          <dl className="t-mono telemetry-readouts">
            <div><dt>Model</dt><dd>{capture.meta.model}</dd></div>
            <div><dt>Inference</dt><dd>local</dd></div>
            <div><dt>Uplink</dt><dd>none required</dd></div>
            <div><dt>Rule gate</dt><dd>{fmt(s.gate_latency_ms_median, 3)} ms</dd></div>
            <div><dt>Inputs</dt><dd>lab, ECG, Rx, wound</dd></div>
            <div><dt>Validated</dt><dd>{s.validated_runs} / {s.total_runs}</dd></div>
          </dl>
          <figure className="runs">
            <div className="runs-bars" aria-hidden="true">
              {runs.map((r, i) => (
                <span key={i} className="runs-bar" data-k={r.k} style={{ height: `${(r.ms / max) * 100}%` }} title={`${r.k} ${fmt(r.ms, 0)} ms`} />
              ))}
            </div>
            <figcaption className="t-mono">
              Last {runs.length} of {s.validated_runs} validated runs, end to end, ms. Median {fmt(s.pipeline_ms_median / 1000, 1)} s on this machine.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
