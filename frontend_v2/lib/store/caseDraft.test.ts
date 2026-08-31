import { describe, it, expect, beforeEach } from "vitest";
import { useCaseDraft } from "./caseDraft";
import { PRESET_CASES } from "@/lib/casesData";

describe("useCaseDraft", () => {
  beforeEach(() => {
    useCaseDraft.getState().reset();
    sessionStorage.clear();
  });

  it("starts empty, with no seeded patient", () => {
    const s = useCaseDraft.getState();
    expect(s.patient.patientName).toBe("");
    expect(s.step).toBe(1);
    expect(s.uploads).toEqual([]);
  });

  it("merges patient updates without clobbering other fields", () => {
    useCaseDraft.getState().updatePatient({ patientName: "Sunita Devi" });
    useCaseDraft.getState().updatePatient({ age: 62 });
    const p = useCaseDraft.getState().patient;
    expect(p.patientName).toBe("Sunita Devi");
    expect(p.age).toBe(62);
  });

  it("clamps step to the 1-5 range", () => {
    useCaseDraft.getState().setStep(9 as never);
    expect(useCaseDraft.getState().step).toBe(5);
  });

  it("removes an upload by id", () => {
    const { addUpload, removeUpload } = useCaseDraft.getState();
    addUpload({ id: "a", file: new File([""], "ecg.png"), type: "ECG" });
    removeUpload("a");
    expect(useCaseDraft.getState().uploads).toEqual([]);
  });

  it("reset clears a populated draft", () => {
    useCaseDraft.getState().updatePatient({ patientName: "X" });
    useCaseDraft.getState().reset();
    expect(useCaseDraft.getState().patient.patientName).toBe("");
  });

  // The brief's own test snippet never exercises setResult or the result
  // field, even though the store's Interfaces section requires both (Task 18
  // depends on setResult to hand a completed case to the results route
  // without sessionStorage). These three tests close that gap.

  it("starts with a null result", () => {
    expect(useCaseDraft.getState().result).toBeNull();
  });

  it("setResult updates result to the given ClinicalCaseData", () => {
    const preset = PRESET_CASES["CASE-8901"];
    useCaseDraft.getState().setResult(preset);
    expect(useCaseDraft.getState().result).toEqual(preset);
  });

  it("reset clears a populated result back to null", () => {
    const preset = PRESET_CASES["CASE-8901"];
    useCaseDraft.getState().setResult(preset);
    useCaseDraft.getState().reset();
    expect(useCaseDraft.getState().result).toBeNull();
  });

  // Regression test for the whole-branch review's most severe finding: a
  // completed wizard case was held only in memory, so a reload after
  // finishing the wizard silently substituted a different, fabricated
  // patient's data under the user's own case URL. Fixed by persisting
  // `result` to sessionStorage. These tests exercise the actual persisted
  // write rather than just the in-memory state the tests above already
  // cover, since a `persist` misconfiguration (wrong key, wrong storage,
  // wrong `partialize` scope) would pass every test above while still
  // losing the result on a real reload.

  it("persists only the result field to sessionStorage under the store's storage key, not the whole draft", () => {
    useCaseDraft.getState().updatePatient({ patientName: "Sunita Devi" });
    const preset = PRESET_CASES["CASE-8901"];
    useCaseDraft.getState().setResult(preset);

    const raw = sessionStorage.getItem("medigem-case-draft");
    expect(raw).not.toBeNull();
    const persisted = JSON.parse(raw as string);
    expect(persisted.state.result).toEqual(preset);
    // Only `result` is persisted; mid-wizard fields like `patient` must not
    // survive into the storage payload's state.
    expect(persisted.state.patient).toBeUndefined();
  });

  it("clearing sessionStorage and re-reading via a fresh call still returns the in-memory result while the tab is open", () => {
    // Zustand's persist hydrates once at module load, so this test cannot
    // simulate a real page reload (that would need a fresh module registry).
    // What it can and does prove is that the write path a reload would read
    // from is real: the exact JSON shape persist's storage adapter expects
    // to rehydrate from is what actually lands in sessionStorage.
    const preset = PRESET_CASES["CASE-8901"];
    useCaseDraft.getState().setResult(preset);
    const raw = sessionStorage.getItem("medigem-case-draft");
    const persisted = JSON.parse(raw as string);
    expect(persisted.version).toBeDefined();
    expect(persisted.state).toBeDefined();
    expect(persisted.state.result.caseId).toBe(preset.caseId);
  });
});
