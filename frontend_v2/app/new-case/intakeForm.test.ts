import { describe, it, expect } from "vitest";
import {
  AGE_NOT_RECORDED,
  asGender,
  buildErrorSummary,
  displayVital,
  fieldError,
  isAgeRecorded,
  numberInputValue,
  parseOptionalNumber,
  toFormValues,
} from "./intakeForm";
import { patientDetailsSchema } from "@/lib/schemas/patient";
import type { PatientDetailsFormData } from "@/components/new-case/StepPatientDetails";

const EMPTY_PATIENT: PatientDetailsFormData = {
  patientName: "",
  patientId: "",
  age: AGE_NOT_RECORDED,
  gender: "",
  chiefComplaint: "",
};

const EMPTY_SYMPTOMS = { symptoms: [] as string[], duration: "", severity: "" };

const EMPTY_HISTORY = {
  pastIllnesses: "",
  medications: "",
  allergies: "",
  surgeries: "",
  chronicConditions: "",
  lifestyleNotes: "",
};

describe("age sentinel", () => {
  it("treats the not-recorded sentinel as not a real age", () => {
    expect(isAgeRecorded(AGE_NOT_RECORDED)).toBe(false);
    expect(isAgeRecorded(0)).toBe(true);
    expect(isAgeRecorded(62)).toBe(true);
  });

  it("carries the sentinel into the form as null rather than a number", () => {
    const values = toFormValues(EMPTY_PATIENT, EMPTY_SYMPTOMS, EMPTY_HISTORY);
    expect(values.age).toBeNull();
  });

  it("keeps a genuinely recorded age of 0 as 0", () => {
    const values = toFormValues(
      { ...EMPTY_PATIENT, age: 0 },
      EMPTY_SYMPTOMS,
      EMPTY_HISTORY
    );
    expect(values.age).toBe(0);
  });

  it("an unrecorded age fails the schema with the actionable message", () => {
    const result = patientDetailsSchema.safeParse({
      patientName: "Sunita Devi",
      patientId: "P-101",
      age: null,
      gender: "Female",
      chiefComplaint: "Chest tightness for the past two hours.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "age");
      expect(issue?.message).toBe("Enter an age between 0 and 120");
    }
  });

  it("a recorded age of 0 passes the schema", () => {
    const result = patientDetailsSchema.safeParse({
      patientName: "Baby Devi",
      patientId: "P-102",
      age: 0,
      gender: "Female",
      chiefComplaint: "Newborn presenting with poor feeding since birth.",
    });
    expect(result.success).toBe(true);
  });
});

describe("gender seam", () => {
  it("narrows the store's plain string to the schema's literal union", () => {
    expect(asGender("Male")).toBe("Male");
    expect(asGender("Female")).toBe("Female");
    expect(asGender("Other")).toBe("Other");
  });

  it("maps anything outside the option list to the empty placeholder", () => {
    expect(asGender("")).toBe("");
    expect(asGender("male")).toBe("");
    expect(asGender("Unknown")).toBe("");
  });
});

describe("numeric input helpers", () => {
  it("renders unrecorded numbers as a blank box, never as zero", () => {
    expect(numberInputValue(null)).toBe("");
    expect(numberInputValue(undefined)).toBe("");
    expect(numberInputValue(Number.NaN)).toBe("");
    expect(numberInputValue(0)).toBe("0");
  });

  it("reads a blank box back as not recorded rather than zero", () => {
    expect(parseOptionalNumber("")).toBeUndefined();
    expect(parseOptionalNumber("   ")).toBeUndefined();
    expect(parseOptionalNumber("0")).toBe(0);
    expect(parseOptionalNumber("37.2")).toBe(37.2);
  });

  it("says plainly when a vital was not recorded", () => {
    expect(displayVital(undefined, "bpm")).toBe("Not recorded");
    expect(displayVital(Number.NaN, "bpm")).toBe("Not recorded");
    expect(displayVital(96, "bpm")).toBe("96 bpm");
  });
});

describe("error summary", () => {
  const errors = {
    chiefComplaint: { message: "Describe the chief complaint in at least 10 characters" },
    age: { message: "Enter an age between 0 and 120" },
    patientName: { message: "Enter the patient's name (at least 2 characters)" },
  } as never;

  it("lists the step's errors in on-screen order", () => {
    expect(buildErrorSummary(errors, 1)).toEqual([
      {
        fieldId: "patientName",
        message: "Enter the patient's name (at least 2 characters)",
      },
      { fieldId: "age", message: "Enter an age between 0 and 120" },
      {
        fieldId: "chiefComplaint",
        message: "Describe the chief complaint in at least 10 characters",
      },
    ]);
  });

  it("ignores errors that belong to a different step", () => {
    expect(buildErrorSummary(errors, 2)).toEqual([]);
  });

  it("reads a single field's message back as a plain string", () => {
    expect(fieldError(errors, "age")).toBe("Enter an age between 0 and 120");
    expect(fieldError(errors, "gender")).toBeUndefined();
  });
});
