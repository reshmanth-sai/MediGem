export interface VitalSign {
  label: string;
  value: string;
  unit?: string;
  status: "normal" | "warning" | "alert";
  reference?: string;
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
  aiConfidence: number;
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

  return {
    riskLevel,
    urgencyScore: Math.min(9.9, Number(score.toFixed(1))),
    primaryFinding,
    recommendedAction,
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
    aiConfidence: 94.5,
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
    clinicalSummary: "Acute cardiac emergency detected by local safety gate in 0.28ms. Critical vitals and severe angina require immediate physician intervention.",
    aiConfidence: 98.2,
  },
};
