import type { AnalysisResponse, StoredCase } from "@/lib/schemas/analysis";
import type { ClinicalCaseData, ClinicalDocument, VitalSign } from "@/lib/casesData";
import { documentUrl } from "@/services/cases.service";
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

/** First sentence of the summary, or a risk-level line when it runs long. */
function headline(summary: string, risk: ClinicalCaseData["riskLevel"]): string {
  const first = summary.split(/(?<=[.!?])\s+/)[0]?.trim() ?? "";
  if (first.length > 0 && first.length <= 110) return first;
  return `${risk.charAt(0)}${risk.slice(1).toLowerCase()} risk assessment; see summary`;
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
      : headline(r?.assessment.clinical_summary ?? res.summary, riskLevel),
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

function vitalStatus(label: string, v: number): VitalSign["status"] {
  if (label === "HR") return v > 100 || v < 50 ? "alert" : "normal";
  if (label === "BP") return v > 140 ? "warning" : "normal";
  if (label === "Temp") return v > 38 ? "warning" : "normal";
  if (label === "SpO2") return v < 94 ? "alert" : "normal";
  return "normal";
}

/** A stored case, as the results and list screens render it. */
export function mapStoredCase(c: StoredCase): ClinicalCaseData {
  const p = c.patient;
  const vs = p.vital_signs ?? {};
  const vitals: VitalSign[] = [];
  if (vs.heart_rate_bpm != null) vitals.push({ label: "HR", value: `${vs.heart_rate_bpm} bpm`, status: vitalStatus("HR", vs.heart_rate_bpm) });
  if (vs.blood_pressure_sys != null && vs.blood_pressure_dia != null)
    vitals.push({ label: "BP", value: `${vs.blood_pressure_sys}/${vs.blood_pressure_dia} mmHg`, status: vitalStatus("BP", vs.blood_pressure_sys) });
  if (vs.temperature_c != null) vitals.push({ label: "Temp", value: `${vs.temperature_c} °C`, status: vitalStatus("Temp", vs.temperature_c) });
  if (vs.spo2_percent != null) vitals.push({ label: "SpO2", value: `${vs.spo2_percent}%`, status: vitalStatus("SpO2", vs.spo2_percent) });

  const mapped = mapAnalysisToCase(c.response, {
    caseId: c.id,
    patientId: p.patient_id || "UNKNOWN",
    patientName: p.patient_name || "Unnamed patient",
    age: p.age ?? 0,
    gender: p.gender || "Not recorded",
    village: p.location || SESSION.facility.name,
    chiefComplaint: p.chief_complaint || p.symptoms.join(", ") || "Not recorded",
    symptoms: p.symptoms,
    vitals,
    documents: p.documents,
  });
  mapped.arrivalTime = relativeTime(c.created_at);
  mapped.requiresHumanReview = c.requires_review;
  mapped.clinicalNotes = p.notes ?? undefined;
  if (c.reviewed_at && c.review_decision && c.reviewer) {
    mapped.review = { decision: c.review_decision, reviewer: c.reviewer, at: c.reviewed_at, note: c.review_note };
  }
  if (c.plan) {
    mapped.plan = { nextStep: c.plan.next_step, followUp: c.plan.follow_up, urgency: c.plan.urgency, note: c.plan.note, updatedBy: c.plan.updated_by, updatedAt: c.plan.updated_at };
    mapped.disposition = { ...mapped.disposition, nextStep: c.plan.next_step, urgency: c.plan.urgency || mapped.disposition.urgency };
  }
  mapped.notes = c.notes.map((n) => ({ id: n.id, author: n.author, text: n.text, at: n.created_at }));
  mapped.events = c.events.map((e) => ({ id: e.id, actor: e.actor, action: e.action, payload: e.payload ?? null, at: e.created_at }));
  const intakeDocs: ClinicalDocument[] = p.documents.map((name) => ({ name, type: /\.pdf$/i.test(name) ? "PDF" : "Image", size: "", uploadedTime: mapped.arrivalTime, addedBy: "intake" }));
  const storedDocs: ClinicalDocument[] = c.documents.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.content_type === "application/pdf" ? "PDF" : "Image",
    size: d.size_bytes >= 1024 * 1024 ? `${(d.size_bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(d.size_bytes / 1024))} KB`,
    uploadedTime: relativeTime(d.created_at),
    url: documentUrl(c.id, d.id),
    addedBy: d.added_by,
  }));
  mapped.clinicalDocuments = [...intakeDocs, ...storedDocs];
  return mapped;
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const mins = Math.max(0, Math.round((now.getTime() - t) / 60_000));
  if (mins < 1) return "Arrived just now";
  if (mins < 60) return `Arrived ${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Arrived ${hours}h ago`;
  return `Arrived ${Math.round(hours / 24)}d ago`;
}
