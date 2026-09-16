"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, X, PlayCircle, Stethoscope } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { PageHeader } from "@/components/layout/PageHeader";

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
import { type ClinicalCaseData } from "@/lib/casesData";
import { SESSION } from "@/lib/session";
import { analyze, imageTypeFor } from "@/services/analysis.service";
import { mapAnalysisToCase } from "@/lib/mapAnalysis";
import { isApiConfigured } from "@/lib/api-client";
import { REPLAY_OPTIONS, CAPTURED_AT, replayRun, type ReplayId } from "@/lib/replay";
import { useCaseList } from "@/providers/CasesProvider";
import type { Route } from "next";
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
  const caseList = useCaseList();

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
  // Without an API, the intake replays one recorded run; this is which.
  const [replayId, setReplayId] = useState<ReplayId | null>(null);
  const [replayMenuOpen, setReplayMenuOpen] = useState(false);
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

  // One request to the pipeline API. The overlay owns the request lifecycle
  // (abort, retry); this builds the input from the draft and maps the answer
  // into the case the results route renders. No result is produced locally.
  const runAnalysis = useCallback(
    async (signal: AbortSignal, onStage?: (index: number) => void): Promise<ClinicalCaseData> => {
      const vitals: ClinicalCaseData["vitals"] = [
        { label: "HR", value: displayVital(patient.hrBpm, "bpm"), status: (patient.hrBpm ?? 0) > 100 ? "alert" : "normal" },
        {
          label: "BP",
          value:
            patient.systolicBp === undefined || patient.diastolicBp === undefined
              ? "Not recorded"
              : `${patient.systolicBp}/${patient.diastolicBp} mmHg`,
          status: (patient.systolicBp ?? 0) > 140 ? "warning" : "normal",
        },
        { label: "Temp", value: displayVital(patient.tempCelsius, "C"), status: (patient.tempCelsius ?? 0) > 38.0 ? "warning" : "normal" },
        { label: "SpO2", value: displayVital(patient.spO2Percent, "percent"), status: (patient.spO2Percent ?? 100) < 94 ? "alert" : "normal" },
      ];

      // The pipeline takes one image per request; send the first upload and
      // list the rest on the case so nothing is silently dropped.
      const first = uploads.find((u) => imageTypeFor(u.type) !== null);
      const historyNotes = Object.entries(history)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `${k}: ${String(v).trim()}`)
        .join("\n");
      const notes = [patient.chiefComplaint, symptoms.duration && `Duration: ${symptoms.duration}`, symptoms.severity && `Severity: ${symptoms.severity}`, historyNotes]
        .filter(Boolean)
        .join("\n");

      const intake = {
        caseId: CASE_ID,
        patientId: patient.patientId || "P-CUSTOM",
        patientName: patient.patientName || "Current patient intake",
        age: isAgeRecorded(patient.age) ? patient.age : 0,
        gender: patient.gender || "Not recorded",
        village: patient.location || SESSION.facility.name,
        chiefComplaint: patient.chiefComplaint,
        symptoms: symptoms.symptoms,
        vitals,
        documents: uploads.map((u) => u.file.name),
      };
      if (replayId) return replayRun(replayId, intake, signal, onStage);

      const res = await analyze({
        patientId: patient.patientId || undefined,
        patientName: patient.patientName || undefined,
        location: patient.location || undefined,
        chiefComplaint: patient.chiefComplaint || undefined,
        age: isAgeRecorded(patient.age) ? patient.age : 0,
        gender: patient.gender || "Not recorded",
        symptoms: symptoms.symptoms,
        notes,
        vitals: {
          heart_rate_bpm: patient.hrBpm,
          blood_pressure_sys: patient.systolicBp,
          blood_pressure_dia: patient.diastolicBp,
          spo2_percent: patient.spO2Percent,
          temperature_c: patient.tempCelsius,
        },
        image: first ? { file: first.file, type: imageTypeFor(first.type)! } : undefined,
        signal,
      });

      // The API stored the case; its id becomes the URL, so a reload of the
      // results page reads it back from the store rather than this tab.
      return mapAnalysisToCase(res, { ...intake, caseId: res.case_id ?? CASE_ID });
    },
    [patient, symptoms, history, uploads, replayId]
  );

  const handleAnalysisComplete = useCallback(
    (result: ClinicalCaseData) => {
      // The completed case travels in the draft store, which persists `result`
      // to sessionStorage only (see lib/store/caseDraft.ts) so a reload of the
      // results route does not lose it. Nothing is written to localStorage.
      setResult(result);
      setIsAnalyzing(false);
      void caseList.refresh();
      router.push(`/results/${result.caseId}` as Route);
    },
    [setResult, router, caseList]
  );

  const cancelAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setReplayId(null);
  }, []);
  const apiConfigured = isApiConfigured();
  const startReplay = useCallback((id: ReplayId) => {
    setReplayId(id);
    setIsAnalyzing(true);
  }, []);

  const progressPct = Math.round((step / 5) * 100);
  const showSummary = summaryVisible && summaryEntries.length > 0;

  return (
    <AppShell>
      <div className="space-y-4 max-w-[1600px] mx-auto pb-16">
        <PageHeader
          title="New patient intake"
          subtitle="Five steps: patient, symptoms, history, documents, review. The assessment runs when you finish."
          actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadDemoCase}
              leftIcon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
              data-tour="tour-replay-demo"
            >
              Load demo case
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/workstation")}
              leftIcon={<X className="h-4 w-4" aria-hidden="true" />}
            >
              Cancel
            </Button>
          </div>
          }
        />

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

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-card bg-surface border border-rule">
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
                  apiConfigured ? (
                    <Button
                      onClick={() => setIsAnalyzing(true)}
                      aria-label="Run clinical reasoning"
                      leftIcon={<Stethoscope className="h-4 w-4" aria-hidden="true" />}
                    >
                      Run clinical assessment
                    </Button>
                  ) : (
                    <div className="relative">
                      <Button
                        type="button"
                        onClick={() => setReplayMenuOpen((v) => !v)}
                        aria-expanded={replayMenuOpen}
                        aria-controls="replay-menu"
                        leftIcon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
                      >
                        Replay a recorded run
                      </Button>
                      {replayMenuOpen && (
                        <div id="replay-menu" role="group" aria-label="Recorded runs" className="absolute right-0 z-20 mt-2 w-[min(28rem,90vw)] rounded-control border border-rule bg-surface p-2 space-y-1">
                          <p className="px-2 py-1 text-body-sm text-ink-muted">
                            No pipeline API in this build. Replay a run measured on {CAPTURED_AT}; the assessment shown is of the recorded sample, not of this patient.
                          </p>
                          {REPLAY_OPTIONS.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                setReplayMenuOpen(false);
                                startReplay(o.id);
                              }}
                              className="w-full text-left px-2 py-2 rounded-control hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                              <span className="block text-body-sm font-semibold text-ink">{o.label}</span>
                              <span className="block text-body-sm text-ink-muted font-mono">{o.detail}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
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

      {isAnalyzing && <AIExecutionPipeline run={runAnalysis} onComplete={handleAnalysisComplete} onCancel={cancelAnalysis} />}
    </AppShell>
  );
}
