import type { ClinicalCaseData } from "./casesData";

/*
 * The one search and risk filter every case list uses. A consumer adds its
 * own predicate for anything beyond that (review state, transfer status).
 */

export const RISK_FILTERS = ["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"] as const;
export type RiskFilter = (typeof RISK_FILTERS)[number];

export function riskFilterLabel(level: RiskFilter): string {
  return level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase();
}

/** Case-insensitive match across the fields a clinician would search by. */
export function matchesQuery(c: ClinicalCaseData, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [c.patientName, c.patientId, c.chiefComplaint, c.village, c.primaryFinding, ...(c.symptoms ?? [])]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
}

export interface CaseFilterCriteria {
  query: string;
  risk: RiskFilter;
  extra?: (c: ClinicalCaseData) => boolean;
}

export function filterCases(cases: ClinicalCaseData[], { query, risk, extra }: CaseFilterCriteria): ClinicalCaseData[] {
  return cases.filter((c) => matchesQuery(c, query) && (risk === "ALL" || c.riskLevel === risk) && (extra ? extra(c) : true));
}
