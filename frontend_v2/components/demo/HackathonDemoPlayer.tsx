"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DEMO_STEPS = [
  { step: 1, title: "1. Select Synthetic Preset", desc: "Select pre-filled 12-Lead ECG or Lab Report PDF" },
  { step: 2, title: "2. Instant Safety Gate Intercept", desc: "Evaluate acute symptoms in < 0.3ms" },
  { step: 3, title: "3. Gemma 3 4B Local Reasoning", desc: "Execute 100% offline Ollama inference" },
  { step: 4, title: "4. Reasoning Transparency", desc: "Inspect PyMuPDF text layers & OpenCV blur scores" },
  { step: 5, title: "5. Generate Referral Memo", desc: "Print formatted clinical referral memorandum" },
];

export function HackathonDemoPlayer() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const startWalkthrough = () => {
    setIsPlaying(true);
    setActiveStep(1);
  };

  const nextStep = () => {
    if (activeStep < DEMO_STEPS.length) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setActiveStep(1);
    }
  };

  return (
    <Card className="space-y-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-teal-800 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-teal-400" />
          <div>
            <h2 className="text-lg font-bold text-white">🏆 5-Minute Hackathon Demo Mode</h2>
            <p className="text-xs text-slate-300">
              Guided 1-click presentation player for judges & live demonstrations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isPlaying ? (
            <Button size="sm" variant="primary" leftIcon={<Play className="h-4 w-4" />} onClick={startWalkthrough}>
              Start 5-Min Guided Presentation
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="border-teal-400 text-teal-300" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setIsPlaying(false)}>
              Reset Walkthrough
            </Button>
          )}
        </div>
      </div>

      {isPlaying && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-700/60 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono text-teal-300">
            <span>PRESENTATION STEP {activeStep} / {DEMO_STEPS.length}</span>
            <span>04:30 REMAINING</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {DEMO_STEPS[activeStep - 1].title}
            </h3>
            <p className="text-xs text-slate-300">
              {DEMO_STEPS[activeStep - 1].desc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              {DEMO_STEPS.map((s) => (
                <div
                  key={s.step}
                  className={`h-2 w-8 rounded-full ${
                    s.step <= activeStep ? "bg-teal-500" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>

            <Button size="sm" variant="primary" rightIcon={<ChevronRight className="h-4 w-4" />} onClick={nextStep}>
              {activeStep === DEMO_STEPS.length ? "Finish Demo" : "Next Step"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
