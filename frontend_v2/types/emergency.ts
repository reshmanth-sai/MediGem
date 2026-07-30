/** Emergency Safety Engine Type Definitions */

export type EmergencyCategory =
  | "CARDIAC"
  | "RESPIRATORY"
  | "STROKE"
  | "SEPSIS"
  | "POISONING"
  | "SNAKE_BITE"
  | "GENERAL_EMERGENCY";

export type EmergencyPriority = "CRITICAL" | "HIGH" | "URGENT";

export interface EmergencyResult {
  emergencyDetected: boolean;
  ruleId?: string;
  emergencyCategory?: EmergencyCategory;
  priority?: EmergencyPriority;
  actionRequired?: string;
  matchedSymptom?: string;
  durationMs: number;
}
