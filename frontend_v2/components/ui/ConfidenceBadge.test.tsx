import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfidenceBadge } from "./ConfidenceBadge";

describe("ConfidenceBadge", () => {
  it.each([
    ["HIGH", "High confidence"],
    ["MEDIUM", "Moderate confidence"],
    ["LOW", "Low confidence"],
  ] as const)("bands %s as %s", (level, expected) => {
    render(<ConfidenceBadge level={level} needsReview={false} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("shows the clinician review requirement", () => {
    render(<ConfidenceBadge level="HIGH" needsReview />);
    expect(screen.getByText("Needs clinician review")).toBeInTheDocument();
  });

  it("never renders a percentage", () => {
    const { container } = render(<ConfidenceBadge level="HIGH" needsReview />);
    expect(container.textContent ?? "").not.toMatch(/\d+(\.\d+)?\s*%/);
  });
});
