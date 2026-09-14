"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { TraceStrip } from "../Trace";
import { capture } from "../data";
import type { ModalityData } from "../data/schema";
import { DocumentPlane, type PlaneState } from "../DocumentPlane";

const ORDER = ["lab", "ecg", "prescription", "wound"] as const;
const SOURCES = ORDER.map((k) => `/landing/${k}.webp`);

function ocrLines(m: ModalityData): string[] {
  if (!m.input.extracted || !m.input.ocr_performed) return [];
  return m.input.extracted.text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 7);
}

function fmt(n: number, d = 1) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// One modality's four stages, as plain DOM. On desktop the timeline reveals
// them in order; on mobile and under reduced motion they simply stack.
function Stages({ m, k }: { m: ModalityData; k: string }) {
  const q = m.input.quality;
  const lines = ocrLines(m);
  const r = m.reasoning;
  return (
    <div className="stages" data-modality={k} data-first={k === "lab" || undefined}>
      <span className="stage-rail" aria-hidden="true"><span className="stage-rail-fill" /></span>
      <div className="stage" data-stage="input"><span className="stage-dot" aria-hidden="true" />
        <div className="t-label">01 {copy.pipeline.steps[0]}</div>
        <div className="t-mono">
          {m.file.split("/").pop()}
          {m.input.image && <> · {m.input.image.width}×{m.input.image.height} · {(m.input.image.file_size_bytes / 1024).toFixed(1)} KB</>}
        </div>
        <div className="t-mono stage-note">Symptoms: {m.symptoms.join(", ")}</div>
      </div>

      <div className="stage" data-stage="quality"><span className="stage-dot" aria-hidden="true" />
        <div className="t-label">02 {copy.pipeline.steps[1]}</div>
        {q && (
          <dl className="t-mono readouts">
            <div><dt>blur_score</dt><dd>{fmt(q.blur_score, 2)}</dd></div>
            <div><dt>brightness_score</dt><dd>{fmt(q.brightness_score, 2)}</dd></div>
            <div><dt>contrast_score</dt><dd>{fmt(q.contrast_score, 2)}</dd></div>
            <div><dt>resolution_score</dt><dd>{fmt(q.resolution_score, 3)}</dd></div>
            <div><dt>quality_level</dt><dd>{q.quality_level}</dd></div>
          </dl>
        )}
        {q?.warnings.map((w) => (
          <div key={w} className="t-mono stage-note">{w}</div>
        ))}
      </div>

      <div className="stage" data-stage="ocr"><span className="stage-dot" aria-hidden="true" />
        <div className="t-label">03 {copy.pipeline.steps[2]}</div>
        {lines.length ? (
          <>
            <ol className="t-mono ocr-lines">
              {lines.map((l, i) => (
                <li key={i} className="ocr-line">{l}</li>
              ))}
            </ol>
            <div className="t-mono stage-note">Tesseract confidence {fmt((m.input.extracted?.confidence ?? 0) * 100, 0)}%, as read</div>
          </>
        ) : (
          <div className="t-mono stage-note">No text layer. The image goes to the model as pixels.</div>
        )}
      </div>

      <div className="stage" data-stage="assessment"><span className="stage-dot" aria-hidden="true" />
        <div className="t-label">04 {copy.pipeline.steps[3]}</div>
        {r && (
          <>
            <div className="t-mono assess-head">
              <span>risk_level {r.assessment.risk_level}</span>
              <span>confidence {r.assessment.confidence_level}</span>
              <span>needs_referral {String(r.recommendations.needs_referral)}</span>
            </div>
            <p className="t-body assess-summary">{r.assessment.clinical_summary}</p>
          </>
        )}
        <div className="t-mono stage-note">Median {fmt(m.pipeline_ms.median / 1000, 1)} s over {m.validated_runs} runs, local</div>
      </div>
    </div>
  );
}

export function Pipeline({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const plane = useRef<PlaneState>({ from: 0, to: 1, mix: 0, scan: 0, reveal: 1 });
  const mods = useMemo(() => ORDER.map((k) => [k, capture.modalities[k]] as const), []);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current || !pin.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const stagesEls = ORDER.map((k) => pin.current!.querySelector<HTMLElement>(`.stages[data-modality="${k}"]`)!);
      const marker = pin.current!.querySelector<HTMLElement>(".pipeline-marker")!;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=400%",
          pin: pin.current,
          scrub: 0.6,
          onUpdate: (self) => {
            const i = Math.min(3, Math.floor(self.progress * 4));
            marker.textContent = `${i + 1}/4 ${ORDER[i].toUpperCase()}`;
          },
        },
      });

      const ps = plane.current;
      ORDER.forEach((k, i) => {
        const el = stagesEls[i];
        const stages = Array.from(el.querySelectorAll<HTMLElement>(".stage"));
        const lines = Array.from(el.querySelectorAll<HTMLElement>(".ocr-line"));
        const fill = el.querySelector<HTMLElement>(".stage-rail-fill")!;
        const base = i * 4; // seconds of timeline per modality
        const css = getComputedStyle(el);
        const muted = css.getPropertyValue("--l-fg-muted").trim();
        const signal = css.getPropertyValue("--l-signal").trim();
        // A stage lights up when the data reaches it: label to signal colour,
        // rail dot filled. Nothing is dimmed, so every readout stays legible.
        const light = (st: HTMLElement, at: number) => {
          tl.fromTo(st.querySelector(".t-label"), { color: muted }, { color: signal, duration: 0.3 }, at);
          tl.fromTo(st.querySelector(".stage-dot"), { scale: 0 }, { scale: 1, duration: 0.3 }, at);
        };

        // The document dissolves into the next modality; the first one is
        // simply there, so the section has content before any scroll.
        if (i > 0) {
          tl.set(ps, { from: i - 1, to: i, mix: 0 }, base);
          tl.to(ps, { mix: 1, duration: 0.6, ease: "none" }, base);
          tl.set(el, { autoAlpha: 1 }, base);
          tl.set(stagesEls[i - 1], { autoAlpha: 0 }, base);
        }

        // All four stages stay visible. The rail fills top to bottom and
        // each stage comes to full strength as the data reaches it.
        tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 3.2, ease: "none" }, base + 0.2);
        light(stages[0], base + 0.2);
        // Quality: the scan line sweeps the document, readouts follow it.
        tl.fromTo(ps, { scan: 0 }, { scan: 1, duration: 0.8, ease: "none" }, base + 0.8);
        light(stages[1], base + 1.2);
        // OCR: lines lift from the document into the column.
        light(stages[2], base + 1.9);
        if (lines.length) tl.from(lines, { x: -160, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", immediateRender: false }, base + 2.0);
        // Assessment
        light(stages[3], base + 2.9);
        tl.to({}, { duration: 0.4 }, base + 3.3);
      });
      return () => tl.scrollTrigger?.kill();
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="pipeline" data-section="pipeline" className="section ground-ink pipeline" aria-labelledby="pipeline-h">
      <div ref={pin} className="pipeline-pin">
        <TraceStrip mode="line" reduced={reduced} />
        <div className="section-index">
          <span className="t-label">03</span>
          <span className="t-label">The pipeline</span>
          <span className="t-label pipeline-marker" aria-hidden="true">1/4 LAB</span>
        </div>
        <h2 id="pipeline-h" className="t-statement t-section">{copy.pipeline.statement}</h2>
        <div className="pipeline-grid">
          <div className="pipeline-doc">
            {/* The first document is plain markup so it paints before WebGL is ready. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pipeline-first" src="/landing/lab.webp" alt="" aria-hidden="true" />
            {!reduced && <DocumentPlane sources={SOURCES} state={plane} className="pipeline-plane" />}
          </div>
          <div className="pipeline-stages">
            {mods.map(([k, m]) => (
              <Stages key={k} m={m} k={k} />
            ))}
          </div>
        </div>
      </div>
      {/* Mobile and reduced-motion: the same four modalities, stacked. */}
      <div className="pipeline-stack">
        {mods.map(([k, m]) => (
          <article key={k} className="pipeline-stack-item">
            <div className="t-label">{m.label}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/landing/${k}.webp`} alt={`${m.label} sample used for this run`} loading="lazy" decoding="async" />
            <Stages m={m} k={`${k}-stack`} />
          </article>
        ))}
      </div>
    </section>
  );
}
