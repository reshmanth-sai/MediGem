import { z } from "zod";

// Mirrors backend/reasoning/output_schema.py::ClinicalReasoningOutput and the
// surrounding capture written by evaluation/capture_landing_data.py. The test
// beside this file parses capture.json against it, so the landing page cannot
// quietly show a shape the backend does not produce.

export const RiskLevel = z.enum(["LOW", "MODERATE", "HIGH", "EMERGENCY"]);
export const ConfidenceLevel = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const ReasoningOutput = z.object({
  metadata: z.object({
    reasoning_version: z.string(),
    modality: z.string(),
    timestamp: z.string(),
  }),
  observations: z.array(z.object({ source: z.string(), observation: z.string() })),
  assessment: z.object({
    clinical_summary: z.string(),
    risk_level: RiskLevel,
    confidence_level: ConfidenceLevel,
    red_flags: z.array(z.string()),
  }),
  recommendations: z.object({
    recommended_next_step: z.string(),
    needs_referral: z.boolean(),
    requires_human_review: z.boolean(),
    follow_up_notes: z.string(),
  }),
  patient_summary: z.string(),
  limitations: z.array(z.string()),
  safety: z.object({ is_safe: z.boolean(), safety_flags: z.array(z.string()) }),
});

export const Quality = z.object({
  blur_score: z.number(),
  brightness_score: z.number(),
  contrast_score: z.number(),
  resolution_score: z.number(),
  quality_level: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]),
  warnings: z.array(z.string()),
});

export const Modality = z.object({
  label: z.string(),
  file: z.string(),
  modality: z.string(),
  symptoms: z.array(z.string()),
  input: z.object({
    input_processing_ms: z.number(),
    processing_time_ms: z.number(),
    ocr_performed: z.boolean(),
    quality: Quality.nullable(),
    extracted: z.object({ text: z.string(), confidence: z.number(), language: z.string() }).nullable(),
    image: z.object({ width: z.number(), height: z.number(), file_size_bytes: z.number() }).nullable(),
  }),
  runs: z.number(),
  validated_runs: z.number(),
  fallback_runs: z.number(),
  statuses: z.array(z.string()),
  pipeline_ms: z.object({ median: z.number(), min: z.number(), max: z.number(), all: z.array(z.number()) }),
  response: z.object({
    summary: z.string(),
    status: z.string(),
    risk_level: RiskLevel.nullable(),
    risk_flags: z.array(z.string()),
    recommended_action: z.string().nullable(),
  }),
  reasoning: ReasoningOutput.nullable(),
});

export const Rule = z.object({
  id: z.string(),
  name: z.string().nullable(),
  category: z.string().nullable(),
  priority: z.union([z.string(), z.number()]).nullable(),
  description: z.string().nullable(),
  symptoms_required: z.array(z.string()),
  min_match_count: z.number().nullable(),
  recommended_action: z.string().nullable(),
});

export const Capture = z.object({
  meta: z.object({
    captured_at: z.string(),
    model: z.string(),
    ollama_host: z.string(),
    hardware: z.object({ chip: z.string(), platform: z.string(), python: z.string() }),
    runs_per_modality: z.number(),
    gate_iterations: z.number(),
  }),
  summary: z.object({
    total_runs: z.number(),
    validated_runs: z.number(),
    fallback_runs: z.number(),
    pipeline_ms_median: z.number(),
    pipeline_ms_min: z.number(),
    pipeline_ms_max: z.number(),
    ocr_confidence_mean: z.number().nullable(),
    ocr_samples: z.number(),
    gate_latency_ms_median: z.number(),
    gate_latency_ms_max: z.number(),
    gate_rule_count: z.number(),
    supported_inputs: z.number(),
  }),
  gate: z.object({
    iterations: z.number(),
    match_case: z.object({
      symptoms: z.array(z.string()),
      emergency_detected: z.boolean(),
      safe_for_ai_processing: z.boolean(),
      category: z.string().nullable(),
      priority: z.string(),
      matched_symptoms: z.array(z.string()),
      matched_reason: z.string(),
      recommended_action: z.string(),
      matched_rules: z.array(z.string()),
    }),
    latency_ms: z.object({
      match_median: z.number(),
      match_p95: z.number(),
      match_max: z.number(),
      benign_median: z.number(),
      benign_max: z.number(),
    }),
    rule_count: z.number(),
    rules: z.array(Rule),
    orchestrator_block: z.object({
      status: z.string(),
      summary: z.string(),
      duration_ms: z.number().nullable(),
      wall_ms: z.number(),
      risk_level: RiskLevel.nullable(),
    }),
  }),
  modalities: z.object({ lab: Modality, ecg: Modality, prescription: Modality, wound: Modality }),
});

export type CaptureData = z.infer<typeof Capture>;
export type ModalityData = z.infer<typeof Modality>;
export type RuleData = z.infer<typeof Rule>;
