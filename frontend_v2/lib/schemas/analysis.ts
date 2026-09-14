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
});
export type AnalysisResponse = z.infer<typeof AnalysisResponse>;

export const HealthResponse = z.object({
  ok: z.boolean(),
  api_version: z.string(),
  model: z.string(),
  ollama_host: z.string(),
  ollama_connected: z.boolean(),
  provider_details: z.string(),
  gate_rule_count: z.number(),
  gate_latency_ms: z.number(),
  uptime_seconds: z.number(),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponse>;
