import { capture } from "@/components/landing/data";
import type { AnalysisResponse } from "@/lib/schemas/analysis";
import type { ClinicalCaseData } from "@/lib/casesData";
import { mapAnalysisToCase, type IntakeSnapshot } from "@/lib/mapAnalysis";

/*
 * Replay mode. When no pipeline API is configured, an intake can replay one
 * of the runs recorded by evaluation/capture_landing_data.py: the same
 * reasoning object, input findings and duration the landing page quotes.
 * Nothing is generated here, and every screen that shows a replayed case
 * says which recorded run it is and when it was measured.
 */

export type ReplayId = "lab" | "ecg" | "prescription" | "wound" | "gate";

export interface ReplayOption {
  id: ReplayId;
  label: string;
  detail: string;
  durationMs: number;
}

const MODALITIES = ["lab", "ecg", "prescription", "wound"] as const;

export const CAPTURED_AT = capture.meta.captured_at.slice(0, 10);

export const REPLAY_OPTIONS: ReplayOption[] = [
  ...MODALITIES.map((k) => {
    const m = capture.modalities[k];
    return {
      id: k,
      label: m.label,
      detail: `${m.file.split("/").pop()} · ${m.symptoms.join(", ")} · ${m.response.status} · ${(m.pipeline_ms.median / 1000).toFixed(1)} s median`,
      durationMs: m.pipeline_ms.median,
    };
  }),
  {
    id: "gate",
    label: "Emergency gate case",
    detail: `${capture.gate.match_case.symptoms.join(", ")} · ${capture.gate.orchestrator_block.status} · ${capture.gate.orchestrator_block.duration_ms ?? capture.gate.latency_ms.match_median} ms, no model call`,
    durationMs: capture.gate.orchestrator_block.duration_ms ?? capture.gate.latency_ms.match_median,
  },
];

/** The recorded run as the AnalysisResponse the API would have returned. */
export function replayResponse(id: ReplayId): AnalysisResponse {
  if (id === "gate") {
    const g = capture.gate;
    const b = g.orchestrator_block;
    return {
      request_id: `REPLAY-GATE`,
      summary: b.summary,
      risk_assessment: {
        risk_level: b.risk_level ?? "EMERGENCY",
        urgency_score: 9.5,
        risk_flags: g.match_case.matched_symptoms,
        rationale: g.match_case.matched_reason,
        recommended_action: g.match_case.recommended_action,
      },
      referral_summary: null,
      status: b.status,
      duration_ms: b.duration_ms,
      timestamp: capture.meta.captured_at,
      reasoning: null,
      input_summary: null,
    };
  }
  const m = capture.modalities[id];
  const r = m.reasoning;
  const risk = m.response.risk_level ?? r?.assessment.risk_level ?? null;
  return {
    request_id: `REPLAY-${id.toUpperCase()}`,
    summary: r?.assessment.clinical_summary ?? m.response.summary,
    risk_assessment: risk
      ? {
          risk_level: risk,
          urgency_score: risk === "EMERGENCY" || risk === "HIGH" ? 7 : 3,
          risk_flags: m.response.risk_flags.length ? m.response.risk_flags : r?.assessment.red_flags ?? [],
          rationale: r?.recommendations.recommended_next_step ?? null,
          recommended_action: m.response.recommended_action ?? r?.recommendations.recommended_next_step ?? null,
        }
      : null,
    referral_summary: null,
    // The recorded status, as recorded. A DEGRADED run replays as DEGRADED.
    status: m.response.status,
    duration_ms: m.pipeline_ms.median,
    timestamp: capture.meta.captured_at,
    reasoning: r,
    input_summary: m.input.quality || m.input.extracted || m.input.image
      ? {
          ocr_performed: m.input.ocr_performed,
          processing_time_ms: m.input.processing_time_ms,
          quality: m.input.quality,
          extracted: m.input.extracted,
          image: m.input.image,
        }
      : null,
  };
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

/**
 * Replays a recorded run for the current intake. A short pause stands in for
 * the recorded duration; the case carries the real duration and the source.
 */
export async function replayRun(id: ReplayId, intake: IntakeSnapshot, signal: AbortSignal): Promise<ClinicalCaseData> {
  await wait(id === "gate" ? 300 : 1200, signal);
  const option = REPLAY_OPTIONS.find((o) => o.id === id)!;
  const c = mapAnalysisToCase(replayResponse(id), intake);
  const sourceFile = id === "gate" ? "evaluation/capture_landing_data.py (gate case)" : capture.modalities[id].file;
  c.provenance = {
    model: id === "gate" ? "Deterministic rules only" : `${capture.meta.model} via Ollama`,
    knowledgeSource: `Recorded run, ${CAPTURED_AT}`,
    inferenceType: "Replay",
    analysisTime: c.provenance?.analysisTime ?? "not recorded",
  };
  c.pipeline = { ...c.pipeline!, replay: { capturedAt: CAPTURED_AT, sourceFile, label: option.label } };
  return c;
}
