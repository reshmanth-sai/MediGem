"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Maximize2, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    let timer: any;
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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur border border-teal-800 rounded-full px-5 py-2.5 shadow-2xl flex items-center space-x-4 text-xs font-mono">
      {/* Step Navigator */}
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="text-white hover:text-teal-300 p-1" onClick={onPrev} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-bold text-teal-400">
          STEP {currentStep} / {totalSteps}
        </span>
        <Button size="sm" variant="ghost" className="text-white hover:text-teal-300 p-1" onClick={onNext} disabled={currentStep === totalSteps}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Countdown Timer */}
      <div className="flex items-center space-x-2">
        <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="hover:text-teal-300">
          {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <span className={`font-bold ${timeLeftSec < 60 ? "text-red-400 animate-pulse" : "text-amber-400"}`}>
          ⏱️ {formatTimer(timeLeftSec)}
        </span>
        <button onClick={() => setTimeLeftSec(300)} className="hover:text-teal-300">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Mode Controls */}
      <div className="flex items-center space-x-2">
        <button onClick={() => setFocusMode(!focusMode)} className={`p-1 rounded ${focusMode ? "text-teal-400" : "text-slate-400"}`}>
          <Eye className="h-4 w-4" />
        </button>
        <button onClick={toggleFullscreen} className="p-1 text-slate-400 hover:text-white">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
