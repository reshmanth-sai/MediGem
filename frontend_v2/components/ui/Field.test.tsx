import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";

describe("Field", () => {
  it("links the visible label to the control", () => {
    render(<Field id="age" label="Age"><input id="age" /></Field>);
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
  });

  it("connects the error to the control and marks it invalid", () => {
    render(<Field id="age" label="Age" error="Enter an age between 0 and 120"><input id="age" /></Field>);
    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("age-error");
    expect(screen.getByText("Enter an age between 0 and 120")).toBeInTheDocument();
  });
});
