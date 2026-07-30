"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, X, PlayCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { OfflineBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IntakeStepper } from "@/components/new-case/IntakeStepper";
import { StepPatientDetails, PatientDetailsFormData } from "@/components/new-case/StepPatientDetails";
import { StepSymptoms } from "@/components/new-case/StepSymptoms";
import { StepMedicalHistory, MedicalHistoryData } from "@/components/new-case/StepMedicalHistory";
import { StepUploads, UploadedFileItem } from "@/components/new-case/StepUploads";
import { StepReview } from "@/components/new-case/StepReview";
import { StepConfirmAnalyze } from "@/components/new-case/StepConfirmAnalyze";
import { LoadingTransition } from "@/components/new-case/LoadingTransition";

export default function NewCasePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form State
  const [patientData, setPatientData] = useState<PatientDetailsFormData>({
    patientName: "Ramesh Kumar",
    patientId: "P-101",
    age: 45,
    gender: "Male",
    weightKg: 70,
    heightCm: 172,
    hrBpm: 95,
    systolicBp: 138,
    diastolicBp: 88,
    tempCelsius: 37.2,
    spO2Percent: 98,
    chiefComplaint: "Patient presents in rural clinic with chest tightness and palpitations.",
    location: "Sub-Center Clinic A",
  });

  const [symptoms, setSymptoms] = useState<string[]>(["Chest tightness", "Palpitations"]);
  const [symptomDuration, setSymptomDuration] = useState("2 hours ago");
  const [symptomSeverity, setSymptomSeverity] = useState("Moderate");
  const [symptomNotes, setSymptomNotes] = useState("Gradual onset while at rest.");

  const [historyData, setHistoryData] = useState<MedicalHistoryData>({
    pastIllnesses: "None reported",
    medications: "Amlodipine 5mg OD",
    allergies: "None known",
    surgeries: "None",
    chronicConditions: "Hypertension (3 years)",
    lifestyleNotes: "Non-smoker",
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

  const handlePatientDataChange = (field: keyof PatientDetailsFormData, val: any) => {
    setPatientData((prev) => ({ ...prev, [field]: val }));
  };

  const handleHistoryDataChange = (field: keyof MedicalHistoryData, val: string) => {
    setHistoryData((prev) => ({ ...prev, [field]: val }));
  };

  const handleAddFile = (file: File, type: string) => {
    const newItem: UploadedFileItem = {
      id: Math.random().toString(36).substring(2, 9),
      file,
      type,
    };
    setUploadedFiles((prev) => [...prev, newItem]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const loadDemoCase = () => {
    setPatientData({
      patientName: "Synthetic Demo Patient",
      patientId: "DEMO-9901",
      age: 62,
      gender: "Female",
      hrBpm: 110,
      systolicBp: 155,
      diastolicBp: 95,
      chiefComplaint: "Acute onset substernal chest discomfort.",
    });
    setSymptoms(["Chest tightness", "Shortness of breath", "Diaphoresis"]);
    setSymptomDuration("30 minutes ago");
    setSymptomSeverity("Severe");
    setCurrentStep(5); // Jump directly to Review
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    router.push("/results/CASE-8901");
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-8">
        {/* Workspace Landing Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Guided Clinical Patient Intake
              </h1>
              <OfflineBadge />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Estimated completion time: ~3 min • 100% Offline Local Reasoning
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<PlayCircle className="h-4 w-4" />}
              onClick={loadDemoCase}
            >
              Load Demo Case
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<X className="h-4 w-4" />}
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Progress Stepper */}
        {!isAnalyzing && (
          <IntakeStepper currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />
        )}

        {/* Dynamic Workflow Step Content */}
        {isAnalyzing ? (
          <LoadingTransition onComplete={handleAnalysisComplete} />
        ) : (
          <div className="space-y-6">
            {currentStep === 1 && (
              <StepPatientDetails formData={patientData} onChange={handlePatientDataChange} />
            )}

            {currentStep === 2 && (
              <StepSymptoms
                symptoms={symptoms}
                duration={symptomDuration}
                severity={symptomSeverity}
                notes={symptomNotes}
                onChange={(field, val) => {
                  if (field === "symptoms") setSymptoms(val);
                  if (field === "duration") setSymptomDuration(val);
                  if (field === "severity") setSymptomSeverity(val);
                  if (field === "notes") setSymptomNotes(val);
                }}
              />
            )}

            {currentStep === 3 && (
              <StepMedicalHistory data={historyData} onChange={handleHistoryDataChange} />
            )}

            {currentStep === 4 && (
              <StepUploads
                uploadedFiles={uploadedFiles}
                onAddFile={handleAddFile}
                onRemoveFile={handleRemoveFile}
              />
            )}

            {currentStep === 5 && (
              <StepReview
                patientData={patientData}
                symptoms={symptoms}
                symptomDuration={symptomDuration}
                symptomSeverity={symptomSeverity}
                historyData={historyData}
                uploadedFiles={uploadedFiles}
                onEditStep={(s) => setCurrentStep(s)}
              />
            )}

            {currentStep === 6 && (
              <StepConfirmAnalyze
                patientName={patientData.patientName}
                fileCount={uploadedFiles.length}
                onStartAnalysis={handleStartAnalysis}
              />
            )}

            {/* Bottom Workflow Navigation Bar */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button
                variant="outline"
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                Previous Step
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" leftIcon={<Save className="h-4 w-4" />}>
                  Save Draft
                </Button>

                {currentStep < 6 && (
                  <Button
                    variant="primary"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
