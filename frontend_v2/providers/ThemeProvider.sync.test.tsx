import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "@/components/layout/Header";
import { AppearanceThemes } from "@/components/settings/AppearanceThemes";

/**
 * Regression test for a Task 6 review finding: hooks/useTheme.ts used to
 * wrap independent useLocalStorage state per call site, with no
 * cross-instance sync, so toggling the theme in one mounted consumer would
 * not update another mounted consumer without a remount. This mounts two
 * real, independent consumers (Header and AppearanceThemes) at once inside
 * one ThemeProvider and asserts that a change made through one is reflected
 * by the other without either component remounting.
 */
describe("ThemeProvider cross-consumer sync", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("theme-night");
  });

  afterEach(() => {
    cleanup();
  });

  it("propagates a theme change from one mounted consumer to another with no remount", () => {
    const { container } = render(
      <ThemeProvider>
        <Header />
        <AppearanceThemes />
      </ThemeProvider>
    );

    const toggleButton = () => screen.getByLabelText("Toggle Theme");

    // Starting state is Day: Header (a separate consumer of useTheme) shows
    // the Moon icon, not Sun, and <html> carries no theme-night class.
    expect(toggleButton().querySelector("svg.lucide-moon")).not.toBeNull();
    expect(toggleButton().querySelector("svg.lucide-sun")).toBeNull();
    expect(document.documentElement.classList.contains("theme-night")).toBe(false);

    // Toggle to Night from the AppearanceThemes consumer's radio control.
    const nightRadio = screen.getByRole("radio", { name: /night/i }) as HTMLInputElement;
    fireEvent.click(nightRadio);

    expect(nightRadio.checked).toBe(true);

    // Header did not remount (same container query, same component tree);
    // it must reflect the change purely because it reads the same shared
    // context as AppearanceThemes.
    expect(toggleButton().querySelector("svg.lucide-sun")).not.toBeNull();
    expect(toggleButton().querySelector("svg.lucide-moon")).toBeNull();
    expect(document.documentElement.classList.contains("theme-night")).toBe(true);
    expect(window.localStorage.getItem("medigem-theme")).toBe(JSON.stringify("night"));

    // Now flip it back from Header's own toggle button, and confirm
    // AppearanceThemes (the other consumer) picks up the change in reverse.
    fireEvent.click(toggleButton());

    expect(toggleButton().querySelector("svg.lucide-moon")).not.toBeNull();
    expect(nightRadio.checked).toBe(false);
    const dayRadio = screen.getByRole("radio", { name: /^day/i }) as HTMLInputElement;
    expect(dayRadio.checked).toBe(true);
    expect(document.documentElement.classList.contains("theme-night")).toBe(false);
  });
});
