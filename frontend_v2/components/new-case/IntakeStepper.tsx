"use client";

import React from "react";
import { Check, Clock, ShieldCheck } from "lucide-react";
import { Label, BodySm } from "@/components/ui/Typography";
import { prefersReducedMotion } from "@/lib/motion";

export interface IntakeStepperProps {
  currentStep: number;
  /** Only completed steps are selectable, so the wizard cannot be skipped. */
  onSelectStep: (step: number) => void;
  progressPct: number;
}

const STEPS = [
  { num: 1, label: "Patient details", desc: "Demographics and vitals" },
  { num: 2, label: "Presenting symptoms", desc: "Symptoms and onset" },
  { num: 3, label: "Medical history", desc: "Illnesses and medications" },
  { num: 4, label: "Clinical uploads", desc: "ECG, labs and scans" },
  { num: 5, label: "Review and reasoning", desc: "Validation and pipeline" },
];

export function IntakeStepper({
  currentStep,
  onSelectStep,
  progressPct,
}: IntakeStepperProps) {
  const stripRef = React.useRef<HTMLOListElement>(null);

  // On the mobile strip the current step can sit off to the right after an
  // advance. Bring it back into view; on `sm` and up the list is a static
  // grid and there is nothing to scroll.
  React.useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLElement>("[data-active]");
    // jsdom has no layout and so no scrollIntoView; the guard keeps the
    // component mountable under test as well as in a browser without it.
    // Smooth scrolling is motion, so it goes through the same preference the
    // rest of the app reads -- reduced motion still moves the strip, it just
    // jumps rather than animates.
    active?.scrollIntoView?.({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentStep]);

  return (
    <nav
      aria-label="Intake progress"
      className="rounded-card bg-surface border border-rule p-4 space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-chip text-label bg-action-subtle text-action border border-rule">
            Guided clinical intake
          </span>
          <BodySm className="text-ink-muted">
            Step {currentStep} of 5, {progressPct} percent complete
          </BodySm>
        </div>

        <div className="flex items-center gap-3">
          <BodySm className="flex items-center gap-1 text-ink-muted">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>About 2 minutes remaining</span>
          </BodySm>
          <BodySm className="flex items-center gap-1 text-risk-low">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Fully offline</span>
          </BodySm>
        </div>
      </div>

      {/*
        Two columns of five cards cost a phone most of a screen before the
        clinician reaches the first field. Below `sm` the steps become one
        horizontally scrolling row, which keeps every step reachable -- a
        completed one is still the way back -- in a single row's height.
        The active step is scrolled into view by the effect above.
      */}
      <ol
        ref={stripRef}
        // A scroll container that a keyboard cannot reach is WCAG 2.1.1:
        // at step 1 every card is a plain div, so the strip holds nothing
        // focusable and arrow keys never get a chance to pan it. tabIndex=0
        // makes the region itself a tab stop, which is what axe's
        // scrollable-region-focusable rule asks for, and the label says what
        // the stop is. Both are inert from `sm` up, where the list is a grid
        // with nothing to scroll.
        tabIndex={0}
        aria-label="Intake steps"
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pt-1 list-none m-0 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-5"
      >
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.num;
          const isActive = currentStep === s.num;
          const statusText = isCompleted
            ? "Completed"
            : isActive
            ? "Current step"
            : "Not started";

          const tone = isActive
            ? "bg-action-subtle border-action text-ink"
            : isCompleted
            ? "bg-surface-raised border-risk-low text-ink"
            : "bg-surface-raised border-rule text-ink-muted";

          const content = (
            <>
              <span className="flex items-center justify-between mb-1">
                <Label as="span">Step {s.num}</Label>
                {isCompleted ? (
                  <span className="h-5 w-5 rounded-full bg-risk-low text-on-action flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                ) : (
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-body-sm font-semibold font-mono ${
                      isActive
                        ? "bg-action text-on-action"
                        : // `text-ink` rather than `text-ink-muted`: muted ink on
                          // the rule fill measures 3.93:1 in Day, under the 4.5:1
                          // WCAG 1.4.3 minimum for a 14px numeral. Full ink clears
                          // the threshold in both themes, and the muted fill still
                          // reads as an upcoming step.
                          "bg-rule text-ink"
                    }`}
                    aria-hidden="true"
                  >
                    {s.num}
                  </span>
                )}
              </span>
              <span className="block text-body-sm font-semibold text-ink">
                {s.label}
              </span>
              <span className="block text-body-sm text-ink-muted">
                {s.desc}
              </span>
              <span className="sr-only">{statusText}</span>
            </>
          );

          return (
            <li
              key={s.num}
              data-active={isActive || undefined}
              // `relative` is load-bearing: the status text below is `sr-only`,
              // which is absolutely positioned. With no positioned ancestor it
              // resolves against the initial containing block, escapes the
              // strip's `overflow-x-auto` clip entirely, and drags the document
              // scroll width out to the full width of all five cards -- a
              // 565px horizontal scrollbar on the whole page. Positioning the
              // item makes it the containing block, so the clip applies.
              className="relative w-[13.5rem] shrink-0 snap-start sm:w-auto sm:shrink"
            >
              {isCompleted ? (
                <button
                  type="button"
                  onClick={() => onSelectStep(s.num)}
                  className={`h-full w-full text-left p-2.5 rounded-control border transition-colors hover:border-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${tone}`}
                >
                  {content}
                </button>
              ) : (
                <div
                  aria-current={isActive ? "step" : undefined}
                  className={`h-full p-2.5 rounded-control border ${tone}`}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
