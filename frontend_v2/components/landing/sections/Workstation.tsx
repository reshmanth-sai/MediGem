"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { copy } from "../copy";
import { TraceStrip } from "../Trace";

export function Workstation({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} id="workstation" data-section="workstation" className="section ground-ink workstation" aria-labelledby="workstation-h">
      <TraceStrip mode="full" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">08</span>
        <span className="t-label">The workstation</span>
      </div>
      <h2 id="workstation-h" className="t-statement t-section">{copy.workstation.statement}</h2>
      <p className="t-lede">{copy.workstation.sub}</p>
      <Link href="/workstation" className="cta" data-curtain>
        {copy.workstation.cta}
        <span aria-hidden="true">&rarr;</span>
      </Link>

      <figure className="ws-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/landing/workstation.webp" width="1800" height="1125" alt="The MediGem workstation: an emergency alert, the day's counters, and the patient queue ordered by the safety gate." loading="lazy" decoding="async" />
        <figcaption className="t-mono">{copy.workstation.shot}</figcaption>
      </figure>


      <footer className="foot">
        <div className="foot-mark" aria-hidden="true">MediGem</div>
        <div className="foot-row">
          <span className="t-mono">{copy.workstation.tagline}</span>
          <nav aria-label="Footer" className="foot-links t-mono">
            <a className="link" href="https://github.com/reshmanth-sai/MediGem" rel="noreferrer">GitHub</a>
            <a className="link" href="https://github.com/reshmanth-sai/MediGem/tree/main/docs" rel="noreferrer">Docs on GitHub</a>
            <span>Apache 2.0</span>
            <span>Built with Gemma 3</span>
          </nav>
        </div>
      </footer>
    </section>
  );
}
