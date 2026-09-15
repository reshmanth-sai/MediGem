import { z } from "zod";
import { apiRequest, ApiError, API_BASE_URL } from "@/lib/api-client";
import { StoredCase } from "@/lib/schemas/analysis";

function parse<S extends z.ZodTypeAny>(schema: S, payload: unknown): z.output<S> {
  const r = schema.safeParse(payload);
  if (!r.success) throw new ApiError("parse", "Response did not match the expected schema", undefined, r.error);
  return r.data;
}

export async function listCases(signal?: AbortSignal): Promise<StoredCase[]> {
  return parse(z.array(StoredCase), await apiRequest<unknown>("/cases?limit=500", { timeoutMs: 8_000, signal }));
}

export async function getCase(id: string, signal?: AbortSignal): Promise<StoredCase> {
  return parse(StoredCase, await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}`, { timeoutMs: 8_000, signal }));
}

export type ReviewDecision = "approved" | "modified" | "rejected";

export async function reviewCase(id: string, decision: ReviewDecision, note?: string): Promise<StoredCase> {
  return parse(
    StoredCase,
    await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The reviewer is whoever the session cookie says is signed in; the
      // API rejects a request body that tries to name someone else.
      body: JSON.stringify({ decision, note }),
      timeoutMs: 8_000,
    })
  );
}

export async function deleteCase(id: string): Promise<void> {
  await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}`, { method: "DELETE", timeoutMs: 8_000 });
}

export interface PatientPatch {
  patient_id?: string;
  patient_name?: string;
  age?: number;
  gender?: string;
  location?: string;
  chief_complaint?: string;
}

const json = (body: unknown) => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), timeoutMs: 8_000 });

export async function updatePatient(id: string, patch: PatientPatch): Promise<StoredCase> {
  return parse(StoredCase, await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/patient`, { method: "PATCH", ...json(patch) }));
}

export interface PlanInput {
  next_step: string;
  follow_up?: string;
  urgency?: string;
  note?: string;
}

export async function setPlan(id: string, plan: PlanInput): Promise<StoredCase> {
  return parse(StoredCase, await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/plan`, { method: "PUT", ...json(plan) }));
}

export async function addNote(id: string, text: string): Promise<StoredCase> {
  return parse(StoredCase, await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/notes`, { method: "POST", ...json({ text }) }));
}

export async function addDocument(id: string, file: File): Promise<StoredCase> {
  const form = new FormData();
  form.set("file", file, file.name);
  return parse(StoredCase, await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/documents`, { method: "POST", body: form, timeoutMs: 30_000 }));
}

export function documentUrl(caseId: string, docId: string): string {
  return `${API_BASE_URL}/cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}`;
}
