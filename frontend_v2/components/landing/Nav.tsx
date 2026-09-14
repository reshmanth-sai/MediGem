"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTrace } from "./Trace";
import { copy } from "./copy";

const LINKS = [
  { id: "place", index: "02", name: "Place" },
  { id: "pipeline", index: "03", name: "Pipeline" },
  { id: "gate", index: "04", name: "Safety" },
  { id: "reasoning", index: "05", name: "Reasoning" },
  { id: "proof", index: "06", name: "Proof" },
  { id: "contract", index: "07", name: "Contract" },
] as const;

// The only navigation. A single underline slides between links as sections
// change, and a hairline along the top edge shows position in the page. The
// uplink readout is real: it follows the browser's connectivity state.
export function Nav({ active }: { active: string }) {
  const trace = useTrace();
  const list = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const p = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
      if (progress.current) progress.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`a[data-id="${active}"]`);
    const b = bar.current;
    if (!b) return;
    if (!el) {
      b.style.opacity = "0";
      return;
    }
    b.style.opacity = "1";
    b.style.transform = `translateX(${el.offsetLeft}px)`;
    b.style.width = `${el.offsetWidth}px`;
  }, [active]);

  const blip = () => trace.blip();

  return (
    <>
      {/* Outside the header so the blend mode does not recolour the bar. */}
      <div ref={progress} className="nav-progress" aria-hidden="true" />
    <header className="nav">
      <a href="#signal" className="nav-mark" onMouseEnter={blip} aria-label="MediGem, back to top">
        MediGem
      </a>
      <nav ref={list} aria-label="Sections" className="nav-links">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} data-id={l.id} className="nav-link" aria-current={active === l.id ? "location" : undefined} onMouseEnter={blip}>
            <span className="t-mono nav-link-index">{l.index}</span>
            {l.name}
          </a>
        ))}
        <span ref={bar} className="nav-bar" aria-hidden="true" />
      </nav>
      <div className="nav-right">
        <span className="t-mono nav-uplink" aria-live="polite">
          <span className={online === false ? "dot dot-off" : "dot"} aria-hidden="true" />
          Your connection {online === null ? "..." : online ? "online" : "offline"}
        </span>
        <Link href="/workstation" className="link t-mono nav-open" onMouseEnter={blip}>
          <span className="nav-open-long">{copy.workstation.cta}</span>
          <span className="nav-open-short">{copy.workstation.ctaShort}</span>
        </Link>
      </div>
    </header>
    </>
  );
}
