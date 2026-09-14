"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The ECG trace. Each section owns a strip in the band above its heading, so
 * the trace scrolls with the content and never crosses it. The strip's mode
 * is the system behaviour that section explains:
 *
 *   rest      hero: the system is alive and local; cursor speed nudges rate
 *   thin      the place: connectivity gone, the trace keeps beating
 *   line      pipeline: the trace is the wire data travels along
 *   flatline  gate: inference stops; the line ends in a cross
 *   quiet     reasoning and proof: a baseline in the margin
 *   full      contract and workstation: care continues
 *
 * A strip only animates while it is on screen.
 */

export type TraceMode = "rest" | "thin" | "line" | "flatline" | "quiet" | "full";

interface Preset {
  amplitude: number; // fraction of strip height
  opacity: number;
  bpm: number;
  width: number;
}

const PRESETS: Record<TraceMode, Preset> = {
  rest: { amplitude: 0.42, opacity: 1, bpm: 58, width: 1.5 },
  thin: { amplitude: 0.3, opacity: 0.6, bpm: 56, width: 1.25 },
  line: { amplitude: 0.26, opacity: 0.55, bpm: 56, width: 1.25 },
  flatline: { amplitude: 0.38, opacity: 1, bpm: 60, width: 1.5 },
  quiet: { amplitude: 0.18, opacity: 0.45, bpm: 54, width: 1 },
  full: { amplitude: 0.46, opacity: 1, bpm: 66, width: 1.5 },
};

interface Handle {
  blip(): void;
  velocity(v: number): void;
}

const Ctx = createContext<React.MutableRefObject<Handle | null> | null>(null);

/** Lets the nav blip the hero strip on hover. */
export function TraceProvider({ children }: { children: React.ReactNode }) {
  const hero = useRef<Handle | null>(null);
  return <Ctx.Provider value={hero}>{children}</Ctx.Provider>;
}

export function useTrace(): Handle {
  const ref = useContext(Ctx);
  return useMemo(() => ({ blip: () => ref?.current?.blip(), velocity: (v: number) => ref?.current?.velocity(v) }), [ref]);
}

// One heartbeat, phase in [0, 1). A sum of Gaussians shaped like PQRST.
function pqrst(p: number): number {
  const g = (c: number, w: number, a: number) => a * Math.exp(-((p - c) * (p - c)) / (2 * w * w));
  return g(0.12, 0.028, 0.14) + g(0.215, 0.007, -0.11) + g(0.235, 0.011, 1) + g(0.257, 0.009, -0.28) + g(0.42, 0.045, 0.3);
}

function run(canvas: HTMLCanvasElement, mode: TraceMode, reactive: boolean): Handle & { stop(): void; pause(p: boolean): void } {
  const ctx = canvas.getContext("2d")!;
  const preset = PRESETS[mode];
  const stroke = getComputedStyle(canvas).getPropertyValue("--l-signal").trim();

  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const buf = new Float32Array(4096);
  let head = 0;
  let phase = 0;
  let bpm = preset.bpm;
  let vel = 0;
  let blipAt = -1;
  let flatX = -1; // flatline: pixels since the line stopped
  let raf = 0;
  let paused = false;
  let last = performance.now();

  // Flatline strips pre-fill so the cross is visible without waiting.
  if (mode === "flatline") {
    const pxPerSec = Math.max(1, w) * 0.22;
    for (let i = 0; i < buf.length; i++) {
      phase += bpm / 60 / pxPerSec;
      buf[i] = pqrst(phase % 1);
    }
    head = 0;
    flatX = Math.round(w * 0.42);
    for (let i = 0; i < flatX; i++) buf[(head - 1 - i + buf.length * 2) % buf.length] = 0;
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (paused) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const target = reactive ? preset.bpm + Math.min(vel, 40) : preset.bpm;
    bpm += (target - bpm) * (1 - Math.exp(-dt * 1.2));
    vel *= 0.9;

    const pxPerSec = w * 0.22;
    const advance = Math.max(1, Math.round(pxPerSec * dt));
    for (let i = 0; i < advance; i++) {
      if (mode === "flatline") {
        // The line has stopped: only zeros enter, the cross drifts left
        // until it leaves, then a fresh beat sequence begins and stops again.
        if (flatX >= 0 && flatX < w) {
          buf[head] = 0;
          flatX++;
        } else if (flatX >= w) {
          phase = 0;
          flatX = -1;
          buf[head] = pqrst(0);
        } else {
          phase += bpm / 60 / pxPerSec;
          buf[head] = pqrst(phase % 1);
          if (phase > 2.6) flatX = 0;
        }
      } else {
        phase += bpm / 60 / pxPerSec;
        if (blipAt > 0 && now - blipAt < 40) phase = Math.max(phase, Math.floor(phase) + 0.2);
        buf[head] = pqrst(phase % 1);
      }
      head = (head + 1) % buf.length;
    }
    if (blipAt > 0 && now - blipAt > 40) blipAt = -1;

    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = preset.opacity;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = preset.width;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const cy = h * 0.62;
    const amp = preset.amplitude * h;
    for (let x = 0; x < w; x++) {
      const idx = (head - 1 - (w - 1 - x) + buf.length * 2) % buf.length;
      const y = cy - buf[idx] * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (mode === "flatline" && flatX >= 0 && flatX < w) {
      const x = w - flatX;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 6, cy - 6);
      ctx.lineTo(x + 6, cy + 6);
      ctx.moveTo(x + 6, cy - 6);
      ctx.lineTo(x - 6, cy + 6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
  raf = requestAnimationFrame(frame);

  return {
    blip: () => {
      blipAt = performance.now();
    },
    velocity: (v: number) => {
      vel = Math.min(vel + v, 60);
    },
    pause: (p: boolean) => {
      paused = p;
    },
    stop: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    },
  };
}

export function TraceStrip({ mode, hero = false, reduced, className }: { mode: TraceMode; hero?: boolean; reduced: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useContext(Ctx);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const handle = run(canvas, mode, hero);
    if (hero && heroRef) heroRef.current = handle;

    const io = new IntersectionObserver((entries) => handle.pause(!entries.some((e) => e.isIntersecting)), { rootMargin: "80px" });
    io.observe(canvas);
    const onVis = () => handle.pause(document.hidden);
    document.addEventListener("visibilitychange", onVis);

    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      const d = Math.hypot(e.clientX - px, e.clientY - py);
      px = e.clientX;
      py = e.clientY;
      handle.velocity(d * 0.15);
    };
    if (hero) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      handle.stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (hero) window.removeEventListener("pointermove", onMove);
      if (hero && heroRef && heroRef.current === handle) heroRef.current = null;
    };
  }, [mode, hero, reduced, heroRef]);

  return (
    <div className={["strip", hero ? "strip-hero" : "", className ?? ""].join(" ").trim()} aria-hidden="true">
      {reduced ? <StaticTrace flat={mode === "flatline"} beats={mode === "quiet" ? 3 : 5} /> : <canvas ref={canvasRef} />}
    </div>
  );
}

/** Static trace for reduced motion and for print. A fixed PQRST polyline. */
export function StaticTrace({ className, beats = 4, flat = false }: { className?: string; beats?: number; flat?: boolean }) {
  const points = useMemo(() => {
    const n = 600;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * 1000;
      const p = ((i / n) * beats) % 1;
      const y = 62 - (flat && i / n > 0.55 ? 0 : pqrst(p)) * 40;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, [beats, flat]);
  return (
    <svg className={className} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {flat && <path d="M544 56 l12 12 m0 -12 l-12 12" stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}
