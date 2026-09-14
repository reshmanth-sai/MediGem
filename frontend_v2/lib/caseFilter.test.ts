import { describe, it, expect } from "vitest";
import { filterCases, matchesQuery } from "./caseFilter";
import { allCases } from "./caseStats";

describe("case filter", () => {
  const cases = allCases();

  it("searches name, id, complaint, village, finding and symptoms, case-insensitively", () => {
    const c = cases[0];
    expect(matchesQuery(c, c.patientName.slice(0, 4).toUpperCase())).toBe(true);
    expect(matchesQuery(c, c.patientId.toLowerCase())).toBe(true);
    expect(matchesQuery(c, "zzz-no-such-token")).toBe(false);
    expect(matchesQuery(c, "   ")).toBe(true);
  });

  it("narrows by risk and by an extra predicate together", () => {
    const emergencies = filterCases(cases, { query: "", risk: "EMERGENCY" });
    expect(emergencies.every((c) => c.riskLevel === "EMERGENCY")).toBe(true);
    const none = filterCases(cases, { query: "", risk: "ALL", extra: () => false });
    expect(none).toEqual([]);
  });
});
