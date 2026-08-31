"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, X, PlayCircle, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { H1, BodySm } from "@/components/ui/Typography";

import { IntakeStepper } from "@/components/new-case/IntakeStepper";
import { StickyPatientContextSidebar } from "@/components/new-case/StickyPatientContextSidebar";
import {
  StepPatientDetails,
  type PatientDetailsField,
  type PatientDetailsFormData,
} from "@/components/new-case/StepPatientDetails";
import { SmartSymptomSearch } from "@/components/new-case/SmartSymptomSearch";
import {
  StructuredMedicalHistory,
  type MedicalHistoryField,
} from "@/components/new-case/StructuredMedicalHistory";
import { DocumentUploadWorkspace } from "@/components/new-case/DocumentUploadWorkspace";
import { StepReview } from "@/components/new-case/StepReview";
import { AIExecutionPipeline } from "@/components/new-case/AIExecutionPipeline";

import { useCaseDraft, type IntakeStep } from "@/lib/store/caseDraft";
import { stepSchemas } from "@/lib/schemas/patient";
import { calculateCustomUrgencyScore, type ClinicalCaseData } from "@/lib/casesData";
import {
  AGE_NOT_RECORDED,
  buildErrorSummary,
  displayVital,
  fieldError,
  isAgeRecorded,
  toFormValues,
  type IntakeFieldName,
  type IntakeFormValues,
} from "./intakeForm";

/**
 * The exact object identity the draft store hands out for an untouched (or
 * freshly reset) patient. Captured at module load, before any interaction can
 * have written to the draft. updatePatient always allocates a new object and
 * reset restores this one, so `patient === PRISTINE_PATIENT` is an exact test
 * for "nothing has been entered yet" rather than a guess based on field
 * contents. The wizard uses it once, on mount, to replace the store's
 * ambiguous `age: 0` default with the NaN "not recorded" sentinel described in
 * ./intakeForm.ts.
 */
const PRISTINE_PATIENT = useCaseDraft.getState().patient;

const CASE_ID = "CASE-CUSTOM";

export default function NewCasePage() {
  const router = useRouter();

  const step = useCaseDraft((s) => s.step);
  const patient = useCaseDraft((s) => s.patient);
  const symptoms = useCaseDraft((s) => s.symptoms);
  const history = useCaseDraft((s) => s.history);
  const uploads = useCaseDraft((s) => s.uploads);
  const setStep = useCaseDraft((s) => s.setStep);
  const updatePatient = useCaseDraft((s) => s.updatePatient);
  const updateSymptoms = useCaseDraft((s) => s.updateSymptoms);
  const updateHistory = useCaseDraft((s) => s.updateHistory);
  const addUpload = useCaseDraft((s) => s.addUpload);
  const removeUpload = useCaseDraft((s) => s.removeUpload);
  const setResult = useCaseDraft((s) => s.setResult);

  // Whether the reasoning overlay is on screen. Not part of the draft, so it
  // stays local: nothing about it needs to survive a route change.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [failedAdvances, setFailedAdvances] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Lift the store's `age: 0` default into the "not recorded" sentinel exactly
  // once, so an untouched age can never pass validation as a literal zero.
  useEffect(() => {
    if (useCaseDraft.getState().patient === PRISTINE_PATIENT) {
      useCaseDraft.getState().updatePatient({ age: AGE_NOT_RECORDED });
    }
  }, []);

  const formValues = useMemo(
    () => toFormValues(patient, symptoms, history),
    [patient, symptoms, history]
  );

  // One resolver per step. react-hook-form reads _options on every render, so
  // swapping the schema as the wizard advances takes effect immediately.
  const resolver = useMemo(
    () => zodResolver(stepSchemas[step]) as unknown as Resolver<IntakeFormValues>,
    [step]
  );

  const {
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<IntakeFormValues>({
    resolver,
    mode: "onBlur",
    values: formValues,
    // The draft store owns the values; keep validation state across the
    // re-syncs that every keystroke causes so a message does not flicker away
    // while the clinician is still fixing the field it belongs to.
    resetOptions: { keepErrors: true, keepTouched: true, keepIsSubmitted: true },
  });

  const summaryEntries = useMemo(
    () => buildErrorSummary(errors, step),
    [errors, step]
  );

  // Move focus to the summary after a failed advance, once the errors it lists
  // have actually rendered.
  useEffect(() => {
    if (failedAdvances > 0) {
      summaryRef.current?.focus();
    }
  }, [failedAdvances]);

  const revalidateField = useCallback(
    (field: IntakeFieldName) => {
      void trigger(field);
    },
    [trigger]
  );

  const goToStep = useCallback(
    (next: number) => {
      setSummaryVisible(false);
      clearErrors();
      setStep(Math.min(5, Math.max(1, next)) as IntakeStep);
    },
    [clearErrors, setStep]
  );

  const handleNext = useCallback(async () => {
    const valid = await trigger();
    if (!valid) {
      setSummaryVisible(true);
      setFailedAdvances((n) => n + 1);
      return;
    }
    goToStep(step + 1);
  }, [trigger, goToStep, step]);

  const handlePatientChange = useCallback(
    (field: PatientDetailsField, val: string | number | null | undefined) => {
      if (field === "age") {
        // The store types age as a number, so "not recorded" is the NaN
        // sentinel rather than null or a dropped key.
        updatePatient({
          age: typeof val === "number" ? val : AGE_NOT_RECORDED,
        });
        return;
      }
      updatePatient({ [field]: val } as Partial<PatientDetailsFormData>);
    },
    [updatePatient]
  );

  const handleHistoryChange = useCallback(
    (field: MedicalHistoryField, val: string) => {
      updateHistory({ [field]: val });
    },
    [updateHistory]
  );

  const handleAddFile = useCallback(
    (file: File, type: string) => {
      addUpload({
        id: Math.random().toString(36).substring(2, 9),
        file,
        type,
      });
    },
    [addUpload]
  );

  /**
   * A deliberate, clearly labelled demo affordance. It is not seeded state:
   * nothing here runs unless a presenter clicks "Load demo case", and the
   * values it writes go through the same store as typed input.
   */
  const loadDemoCase = useCallback(() => {
    updatePatient({
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
    updateSymptoms({
      symptoms: ["Chest tightness", "Shortness of breath", "Diaphoresis"],
      duration: "30 minutes ago",
      severity: "Severe",
    });
    goToStep(5);
  }, [updatePatient, updateSymptoms, goToStep]);

  const handleAnalysisComplete = useCallback(() => {
    const vitals: ClinicalCaseData["vitals"] = [
      {
        label: "HR",
        value: displayVital(patient.hrBpm, "bpm"),
        status: (patient.hrBpm ?? 0) > 100 ? "alert" : "normal",
      },
      {
        label: "BP",
        value:
          patient.systolicBp === undefined || patient.diastolicBp === undefined
            ? "Not recorded"
            : `${patient.systolicBp}/${patient.diastolicBp} mmHg`,
        status: (patient.systolicBp ?? 0) > 140 ? "warning" : "normal",
      },
      {
        label: "Temp",
        value: displayVital(patient.tempCelsius, "C"),
        status: (patient.tempCelsius ?? 0) > 38.0 ? "warning" : "normal",
      },
      {
        label: "SpO2",
        value: displayVital(patient.spO2Percent, "percent"),
        status: (patient.spO2Percent ?? 100) < 94 ? "alert" : "normal",
      },
    ];

    const calc = calculateCustomUrgencyScore(
      vitals.slice(0, 2),
      symptoms.symptoms
    );

    const recordedAge = isAgeRecorded(patient.age) ? patient.age : 0;

    const customCase: ClinicalCaseData = {
      caseId: CASE_ID,
      patientId: patient.patientId || "P-CUSTOM",
      patientName: patient.patientName || "Current patient intake",
      age: recordedAge,
      gender: patient.gender || "Not recorded",
      arrivalTime: "Arrived just now",
      assignedWorker: "Priya Sharma (ANM)",
      activeUser: "Dr. Vikram Patel (CHO)",
      village: patient.location || "Rampur Sub-Center",
      riskLevel: calc.riskLevel,
      urgencyScore: calc.urgencyScore,
      primaryFinding: calc.primaryFinding,
      clinicalSummary: `Intake assessment for ${
        patient.patientName || "this patient"
      }, ${isAgeRecorded(patient.age) ? `${patient.age} years` : "age not recorded"}, ${
        patient.gender || "gender not recorded"
      }. Chief complaint: ${patient.chiefComplaint}. Vitals: HR ${displayVital(
        patient.hrBpm,
        "bpm"
      )}, temperature ${displayVital(
        patient.tempCelsius,
        "C"
      )}, oxygen saturation ${displayVital(patient.spO2Percent, "percent")}.`,
      recommendedAction: calc.recommendedAction,
      confidenceLevel: calc.confidenceLevel,
      requiresHumanReview: calc.requiresHumanReview,
      supportingFindings: calc.supportingFindings,
      differentialConsiderations: calc.differentialConsiderations,
      recommendedInvestigations: calc.recommendedInvestigations,
      clinicalRationale: calc.clinicalRationale,
      disposition: calc.disposition,
      vitals,
      chiefComplaint: patient.chiefComplaint,
      symptoms: symptoms.symptoms,
      documents: uploads.map((u) => u.file.name),
    };

    // The completed case travels in the draft store. No sessionStorage, so
    // nothing about the case is serialised into browser storage on the way to
    // the results route.
    setResult(customCase);
    router.push(`/results/${CASE_ID}`);
  }, [patient, symptoms, uploads, setResult, router]);

  const progressPct = Math.round((step / 5) * 100);
  const showSummary = summaryVisible && summaryEntries.length > 0;

  return (
    <AppShell>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-3">
          <div className="space-y-1">
            <H1>Guided clinical patient intake</H1>
            <BodySm className="text-ink-muted">
              Offline clinical co-pilot intake, edge reasoning, local SQLite
              storage.
            </BodySm>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadDemoCase}
              leftIcon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
            >
              Load demo case
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              leftIcon={<X className="h-4 w-4" aria-hidden="true" />}
            >
              Cancel
            </Button>
          </div>
        </div>

        <IntakeStepper
          currentStep={step}
          onSelectStep={goToStep}
          progressPct={progressPct}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-4">
            {showSummary && (
              <ErrorSummary ref={summaryRef} errors={summaryEntries} />
            )}

            {step === 1 && (
              <StepPatientDetails
                formData={formValues}
                onChange={handlePatientChange}
                errors={{
                  patientName: fieldError(errors, "patientName"),
                  patientId: fieldError(errors, "patientId"),
                  age: fieldError(errors, "age"),
                  gender: fieldError(errors, "gender"),
                  chiefComplaint: fieldError(errors, "chiefComplaint"),
                  weightKg: fieldError(errors, "weightKg"),
                  heightCm: fieldError(errors, "heightCm"),
                  hrBpm: fieldError(errors, "hrBpm"),
                  systolicBp: fieldError(errors, "systolicBp"),
                  diastolicBp: fieldError(errors, "diastolicBp"),
                  tempCelsius: fieldError(errors, "tempCelsius"),
                  spO2Percent: fieldError(errors, "spO2Percent"),
                  location: fieldError(errors, "location"),
                }}
                onBlurField={revalidateField}
              />
            )}

            {step === 2 && (
              <SmartSymptomSearch
                symptoms={symptoms.symptoms}
                onSymptomsChange={(next) => updateSymptoms({ symptoms: next })}
                duration={symptoms.duration}
                onDurationChange={(val) => updateSymptoms({ duration: val })}
                severity={symptoms.severity}
                onSeverityChange={(val) => updateSymptoms({ severity: val })}
                errors={{
                  symptoms: fieldError(errors, "symptoms"),
                  duration: fieldError(errors, "duration"),
                  severity: fieldError(errors, "severity"),
                }}
                onBlurField={revalidateField}
              />
            )}

            {step === 3 && (
              <StructuredMedicalHistory
                historyData={history}
                onChange={handleHistoryChange}
                errors={{
                  pastIllnesses: fieldError(errors, "pastIllnesses"),
                  medications: fieldError(errors, "medications"),
                  allergies: fieldError(errors, "allergies"),
                  surgeries: fieldError(errors, "surgeries"),
                  chronicConditions: fieldError(errors, "chronicConditions"),
                  lifestyleNotes: fieldError(errors, "lifestyleNotes"),
                }}
                onBlurField={revalidateField}
              />
            )}

            {step === 4 && (
              <DocumentUploadWorkspace
                uploadedFiles={uploads}
                onAddFile={handleAddFile}
                onRemoveFile={removeUpload}
              />
            )}

            {step === 5 && (
              <StepReview
                patientData={formValues}
                symptoms={symptoms.symptoms}
                symptomDuration={symptoms.duration}
                symptomSeverity={symptoms.severity}
                historyData={history}
                uploadedFiles={uploads}
                onEditStep={goToStep}
              />
            )}

            <div className="flex items-center justify-between gap-3 p-4 rounded-card bg-surface border border-rule">
              <Button
                variant="secondary"
                disabled={step === 1}
                onClick={() => goToStep(step - 1)}
                leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
              >
                Previous step
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
                >
                  Save draft
                </Button>

                {step < 5 ? (
                  <Button
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    Next step
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsAnalyzing(true)}
                    leftIcon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                  >
                    Run clinical reasoning
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <StickyPatientContextSidebar
              patientData={formValues}
              symptoms={symptoms.symptoms}
              historyData={history}
              uploadedFiles={uploads}
              currentStep={step}
            />
          </div>
        </div>
      </div>

      {isAnalyzing && <AIExecutionPipeline onComplete={handleAnalysisComplete} />}
    </AppShell>
  );
}
