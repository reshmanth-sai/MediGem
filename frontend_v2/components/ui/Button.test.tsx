import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("is disabled and busy while loading", () => {
    render(<Button isLoading>Save</Button>);
    const b = screen.getByRole("button");
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });

  it("keeps sm buttons at a 44px hit area", () => {
    render(<Button size="sm">Edit</Button>);
    expect(screen.getByRole("button").className).toContain("before:min-h-[44px]");
  });

  it("never carries a pulse animation", () => {
    render(<Button variant="danger">Delete case</Button>);
    expect(screen.getByRole("button").className).not.toContain("animate-pulse");
  });

  it("renders text variant without a fill", () => {
    render(<Button variant="text">Learn more</Button>);
    const c = screen.getByRole("button").className;
    expect(c).not.toContain("bg-action");
  });
});
