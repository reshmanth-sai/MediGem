import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { REPLAY_OPTIONS, replayResponse, replayRun, replayStages } from "./replay";
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

// The pipeline stages wait for the real recorded duration (seconds for the
// model stage), so these tests run on fake timers and fast-forward through
// the wait instead of actually sitting through it.
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

/** Runs a replay to completion by advancing fake timers past every stage. */
async function runToCompletion<T>(promise: Promise<T>, totalMs: number): Promise<T> {
  const done = promise.then((v) => ({ v }));
  await vi.advanceTimersByTimeAsync(totalMs + 1);
  return (await done).v;
}

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
    const p = replayRun("ecg", intake, new AbortController().signal);
    const c = await runToCompletion(p, capture.modalities.ecg.pipeline_ms.median);
    expect(c.status).toBe(capture.modalities.ecg.response.status);
    expect(c.pipeline?.replay?.sourceFile).toBe(capture.modalities.ecg.file);
    expect(c.pipeline?.durationMs).toBe(capture.modalities.ecg.pipeline_ms.median);
    expect(c.provenance?.inferenceType).toBe("Replay");
    expect(c.patientName).toBe("Test Patient");
  });

  it("the gate case replays as an interception with no reasoning", async () => {
    const p = replayRun("gate", intake, new AbortController().signal);
    const c = await runToCompletion(p, capture.gate.orchestrator_block.duration_ms ?? capture.gate.latency_ms.match_median);
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

describe("replayStages", () => {
  it("the gate case is one stage, its own recorded duration", () => {
    const stages = replayStages("gate");
    expect(stages).toEqual([{ index: 0, ms: capture.gate.orchestrator_block.duration_ms ?? capture.gate.latency_ms.match_median }]);
  });

  it("a modality replay is four stages that sum back to the recorded total", () => {
    for (const id of ["lab", "ecg", "prescription", "wound"] as const) {
      const stages = replayStages(id);
      expect(stages.map((s) => s.index)).toEqual([0, 1, 2, 3]);
      expect(stages.every((s) => s.ms >= 0)).toBe(true);
      const total = stages.reduce((sum, s) => sum + s.ms, 0);
      expect(total).toBeCloseTo(capture.modalities[id].pipeline_ms.median, 6);
    }
  });

  it("walks onStage through every stage index in order before resolving", async () => {
    const seen: number[] = [];
    const p = replayRun("ecg", intake, new AbortController().signal, (i) => seen.push(i));
    await runToCompletion(p, capture.modalities.ecg.pipeline_ms.median);
    expect(seen).toEqual([0, 1, 2, 3]);
  });
});
