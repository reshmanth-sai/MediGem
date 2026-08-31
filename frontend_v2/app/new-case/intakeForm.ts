import type { FieldErrors } from "react-hook-form";
import { genderOptions, type PatientDetails } from "@/lib/schemas/patient";
import type { ErrorSummaryEntry } from "@/components/ui/ErrorSummary";
import type { PatientDetailsFormData } from "@/components/new-case/StepPatientDetails";
import type { MedicalHistoryData } from "@/components/new-case/StepMedicalHistory";
import type { SymptomEntry, IntakeStep } from "@/lib/store/caseDraft";

/**
 * The seam between the case draft store and the validated intake form.
 *
 * Two mismatches live here, both deliberate and both documented, so that no
 * other file in the wizard has to know about them.
 *
 * 1. AGE AND THE MISSING "NOT ENTERED" VALUE.
 *    The store types patient.age as a plain `number` and seeds it to 0. A
 *    literal 0 is also a real recorded age (a newborn), so an untouched age
 *    field would both display "0" and satisfy patientDetailsSchema's own
 *    `min(0)` bound. The wizard therefore treats NaN as the store's
 *    "no age recorded yet" value: NaN is a `number`, so nothing about the
 *    store's type changes, and it is the only number that cannot be a real
 *    age. At the form boundary NaN becomes `null`, which zod reports through
 *    `invalid_type_error`, i.e. the schema's own
 *    "Enter an age between 0 and 120" rather than a generic "Required".
 *    (null rather than NaN in the form values because react-hook-form
 *    deep-compares the `values` prop every render, and NaN comparisons are
 *    implementation-dependent across its versions; null is stable.)
 *
 * 2. GENDER AS STRING VS AS A LITERAL UNION.
 *    The store types patient.gender as `string`; patientDetailsSchema infers
 *    it as "Male" | "Female" | "Other". Widening (form to store) is free.
 *    Narrowing (store to form) goes through asGender, which checks the value
 *    against genderOptions at runtime rather than asserting it. The gender
 *    select only ever offers those three options plus an empty placeholder,
 *    so this cannot change behaviour; it just makes the narrowing honest.
 */

export type Gender = PatientDetails["gender"];

/** The value patient.age carries in the store while no age has been recorded. */
export const AGE_NOT_RECORDED = Number.NaN;

/** True when the draft carries a real recorded age rather than the sentinel. */
export function isAgeRecorded(age: number): boolean {
  return Number.isFinite(age);
}

/** Narrow a stored gender string to the schema's literal union, or "" if unset. */
export function asGender(value: string): Gender | "" {
  return (genderOptions as readonly string[]).includes(value)
    ? (value as Gender)
    : "";
}

/**
 * Every field the wizard collects, flattened into one object. The steps use
 * disjoint field names, so a single form can carry all of them while the
 * resolver swaps to the current step's schema; zod strips the keys that do
 * not belong to the step being validated.
 */
export interface IntakeFormValues {
  patientName: string;
  patientId: string;
  age: number | null;
  gender: Gender | "";
  weightKg?: number;
  heightCm?: number;
  hrBpm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  tempCelsius?: number;
  spO2Percent?: number;
  chiefComplaint: string;
  location?: string;

  symptoms: string[];
  duration: string;
  severity: string;

  pastIllnesses?: string;
  medications?: string;
  allergies?: string;
  surgeries?: string;
  chronicConditions?: string;
  lifestyleNotes?: string;
}

export type IntakeFieldName = keyof IntakeFormValues;

/** The subset of IntakeFormValues that step 1 collects. */
export type PatientFieldName = Extract<
  IntakeFieldName,
  | "patientName"
  | "patientId"
  | "age"
  | "gender"
  | "weightKg"
  | "heightCm"
  | "hrBpm"
  | "systolicBp"
  | "diastolicBp"
  | "tempCelsius"
  | "spO2Percent"
  | "chiefComplaint"
  | "location"
>;

export function toFormValues(
  patient: PatientDetailsFormData,
  symptoms: SymptomEntry,
  history: MedicalHistoryData
): IntakeFormValues {
  return {
    patientName: patient.patientName,
    patientId: patient.patientId,
    age: isAgeRecorded(patient.age) ? patient.age : null,
    gender: asGender(patient.gender),
    weightKg: patient.weightKg,
    heightCm: patient.heightCm,
    hrBpm: patient.hrBpm,
    systolicBp: patient.systolicBp,
    diastolicBp: patient.diastolicBp,
    tempCelsius: patient.tempCelsius,
    spO2Percent: patient.spO2Percent,
    chiefComplaint: patient.chiefComplaint,
    location: patient.location,

    symptoms: symptoms.symptoms,
    duration: symptoms.duration,
    severity: symptoms.severity,

    pastIllnesses: history.pastIllnesses,
    medications: history.medications,
    allergies: history.allergies,
    surgeries: history.surgeries,
    chronicConditions: history.chronicConditions,
    lifestyleNotes: history.lifestyleNotes,
  };
}

/**
 * Reading order for the error summary, so the list a health worker is given
 * after a failed advance matches the order the fields appear on screen.
 */
export const STEP_FIELD_ORDER: Record<IntakeStep, IntakeFieldName[]> = {
  1: [
    "patientName",
    "patientId",
    "location",
    "age",
    "gender",
    "weightKg",
    "heightCm",
    "hrBpm",
    "systolicBp",
    "diastolicBp",
    "tempCelsius",
    "spO2Percent",
    "chiefComplaint",
  ],
  2: ["symptoms", "duration", "severity"],
  3: [
    "allergies",
    "medications",
    "chronicConditions",
    "surgeries",
    "pastIllnesses",
    "lifestyleNotes",
  ],
  4: [],
  5: [],
};

/**
 * Flatten react-hook-form's error object into the entries ErrorSummary
 * renders, in on-screen order. Field ids equal field names throughout the
 * wizard, so each entry's anchor lands on the control that needs fixing.
 */
export function buildErrorSummary(
  errors: FieldErrors<IntakeFormValues>,
  step: IntakeStep
): ErrorSummaryEntry[] {
  const entries: ErrorSummaryEntry[] = [];
  for (const field of STEP_FIELD_ORDER[step]) {
    const message = errors[field]?.message;
    if (typeof message === "string" && message.length > 0) {
      entries.push({ fieldId: field, message });
    }
  }
  return entries;
}

/**
 * Read one field's message out of react-hook-form's errors as a plain string.
 * Field takes ReactNode for `error`, but keeping this narrow to string means
 * the same value can feed both the inline message and the summary link.
 */
export function fieldError(
  errors: FieldErrors<IntakeFormValues>,
  field: IntakeFieldName
): string | undefined {
  const message = errors[field]?.message;
  return typeof message === "string" && message.length > 0 ? message : undefined;
}

/**
 * Turn a number input's raw string into the value the draft stores.
 * An empty box means "not recorded", which is `undefined` for every optional
 * vital. Age has no undefined in its type, so it uses the NaN sentinel.
 */
export function parseOptionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Render a numeric draft value back into an input, blank when not recorded. */
export function numberInputValue(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return String(value);
}

/** Display a recorded vital, or say plainly that it was not recorded. */
export function displayVital(
  value: number | null | undefined,
  unit: string
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "Not recorded";
  }
  return `${value} ${unit}`.trim();
}
