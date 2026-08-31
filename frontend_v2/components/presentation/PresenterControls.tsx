"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Maximize2, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/** Shared chrome for the small icon-only controls in the presenter bar. */
const ICON_CONTROL =
  "h-9 w-9 inline-flex items-center justify-center rounded-control text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function PresenterControls({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSelectStep,
}: {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectStep: (step: number) => void;
}) {
  const [timeLeftSec, setTimeLeftSec] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isTimerRunning && timeLeftSec > 0) {
      timer = setInterval(() => setTimeLeftSec((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeftSec]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const isTimeCritical = timeLeftSec < 60;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-surface border border-rule rounded-full px-4 py-2 flex items-center gap-4 text-body-sm">
      {/* Step navigator */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onPrev}
          disabled={currentStep === 1}
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="font-mono tabular font-semibold text-ink whitespace-nowrap">
          Step {currentStep} / {totalSteps}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onNext}
          disabled={currentStep === totalSteps}
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="h-5 w-px bg-rule" aria-hidden="true" />

      {/* Countdown timer */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className={ICON_CONTROL}
          aria-label={isTimerRunning ? "Pause presentation timer" : "Resume presentation timer"}
        >
          {isTimerRunning ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <span
          className={cn(
            "font-mono tabular font-semibold whitespace-nowrap",
            isTimeCritical ? "text-risk-emergency" : "text-ink"
          )}
        >
          <span className="sr-only">Time remaining{isTimeCritical ? ", under one minute" : ""}: </span>
          {formatTimer(timeLeftSec)}
        </span>
        <button
          type="button"
          onClick={() => setTimeLeftSec(300)}
          className={ICON_CONTROL}
          aria-label="Reset presentation timer"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="h-5 w-px bg-rule" aria-hidden="true" />

      {/* Mode controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setFocusMode(!focusMode)}
          aria-pressed={focusMode}
          className={cn(ICON_CONTROL, focusMode && "bg-action-subtle text-action")}
          aria-label="Toggle focus mode"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={ICON_CONTROL}
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
