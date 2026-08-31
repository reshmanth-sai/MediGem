import { describe, it, expect } from "vitest";
import { contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colours", () => {
    expect(contrastRatio("#4A5A50", "#4A5A50")).toBeCloseTo(1, 5);
  });

  it("is order independent", () => {
    const a = contrastRatio("#626C66", "#FBFCFB");
    const b = contrastRatio("#FBFCFB", "#626C66");
    expect(a).toBeCloseTo(b, 10);
  });

  it("accepts shorthand hex", () => {
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 1);
  });

  it("throws on malformed input", () => {
    expect(() => contrastRatio("nope", "#FFFFFF")).toThrow();
  });
});
