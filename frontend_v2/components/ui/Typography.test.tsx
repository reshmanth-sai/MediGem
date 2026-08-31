import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { H1, Data, Body } from "./Typography";

describe("Typography", () => {
  it("renders H1 as an h1 by default", () => {
    render(<H1>Patient queue</H1>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Patient queue");
  });

  it("honours the as prop without changing style", () => {
    render(<H1 as="h2">Queue</H1>);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("gives Data tabular monospace figures", () => {
    render(<Data>165/102</Data>);
    const el = screen.getByText("165/102");
    expect(el.className).toContain("font-mono");
    expect(el.className).toContain("tabular");
  });

  it("caps Body measure for readability", () => {
    render(<Body>Clinical summary text</Body>);
    expect(screen.getByText("Clinical summary text").className).toContain("max-w-[70ch]");
  });
});
