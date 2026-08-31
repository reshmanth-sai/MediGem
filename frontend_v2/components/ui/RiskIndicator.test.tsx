import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RiskIndicator } from "./RiskIndicator";

const LEVELS = ["EMERGENCY", "HIGH", "MODERATE", "LOW"] as const;

describe("RiskIndicator", () => {
  it.each(LEVELS)("%s carries a text label, not colour alone", (level) => {
    render(<RiskIndicator level={level} />);
    expect(screen.getByText(level.charAt(0) + level.slice(1).toLowerCase(), { exact: false }))
      .toBeInTheDocument();
  });

  it.each(LEVELS)("%s carries a distinct shape icon", (level) => {
    const { container } = render(<RiskIndicator level={level} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("spells the level out for screen readers", () => {
    render(<RiskIndicator level="EMERGENCY" />);
    expect(screen.getByLabelText(/Assessed risk level: Emergency/i)).toBeInTheDocument();
  });

  it("renders the urgency score with tabular figures", () => {
    render(<RiskIndicator level="EMERGENCY" showScore={9.8} />);
    expect(screen.getByText("9.8").className).toContain("tabular");
  });

  it("uses no emoji", () => {
    const { container } = render(<RiskIndicator level="HIGH" />);
    expect(container.textContent ?? "").not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
