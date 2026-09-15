"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCaseList } from "@/providers/CasesProvider";
import { prefersReducedMotion } from "@/lib/motion";
import { TOUR_SEEN_KEY, TOUR_STEPS, TOUR_TOTAL, parseTourParam, tourStepFor } from "@/lib/tour";

/*
 * A four-step, dismissible tour of the workstation: the queue, an
 * intercepted example, where a live run starts, and the replay picker that
 * gets you to a real reasoning card. Auto-starts once, on a first visit to
 * /workstation, only in replay/example mode (the hosted demo); a link to any
 * step works any time via ?tour=1..4, seen or not. Nothing here scores or
 * fabricates anything -- it only points at what is already on screen.
 *
 * A highlight ring is drawn around the real element (pointer-events none, so
 * clicking straight through it works exactly as it would without the tour)
 * and a small callout card sits near it with the step's explanation.
 */
export function ProductTour() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { source } = useCaseList();

  const [mounted, setMounted] = useState(false);
  const [wide, setWide] = useState(false);
  const [autoStep, setAutoStep] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (pathname === "/workstation" && !localStorage.getItem(TOUR_SEEN_KEY)) setAutoStep(1);
    } catch {
      // Private browsing or storage disabled: no auto-start, ?tour=N still works.
    }
  }, [mounted, pathname]);

  const requestedStep = parseTourParam(searchParams.get("tour"));
  const activeStepNumber = source === "example" && wide ? requestedStep ?? autoStep : null;
  const step = activeStepNumber != null ? tourStepFor(pathname, activeStepNumber) : undefined;

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {
      // Nothing to persist; the tour just won't remember it was dismissed.
    }
  }, []);

  const dismiss = useCallback(() => {
    markSeen();
    setAutoStep(null);
    if (requestedStep != null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("tour");
      const qs = params.toString();
      router.replace((qs ? `${pathname}?${qs}` : pathname) as Route, { scroll: false });
    }
  }, [markSeen, pathname, requestedStep, router, searchParams]);

  const goTo = useCallback(
    (n: number) => {
      if (n > TOUR_TOTAL) {
        dismiss();
        return;
      }
      const next = TOUR_STEPS.find((s) => s.step === n);
      if (!next) return;
      setAutoStep(next.path === pathname ? n : null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tour", String(n));
      const qs = params.toString();
      if (next.path === pathname) router.replace(`${pathname}?${qs}` as Route, { scroll: false });
      else router.push(`${next.path}?${qs}` as Route);
    },
    [dismiss, pathname, router, searchParams]
  );

  // Find and track the target element. Retries briefly on mount / step
  // change in case the page it just navigated to is still rendering.
  useEffect(() => {
    if (!step) {
      setRect(null);
      return;
    }
    let raf = 0;
    let tries = 0;
    let cleanup: (() => void) | undefined;
    const tick = () => {
      const el = document.querySelector<HTMLElement>(step.selector);
      if (el) {
        el.scrollIntoView?.({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
        const update = () => setRect(el.getBoundingClientRect());
        update();
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        cardRef.current?.focus();
        // Not every environment has ResizeObserver (older browsers, jsdom in
        // tests); the scroll/resize listeners above already cover the common
        // case of the target moving, so this is a nice-to-have, not load-bearing.
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
        ro?.observe(el);
        cleanup = () => {
          ro?.disconnect();
          window.removeEventListener("scroll", update, true);
          window.removeEventListener("resize", update);
        };
        return;
      }
      tries += 1;
      if (tries < 60) raf = requestAnimationFrame(tick);
      else setRect(null); // target never appeared; stand down quietly for this step
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, [step]);

  useEffect(() => {
    if (!step) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, dismiss]);

  if (!step || !rect) return null;

  const cardWidth = 320;
  const gap = 12;
  const spaceBelow = window.innerHeight - rect.bottom;
  const placeBelow = spaceBelow > 180 || rect.top < 180;
  const top = placeBelow ? Math.min(rect.bottom + gap, window.innerHeight - 220) : Math.max(gap, rect.top - gap - 200);
  const left = Math.min(Math.max(gap, rect.left), window.innerWidth - cardWidth - gap);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed z-[60] rounded-control ring-2 ring-action ring-offset-2 ring-offset-ground pointer-events-none motion-safe:transition-all motion-safe:duration-200"
        style={{ top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-label={`Product tour, step ${step.step} of ${TOUR_TOTAL}`}
        tabIndex={-1}
        className="fixed z-[60] w-[min(20rem,calc(100vw-2rem))] rounded-control border border-rule bg-surface p-4 space-y-3 outline-none"
        style={{ top, left }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-label font-mono text-ink-muted">Step {step.step} of {TOUR_TOTAL}</span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss tour"
            className="text-ink-muted hover:text-ink rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus shrink-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-body-sm font-semibold text-ink">{step.title}</p>
        <p className="text-body-sm text-ink-muted">{step.body}</p>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" size="sm" onClick={dismiss}>
            Skip tour
          </Button>
          <Button type="button" size="sm" onClick={() => goTo(step.step + 1)}>
            {step.step === TOUR_TOTAL ? "Got it" : "Next"}
          </Button>
        </div>
      </div>
    </>
  );
}
