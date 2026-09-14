import { describe, expect, it } from "vitest";
import raw from "./capture.json";
import { Capture } from "./schema";

describe("landing capture data", () => {
  const data = Capture.parse(raw);

  it("matches the backend output schema", () => {
    for (const m of Object.values(data.modalities)) {
      expect(m.reasoning).not.toBeNull();
      expect(m.validated_runs).toBeGreaterThan(0);
      expect(m.pipeline_ms.all).toHaveLength(m.validated_runs);
    }
  });

  it("was measured against the real gate and model", () => {
    expect(data.meta.model).toMatch(/gemma3/);
    expect(data.gate.rule_count).toBe(11);
    expect(data.gate.match_case.emergency_detected).toBe(true);
    expect(data.gate.match_case.safe_for_ai_processing).toBe(false);
    expect(data.gate.orchestrator_block.status).toBe("EMERGENCY_INTERCEPTED");
    expect(data.summary.validated_runs).toBeGreaterThanOrEqual(4);
  });

  it("only ever claims qualitative confidence", () => {
    for (const m of Object.values(data.modalities)) {
      expect(["LOW", "MEDIUM", "HIGH"]).toContain(m.reasoning?.assessment.confidence_level);
    }
  });
});
