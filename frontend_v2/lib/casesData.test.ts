import { describe, it, expect } from "vitest";
import { PRESET_CASES } from "./casesData";

describe("case data", () => {
  it("carries no numeric confidence", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c).not.toHaveProperty("aiConfidence");
      expect(["LOW", "MEDIUM", "HIGH"]).toContain(c.confidenceLevel);
    }
  });

  it("defaults to requiring human review", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.requiresHumanReview).toBe(true);
    }
  });

  it("uses no diagnostic language in findings", () => {
    const banned = /diagnosed with|definitive diagnosis/i;
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.primaryFinding).not.toMatch(banned);
      expect(c.clinicalSummary).not.toMatch(banned);
    }
  });

  it("populates every results section", () => {
    for (const c of Object.values(PRESET_CASES)) {
      expect(c.supportingFindings.length).toBeGreaterThan(0);
      expect(c.differentialConsiderations.length).toBeGreaterThan(0);
      expect(c.recommendedInvestigations.length).toBeGreaterThan(0);
    }
  });
});
