export interface VitalSign {
  label: string;
  value: string;
  unit?: string;
  status: "normal" | "warning" | "alert";
  reference?: string;
}

/**
 * Qualitative confidence banding. Numeric confidence percentages are forbidden
 * anywhere in the UI, since a false-precision percentage implies statistical
 * certainty the underlying model doesn't actually have.
 */
export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

/**
 * Canonical title-case label for each confidence band. This is the single
 * shared source of truth for rendering `confidenceLevel` as text until the
 * dedicated ConfidenceBadge component is wired into these routes (route
 * migration tasks 18-23). Consumers needing a mid-sentence, lowercase form
 * should transform this value at the point of use (e.g. `.toLowerCase()`)
 * rather than defining a second, differently-cased constant.
 */
export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  HIGH: "High confidence",
  MEDIUM: "Moderate confidence",
  LOW: "Low confidence",
};

export interface SupportingFinding {
  source: string;
  observation: string;
}

export interface CaseDisposition {
  needsReferral: boolean;
  urgency: string;
  nextStep: string;
}

export interface ClinicalCaseData {
  caseId?: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  arrivalTime: string;
  assignedWorker: string;
  activeUser: string;
  village: string;
  riskLevel: "EMERGENCY" | "HIGH" | "MODERATE" | "LOW";
  urgencyScore: number;
  chiefComplaint: string;
  vitals: VitalSign[];
  primaryFinding: string;
  recommendedAction: string;
  clinicalSummary: string;
  confidenceLevel: ConfidenceLevel;
  requiresHumanReview: boolean;
  supportingFindings: SupportingFinding[];
  differentialConsiderations: string[];
  recommendedInvestigations: string[];
  clinicalRationale: string[];
  disposition: CaseDisposition;
  status?: string;
  symptoms?: string[];
  documents?: string[];
}

export function calculateCustomUrgencyScore(
  vitals: VitalSign[],
  symptoms: string[] = []
): {
  riskLevel: "EMERGENCY" | "HIGH" | "MODERATE" | "LOW";
  urgencyScore: number;
  primaryFinding: string;
  recommendedAction: string;
  confidenceLevel: ConfidenceLevel;
  requiresHumanReview: boolean;
  supportingFindings: SupportingFinding[];
  differentialConsiderations: string[];
  recommendedInvestigations: string[];
  clinicalRationale: string[];
  disposition: CaseDisposition;
} {
  let score = 5.0;
  const isSevere = symptoms.some(s => s.toLowerCase().includes("chest") || s.toLowerCase().includes("dyspnea"));
  if (isSevere) {
    score += 2.5;
  }
  if (vitals.some(v => v.status === "alert")) {
    score += 2.0;
  }

  const riskLevel = score >= 9.0 ? "EMERGENCY" : score >= 7.5 ? "HIGH" : score >= 5.5 ? "MODERATE" : "LOW";
  const primaryFinding = isSevere
    ? "Elevated Physiological Parameters with Anginal Symptoms"
    : "Mild Physiological Parameter Variance";
  const recommendedAction = isSevere
    ? "Schedule routine 12-lead ECG review with cardiology specialist within 48 hours & monitor vitals Q4H."
    : "Continue routine clinical observation and monitor vital signs every 8 hours.";

  const supportingFindings: SupportingFinding[] = isSevere
    ? [
        { source: "Vitals", observation: "Heart rate and blood pressure trending outside reference range at intake." },
        { source: "Symptom history", observation: "Chest tightness and palpitations reported by patient." },
      ]
    : [
        { source: "Vitals", observation: "Vital signs recorded within or close to reference range at intake." },
      ];

  const differentialConsiderations = isSevere
    ? ["Stable angina", "Anxiety-related chest tightness", "Musculoskeletal chest pain"]
    : ["Physiological variance without pathological correlate", "Early-stage viral illness"];

  const recommendedInvestigations = isSevere
    ? ["12-lead ECG", "Troponin panel", "Chest X-ray"]
    : ["Routine vitals recheck in 8 hours", "Basic metabolic panel if symptoms persist"];

  const clinicalRationale = isSevere
    ? [
        "Symptom pattern and vital sign trend are consistent with a cardiac origin warranting further workup.",
        "Absence of confirmatory ECG findings at intake supports a non-emergent referral pathway pending review.",
      ]
    : [
        "Vital sign pattern does not meet threshold for urgent escalation.",
        "Continued observation is appropriate given the absence of alert-level findings.",
      ];

  const disposition: CaseDisposition = isSevere
    ? { needsReferral: true, urgency: "Routine referral within 48 hours", nextStep: "Schedule cardiology consultation and repeat vitals in 4 hours." }
    : { needsReferral: false, urgency: "Routine follow-up", nextStep: "Continue observation and reassess at next scheduled visit." };

  return {
    riskLevel,
    urgencyScore: Math.min(9.9, Number(score.toFixed(1))),
    primaryFinding,
    recommendedAction,
    confidenceLevel: isSevere ? "MEDIUM" : "HIGH",
    requiresHumanReview: true,
    supportingFindings,
    differentialConsiderations,
    recommendedInvestigations,
    clinicalRationale,
    disposition,
  };
}

export const PRESET_CASES: Record<string, ClinicalCaseData> = {
  "CASE-8901": {
    caseId: "CASE-8901",
    patientId: "P-8901",
    patientName: "Ramesh Kumar",
    age: 45,
    gender: "Male",
    arrivalTime: "Arrived 12m ago",
    assignedWorker: "Priya Sharma (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Rampur Sub-Center",
    riskLevel: "MODERATE",
    urgencyScore: 6.5,
    chiefComplaint: "Patient presents with chest tightness and palpitations.",
    status: "MODERATE",
    vitals: [
      { label: "HR", value: "98 bpm", unit: "bpm", status: "warning", reference: "60-100" },
      { label: "BP", value: "132/88 mmHg", unit: "mmHg", status: "warning", reference: "120/80" },
      { label: "Temp", value: "37.2°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "98%", unit: "%", status: "normal", reference: "95-100%" },
    ],
    primaryFinding: "Sinus Tachycardia with mild elevated Blood Pressure",
    recommendedAction: "Schedule routine 12-lead ECG review with cardiology specialist within 48 hours & monitor vitals Q4H.",
    clinicalSummary: "Patient presents with chest tightness, heart rate of 98 bpm, and BP of 132/88 mmHg. Multimodal reasoning indicates moderate clinical risk requiring non-urgent cardiology evaluation.",
    confidenceLevel: "MEDIUM",
    requiresHumanReview: true,
    supportingFindings: [
      { source: "Vitals", observation: "Heart rate of 98 bpm and blood pressure of 132/88 mmHg, both mildly above reference range." },
      { source: "Symptom history", observation: "Chest tightness and palpitations reported at intake, without radiation or diaphoresis." },
      { source: "Oxygenation", observation: "SpO2 of 98% and temperature of 37.2°C remain within normal limits." },
    ],
    differentialConsiderations: [
      "Stable angina",
      "Anxiety-related chest tightness",
      "Musculoskeletal chest pain",
      "Early hypertensive response to exertion",
    ],
    recommendedInvestigations: [
      "12-lead ECG",
      "Troponin panel",
      "Basic metabolic panel",
      "Chest X-ray if symptoms persist",
    ],
    clinicalRationale: [
      "Mild tachycardia and blood pressure elevation alongside anginal symptoms warrant cardiology follow-up, but the absence of alert-level vitals does not indicate an acute emergency.",
      "Pattern is consistent with a moderate-risk presentation that benefits from a confirmatory ECG rather than immediate escalation.",
    ],
    disposition: {
      needsReferral: true,
      urgency: "Routine referral within 48 hours",
      nextStep: "Schedule cardiology consultation, repeat vitals every 4 hours until reviewed.",
    },
  },
  "DEMO-ACUTE-CARDIAC": {
    caseId: "DEMO-ACUTE-CARDIAC",
    patientId: "P-9902",
    patientName: "Sunita Devi",
    age: 62,
    gender: "Female",
    arrivalTime: "Arrived 5m ago",
    assignedWorker: "Rajesh Singh (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Sultanpur Sub-Center",
    riskLevel: "EMERGENCY",
    urgencyScore: 9.8,
    chiefComplaint: "Acute substernal chest pain radiating to jaw with diaphoresis.",
    status: "EMERGENCY",
    vitals: [
      { label: "HR", value: "115 bpm", unit: "bpm", status: "alert", reference: "60-100" },
      { label: "BP", value: "165/102 mmHg", unit: "mmHg", status: "alert", reference: "120/80" },
      { label: "Temp", value: "36.8°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "92%", unit: "%", status: "warning", reference: "95-100%" },
    ],
    primaryFinding: "Acute Coronary Syndrome (Possible STEMI)",
    recommendedAction: "STAT Emergency Referral: Oxygen therapy, sublingual nitroglycerin, 12-lead ECG immediately, and dispatch tertiary transport.",
    clinicalSummary: "Acute cardiac emergency flagged by local safety gate in 0.28ms. Critical vitals and severe angina require immediate physician intervention.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    supportingFindings: [
      { source: "Vitals", observation: "Heart rate of 115 bpm and blood pressure of 165/102 mmHg, both at alert thresholds." },
      { source: "Oxygenation", observation: "SpO2 of 92%, below the reference range and trending downward." },
      { source: "Symptom history", observation: "Substernal chest pain radiating to the jaw with diaphoresis, classic for acute coronary syndrome." },
    ],
    differentialConsiderations: [
      "ST-elevation myocardial infarction",
      "Unstable angina",
      "Aortic dissection",
      "Severe hypertensive emergency",
    ],
    recommendedInvestigations: [
      "Immediate 12-lead ECG",
      "STAT troponin panel",
      "Portable chest X-ray",
      "Continuous cardiac monitoring during transport",
    ],
    clinicalRationale: [
      "Alert-level heart rate and blood pressure combined with classic anginal radiation pattern meet the threshold for an acute coronary emergency.",
      "Falling SpO2 alongside diaphoresis increases the likelihood of a significant cardiac event requiring tertiary-level intervention without delay.",
    ],
    disposition: {
      needsReferral: true,
      urgency: "STAT emergency transfer",
      nextStep: "Administer oxygen and sublingual nitroglycerin, obtain immediate 12-lead ECG, and dispatch tertiary transport.",
    },
  },
};
