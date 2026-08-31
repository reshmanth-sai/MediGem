"use client";

import React, { useState } from "react";
import { PresenterControls } from "./PresenterControls";
import { HeroHeader } from "@/components/dashboard/HeroHeader";
import { WhyMediGem } from "@/components/dashboard/WhyMediGem";
import { JudgeDashboard } from "@/components/judge/JudgeDashboard";
import { StepPatientDetails } from "@/components/new-case/StepPatientDetails";
import { StepUploads } from "@/components/new-case/StepUploads";
import { LoadingTransition } from "@/components/new-case/LoadingTransition";
import { ConfidenceDashboard } from "@/components/results/ConfidenceDashboard";
import { ClinicalSummaryCard } from "@/components/results/ClinicalSummaryCard";
import { ClinicalInsightsDashboard } from "@/components/history/ClinicalInsightsDashboard";
import { EvaluationMetricsCharts } from "@/components/evaluation/EvaluationMetricsCharts";
import { Card } from "@/components/ui/Card";
import { H1, H2, Body, BodySm } from "@/components/ui/Typography";
import { Award, CheckCircle2 } from "lucide-react";

export function PresentationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const handleNext = () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-ground text-ink p-8 flex flex-col justify-between max-w-7xl mx-auto space-y-6">
      {/* Slide header */}
      <div className="flex items-center justify-between gap-4 border-b border-rule pb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Award className="h-6 w-6 text-action shrink-0" aria-hidden="true" />
          <div className="space-y-0.5 min-w-0">
            <H1>MediGem Hackathon Presentation Flow</H1>
            <BodySm className="text-ink-muted">
              Offline AI clinical co-pilot for rural healthcare workers
            </BodySm>
          </div>
        </div>

        <nav aria-label="Slides" className="flex gap-1 shrink-0">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const step = i + 1;
            const isCurrent = step === currentStep;
            return (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                aria-label={`Go to slide ${step} of ${totalSteps}`}
                aria-current={isCurrent ? "step" : undefined}
                className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                  isCurrent
                    ? "w-10 bg-action"
                    : step < currentStep
                    ? "w-6 bg-action/50"
                    : "w-6 bg-surface-raised border border-rule"
                }`}
              />
            );
          })}
        </nav>
      </div>

      {/* Slide content */}
      <div className="flex-1 py-4">
        {currentStep === 1 && (
          <div className="space-y-6">
            <HeroHeader />
            <JudgeDashboard />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <WhyMediGem />
          </div>
        )}

        {currentStep === 3 && (
          <Card className="text-center space-y-4 p-8">
            <H2>Step 3: New Case Launcher</H2>
            <Body className="text-ink-muted mx-auto">
              Primary intake workspace designed for low-resource clinics and mobile health units.
            </Body>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <StepPatientDetails
              formData={{
                patientName: "Ramesh Kumar",
                patientId: "P-101",
                age: 45,
                gender: "Male",
                chiefComplaint: "Substernal chest tightness radiating to left shoulder.",
              }}
              onChange={() => {}}
            />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <StepUploads uploadedFiles={[]} onAddFile={() => {}} onRemoveFile={() => {}} />
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <LoadingTransition />
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <ConfidenceDashboard />
            <ClinicalSummaryCard />
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4">
            <ClinicalInsightsDashboard />
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-4">
            <EvaluationMetricsCharts />
          </div>
        )}

        {currentStep === 10 && (
          <Card className="text-center space-y-6 p-10">
            <CheckCircle2 className="h-12 w-12 text-action mx-auto" strokeWidth={1.75} aria-hidden="true" />
            <div className="space-y-2">
              <H2>Thank You and Open Q&amp;A</H2>
              <Body className="text-ink-muted mx-auto">
                MediGem delivers 100% offline, explainable, emergency-first AI decision support to
                healthcare workers where it matters most.
              </Body>
            </div>
          </Card>
        )}
      </div>

      {/* Presenter controls */}
      <PresenterControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectStep={(s) => setCurrentStep(s)}
      />
    </div>
  );
}
