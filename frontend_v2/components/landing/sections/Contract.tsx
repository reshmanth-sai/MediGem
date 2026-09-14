"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { TraceStrip } from "../Trace";

// Typography only. The strike on "diagnose" and "prescribe" is drawn on
// scroll; the footnote is the schema default that backs the claim.
export function Contract({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".verbs li", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".verbs", start: "top 75%" },
      });
      gsap.from(".decides", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".decides", start: "top 80%" },
      });
      gsap.utils.toArray<HTMLElement>(".never .strike").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 70%" } });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  const withStrike = (line: string) => {
    const word = line.match(/diagnose|prescribe|replace clinicians/)?.[0];
    if (!word) return line;
    const [a, b] = line.split(word);
    return (
      <>
        {a}
        <span className="struck">
          {word}
          <span className="strike" aria-hidden="true" />
        </span>
        {b}
      </>
    );
  };

  return (
    <section ref={ref} id="contract" data-section="contract" className="section ground-ink contract" aria-labelledby="contract-h">
      <TraceStrip mode="full" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">07</span>
        <span className="t-label">The contract</span>
      </div>
      <h2 id="contract-h" className="t-statement t-section">{copy.contract.statement}</h2>

      <ul className="verbs t-lede">
        {copy.contract.verbs.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>

      <p className="decides t-statement">{copy.contract.decides}</p>
      <div className="t-mono stage-note">requires_human_review: true, the schema default in backend/reasoning/output_schema.py</div>

      <ul className="never t-statement" aria-label="What MediGem will never do">
        {copy.contract.nevers.map((n) => (
          <li key={n}>{withStrike(n)}</li>
        ))}
      </ul>
    </section>
  );
}
