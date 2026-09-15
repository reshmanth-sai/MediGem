import { describe, it, expect } from "vitest";
import { TOUR_STEPS, TOUR_TOTAL, parseTourParam, tourStepFor } from "./tour";

describe("tour steps", () => {
  it("are numbered 1..N with no gaps or repeats", () => {
    expect(TOUR_STEPS.map((s) => s.step)).toEqual(Array.from({ length: TOUR_TOTAL }, (_, i) => i + 1));
  });

  it("only ever point at /workstation or /new-case", () => {
    expect(TOUR_STEPS.every((s) => s.path === "/workstation" || s.path === "/new-case")).toBe(true);
  });

  it("tourStepFor matches step and path together", () => {
    expect(tourStepFor("/workstation", 1)?.selector).toBe('[data-tour="tour-queue"]');
    expect(tourStepFor("/new-case", 1)).toBeUndefined(); // step 1 lives on /workstation, not here
    expect(tourStepFor("/new-case", 4)?.selector).toBe('[data-tour="tour-replay-demo"]');
  });
});

describe("parseTourParam", () => {
  it("accepts 1..TOUR_TOTAL and rejects everything else", () => {
    expect(parseTourParam("1")).toBe(1);
    expect(parseTourParam(String(TOUR_TOTAL))).toBe(TOUR_TOTAL);
    expect(parseTourParam(String(TOUR_TOTAL + 1))).toBeNull();
    expect(parseTourParam("0")).toBeNull();
    expect(parseTourParam("banana")).toBeNull();
    expect(parseTourParam(null)).toBeNull();
  });
});
