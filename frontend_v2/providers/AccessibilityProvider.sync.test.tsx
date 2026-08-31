import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AccessibilityProvider, useAccessibilityContext } from "./AccessibilityProvider";
import { AccessibilityHumanFactors } from "@/components/settings/AccessibilityHumanFactors";

/**
 * Regression test for the Task 22 review finding: the Accessibility &
 * Human Factors panel's three toggles (reduced motion, high contrast,
 * large text) used to be pure local useState with zero effect anywhere
 * else in the app, and reset on every reload. This mounts two independent
 * consumers (the panel actually rendered by app/settings/page.tsx, and the
 * minimal SecondConsumer below) inside one AccessibilityProvider and
 * asserts a real, app-wide, persisted effect: the matching data attribute
 * lands on <html>, localStorage is written, and a change made through one
 * consumer is reflected by the other with no remount.
 */
function SecondConsumer() {
  const { reducedMotion, setReducedMotion } = useAccessibilityContext();
  return (
    <label>
      Respect reduced motion preferences
      <input
        type="checkbox"
        role="switch"
        checked={reducedMotion}
        onChange={(event) => setReducedMotion(event.target.checked)}
      />
    </label>
  );
}
describe("AccessibilityProvider real toggles", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-motion");
    document.documentElement.removeAttribute("data-contrast");
    document.documentElement.removeAttribute("data-text-scale");
  });

  afterEach(() => {
    cleanup();
  });

  it("sets data-motion on <html> and persists it, syncing across mounted consumers", () => {
    render(
      <AccessibilityProvider>
        <AccessibilityHumanFactors />
        <SecondConsumer />
      </AccessibilityProvider>
    );

    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);

    const panelToggle = screen.getByRole("switch", { name: /reduce screen animations/i });
    fireEvent.click(panelToggle);

    expect(document.documentElement.getAttribute("data-motion")).toBe("reduce");
    expect(window.localStorage.getItem("medigem-reduced-motion")).toBe("true");

    // The other mounted consumer's own toggle reflects the same shared state.
    const centerToggle = screen.getByRole("switch", { name: /respect reduced motion preferences/i });
    expect((centerToggle as HTMLInputElement).checked).toBe(true);

    fireEvent.click(centerToggle);
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    expect(window.localStorage.getItem("medigem-reduced-motion")).toBe("false");
    expect((panelToggle as HTMLInputElement).checked).toBe(false);
  });

  it("sets data-contrast and data-text-scale independently and persists both", () => {
    render(
      <AccessibilityProvider>
        <AccessibilityHumanFactors />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByRole("switch", { name: /high contrast/i }));
    expect(document.documentElement.getAttribute("data-contrast")).toBe("high");
    expect(window.localStorage.getItem("medigem-high-contrast")).toBe("true");

    fireEvent.click(screen.getByRole("switch", { name: /large text/i }));
    expect(document.documentElement.getAttribute("data-text-scale")).toBe("large");
    expect(window.localStorage.getItem("medigem-large-text")).toBe("true");

    // Independent: turning contrast back off does not touch text scale.
    fireEvent.click(screen.getByRole("switch", { name: /high contrast/i }));
    expect(document.documentElement.hasAttribute("data-contrast")).toBe(false);
    expect(document.documentElement.getAttribute("data-text-scale")).toBe("large");
  });
});
