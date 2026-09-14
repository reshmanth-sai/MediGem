import { PRESET_CASES, type ClinicalCaseData } from "./casesData";

/*
 * Every counter on the dashboard is derived from the same case list the queue
 * renders, so "patients today", the queue badge and the symptom distribution
 * can never disagree.
 */

export const RISK_WEIGHT: Record<ClinicalCaseData["riskLevel"], number> = {
  EMERGENCY: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

export function allCases(): ClinicalCaseData[] {
  return Object.values(PRESET_CASES).sort(
    (a, b) => RISK_WEIGHT[b.riskLevel] - RISK_WEIGHT[a.riskLevel] || b.urgencyScore - a.urgencyScore
  );
}

export function emergencyCases(cases: ClinicalCaseData[] = allCases()): ClinicalCaseData[] {
  return cases.filter((c) => c.riskLevel === "EMERGENCY");
}

/** Sort any list the way the queue orders it: gate first, then urgency. */
export function sortBySeverity(cases: ClinicalCaseData[]): ClinicalCaseData[] {
  return [...cases].sort((a, b) => RISK_WEIGHT[b.riskLevel] - RISK_WEIGHT[a.riskLevel] || b.urgencyScore - a.urgencyScore);
}

export interface CaseCounters {
  total: number;
  emergency: number;
  pendingReview: number;
  referrals: number;
}

export function caseCounters(cases: ClinicalCaseData[] = allCases()): CaseCounters {
  return {
    total: cases.length,
    emergency: cases.filter((c) => c.riskLevel === "EMERGENCY").length,
    pendingReview: cases.filter((c) => c.requiresHumanReview && c.riskLevel !== "EMERGENCY").length,
    referrals: cases.filter((c) => c.disposition?.needsReferral).length,
  };
}

export interface SymptomBucket {
  label: string;
  count: number;
  pct: number;
}

// Coarse presenting-complaint buckets for the overview bar list. A case lands
// in the first bucket its chief complaint or symptoms match; the remainder is
// reported as "Other" rather than dropped, so the counts add up to the total.
const BUCKETS: { label: string; test: RegExp }[] = [
  { label: "Chest discomfort or breathlessness", test: /chest|angina|palpitation|breath|dyspn/i },
  { label: "Fever and infection", test: /fever|rigor|chills|infection|cough/i },
  { label: "Hypertension, headache, dizziness", test: /hypertens|headache|dizz|blood pressure/i },
  { label: "Wound and post-operative", test: /wound|post-?op|cesarean|incision|suture/i },
];

export function symptomDistribution(cases: ClinicalCaseData[] = allCases()): SymptomBucket[] {
  const counts = new Map<string, number>(BUCKETS.map((b) => [b.label, 0]));
  let other = 0;
  for (const c of cases) {
    const text = [c.chiefComplaint, ...(c.symptoms ?? [])].join(" ");
    const hit = BUCKETS.find((b) => b.test.test(text));
    if (hit) counts.set(hit.label, (counts.get(hit.label) ?? 0) + 1);
    else other += 1;
  }
  const total = Math.max(1, cases.length);
  const rows: SymptomBucket[] = [...counts.entries()]
    .filter(([, n]) => n > 0)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / total) * 100) }));
  if (other > 0) rows.push({ label: "Other", count: other, pct: Math.round((other / total) * 100) });
  return rows.sort((a, b) => b.count - a.count);
}
