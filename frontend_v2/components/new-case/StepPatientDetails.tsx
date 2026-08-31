"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { TextField, Textarea } from "@/components/ui/Input";
import { H3, BodySm, Label } from "@/components/ui/Typography";
import { genderOptions } from "@/lib/schemas/patient";

/**
 * The shape the case draft store keeps for the patient. Unchanged: the store
 * and every consumer of the draft depend on it. `age` is a plain number here,
 * and the wizard writes NaN into it while no age has been recorded (see
 * app/new-case/intakeForm.ts).
 */
export interface PatientDetailsFormData {
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  weightKg?: number;
  heightCm?: number;
  hrBpm?: number;
  systolicBp?: number;
  diastolicBp?: number;
  tempCelsius?: number;
  spO2Percent?: number;
  chiefComplaint: string;
  location?: string;
}

/**
 * The same fields as they travel through the validated form, where `null`
 * age means "not recorded yet". PatientDetailsFormData is assignable to this,
 * so callers that still hold a plain draft object keep working.
 */
export interface PatientDetailsFormValues
  extends Omit<PatientDetailsFormData, "age"> {
  age: number | null;
}

export type PatientDetailsField = keyof PatientDetailsFormValues;

export interface StepPatientDetailsProps {
  formData: PatientDetailsFormValues;
  onChange: (
    field: PatientDetailsField,
    val: string | number | null | undefined
  ) => void;
  /** Validation messages keyed by field name, from the step's zod schema. */
  errors?: Partial<Record<PatientDetailsField, string>>;
  /** Called when a control loses focus, so the step can revalidate that field. */
  onBlurField?: (field: PatientDetailsField) => void;
}

/** Blank while a value is not recorded, so an empty box never reads as a zero. */
function numberValue(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return String(value);
}

/** An empty numeric box means "not recorded", never 0. */
function parseNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}

const SELECT_CLASS =
  "w-full h-11 px-3 text-body-sm bg-surface border border-rule-strong rounded-control text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus transition-colors";

export function StepPatientDetails({
  formData,
  onChange,
  errors,
  onBlurField,
}: StepPatientDetailsProps) {
  const errorFor = (field: PatientDetailsField) => errors?.[field];
  const blurHandler = (field: PatientDetailsField) => () => onBlurField?.(field);

  const numberProps = (field: PatientDetailsField) => ({
    type: "number",
    inputMode: "decimal" as const,
    value: numberValue(formData[field] as number | null | undefined),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(field, parseNumber(e.target.value)),
    onBlur: blurHandler(field),
    error: errorFor(field),
  });

  return (
    <Card className="space-y-6">
      <div className="space-y-1">
        <H3>Step 1: Patient demographics and vital signs</H3>
        <BodySm className="text-ink-muted">
          Enter patient identification, physical measurements, and baseline vital
          signs. Fields marked with an asterisk are required to continue.
        </BodySm>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField
          id="patientName"
          label="Full patient name"
          required
          value={formData.patientName}
          onChange={(e) => onChange("patientName", e.target.value)}
          onBlur={blurHandler("patientName")}
          error={errorFor("patientName")}
          helperText="As recorded on the patient's identity document."
        />
        <TextField
          id="patientId"
          label="Patient ID"
          required
          value={formData.patientId}
          onChange={(e) => onChange("patientId", e.target.value)}
          onBlur={blurHandler("patientId")}
          error={errorFor("patientId")}
          helperText="Letters, numbers and hyphens, for example P-101."
        />
        <TextField
          id="location"
          label="Location or facility"
          value={formData.location ?? ""}
          onChange={(e) => onChange("location", e.target.value)}
          onBlur={blurHandler("location")}
          error={errorFor("location")}
          helperText="Where this intake is being recorded."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TextField
          id="age"
          label="Age in years"
          required
          min={0}
          max={120}
          step={1}
          helperText="Whole years, 0 to 120."
          {...numberProps("age")}
        />

        <Field
          id="gender"
          label="Gender"
          required
          error={errorFor("gender")}
          helper="Recorded for clinical risk scoring."
        >
          <select
            value={formData.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            onBlur={blurHandler("gender")}
            className={SELECT_CLASS}
          >
            <option value="">Select a gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <TextField
          id="weightKg"
          label="Weight in kg"
          step="0.1"
          helperText="Optional."
          {...numberProps("weightKg")}
        />
        <TextField
          id="heightCm"
          label="Height in cm"
          step="0.1"
          helperText="Optional."
          {...numberProps("heightCm")}
        />
      </div>

      <div className="pt-2 border-t border-rule space-y-3">
        <Label as="h4">Vital signs</Label>
        <BodySm className="text-ink-muted">
          Leave a measurement blank when it was not taken. A blank box is
          recorded as not measured, never as zero.
        </BodySm>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <TextField
            id="hrBpm"
            label="Heart rate (bpm)"
            step={1}
            {...numberProps("hrBpm")}
          />
          <TextField
            id="systolicBp"
            label="Systolic BP (mmHg)"
            step={1}
            {...numberProps("systolicBp")}
          />
          <TextField
            id="diastolicBp"
            label="Diastolic BP (mmHg)"
            step={1}
            {...numberProps("diastolicBp")}
          />
          <TextField
            id="tempCelsius"
            label="Temperature (Celsius)"
            step="0.1"
            {...numberProps("tempCelsius")}
          />
          <TextField
            id="spO2Percent"
            label="Oxygen saturation (percent)"
            step={1}
            {...numberProps("spO2Percent")}
          />
        </div>
      </div>

      <Textarea
        id="chiefComplaint"
        label="Chief complaint summary"
        required
        rows={3}
        value={formData.chiefComplaint}
        onChange={(e) => onChange("chiefComplaint", e.target.value)}
        onBlur={blurHandler("chiefComplaint")}
        error={errorFor("chiefComplaint")}
        helperText="Main reason for the consultation, in at least 10 characters."
      />
    </Card>
  );
}
