"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { TraceStrip } from "../Trace";
import { capture } from "../data";

// The lab report's reasoning card, unfolded. Each part's index line fills as
// it enters; the content is the validated output, not a paraphrase.
export function Reasoning({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const r = capture.modalities.lab.reasoning!;

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".trail-part").forEach((el) => {
        gsap.fromTo(
          el.querySelector(".trail-line"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 40%", scrub: true } }
        );
        gsap.from(el.querySelector(".trail-body"), {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  const parts = copy.reasoning.parts;

  return (
    <section ref={ref} id="reasoning" data-section="reasoning" className="section ground-paper reasoning" aria-labelledby="reasoning-h">
      <TraceStrip mode="quiet" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">05</span>
        <span className="t-label">The reasoning</span>
      </div>
      <div className="reasoning-grid">
      <div className="reasoning-side">
        <h2 id="reasoning-h" className="t-statement t-section">{copy.reasoning.statement}</h2>
        <p className="t-body">
          Every assessment MediGem returns is one structured object with five parts, validated against a schema before a person sees it. This is the object the lab report above produced, unedited.
        </p>
        <ol className="t-mono reasoning-parts">
          {copy.reasoning.parts.map((p) => (
            <li key={p.index}><span>{p.index}</span> {p.name}</li>
          ))}
        </ol>
      </div>

      <article className="record" aria-label="Reasoning card">
        <header className="record-head t-mono">
          <span>MediGem · Reasoning card</span>
          <span>{r.metadata.modality} · v{r.metadata.reasoning_version}</span>
          <span>{r.metadata.timestamp.slice(0, 19).replace("T", " ")} UTC</span>
        </header>
      <div className="trail">
        <div className="trail-part">
          <TrailHead p={parts[0]} />
          <div className="trail-body">
            <ul className="trail-list">
              {r.observations.map((o, i) => (
                <li key={i}>
                  <span className="t-label">{o.source}</span>
                  <span className="t-body">{o.observation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="trail-part">
          <TrailHead p={parts[1]} />
          <div className="trail-body">
            <div className="t-mono assess-head">
              <span>risk_level {r.assessment.risk_level}</span>
              <span>confidence_level {r.assessment.confidence_level}</span>
            </div>
            <p className="t-body">{r.assessment.clinical_summary}</p>
            {r.assessment.red_flags.length > 0 && (
              <ul className="trail-list">
                {r.assessment.red_flags.map((f) => (
                  <li key={f}><span className="t-label">red_flag</span><span className="t-body">{f}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="trail-part">
          <TrailHead p={parts[2]} />
          <div className="trail-body">
            <p className="t-body">{r.recommendations.recommended_next_step}</p>
            <div className="t-mono assess-head">
              <span>needs_referral {String(r.recommendations.needs_referral)}</span>
              <span>requires_human_review {String(r.recommendations.requires_human_review)}</span>
            </div>
            {r.recommendations.follow_up_notes && <p className="t-body trail-muted">{r.recommendations.follow_up_notes}</p>}
          </div>
        </div>

        <div className="trail-part">
          <TrailHead p={parts[3]} />
          <div className="trail-body">
            <p className="t-body">{r.patient_summary}</p>
          </div>
        </div>

        <div className="trail-part">
          <TrailHead p={parts[4]} />
          <div className="trail-body">
            <ul className="trail-list">
              {r.limitations.map((l) => (
                <li key={l}><span className="t-label">limitation</span><span className="t-body">{l}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <footer className="record-foot t-mono">
        <span>safety.is_safe {String(r.safety.is_safe)}</span>
        <span>requires_human_review {String(r.recommendations.requires_human_review)}</span>
      </footer>
      </article>
      </div>
    </section>
  );
}

function TrailHead({ p }: { p: { index: string; name: string; note: string } }) {
  return (
    <div className="trail-head">
      <span className="t-label">{p.index}</span>
      <div>
        <div className="trail-name">{p.name}</div>
        <div className="t-mono trail-note">{p.note}</div>
      </div>
      <span className="trail-line" aria-hidden="true" />
    </div>
  );
}
