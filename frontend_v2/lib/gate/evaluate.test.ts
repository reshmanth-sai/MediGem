import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import fixtures from "./parity.fixtures.json";
import rules from "./rules.json";
import { evaluateGate, parseSymptoms } from "./evaluate";

// Every expected answer below was produced by the Python engine
// (python -m tests.gate_parity). The port has to agree on all of them.
describe("gate port parity with backend/emergency/engine.py", () => {
  it("uses the same rules file as the backend", () => {
    const backend = readFileSync(path.resolve(__dirname, "../../../backend/emergency/rules.json"), "utf-8");
    expect(JSON.parse(backend)).toEqual(rules);
  });

  it("has fixtures to compare against", () => {
    expect(fixtures.cases.length).toBeGreaterThan(50);
  });

  it.each(fixtures.cases.map((c) => [JSON.stringify(c.input), c] as const))("%s", (_name, c) => {
    const r = evaluateGate(c.input);
    expect({
      emergency_detected: r.emergency_detected,
      safe_for_ai_processing: r.safe_for_ai_processing,
      matched_rules: r.matched_rules,
      matched_symptoms: [...r.matched_symptoms].sort(),
      emergency_category: r.emergency_category,
      priority: r.priority,
      rule_match_score: r.rule_match_score,
      recommended_action: r.recommended_action,
      should_refer_immediately: r.should_refer_immediately,
      should_call_ambulance: r.should_call_ambulance,
    }).toEqual(c.expected);
  });
});

describe("gate coverage matrix", () => {
  it.each(fixtures.coverage.map((r) => [`${r.rule_id} / ${r.phrase}`, r] as const))("%s", (_name, r) => {
    expect(evaluateGate([r.phrase]).matched_rules.includes(r.rule_id)).toBe(r.fired);
  });

  it("names only rules that exist", () => {
    const ids = new Set(rules.rules.map((r) => r.rule_id));
    expect(fixtures.coverage.every((r) => ids.has(r.rule_id))).toBe(true);
  });
});

describe("parseSymptoms", () => {
  it("splits on commas and drops empty entries, as the API form field does", () => {
    expect(parseSymptoms(" chest pain, , breathless ")).toEqual(["chest pain", "breathless"]);
    expect(parseSymptoms("")).toEqual([]);
  });
});
