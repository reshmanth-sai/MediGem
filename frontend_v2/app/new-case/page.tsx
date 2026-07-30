"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Save, X, PlayCircle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { IntakeStepper } from "@/components/new-case/IntakeStepper";
import { StickyPatientContextSidebar } from "@/components/new-case/StickyPatientContextSidebar";
import { StepPatientDetails, PatientDetailsFormData } from "@/components/new-case/StepPatientDetails";
import { SmartSymptomSearch } from "@/components/new-case/SmartSymptomSearch";
import { StructuredMedicalHistory } from "@/components/new-case/StructuredMedicalHistory";
import { DocumentUploadWorkspace } from "@/components/new-case/DocumentUploadWorkspace";
import { StepReview } from "@/components/new-case/StepReview";
import { AIExecutionPipeline } from "@/components/new-case/AIExecutionPipeline";
import { MedicalHistoryData } from "@/components/new-case/StepMedicalHistory";
import { UploadedFileItem } from "@/components/new-case/StepUploads";
import { calculateCustomUrgencyScore, ClinicalCaseData } from "@/lib/casesData";

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
      tempCelsius: 37.8,
      spO2Percent: 96,
      chiefComplaint: "Acute onset substernal chest discomfort.",
      location: "Sub-Center Clinic A",
    });
    setSymptoms(["Chest tightness", "Shortness of breath", "Diaphoresis"]);
    setSymptomDuration("30 minutes ago");
    setSymptomSeverity("Severe");
    setCurrentStep(5);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    const calc = calculateCustomUrgencyScore(
      [
        { label: "HR", value: `${patientData.hrBpm} bpm`, status: (patientData.hrBpm ?? 0) > 100 ? "alert" : "normal" },
        { label: "BP", value: `${patientData.systolicBp}/${patientData.diastolicBp} mmHg`, status: (patientData.systolicBp ?? 0) > 140 ? "warning" : "normal" },
      ],
      symptoms
    );

    const customCase: ClinicalCaseData = {
      caseId: "CASE-CUSTOM",
      patientId: patientData.patientId || "P-CUSTOM",
      patientName: patientData.patientName || "Current Patient Intake",
      age: patientData.age || 45,
      gender: patientData.gender || "Male",
      arrivalTime: "Arrived just now",
      assignedWorker: "Priya Sharma (ANM)",
      activeUser: "Dr. Vikram Patel (CHO)",
      village: "Rampur Sub-Center",
      riskLevel: calc.riskLevel,
      urgencyScore: calc.urgencyScore,
      primaryFinding: calc.primaryFinding,
      clinicalSummary: `Intake Assessment for ${patientData.patientName || "Patient"} (${patientData.age || 45}y/o ${patientData.gender || "Male"}). Chief complaint: ${patientData.chiefComplaint}. Vitals: HR ${patientData.hrBpm} bpm, BP ${patientData.systolicBp}/${patientData.diastolicBp} mmHg, SpO2 ${patientData.spO2Percent}%.`,
      recommendedAction: calc.recommendedAction,
      aiConfidence: 96.4,
      vitals: [
        { label: "HR", value: `${patientData.hrBpm} bpm`, status: (patientData.hrBpm ?? 0) > 100 ? "alert" : "normal" },
        { label: "BP", value: `${patientData.systolicBp}/${patientData.diastolicBp} mmHg`, status: (patientData.systolicBp ?? 0) > 140 ? "warning" : "normal" },
        { label: "Temp", value: `${patientData.tempCelsius}°C`, status: (patientData.tempCelsius ?? 0) > 38.0 ? "warning" : "normal" },
        { label: "SpO2", value: `${patientData.spO2Percent}%`, status: (patientData.spO2Percent ?? 100) < 94 ? "alert" : "normal" },
      ],
      chiefComplaint: patientData.chiefComplaint,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("medigem_custom_case", JSON.stringify(customCase));
    }

    router.push("/results/CASE-CUSTOM");
  };

  const progressPct = Math.round((currentStep / 5) * 100);

  return (
    <AppShell>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-16">
        {/* Workspace Landing Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Guided Clinical Patient Intake Workstation
            </h1>
            <p className="text-xs text-slate-400">
              Offline clinical co-pilot intake • 100% Edge AI reasoning • Local SQLite storage
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadDemoCase}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-700"
            >
              <PlayCircle className="h-4 w-4 text-teal-400" />
              <span>Load Demo Case</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800 transition-colors flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Linear/Apple Progress Timeline Stepper */}
        <IntakeStepper currentStep={currentStep} setCurrentStep={setCurrentStep} progressPct={progressPct} />

        {/* 2-Column Master Layout (65% Intake Wizard / 35% Sticky Patient Context Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (65% Intake Wizard Step) */}
          <div className="lg:col-span-8 space-y-4">
            {currentStep === 1 && (
              <StepPatientDetails formData={patientData} onChange={handlePatientDataChange} />
            )}

            {currentStep === 2 && (
              <SmartSymptomSearch
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                duration={symptomDuration}
                setDuration={setSymptomDuration}
                severity={symptomSeverity}
                setSeverity={setSymptomSeverity}
              />
            )}

            {currentStep === 3 && (
              <StructuredMedicalHistory historyData={historyData} onChange={handleHistoryDataChange} />
            )}

            {currentStep === 4 && (
              <DocumentUploadWorkspace
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

            {/* Navigation Controls Bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                  currentStep === 1
                    ? "bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Step</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors flex items-center space-x-1"
                >
                  <Save className="h-4 w-4 text-teal-400" />
                  <span>Save Draft</span>
                </button>

                {currentStep < 5 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-1.5 border border-teal-300 shadow-lg"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartAnalysis}
                    className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all flex items-center space-x-2 border border-emerald-300 shadow-xl"
                  >
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>Run AI Clinical Reasoning</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (35% Sticky Patient Context Sidebar) */}
          <div className="lg:col-span-4">
            <StickyPatientContextSidebar
              patientData={patientData}
              symptoms={symptoms}
              historyData={historyData}
              uploadedFiles={uploadedFiles}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>

      {/* Stage-by-Stage AI Reasoning Pipeline Overlay */}
      {isAnalyzing && <AIExecutionPipeline onComplete={handleAnalysisComplete} />}
    </AppShell>
  );
}
