"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Award, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { H2, H3, Label, BodySm } from "@/components/ui/Typography";

const DEMO_STEPS = [
  { step: 1, title: "1. Select Synthetic Preset", desc: "Select pre-filled 12-Lead ECG or Lab Report PDF" },
  { step: 2, title: "2. Instant Safety Gate Intercept", desc: "Evaluate acute symptoms in under 0.3ms" },
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
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Award className="h-6 w-6 text-action shrink-0" aria-hidden="true" />
          <div className="space-y-0.5 min-w-0">
            <H2>5-Minute Hackathon Demo Mode</H2>
            <BodySm className="text-ink-muted">
              Guided one-click presentation player for judges and live demonstrations
            </BodySm>
          </div>
        </div>

        <div className="shrink-0">
          {!isPlaying ? (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={startWalkthrough}
            >
              Start Guided Presentation
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => setIsPlaying(false)}
            >
              Reset Walkthrough
            </Button>
          )}
        </div>
      </div>

      {isPlaying && (
        <div className="pt-4 border-t border-rule space-y-3" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <Label>
              Presentation step {activeStep} of {DEMO_STEPS.length}
            </Label>
            <Label>04:30 remaining</Label>
          </div>

          <div className="space-y-1">
            <H3>{DEMO_STEPS[activeStep - 1].title}</H3>
            <BodySm className="text-ink-muted">{DEMO_STEPS[activeStep - 1].desc}</BodySm>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <ol className="flex gap-1" aria-label="Presentation progress">
              {DEMO_STEPS.map((s) => (
                <li
                  key={s.step}
                  aria-current={s.step === activeStep ? "step" : undefined}
                  className={`h-2 w-8 rounded-full ${
                    s.step <= activeStep ? "bg-action" : "bg-surface-raised border border-rule"
                  }`}
                >
                  <span className="sr-only">
                    Step {s.step}
                    {s.step < activeStep ? " complete" : s.step === activeStep ? " current" : " upcoming"}
                  </span>
                </li>
              ))}
            </ol>

            <Button
              size="sm"
              variant="primary"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              onClick={nextStep}
            >
              {activeStep === DEMO_STEPS.length ? "Finish Demo" : "Next Step"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
