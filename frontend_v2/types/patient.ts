/** Patient Demographics and Vital Signs Type Definitions */

export type Gender = "Male" | "Female" | "Other" | "UNKNOWN";

export interface VitalSigns {
  HR?: number;
  SystolicBP?: number;
  DiastolicBP?: number;
  Temp?: number;
  SpO2?: number;
  [key: string]: number | undefined;
}

export interface Patient {
  patientId: string;
  age: number;
  gender: Gender;
  symptoms: string[];
  vitalSigns: VitalSigns;
}
