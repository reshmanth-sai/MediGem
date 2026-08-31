import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PatientDetailsFormData } from "@/components/new-case/StepPatientDetails";
import type { MedicalHistoryData } from "@/components/new-case/StepMedicalHistory";
import type { UploadedFileItem } from "@/components/new-case/StepUploads";
import type { ClinicalCaseData } from "@/lib/casesData";

export interface SymptomEntry {
  symptoms: string[];
  duration: string;
  severity: string;
}

export type IntakeStep = 1 | 2 | 3 | 4 | 5;

const EMPTY_PATIENT: PatientDetailsFormData = {
  patientName: "",
  patientId: "",
  age: 0,
  gender: "",
  chiefComplaint: "",
};

const EMPTY_SYMPTOMS: SymptomEntry = {
  symptoms: [],
  duration: "",
  severity: "",
};

const EMPTY_HISTORY: MedicalHistoryData = {
  pastIllnesses: "",
  medications: "",
  allergies: "",
  surgeries: "",
  chronicConditions: "",
  lifestyleNotes: "",
};

interface CaseDraftState {
  step: IntakeStep;
  patient: PatientDetailsFormData;
  symptoms: SymptomEntry;
  history: MedicalHistoryData;
  uploads: UploadedFileItem[];
  result: ClinicalCaseData | null;
  setStep: (step: IntakeStep) => void;
  updatePatient: (patch: Partial<PatientDetailsFormData>) => void;
  updateSymptoms: (patch: Partial<SymptomEntry>) => void;
  updateHistory: (patch: Partial<MedicalHistoryData>) => void;
  addUpload: (upload: UploadedFileItem) => void;
  removeUpload: (id: string) => void;
  setResult: (result: ClinicalCaseData | null) => void;
  reset: () => void;
}

const clampStep = (step: number): IntakeStep => {
  const clamped = Math.min(5, Math.max(1, Math.round(step)));
  return clamped as IntakeStep;
};

/**
 * The completed analysis is persisted to sessionStorage.
 *
 * Without this, a hard reload of `/results/CASE-CUSTOM` reset the in-memory
 * store and the results route fell back to a preset, showing a different
 * patient's data under the user's own case URL. Only `result` is persisted:
 * mid-wizard patient/symptom/history/upload state is deliberately left in
 * memory, since uploads carry object URLs that do not survive a reload and a
 * half-filled wizard is not worth restoring. sessionStorage, not
 * localStorage, keeps a draft case scoped to the tab session rather than
 * leaving clinical data on disk indefinitely.
 */
export const useCaseDraft = create<CaseDraftState>()(
  persist(
    (set) => ({
      step: 1,
      patient: EMPTY_PATIENT,
      symptoms: EMPTY_SYMPTOMS,
      history: EMPTY_HISTORY,
      uploads: [],
      result: null,

      setStep: (step) => set({ step: clampStep(step) }),

      updatePatient: (patch) =>
        set((state) => ({ patient: { ...state.patient, ...patch } })),

      updateSymptoms: (patch) =>
        set((state) => ({ symptoms: { ...state.symptoms, ...patch } })),

      updateHistory: (patch) =>
        set((state) => ({ history: { ...state.history, ...patch } })),

      addUpload: (upload) =>
        set((state) => ({ uploads: [...state.uploads, upload] })),

      removeUpload: (id) =>
        set((state) => ({ uploads: state.uploads.filter((u) => u.id !== id) })),

      setResult: (result) => set({ result }),

      reset: () =>
        set({
          step: 1,
          patient: EMPTY_PATIENT,
          symptoms: EMPTY_SYMPTOMS,
          history: EMPTY_HISTORY,
          uploads: [],
          result: null,
        }),
    }),
    {
      name: "medigem-case-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ result: state.result }),
    }
  )
);
