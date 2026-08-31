import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, Section } from "./Card";

describe("Card", () => {
  it("declares elevation once: border, never shadow", () => {
    render(<Card data-testid="c">Body</Card>);
    const c = screen.getByTestId("c").className;
    expect(c).toContain("border-rule");
    expect(c).not.toMatch(/\bshadow-/);
  });
});

describe("Section", () => {
  it("renders a section with no border and no background", () => {
    render(<Section data-testid="s">Body</Section>);
    const c = screen.getByTestId("s").className;
    expect(c).not.toMatch(/\bborder\b/);
    expect(c).not.toMatch(/\bbg-/);
    expect(c).not.toMatch(/\bshadow-/);
  });

  it("renders an optional heading", () => {
    render(<Section heading="Overview">Body</Section>);
    expect(screen.getByRole("heading", { name: "Overview" })).toBeInTheDocument();
  });

  it("keeps a heading adornment out of the heading's accessible name", () => {
    render(
      <Section heading="Overview" headingAdornment={<span data-testid="badge">128 total</span>}>
        Body
      </Section>
    );
    const heading = screen.getByRole("heading", { name: "Overview" });
    const badge = screen.getByTestId("badge");
    expect(heading).toHaveTextContent("Overview");
    expect(heading).not.toHaveTextContent("128 total");
    expect(heading.contains(badge)).toBe(false);
  });

  it("renders an h3 heading when headingAs is h3", () => {
    render(<Section heading="Details" headingAs="h3">Body</Section>);
    const heading = screen.getByRole("heading", { name: "Details", level: 3 });
    expect(heading.tagName).toBe("H3");
  });
});
