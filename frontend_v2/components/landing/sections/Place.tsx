"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { TraceStrip } from "../Trace";

const LADDER = [
  { name: "Connected", cells: 24 },
  { name: "Limited", cells: 24 },
  { name: "Offline", cells: 24 },
];

// The connectivity ladder empties row by row as the section scrolls, top
// row first; the trace behind it keeps beating. That contrast is the
// argument, and the ladder is abstract on purpose: no facility count is
// being claimed.
export function Place({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".uplink-fill", {
        scaleX: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true },
      });
      gsap.from(".place .t-statement", {
        opacity: 0,
        y: 24,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      const cells = gsap.utils.toArray<HTMLElement>(".ladder-cell");
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 20%",
        end: "bottom 80%",
        onUpdate: (self) => {
          const p = self.progress;
          const value = ref.current?.querySelector<HTMLElement>(".uplink-value");
          if (value) value.textContent = p > 0.9 ? "none" : `${Math.round((1 - p) * 100)}%`;
          // Connected empties over the first half, Limited over the second.
          cells.forEach((c) => {
            const row = Number(c.dataset.row);
            const i = Number(c.dataset.i);
            const total = LADDER[row].cells;
            let filled: boolean;
            if (row === 0) filled = i < total * (1 - Math.min(1, p * 2));
            else if (row === 1) filled = i < total * (1 - Math.min(1, Math.max(0, p - 0.45) * 2));
            else filled = false;
            c.classList.toggle("is-on", filled);
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="place" data-section="place" className="section ground-paper place" aria-labelledby="place-h">
      <TraceStrip mode="thin" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">02</span>
        <span className="t-label">The place</span>
      </div>
      <div className="place-grid">
        <div>
          <h2 id="place-h" className="t-statement t-section">{copy.place.statement}</h2>
          <p className="t-body">{copy.place.body}</p>
        </div>
        <div className="ladder" role="img" aria-label="Connectivity falling from connected, through limited, to offline">
          {LADDER.map((row, r) => (
            <div key={row.name} className="ladder-row">
              <span className="t-label">{row.name}</span>
              <span className="ladder-cells" aria-hidden="true">
                {Array.from({ length: row.cells }, (_, i) => (
                  <span
                    key={i}
                    data-row={r}
                    data-i={i}
                    className={reduced ? (r === 2 ? "ladder-cell" : "ladder-cell") : r === 0 ? "ladder-cell is-on" : "ladder-cell"}
                  />
                ))}
              </span>
            </div>
          ))}
          <div className="uplink">
            <div className="t-label">{copy.place.bar}</div>
            <div className="uplink-track"><div className="uplink-fill" style={reduced ? { transform: "scaleX(0)" } : undefined} /></div>
            <div className="t-mono uplink-value">{reduced ? "none" : "100%"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
