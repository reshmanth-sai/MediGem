import type { z } from "zod";
import type { ReasoningOutput } from "@/components/landing/data/schema";
import type { InputSummary } from "@/lib/schemas/analysis";

type ReasoningOutputData = z.infer<typeof ReasoningOutput>;
type InputSummaryData = z.infer<typeof InputSummary>;

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

export interface ClinicalDocument {
  id?: string;
  name: string;
  type: string;
  size: string;
  uploadedTime: string;
  url?: string;
  addedBy?: string;
}

export interface KeyObservation {
  label: string;
  detail: string;
}

export interface SafetyScreening {
  hasRedFlags: boolean;
  title: string;
  description: string;
}

export interface CaseProvenance {
  model: string;
  knowledgeSource: string;
  inferenceType: string;
  analysisTime: string;
}

/** The pipeline's validated output and input-stage findings, attached to a case that came from the API. */
export interface PipelineRecord {
  requestId: string;
  status: string;
  durationMs: number | null;
  reasoning: ReasoningOutputData | null;
  inputSummary: InputSummaryData | null;
  gateSummary: string | null;
  /** Present when this case replays a captured run rather than a live request. */
  replay?: { capturedAt: string; sourceFile: string; label: string };
}

export interface ClinicalCaseData {
  caseId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  arrivalTime: string;
  assignedWorker: string;
  activeUser: string;
  village: string;
  lastVisit?: string;
  followUp?: string;
  riskLevel: "EMERGENCY" | "HIGH" | "MODERATE" | "LOW";
  urgencyScore: number;
  chiefComplaint: string;
  clinicalNotes?: string;
  vitals: VitalSign[];
  weightKg?: number;
  respiratoryRate?: string;
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
  clinicalDocuments?: ClinicalDocument[];
  keyObservations?: KeyObservation[];
  safetyScreening?: SafetyScreening;
  provenance?: CaseProvenance;
  pipeline?: PipelineRecord;
  /** Clinician sign-off, when the case came from the store and has one. */
  review?: { decision: "approved" | "modified" | "rejected"; reviewer: string; at: string; note?: string | null };
  /** Care plan set by a clinician after the assessment. */
  plan?: { nextStep: string; followUp?: string | null; urgency?: string | null; note?: string | null; updatedBy?: string; updatedAt?: string };
  /** Notes added by clinicians after intake. */
  notes?: { id: string; author: string; text: string; at: string }[];
  /** Append-only history from the store. */
  events?: { id: number; actor: string; action: string; payload?: Record<string, unknown> | null; at: string }[];
}

export const PRESET_CASES: Record<string, ClinicalCaseData> = {
  "CASE-8901": {
    caseId: "CASE-8901",
    patientId: "PID-2025-0042",
    patientName: "Lakshmi Ammal",
    age: 62,
    gender: "Female",
    arrivalTime: "Arrived 10m ago",
    assignedWorker: "Priya Sharma (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Kovilpatti, Tamil Nadu",
    lastVisit: "Sep 7, 2025",
    followUp: "In 3 days",
    riskLevel: "MODERATE",
    urgencyScore: 6.4,
    chiefComplaint: "Headache and dizziness reported for 2 days.",
    clinicalNotes:
      "Known case of hypertension for 4 years on irregular medication. Reports mild blurred vision and occipital headache for 2 days. No chest pain. No vomiting. Reports mild blurred vision. Appears conscious and oriented.",
    status: "MODERATE",
    weightKg: 58,
    respiratoryRate: "20/min",
    vitals: [
      { label: "BP", value: "150/90 mmHg", unit: "mmHg", status: "warning", reference: "120/80" },
      { label: "Pulse", value: "88 bpm", unit: "bpm", status: "normal", reference: "60-100" },
      { label: "Temperature", value: "37.2°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "96%", unit: "%", status: "normal", reference: "95-100%" },
      { label: "Resp. rate", value: "20/min", unit: "/min", status: "normal", reference: "12-20" },
    ],
    primaryFinding: "Stage 2 Essential Hypertension with Cephalea",
    recommendedAction: "Prescribe anti-hypertensive medication review, low-sodium dietary counseling, and recheck blood pressure in 72 hours.",
    clinicalSummary:
      "62-year-old female presenting with headache and dizziness. Known hypertensive with baseline blood pressure elevation (150/90 mmHg). Oxygenation and respiratory parameters are stable. Requires outpatient blood pressure titration and routine clinical follow-up.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Elevated blood pressure", detail: "150/90 mmHg" },
      { label: "Headache and dizziness", detail: "Reported for 2 days" },
      { label: "No acute respiratory distress", detail: "SpO2 and respiratory rate within normal range" },
      { label: "Age > 60 years", detail: "Higher monitoring category" },
    ],
    supportingFindings: [
      { source: "Vitals", observation: "Blood pressure elevated at 150/90 mmHg; heart rate 88 bpm within normal limits." },
      { source: "Symptom history", observation: "Occipital headache and mild postural dizziness for 48 hours without syncope." },
      { source: "Oxygenation", observation: "SpO2 of 96% and respiratory rate of 20/min remain stable." },
    ],
    differentialConsiderations: [
      "Uncontrolled primary essential hypertension",
      "Tension-type headache secondary to elevated pressure",
      "Medication non-adherence variance",
      "Benign paroxysmal positional dizziness",
    ],
    recommendedInvestigations: [
      "Basic metabolic panel (serum electrolytes & creatinine)",
      "Urine protein dipstick",
      "Fasting blood glucose",
      "Fundoscopic screening for hypertensive changes",
    ],
    clinicalRationale: [
      "Blood pressure of 150/90 mmHg in a 62-year-old patient with persistent headache warrants prompt therapeutic adjustment.",
      "Absence of chest pain, focal neurological deficits, or vomiting indicates a non-emergency presentation suitable for primary center management.",
    ],
    safetyScreening: {
      hasRedFlags: false,
      title: "No emergency red flags detected",
      description: "Rule-based emergency screening completed. Deterministic safety criteria verified.",
    },
    disposition: {
      needsReferral: true,
      urgency: "Consider referral to PHC / CHC",
      nextStep: "Follow-up within 3-7 days for blood pressure recheck.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "8.4 seconds",
    },
    clinicalDocuments: [
      { name: "chest_xray.jpg", type: "Image", size: "2.1 MB", uploadedTime: "10:12 AM" },
      { name: "lab_report.pdf", type: "PDF", size: "1.4 MB", uploadedTime: "10:10 AM" },
      { name: "prescription.jpg", type: "Image", size: "512 KB", uploadedTime: "10:08 AM" },
    ],
  },

  "DEMO-ACUTE-CARDIAC": {
    caseId: "DEMO-ACUTE-CARDIAC",
    patientId: "PID-2025-0019",
    patientName: "Sunita Devi",
    age: 62,
    gender: "Female",
    arrivalTime: "Arrived 5m ago",
    assignedWorker: "Rajesh Singh (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Sundarpur Sub-Center",
    lastVisit: "Aug 14, 2025",
    followUp: "Immediate STAT",
    riskLevel: "EMERGENCY",
    urgencyScore: 9.8,
    chiefComplaint: "Acute substernal chest pain radiating to jaw with diaphoresis.",
    clinicalNotes:
      "Severe crushing substernal chest pain started 45 minutes ago during rest. Radiating to left arm and jaw. Patient is visibly anxious, diaphoretic, and tachypneic. No history of trauma. Immediate STAT referral protocol initiated.",
    status: "EMERGENCY",
    weightKg: 64,
    respiratoryRate: "24/min",
    vitals: [
      { label: "BP", value: "165/102 mmHg", unit: "mmHg", status: "alert", reference: "120/80" },
      { label: "Pulse", value: "115 bpm", unit: "bpm", status: "alert", reference: "60-100" },
      { label: "Temperature", value: "36.8°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "92%", unit: "%", status: "warning", reference: "95-100%" },
      { label: "Resp. rate", value: "24/min", unit: "/min", status: "alert", reference: "12-20" },
    ],
    primaryFinding: "Acute Coronary Syndrome (Possible STEMI)",
    recommendedAction: "STAT Emergency Transfer: Oxygen therapy, sublingual nitroglycerin, 12-lead ECG immediately, and dispatch tertiary transport.",
    clinicalSummary:
      "Acute cardiac emergency flagged by safety screening in 0.28ms. Critical vitals, diaphoresis, and severe angina require immediate physician intervention and ambulance transfer.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Substernal crushing pain", detail: "Radiating to jaw and left arm" },
      { label: "Tachycardia & severe hypertension", detail: "HR 115 bpm, BP 165/102 mmHg" },
      { label: "Hypoxemia & diaphoresis", detail: "SpO2 92% on ambient air" },
      { label: "Critical safety trigger", detail: "Rule-based emergency safety gate active" },
    ],
    supportingFindings: [
      { source: "Vitals", observation: "Heart rate of 115 bpm and blood pressure of 165/102 mmHg at emergency alert thresholds." },
      { source: "Oxygenation", observation: "SpO2 of 92%, below reference range and declining." },
      { source: "Symptom history", observation: "Substernal chest pain radiating to the jaw with profuse cold diaphoresis." },
    ],
    differentialConsiderations: [
      "ST-elevation myocardial infarction",
      "Non-ST elevation acute coronary syndrome",
      "Aortic dissection",
      "Severe hypertensive emergency",
    ],
    recommendedInvestigations: [
      "Immediate 12-lead ECG",
      "STAT troponin panel",
      "Portable chest X-ray",
      "Continuous cardiac telemetry during transport",
    ],
    clinicalRationale: [
      "Alert-level heart rate and blood pressure combined with classic anginal radiation meet the threshold for acute coronary syndrome.",
      "Falling oxygen saturation and diaphoresis require emergent tertiary-level cardiovascular intervention without delay.",
    ],
    safetyScreening: {
      hasRedFlags: true,
      title: "EMERGENCY: Acute cardiac red flag triggered",
      description: "Rule-based emergency screening detected acute coronary syndrome pattern. Immediate referral protocol required.",
    },
    disposition: {
      needsReferral: true,
      urgency: "STAT emergency transfer",
      nextStep: "Administer oxygen, chewable aspirin, obtain immediate 12-lead ECG, dispatch transport.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "0.28 seconds",
    },
    clinicalDocuments: [
      { name: "sample_ecg_lead_ii.png", type: "Image", size: "16.9 KB", uploadedTime: "Just now" },
    ],
  },

  "DEMO-ECG": {
    caseId: "DEMO-ECG",
    patientId: "PID-2025-0031",
    patientName: "Ramesh Kumar",
    age: 45,
    gender: "Male",
    arrivalTime: "Arrived 12m ago",
    assignedWorker: "Priya Sharma (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Rampur Sub-Center",
    lastVisit: "May 12, 2025",
    followUp: "In 2 days",
    riskLevel: "MODERATE",
    urgencyScore: 6.5,
    chiefComplaint: "Palpitations and intermittent chest tightness on exertion.",
    clinicalNotes:
      "45-year-old male with recurrent episodes of palpitations lasting 10-15 minutes over past 3 weeks. Denies syncope, orthopnea, or ankle edema. 12-lead rhythm scan demonstrates sinus tachycardia without acute ischemic ST changes.",
    status: "MODERATE",
    weightKg: 68,
    respiratoryRate: "18/min",
    vitals: [
      { label: "BP", value: "132/88 mmHg", unit: "mmHg", status: "warning", reference: "120/80" },
      { label: "Pulse", value: "98 bpm", unit: "bpm", status: "warning", reference: "60-100" },
      { label: "Temperature", value: "37.2°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "98%", unit: "%", status: "normal", reference: "95-100%" },
      { label: "Resp. rate", value: "18/min", unit: "/min", status: "normal", reference: "12-20" },
    ],
    primaryFinding: "Sinus Tachycardia with Borderline Blood Pressure",
    recommendedAction: "Schedule formal 12-lead ECG review with cardiology specialist within 48 hours and monitor vitals Q4H.",
    clinicalSummary:
      "Patient presents with chest tightness, heart rate of 98 bpm, and BP of 132/88 mmHg. Multimodal review indicates moderate clinical risk requiring non-urgent cardiology evaluation.",
    confidenceLevel: "MEDIUM",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Sinus tachycardia rhythm", detail: "Resting pulse 98 bpm" },
      { label: "Borderline blood pressure", detail: "132/88 mmHg" },
      { label: "Normal oxygen saturation", detail: "SpO2 98% on room air" },
      { label: "ECG rhythm analysis", detail: "No acute ST segment elevation" },
    ],
    supportingFindings: [
      { source: "Vitals", observation: "Heart rate of 98 bpm and blood pressure of 132/88 mmHg, mildly elevated." },
      { source: "Symptom history", observation: "Intermittent chest tightness and palpitations without radiation." },
      { source: "Oxygenation", observation: "SpO2 of 98% and temperature of 37.2°C remain normal." },
    ],
    differentialConsiderations: [
      "Sinus tachycardia secondary to stress or caffeine",
      "Early hypertensive cardiovascular disease",
      "Hyperthyroidism-associated palpitations",
      "Stable anginal equivalent",
    ],
    recommendedInvestigations: [
      "12-lead ECG rhythm strip",
      "Thyroid stimulating hormone (TSH)",
      "Serum electrolytes",
      "Fasting lipid profile",
    ],
    clinicalRationale: [
      "Resting tachycardia and borderline blood pressure in a middle-aged male with palpitations warrant cardiology follow-up.",
      "Absence of alert-level hemodynamic instability supports non-emergency outpatient workup.",
    ],
    safetyScreening: {
      hasRedFlags: false,
      title: "No emergency red flags detected",
      description: "Rule-based screening verified. No acute STEMI or life-threatening arrhythmia detected.",
    },
    disposition: {
      needsReferral: true,
      urgency: "Routine referral within 48 hours",
      nextStep: "Schedule cardiology consultation and repeat vitals in 4 hours.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "5.4 seconds",
    },
    clinicalDocuments: [
      { name: "sample_ecg_lead_ii.png", type: "Image", size: "16.9 KB", uploadedTime: "10:04 AM" },
    ],
  },

  "DEMO-LAB-CBC": {
    caseId: "DEMO-LAB-CBC",
    patientId: "PID-2025-0055",
    patientName: "Rajesh Gupta",
    age: 38,
    gender: "Male",
    arrivalTime: "Arrived 25m ago",
    assignedWorker: "Kavita Rao (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Bhadrak Sub-Center",
    lastVisit: "Jan 18, 2025",
    followUp: "In 24 hours",
    riskLevel: "HIGH",
    urgencyScore: 7.8,
    chiefComplaint: "High grade fever with chills and productive cough for 4 days.",
    clinicalNotes:
      "38-year-old male with 4-day history of remittent fever reaching 39.1°C with rigors. Yellowish productive sputum. CBC report PDF processed via text layer shows marked leukocytosis with neutrophilia.",
    status: "HIGH",
    weightKg: 62,
    respiratoryRate: "22/min",
    vitals: [
      { label: "BP", value: "118/76 mmHg", unit: "mmHg", status: "normal", reference: "120/80" },
      { label: "Pulse", value: "104 bpm", unit: "bpm", status: "alert", reference: "60-100" },
      { label: "Temperature", value: "39.1°C", unit: "°C", status: "alert", reference: "36.5-37.5" },
      { label: "SpO2", value: "94%", unit: "%", status: "warning", reference: "95-100%" },
      { label: "Resp. rate", value: "22/min", unit: "/min", status: "warning", reference: "12-20" },
    ],
    primaryFinding: "Acute Lower Respiratory Tract Infection with Marked Leukocytosis",
    recommendedAction: "Initiate empiric oral antimicrobial therapy per clinical protocol, ensure antipyretic administration, and schedule chest radiography within 24 hours.",
    clinicalSummary:
      "Patient presents with high-grade pyrexia, tachycardia, and productive cough. Laboratory analysis reveals significant leukocytosis (WBC 14.5 k/uL) with 82% neutrophils. High risk requiring targeted antimicrobial management and physician follow-up.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Marked leukocytosis", detail: "WBC 14.5 k/uL with 82% neutrophils" },
      { label: "High pyrexia & tachycardia", detail: "Temp 39.1°C, Pulse 104 bpm" },
      { label: "Mild respiratory compromise", detail: "SpO2 94% on ambient air, RR 22/min" },
      { label: "Document extracted", detail: "CBC laboratory report PDF verified" },
    ],
    supportingFindings: [
      { source: "Laboratory report", observation: "WBC count 14,500/uL with neutrophil predominance (82%), indicating bacterial infection." },
      { source: "Vitals", observation: "Core temperature 39.1°C and tachycardia of 104 bpm." },
      { source: "Oxygenation", observation: "SpO2 of 94% on ambient air warrants close respiratory monitoring." },
    ],
    differentialConsiderations: [
      "Community-acquired bacterial pneumonia",
      "Acute bronchitis with systemic inflammatory response",
      "Tropical febrile illness (scrub typhus / malaria)",
      "Severe upper respiratory tract infection",
    ],
    recommendedInvestigations: [
      "Posteroanterior chest radiograph",
      "Rapid malaria antigen test & dengue NS1 serology",
      "Sputum gram stain and culture",
      "Repeat CBC in 48 hours",
    ],
    clinicalRationale: [
      "High fever combined with elevated leukocyte count and borderline hypoxia indicates significant lower respiratory involvement.",
      "Requires prompt antimicrobial therapy to prevent clinical deterioration in a primary care setting.",
    ],
    safetyScreening: {
      hasRedFlags: false,
      title: "No acute emergency red flags detected",
      description: "Severe sepsis screening criteria evaluated. Blood pressure remains adequate without hemodynamic shock.",
    },
    disposition: {
      needsReferral: true,
      urgency: "Urgent referral within 24 hours",
      nextStep: "Start empiric antibiotic, antipyretic, and refer to CHC for chest X-ray.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "4.1 seconds",
    },
    clinicalDocuments: [
      { name: "cbc_lab_report.pdf", type: "PDF", size: "55.7 KB", uploadedTime: "09:48 AM" },
      { name: "cbc_lab_report.png", type: "Image", size: "38.3 KB", uploadedTime: "09:48 AM" },
    ],
  },

  "DEMO-WOUND": {
    caseId: "DEMO-WOUND",
    patientId: "PID-2025-0078",
    patientName: "Priya Sundaram",
    age: 29,
    gender: "Female",
    arrivalTime: "Arrived 40m ago",
    assignedWorker: "Kavita Rao (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Madurai Rural Clinic",
    lastVisit: "Sep 1, 2025",
    followUp: "In 5 days",
    riskLevel: "MODERATE",
    urgencyScore: 5.8,
    chiefComplaint: "Post-cesarean wound inspection on postoperative day 6.",
    clinicalNotes:
      "29-year-old female presents for scheduled wound check post lower segment cesarean section. Reports mild localized tenderness around suture line. No purulent discharge. Surgical photograph evaluated for healing progression and erythema margin.",
    status: "MODERATE",
    weightKg: 55,
    respiratoryRate: "16/min",
    vitals: [
      { label: "BP", value: "114/72 mmHg", unit: "mmHg", status: "normal", reference: "120/80" },
      { label: "Pulse", value: "76 bpm", unit: "bpm", status: "normal", reference: "60-100" },
      { label: "Temperature", value: "37.0°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "99%", unit: "%", status: "normal", reference: "95-100%" },
      { label: "Resp. rate", value: "16/min", unit: "/min", status: "normal", reference: "12-20" },
    ],
    primaryFinding: "Post-Operative Surgical Site with Mild Perilesional Erythema",
    recommendedAction: "Maintain clean dry dressing protocol, educate on signs of deep surgical site infection, and review in 5 days for suture removal.",
    clinicalSummary:
      "Post-operative day 6 surgical wound check shows clean incision margins with mild benign erythema. Baseline vitals are normal without systemic fever or wound dehiscence.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Incision integrity", detail: "Margins well-approximated, no dehiscence" },
      { label: "Exudate assessment", detail: "No purulent discharge or active bleeding" },
      { label: "Perilesional erythema", detail: "Mild localized erythema under 1 cm margin" },
      { label: "Systemic parameters", detail: "Afebrile, normal vitals" },
    ],
    supportingFindings: [
      { source: "Wound photograph", observation: "Incision well-approximated with minimal serosanguinous crusted margin." },
      { source: "Vitals", observation: "Afebrile at 37.0°C with normal resting pulse of 76 bpm." },
      { source: "Clinical history", observation: "Expected postoperative tenderness improving since day 4." },
    ],
    differentialConsiderations: [
      "Normal physiological healing with mild inflammatory erythema",
      "Superficial surgical site infection (early)",
      "Contact dermatitis from adhesive surgical dressing",
    ],
    recommendedInvestigations: [
      "Wound culture swab only if purulent discharge develops",
      "Follow-up visual assessment in 5 days",
    ],
    clinicalRationale: [
      "Incision margins are intact without induration or fluctuance, consistent with expected healing progression.",
      "Afebrile state and normal systemic vitals argue strongly against deep surgical infection.",
    ],
    safetyScreening: {
      hasRedFlags: false,
      title: "No emergency red flags detected",
      description: "Screening confirmed no signs of necrotizing infection, wound rupture, or systemic sepsis.",
    },
    disposition: {
      needsReferral: false,
      urgency: "Routine follow-up in 5 days",
      nextStep: "Continue wound hygiene protocol and return for scheduled suture removal.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "5.1 seconds",
    },
    clinicalDocuments: [
      { name: "post_op_wound.png", type: "Image", size: "8.5 KB", uploadedTime: "08:30 AM" },
    ],
  },

  "DEMO-PRESCRIPTION": {
    caseId: "DEMO-PRESCRIPTION",
    patientId: "PID-2025-0092",
    patientName: "Anand Verma",
    age: 54,
    gender: "Male",
    arrivalTime: "Arrived 1h ago",
    assignedWorker: "Rajesh Singh (ANM)",
    activeUser: "Dr. Vikram Patel (CHO)",
    village: "Rampur Sub-Center",
    lastVisit: "Jul 20, 2025",
    followUp: "In 14 days",
    riskLevel: "LOW",
    urgencyScore: 4.2,
    chiefComplaint: "Routine hypertension prescription refill and adherence review.",
    clinicalNotes:
      "54-year-old male attending for 3-month medication refill. Brings handwritten prescription slip from district hospital. Verified Amlodipine 5mg OD and Telmisartan 40mg OD. Blood pressure well controlled on current regimen.",
    status: "LOW",
    weightKg: 71,
    respiratoryRate: "16/min",
    vitals: [
      { label: "BP", value: "124/80 mmHg", unit: "mmHg", status: "normal", reference: "120/80" },
      { label: "Pulse", value: "72 bpm", unit: "bpm", status: "normal", reference: "60-100" },
      { label: "Temperature", value: "36.6°C", unit: "°C", status: "normal", reference: "36.5-37.5" },
      { label: "SpO2", value: "98%", unit: "%", status: "normal", reference: "95-100%" },
      { label: "Resp. rate", value: "16/min", unit: "/min", status: "normal", reference: "12-20" },
    ],
    primaryFinding: "Controlled Hypertension on Stable Dual Therapy",
    recommendedAction: "Dispense 30-day medication refill, counsel on continued lifestyle modifications, and schedule routine review in 3 months.",
    clinicalSummary:
      "Patient demonstrates stable hemodynamic control (BP 124/80 mmHg) on current dual anti-hypertensive therapy. Prescription verified without drug-drug contraindications. Low clinical risk.",
    confidenceLevel: "HIGH",
    requiresHumanReview: true,
    keyObservations: [
      { label: "Hemodynamic control", detail: "BP 124/80 mmHg within target range" },
      { label: "Medication adherence", detail: "Amlodipine 5mg & Telmisartan 40mg confirmed" },
      { label: "Prescription scan", detail: "Handwritten memo verified and logged" },
      { label: "Asymptomatic status", detail: "No dizziness, headache, or peripheral edema" },
    ],
    supportingFindings: [
      { source: "Vitals", observation: "Blood pressure 124/80 mmHg and pulse 72 bpm indicate stable pharmacological control." },
      { source: "Prescription memo", observation: "Legible handwritten orders verified matching clinical guidelines." },
      { source: "Symptom review", observation: "Patient reports full adherence and absence of adverse drug effects." },
    ],
    differentialConsiderations: [
      "Controlled primary hypertension",
      "Mild white-coat normotension",
    ],
    recommendedInvestigations: [
      "Annual serum creatinine and potassium",
      "Annual fasting lipid profile",
    ],
    clinicalRationale: [
      "Optimal blood pressure reading and good tolerance of current medication support continuing unchanged maintenance therapy.",
      "Low risk presentation suitable for standard primary health center dispensation.",
    ],
    safetyScreening: {
      hasRedFlags: false,
      title: "No emergency red flags detected",
      description: "Prescription screening verified no drug interactions or adverse alerts.",
    },
    disposition: {
      needsReferral: false,
      urgency: "Routine follow-up in 3 months",
      nextStep: "Dispense monthly medication supply and record adherence in clinic register.",
    },
    provenance: {
      model: "MediGem-1 Local",
      knowledgeSource: "Clinical Guidelines",
      inferenceType: "Offline",
      analysisTime: "4.9 seconds",
    },
    clinicalDocuments: [
      { name: "handwritten_prescription.png", type: "Image", size: "18.9 KB", uploadedTime: "08:15 AM" },
    ],
  },
};

