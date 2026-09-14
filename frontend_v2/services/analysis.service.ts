import { apiRequest, ApiError } from "@/lib/api-client";
import { AnalysisResponse, HealthResponse } from "@/lib/schemas/analysis";

export type ImageType = "ECG" | "REPORT" | "PRESCRIPTION" | "WOUND";

export interface AnalyzeInput {
  patientId?: string;
  patientName?: string;
  location?: string;
  chiefComplaint?: string;
  /** Store the case on the API. Default true. */
  persist?: boolean;
  age: number;
  gender: string;
  symptoms: string[];
  notes?: string;
  vitals?: {
    heart_rate_bpm?: number;
    blood_pressure_sys?: number;
    blood_pressure_dia?: number;
    spo2_percent?: number;
    temperature_c?: number;
  };
  image?: { file: File; type: ImageType };
  signal?: AbortSignal;
}

/** Upload-category labels used by the intake wizard, mapped to the API's ImageType. */
export function imageTypeFor(category: string): ImageType | null {
  const c = category.toLowerCase();
  if (c.includes("ecg")) return "ECG";
  if (c.includes("lab") || c.includes("report")) return "REPORT";
  if (c.includes("prescription")) return "PRESCRIPTION";
  if (c.includes("wound")) return "WOUND";
  return null;
}

function parseOrThrow<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: unknown } }, payload: unknown): T {
  const r = schema.safeParse(payload);
  if (!r.success || r.data === undefined) throw new ApiError("parse", "Response did not match the expected schema", undefined, r.error);
  return r.data;
}

export async function analyze(input: AnalyzeInput): Promise<AnalysisResponse> {
  const form = new FormData();
  form.set("patient_id", input.patientId || "UNKNOWN");
  form.set("age", String(input.age));
  form.set("gender", input.gender);
  form.set("symptoms", JSON.stringify(input.symptoms));
  if (input.notes) form.set("notes", input.notes);
  if (input.patientName) form.set("patient_name", input.patientName);
  if (input.location) form.set("location", input.location);
  if (input.chiefComplaint) form.set("chief_complaint", input.chiefComplaint);
  if (input.persist === false) form.set("persist", "false");
  for (const [k, v] of Object.entries(input.vitals ?? {})) {
    if (typeof v === "number" && Number.isFinite(v)) form.set(k, String(v));
  }
  if (input.image) {
    form.set("image_type", input.image.type);
    form.set("image", input.image.file, input.image.file.name);
  }
  const payload = await apiRequest<unknown>("/analyze", { method: "POST", body: form, signal: input.signal });
  return parseOrThrow<AnalysisResponse>(AnalysisResponse, payload);
}

export async function health(signal?: AbortSignal): Promise<HealthResponse> {
  const payload = await apiRequest<unknown>("/health", { timeoutMs: 4_000, signal });
  return parseOrThrow<HealthResponse>(HealthResponse, payload);
}
