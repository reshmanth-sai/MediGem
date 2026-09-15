import rulesDoc from "./rules.json";

/*
 * A line-for-line port of the emergency gate (backend/emergency/evaluator.py
 * and engine.py) so the landing page can run it in the browser with no API.
 * rules.json is a copy of backend/emergency/rules.json. evaluate.test.ts
 * replays inputs answered by the Python engine and fails on any difference,
 * so change the Python first, then regenerate: python -m tests.gate_parity
 */

export interface GateRule {
  rule_id: string;
  rule_name: string;
  description: string;
  symptoms_required: string[];
  min_match_count: number;
  priority: number;
  recommended_action: string;
  emergency_category: string;
  enabled: boolean;
}

export interface GateResult {
  emergency_detected: boolean;
  safe_for_ai_processing: boolean;
  matched_rules: string[];
  matched_symptoms: string[];
  emergency_category: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rule_match_score: number;
  recommended_action: string;
  should_refer_immediately: boolean;
  should_call_ambulance: boolean;
  /** Required symptom terms each triggered rule matched, primary rule first. */
  triggered: { rule: GateRule; matched: string[]; score: number }[];
}

export const GATE_RULES: GateRule[] = rulesDoc.rules;
export const GATE_SYNONYMS: Record<string, string[]> = rulesDoc.synonyms;

const PRIORITY_NAMES = { 1: "LOW", 2: "MEDIUM", 3: "HIGH", 4: "CRITICAL" } as const;

/** Python: lower().strip(), re.sub(r"[^\w\s]", ""), re.sub(r"\s+", " "). */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}_\s]/gu, "")
    .replace(/\s+/gu, " ");
}

export function expandSymptoms(input: string[], synonyms: Record<string, string[]> = GATE_SYNONYMS): Set<string> {
  const expanded = new Set<string>();
  for (const raw of input) {
    const norm = normalizeText(raw);
    if (!norm) continue;
    expanded.add(norm);
    for (const [canonical, colloquial] of Object.entries(synonyms)) {
      const normCanonical = normalizeText(canonical);
      if (norm === normCanonical || norm.includes(normCanonical)) expanded.add(normCanonical);
      for (const syn of colloquial) {
        const normSyn = normalizeText(syn);
        if (norm === normSyn || norm.includes(normSyn) || normSyn.includes(norm)) {
          expanded.add(normCanonical);
          expanded.add(normSyn);
        }
      }
    }
  }
  return expanded;
}

export function matchRule(rule: GateRule, expanded: Set<string>): { isMatched: boolean; matched: string[]; score: number } {
  if (!rule.enabled) return { isMatched: false, matched: [], score: 0 };
  const matched: string[] = [];
  for (const req of rule.symptoms_required) {
    const normReq = normalizeText(req);
    for (const sym of expanded) {
      if (normReq === sym || sym.includes(normReq) || normReq.includes(sym)) {
        matched.push(req);
        break;
      }
    }
  }
  const total = rule.symptoms_required.length;
  const score = Math.min(1, Math.max(0, total > 0 ? matched.length / total : 0));
  return { isMatched: matched.length >= rule.min_match_count, matched, score };
}

const NOT_DETECTED = {
  emergency_detected: false,
  safe_for_ai_processing: true,
  matched_rules: [],
  emergency_category: null,
  priority: "LOW",
  rule_match_score: 0,
  recommended_action: "MONITOR_PATIENT",
  should_refer_immediately: false,
  should_call_ambulance: false,
  triggered: [],
} as const;

export function evaluateGate(symptoms: string[], rules: GateRule[] = GATE_RULES): GateResult {
  if (!symptoms.length || !symptoms.some((s) => s.trim())) {
    return { ...NOT_DETECTED, matched_rules: [], triggered: [], matched_symptoms: [] };
  }

  const expanded = expandSymptoms(symptoms);
  const triggered: GateResult["triggered"] = [];
  for (const rule of rules) {
    const { isMatched, matched, score } = matchRule(rule, expanded);
    if (isMatched) triggered.push({ rule, matched, score });
  }

  if (!triggered.length) {
    return { ...NOT_DETECTED, matched_rules: [], triggered: [], matched_symptoms: [...symptoms] };
  }

  // Python sorts by (priority, score) with reverse=True; both sorts are stable.
  triggered.sort((a, b) => b.rule.priority - a.rule.priority || b.score - a.score);
  const primary = triggered[0];
  const action = primary.rule.recommended_action;
  const ambulance = action === "CALL_AMBULANCE";
  return {
    emergency_detected: true,
    safe_for_ai_processing: false,
    matched_rules: triggered.map((t) => t.rule.rule_id),
    matched_symptoms: [...new Set(triggered.flatMap((t) => t.matched))],
    emergency_category: primary.rule.emergency_category,
    priority: PRIORITY_NAMES[primary.rule.priority as keyof typeof PRIORITY_NAMES],
    rule_match_score: Math.round(primary.score * 100) / 100,
    recommended_action: action,
    should_refer_immediately: ambulance || action === "IMMEDIATE_REFERRAL" || action === "EMERGENCY_STABILIZATION",
    should_call_ambulance: ambulance,
    triggered,
  };
}

/** Same split the API applies to the comma-separated symptoms form field. */
export function parseSymptoms(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
