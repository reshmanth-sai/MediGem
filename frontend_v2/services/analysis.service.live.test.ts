// @vitest-environment node
import { describe, it, expect } from "vitest";

/*
 * Runs only against a live API: MEDIGEM_LIVE=1 with uvicorn on :8000 and
 * Ollama up. Proves the client, the multipart shape and the response schema
 * agree with the real backend; CI skips it.
 */
const LIVE = process.env.MEDIGEM_LIVE === "1";

describe.skipIf(!LIVE)("analysis service against the live API", () => {
  it("health parses and reports the gate", async () => {
    const { health } = await import("./analysis.service");
    const h = await health();
    expect(h.gate_rule_count).toBeGreaterThan(0);
    expect(h.gate_latency_ms).toBeGreaterThan(0);
  });

  it("an emergency presentation is intercepted before the model", async () => {
    const { analyze } = await import("./analysis.service");
    const res = await analyze({ age: 62, gender: "Female", symptoms: ["chest tightness", "breathlessness"] });
    expect(res.status).toBe("EMERGENCY_INTERCEPTED");
    expect(res.risk_assessment?.risk_level).toBe("EMERGENCY");
    expect(res.reasoning).toBeNull();
  });

  it("a lab report returns a validated reasoning card", async () => {
    const fs = await import("node:fs");
    const { analyze } = await import("./analysis.service");
    const bytes = fs.readFileSync("../sample_data/reports/cbc_lab_report.png");
    const file = new File([bytes], "cbc.png", { type: "image/png" });
    const res = await analyze({ age: 45, gender: "Male", symptoms: ["fatigue"], image: { file, type: "REPORT" } });
    expect(["COMPLETED", "DEGRADED"]).toContain(res.status);
    if (res.status === "COMPLETED") {
      expect(res.reasoning?.assessment.clinical_summary.length).toBeGreaterThan(0);
      expect(res.reasoning?.recommendations.requires_human_review).toBe(true);
      expect(res.input_summary?.ocr_performed).toBe(true);
    }
  }, 120_000);
});
