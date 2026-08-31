import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { cn } from "./utils";
import {
  H1,
  H2,
  H3,
  Display,
  Body,
  BodySm,
  Label,
  Data,
  DataLg,
} from "@/components/ui/Typography";

describe("cn font-size vs text-color collision", () => {
  it("keeps text-h1 on H1 with no className override", () => {
    render(<H1>heading one</H1>);
    expect(screen.getByText("heading one").className).toContain("text-h1");
  });

  it("keeps text-h2 on H2 with no className override", () => {
    render(<H2>heading two</H2>);
    expect(screen.getByText("heading two").className).toContain("text-h2");
  });

  it("keeps text-h3 on H3 with no className override", () => {
    render(<H3>heading three</H3>);
    expect(screen.getByText("heading three").className).toContain("text-h3");
  });

  it("keeps text-display on Display with no className override", () => {
    render(<Display>display text</Display>);
    expect(screen.getByText("display text").className).toContain("text-display");
  });

  it("keeps text-body on Body with no className override", () => {
    render(<Body>body text</Body>);
    expect(screen.getByText("body text").className).toContain("text-body");
  });

  it("keeps text-body-sm on BodySm with no className override", () => {
    render(<BodySm>body sm text</BodySm>);
    expect(screen.getByText("body sm text").className).toContain("text-body-sm");
  });

  it("keeps text-label on Label with no className override", () => {
    render(<Label>label text</Label>);
    expect(screen.getByText("label text").className).toContain("text-label");
  });

  it("keeps text-data on Data with no className override", () => {
    render(<Data>data text</Data>);
    expect(screen.getByText("data text").className).toContain("text-data");
  });

  it("keeps text-data-lg on DataLg with no className override", () => {
    render(<DataLg>data lg text</DataLg>);
    expect(screen.getByText("data lg text").className).toContain("text-data-lg");
  });

  it("still resolves real font-size conflicts, last one wins", () => {
    expect(cn("text-h2", "text-h3")).toContain("text-h3");
    expect(cn("text-h2", "text-h3")).not.toContain("text-h2");
  });

  it("still resolves real text-color conflicts exactly as before", () => {
    expect(cn("text-ink", "text-risk-emergency")).toContain("text-risk-emergency");
    expect(cn("text-ink", "text-risk-emergency")).not.toContain("text-ink");
  });
});
