import type { AnalysisResponse } from "@/lib/schemas/analysis";
import type { ClinicalCaseData, VitalSign } from "@/lib/casesData";
import { SESSION } from "@/lib/session";

export interface IntakeSnapshot {
  caseId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  chiefComplaint: string;
  symptoms: string[];
  vitals: VitalSign[];
  documents: string[];
}

function urgencyLabel(level: ClinicalCaseData["riskLevel"], needsReferral: boolean): string {
  if (level === "EMERGENCY") return "Immediate referral";
  if (level === "HIGH") return needsReferral ? "Urgent referral" : "Urgent review";
  if (level === "MODERATE") return needsReferral ? "Routine referral" : "Monitor and follow up";
  return "Routine follow-up";
}

/**
 * Turns the API's AnalysisResponse into the ClinicalCaseData the results
 * screens render. Nothing is invented: a field the pipeline did not return
 * is left empty, and the full reasoning object rides along untouched.
 */
export function mapAnalysisToCase(res: AnalysisResponse, intake: IntakeSnapshot): ClinicalCaseData {
  const r = res.reasoning ?? null;
  const risk = res.risk_assessment;
  const intercepted = res.status === "EMERGENCY_INTERCEPTED";
  const riskLevel = risk?.risk_level ?? "LOW";
  const needsReferral = intercepted || Boolean(r?.recommendations.needs_referral || res.referral_summary);
  const recommendedAction = intercepted
    ? `${(risk?.recommended_action ?? "IMMEDIATE_REFERRAL").replace(/_/g, " ")}. ${risk?.rationale ?? ""}`.trim()
    : r?.recommendations.recommended_next_step ?? risk?.recommended_action ?? "No recommendation was produced. A clinician must review this case.";

  const durationS = res.duration_ms != null ? `${(res.duration_ms / 1000).toFixed(1)} seconds` : undefined;

  return {
    caseId: intake.caseId,
    patientId: intake.patientId,
    patientName: intake.patientName,
    age: intake.age,
    gender: intake.gender,
    arrivalTime: "Arrived just now",
    assignedWorker: `${SESSION.clinician.name} (${SESSION.clinician.roleShort})`,
    activeUser: `${SESSION.clinician.name} (${SESSION.clinician.roleShort})`,
    village: intake.village,
    riskLevel,
    urgencyScore: risk?.urgency_score ?? 0,
    chiefComplaint: intake.chiefComplaint,
    vitals: intake.vitals,
    primaryFinding: intercepted
      ? `Emergency gate: ${risk?.risk_flags.join(", ") || "rule match"}`
      : r?.assessment.clinical_summary.split(/(?<=\.)\s/)[0] ?? res.summary,
    recommendedAction,
    clinicalSummary: r?.assessment.clinical_summary ?? res.summary,
    confidenceLevel: r?.assessment.confidence_level ?? (intercepted ? "HIGH" : "LOW"),
    requiresHumanReview: r?.recommendations.requires_human_review ?? true,
    supportingFindings: r?.observations.map((o) => ({ source: o.source, observation: o.observation })) ?? [],
    differentialConsiderations: [],
    recommendedInvestigations: [],
    clinicalRationale: [
      ...(risk?.rationale && intercepted ? [risk.rationale] : []),
      ...(r?.limitations ?? []),
    ],
    disposition: {
      needsReferral,
      urgency: urgencyLabel(riskLevel, needsReferral),
      nextStep: recommendedAction,
    },
    status: res.status,
    symptoms: intake.symptoms,
    documents: intake.documents,
    keyObservations: r?.observations.map((o) => ({ label: o.source, detail: o.observation })),
    safetyScreening: {
      hasRedFlags: intercepted || (r?.assessment.red_flags.length ?? 0) > 0,
      title: intercepted
        ? "Emergency gate matched. Model inference was not run."
        : (r?.assessment.red_flags.length ?? 0) > 0
        ? "Red flags noted by the model"
        : "No emergency rule matched",
      description: intercepted
        ? res.summary
        : (r?.assessment.red_flags.join("; ") || "The deterministic rules cleared this presentation before the model ran."),
    },
    provenance: {
      model: intercepted ? "Deterministic rules only" : "Local model via Ollama",
      knowledgeSource: "Pipeline API on this machine",
      inferenceType: intercepted ? "Rule gate" : "Local inference",
      analysisTime: durationS ?? "not recorded",
    },
    pipeline: {
      requestId: res.request_id,
      status: res.status,
      durationMs: res.duration_ms,
      reasoning: r,
      inputSummary: res.input_summary ?? null,
      gateSummary: intercepted ? res.summary : null,
    },
  };
}
