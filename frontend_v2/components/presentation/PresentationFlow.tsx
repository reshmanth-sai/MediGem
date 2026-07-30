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
import { Award, CheckCircle2 } from "lucide-react";

export function PresentationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const handleNext = () => setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col justify-between max-w-7xl mx-auto space-y-6">
      {/* Top Slide Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-600/30 text-teal-400 border border-teal-500/40">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              MediGem Hackathon Presentation Flow
            </h1>
            <p className="text-xs text-slate-400">
              Offline AI Clinical Co-Pilot for Rural Healthcare Workers
            </p>
          </div>
        </div>

        <div className="flex space-x-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i + 1)}
              className={`h-2 w-6 rounded-full transition-all ${
                i + 1 === currentStep
                  ? "bg-teal-400 w-10"
                  : i + 1 < currentStep
                  ? "bg-teal-700"
                  : "bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Slide Content Container */}
      <div className="flex-1 py-4">
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <HeroHeader />
            <JudgeDashboard />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <WhyMediGem />
          </div>
        )}

        {currentStep === 3 && (
          <Card className="p-8 text-center space-y-4 bg-slate-900 border-slate-800">
            <h2 className="text-2xl font-bold text-teal-400">Step 3: New Case Launcher</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Primary intake workspace designed for low-resource clinics and mobile health units.
            </p>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
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
          <div className="space-y-4 animate-in fade-in">
            <StepUploads uploadedFiles={[]} onAddFile={() => {}} onRemoveFile={() => {}} />
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <LoadingTransition />
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in">
            <ConfidenceDashboard />
            <ClinicalSummaryCard />
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4 animate-in fade-in">
            <ClinicalInsightsDashboard />
          </div>
        )}

        {currentStep === 9 && (
          <div className="space-y-4 animate-in fade-in">
            <EvaluationMetricsCharts />
          </div>
        )}

        {currentStep === 10 && (
          <Card className="p-10 text-center space-y-6 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border-teal-800">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-white">Thank You & Open Q&A</h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                MediGem delivers 100% offline, explainable, emergency-first AI decision support to healthcare workers where it matters most.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Floating Presenter Controls */}
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
