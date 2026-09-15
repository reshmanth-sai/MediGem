import { z } from "zod";
import { ReasoningOutput, RiskLevel } from "@/components/landing/data/schema";

/*
 * Wire shape of backend/schemas/analysis.py::AnalysisResponse, plus the
 * reasoning and input_summary fields the pipeline attaches. Parsed on every
 * response so a backend change cannot silently misrender.
 */

export const RiskAssessment = z.object({
  risk_level: RiskLevel,
  urgency_score: z.number(),
  risk_flags: z.array(z.string()).default([]),
  rationale: z.string().nullable().optional(),
  recommended_action: z.string().nullable().optional(),
});

export const ReferralSummary = z.object({
  referral_id: z.string(),
  patient_id: z.string(),
  facility_level: z.string(),
  key_findings: z.array(z.string()).default([]),
  summary_notes: z.string().nullable().optional(),
  timestamp: z.string().nullable().optional(),
});

export const InputSummary = z.object({
  ocr_performed: z.boolean(),
  processing_time_ms: z.number(),
  quality: z
    .object({
      blur_score: z.number(),
      brightness_score: z.number(),
      contrast_score: z.number(),
      resolution_score: z.number(),
      quality_level: z.string(),
      warnings: z.array(z.string()),
    })
    .nullable(),
  extracted: z.object({ text: z.string(), confidence: z.number(), language: z.string() }).nullable(),
  image: z.object({ width: z.number(), height: z.number(), file_size_bytes: z.number() }).nullable(),
});

export const AnalysisStatus = z.enum(["COMPLETED", "DEGRADED", "EMERGENCY_INTERCEPTED", "FAILED"]);

export const AnalysisResponse = z.object({
  request_id: z.string(),
  summary: z.string(),
  risk_assessment: RiskAssessment.nullable(),
  referral_summary: ReferralSummary.nullable(),
  status: z.string(),
  duration_ms: z.number().nullable(),
  timestamp: z.string().nullable(),
  reasoning: ReasoningOutput.nullable().optional(),
  input_summary: InputSummary.nullable().optional(),
  /** Set when the API stored the case. */
  case_id: z.string().nullable().optional(),
});
export type AnalysisResponse = z.infer<typeof AnalysisResponse>;

/** What the intake sent, as the API stored it alongside the response. */
export const StoredPatient = z.object({
  patient_id: z.string().nullable().optional(),
  patient_name: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  gender: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  chief_complaint: z.string().nullable().optional(),
  symptoms: z.array(z.string()).default([]),
  vital_signs: z.record(z.number()).default({}),
  notes: z.string().nullable().optional(),
  documents: z.array(z.string()).default([]),
  image_type: z.string().nullable().optional(),
});

export const CaseNote = z.object({ id: z.string(), author: z.string(), text: z.string(), created_at: z.string() });
export const CaseDocument = z.object({ id: z.string(), name: z.string(), content_type: z.string(), size_bytes: z.number(), added_by: z.string(), created_at: z.string() });
export const CaseEvent = z.object({ id: z.number(), actor: z.string(), action: z.string(), payload: z.record(z.unknown()).nullable().optional(), created_at: z.string() });
export const CarePlan = z.object({
  next_step: z.string(),
  follow_up: z.string().nullable().optional(),
  urgency: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  updated_by: z.string().optional(),
  updated_at: z.string().optional(),
});

export const StoredCase = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  patient: StoredPatient,
  response: AnalysisResponse,
  status: z.string(),
  risk_level: RiskLevel.nullable(),
  needs_referral: z.boolean(),
  requires_review: z.boolean(),
  reviewed_at: z.string().nullable().optional(),
  reviewer: z.string().nullable().optional(),
  review_note: z.string().nullable().optional(),
  review_decision: z.enum(["approved", "modified", "rejected"]).nullable().optional(),
  plan: CarePlan.nullable().optional(),
  notes: z.array(CaseNote).default([]),
  documents: z.array(CaseDocument).default([]),
  events: z.array(CaseEvent).default([]),
});
export type StoredCase = z.infer<typeof StoredCase>;
export type CarePlan = z.infer<typeof CarePlan>;

export const HealthResponse = z.object({
  ok: z.boolean(),
  api_version: z.string(),
  model: z.string(),
  ollama_host: z.string(),
  ollama_connected: z.boolean(),
  provider_details: z.string(),
  gate_rule_count: z.number(),
  case_count: z.number().default(0),
  gate_latency_ms: z.number(),
  uptime_seconds: z.number(),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponse>;
