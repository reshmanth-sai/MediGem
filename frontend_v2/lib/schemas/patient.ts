import { z, type ZodSchema } from "zod";

/**
 * Validation schemas for the patient intake wizard (spec 10.6).
 *
 * Every issue message states both the cause and the fix so a health worker
 * in a rural clinic, often filling this form under time pressure, knows
 * exactly what to correct. Vitals are optional because a worker may not have
 * every measurement available, but when a value is present it must fall
 * within physiologically plausible bounds.
 */

export const genderOptions = ["Male", "Female", "Other"] as const;

export const patientDetailsSchema = z
  .object({
    patientName: z
      .string()
      .trim()
      .min(2, "Enter the patient's name (at least 2 characters)")
      .max(80, "Shorten the patient's name to 80 characters or fewer"),

    patientId: z
      .string()
      .regex(
        /^[A-Za-z0-9-]{2,20}$/,
        "Enter a patient ID of 2 to 20 letters, numbers, or hyphens with no spaces"
      ),

    age: z
      .number({ invalid_type_error: "Enter an age between 0 and 120" })
      .int("Enter a whole number of years for age, between 0 and 120")
      .min(0, "Enter an age between 0 and 120")
      .max(120, "Enter an age between 0 and 120"),

    gender: z.enum(genderOptions, {
      errorMap: () => ({ message: "Select a gender from the list" }),
    }),

    chiefComplaint: z
      .string()
      .trim()
      .min(10, "Describe the chief complaint in at least 10 characters")
      .max(500, "Shorten the chief complaint to 500 characters or fewer"),

    weightKg: z
      .number()
      .min(0.5, "Enter a weight between 0.5 and 500 kg")
      .max(500, "Enter a weight between 0.5 and 500 kg")
      .optional(),

    heightCm: z
      .number()
      .min(20, "Enter a height between 20 and 260 cm")
      .max(260, "Enter a height between 20 and 260 cm")
      .optional(),

    hrBpm: z
      .number()
      .int("Enter a heart rate between 20 and 250 bpm")
      .min(20, "Enter a heart rate between 20 and 250 bpm")
      .max(250, "Enter a heart rate between 20 and 250 bpm")
      .optional(),

    systolicBp: z
      .number()
      .int("Enter a systolic pressure between 50 and 260 mmHg")
      .min(50, "Enter a systolic pressure between 50 and 260 mmHg")
      .max(260, "Enter a systolic pressure between 50 and 260 mmHg")
      .optional(),

    diastolicBp: z
      .number()
      .int("Enter a diastolic pressure between 30 and 160 mmHg")
      .min(30, "Enter a diastolic pressure between 30 and 160 mmHg")
      .max(160, "Enter a diastolic pressure between 30 and 160 mmHg")
      .optional(),

    tempCelsius: z
      .number()
      .min(30, "Enter a temperature between 30 and 45 degrees Celsius")
      .max(45, "Enter a temperature between 30 and 45 degrees Celsius")
      .multipleOf(
        0.1,
        "Enter a temperature with at most one decimal place, for example 37.5"
      )
      .optional(),

    spO2Percent: z
      .number()
      .int("Enter an oxygen saturation between 50 and 100 percent")
      .min(50, "Enter an oxygen saturation between 50 and 100 percent")
      .max(100, "Enter an oxygen saturation between 50 and 100 percent")
      .optional(),

    location: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.diastolicBp !== undefined &&
      data.systolicBp !== undefined &&
      data.diastolicBp >= data.systolicBp
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a diastolic pressure lower than the systolic pressure",
        path: ["diastolicBp"],
      });
    }
  });

export type PatientDetails = z.infer<typeof patientDetailsSchema>;

export const symptomsSchema = z.object({
  symptoms: z
    .array(z.string())
    .min(1, "Select at least one symptom before continuing"),
  duration: z
    .string()
    .trim()
    .min(1, "Enter how long the symptoms have been present"),
  severity: z
    .string()
    .trim()
    .min(1, "Select a severity level for the symptoms"),
});

export type SymptomsData = z.infer<typeof symptomsSchema>;

export const historySchema = z.object({
  pastIllnesses: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
  chronicConditions: z.string().optional(),
  lifestyleNotes: z.string().optional(),
});

export type HistoryData = z.infer<typeof historySchema>;

// Steps 4 (document uploads) and 5 (review before submit) do not collect
// new validated fields of their own; they pass through so every step in
// the wizard has an entry in stepSchemas.
const uploadsSchema = z.object({}).passthrough();
const reviewSchema = z.object({}).passthrough();

export const stepSchemas: Record<1 | 2 | 3 | 4 | 5, ZodSchema> = {
  1: patientDetailsSchema,
  2: symptomsSchema,
  3: historySchema,
  4: uploadsSchema,
  5: reviewSchema,
};
