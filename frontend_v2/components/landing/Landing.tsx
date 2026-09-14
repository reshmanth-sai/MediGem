"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { TraceProvider } from "./Trace";
import { Nav } from "./Nav";
import { Signal } from "./sections/Signal";
import { Place } from "./sections/Place";
import { Pipeline } from "./sections/Pipeline";
import { Gate } from "./sections/Gate";
import { Reasoning } from "./sections/Reasoning";
import { Proof } from "./sections/Proof";
import { Contract } from "./sections/Contract";
import { Workstation } from "./sections/Workstation";
import { Curtain } from "./Curtain";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Server-rendered as false so the markup matches; each animation effect also
// checks prefersReducedMotion() live, so nothing starts before this flips.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(prefersReducedMotion());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function Landing() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("signal");

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // In-page anchors scroll through Lenis so the pinned pipeline and the
    // nav indicator stay in step.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector<HTMLElement>(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -8, duration: 1.4 });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  // Track the active section for the rail and the mobile progress line.
  useEffect(() => {
    const sections = Array.from(root.current?.querySelectorAll<HTMLElement>("section[data-section]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.getAttribute("data-section") ?? "signal");
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <TraceProvider>
      <div ref={root} className={reduced ? "reduced" : undefined}>
        <Nav active={active} />
        <main className="content-layer" id="main">
          <Signal reduced={reduced} />
          <Place reduced={reduced} />
          <Pipeline reduced={reduced} />
          <Gate reduced={reduced} />
          <Reasoning reduced={reduced} />
          <Proof reduced={reduced} />
          <Contract reduced={reduced} />
          <Workstation reduced={reduced} />
        </main>
        <Curtain />
      </div>
    </TraceProvider>
  );
}
