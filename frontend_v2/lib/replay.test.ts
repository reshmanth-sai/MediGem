import { describe, it, expect } from "vitest";
import { REPLAY_OPTIONS, replayResponse, replayRun } from "./replay";
import { AnalysisResponse } from "./schemas/analysis";
import { capture } from "@/components/landing/data";

const intake = {
  caseId: "CASE-CUSTOM",
  patientId: "P-1",
  patientName: "Test Patient",
  age: 40,
  gender: "Male",
  village: "Here",
  chiefComplaint: "Fatigue",
  symptoms: ["fatigue"],
  vitals: [],
  documents: [],
};

describe("replay mode", () => {
  it("offers the four recorded modalities and the gate case", () => {
    expect(REPLAY_OPTIONS.map((o) => o.id)).toEqual(["lab", "ecg", "prescription", "wound", "gate"]);
  });

  it("every replay parses as the API response schema", () => {
    for (const o of REPLAY_OPTIONS) {
      expect(AnalysisResponse.safeParse(replayResponse(o.id)).success, o.id).toBe(true);
    }
  });

  it("replays the recorded status verbatim and labels the case as a replay", async () => {
    const c = await replayRun("ecg", intake, new AbortController().signal);
    expect(c.status).toBe(capture.modalities.ecg.response.status);
    expect(c.pipeline?.replay?.sourceFile).toBe(capture.modalities.ecg.file);
    expect(c.pipeline?.durationMs).toBe(capture.modalities.ecg.pipeline_ms.median);
    expect(c.provenance?.inferenceType).toBe("Replay");
    expect(c.patientName).toBe("Test Patient");
  });

  it("the gate case replays as an interception with no reasoning", async () => {
    const c = await replayRun("gate", intake, new AbortController().signal);
    expect(c.status).toBe("EMERGENCY_INTERCEPTED");
    expect(c.riskLevel).toBe("EMERGENCY");
    expect(c.pipeline?.reasoning).toBeNull();
    expect(c.recommendedAction).toMatch(/call ambulance/i);
  });

  it("aborts cleanly", async () => {
    const ac = new AbortController();
    const p = replayRun("lab", intake, ac.signal);
    ac.abort();
    await expect(p).rejects.toThrow();
  });
});
