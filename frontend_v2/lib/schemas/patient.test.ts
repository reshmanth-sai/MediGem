import { describe, it, expect } from "vitest";
import { patientDetailsSchema } from "./patient";

const valid = {
  patientName: "Sunita Devi",
  patientId: "P-9902",
  age: 62,
  gender: "Female",
  chiefComplaint: "Acute substernal chest pain radiating to jaw.",
};

describe("patientDetailsSchema", () => {
  it("accepts a valid record", () => {
    expect(patientDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["age", -5], ["age", 121], ["age", 12.5],
    ["hrBpm", 19], ["hrBpm", 251],
    ["systolicBp", 49], ["systolicBp", 261],
    ["tempCelsius", 29.9], ["tempCelsius", 45.1],
    ["spO2Percent", 49], ["spO2Percent", 101],
  ])("rejects %s = %s", (field, value) => {
    const r = patientDetailsSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
  });

  it("rejects diastolic greater than or equal to systolic", () => {
    const r = patientDetailsSchema.safeParse({ ...valid, systolicBp: 120, diastolicBp: 130 });
    expect(r.success).toBe(false);
  });

  it("rejects an empty patient name", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, patientName: "" }).success).toBe(false);
  });

  it("rejects a patient id with spaces", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, patientId: "P 9902" }).success).toBe(false);
  });

  it("rejects a chief complaint under 10 characters", () => {
    expect(patientDetailsSchema.safeParse({ ...valid, chiefComplaint: "chest" }).success).toBe(false);
  });

  it("allows all vitals to be omitted", () => {
    expect(patientDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it("gives a recovery-oriented message, not just Invalid", () => {
    const r = patientDetailsSchema.safeParse({ ...valid, age: 200 });
    if (r.success) throw new Error("expected failure");
    expect(r.error.issues[0].message).toMatch(/between 0 and 120/i);
  });
});
