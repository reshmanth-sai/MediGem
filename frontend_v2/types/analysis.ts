/** Clinical Analysis & Reasoning Output Type Definitions */

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "EMERGENCY";

export type ImageModality = "ECG" | "LAB_REPORT" | "PRESCRIPTION" | "WOUND" | "GENERAL";

export interface RiskAssessment {
  riskLevel: RiskLevel;
  urgencyScore: number;
  rationale: string;
}

export interface Observation {
  finding: string;
  evidence: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  clinicalImportance?: string;
}

export interface ReferralSummary {
  reasonForReferral: string;
  priority: "ROUTINE" | "URGENT" | "EMERGENCY";
  clinicalSummary: string;
}

export interface AnalysisResponse {
  requestId: string;
  status: "COMPLETED" | "EMERGENCY_INTERCEPTED" | "FAILED";
  timestamp: string;
  durationMs: number;
  riskAssessment?: RiskAssessment;
  summary: string;
  observations: Observation[];
  referralSummary?: ReferralSummary;
}
