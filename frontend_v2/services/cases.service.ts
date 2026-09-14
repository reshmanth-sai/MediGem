import { z } from "zod";
import { apiRequest, ApiError } from "@/lib/api-client";
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

export async function reviewCase(id: string, decision: ReviewDecision, reviewer: string, note?: string): Promise<StoredCase> {
  return parse(
    StoredCase,
    await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reviewer, note }),
      timeoutMs: 8_000,
    })
  );
}

export async function deleteCase(id: string): Promise<void> {
  await apiRequest<unknown>(`/cases/${encodeURIComponent(id)}`, { method: "DELETE", timeoutMs: 8_000 });
}
