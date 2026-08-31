import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Activity } from "lucide-react";
import { MetricStat } from "./MetricStat";

describe("MetricStat", () => {
  it("renders label, value and subtitle", () => {
    render(<MetricStat label="Total Cases" value="128" subtitle="Processed Patients" />);
    expect(screen.getByText("Total Cases")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("Processed Patients")).toBeInTheDocument();
  });

  it("renders without an icon when none is given", () => {
    const { container } = render(<MetricStat label="OCR Confidence" value="97.5%" />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders the icon when given", () => {
    const { container } = render(<MetricStat icon={Activity} label="PyMuPDF OCR Accuracy" value="98.5%" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
