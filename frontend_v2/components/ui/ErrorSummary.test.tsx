import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorSummary } from "./ErrorSummary";

describe("ErrorSummary", () => {
  it("is an alert that can receive focus", () => {
    render(<ErrorSummary errors={[{ fieldId: "age", message: "Enter an age" }]} />);
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("tabindex", "-1");
  });

  it("links each entry to its field", () => {
    render(<ErrorSummary errors={[{ fieldId: "age", message: "Enter an age" }]} />);
    expect(screen.getByRole("link", { name: "Enter an age" })).toHaveAttribute("href", "#age");
  });

  it("renders nothing when there are no errors", () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
