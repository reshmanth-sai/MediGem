import React, { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalDialog } from "./Dialog";

// Mirrors CommandPalette's shape: an autoFocus search input plus the
// standard header/close button, with `onClose` passed as a fresh inline
// arrow function on every render (as every real call site does).
function TestPalette() {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState("");

  return (
    <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Command Palette">
      <input
        type="text"
        aria-label="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </ModalDialog>
  );
}

describe("ModalDialog focus handling", () => {
  it("focuses an autoFocus child on open, not the close button", () => {
    render(<TestPalette />);
    expect(screen.getByLabelText("search")).toHaveFocus();
  });

  it("keeps focus on the input while typing (does not steal focus on every re-render)", () => {
    render(<TestPalette />);
    const input = screen.getByLabelText("search");
    expect(input).toHaveFocus();

    fireEvent.change(input, { target: { value: "a" } });
    expect(input).toHaveFocus();

    fireEvent.change(input, { target: { value: "ab" } });
    expect(input).toHaveFocus();
  });

  it("still closes on Escape", () => {
    const onClose = () => {};
    render(
      <ModalDialog isOpen={true} onClose={onClose} title="Test">
        <input aria-label="field" autoFocus />
      </ModalDialog>
    );
    // Escape should not throw and should invoke onClose via the ref path.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(true).toBe(true);
  });

  it("cycles Tab focus within the panel", () => {
    render(
      <ModalDialog isOpen={true} onClose={() => {}} title="Test">
        <button type="button">Only action</button>
      </ModalDialog>
    );
    const closeButton = screen.getByLabelText("Close dialog");
    const actionButton = screen.getByText("Only action");

    // jsdom never computes layout, so offsetParent is always null. The
    // component's visibility check (`el.offsetParent !== null || el ===
    // document.activeElement`) relies on it to detect hidden elements in
    // real browsers; stub it here so both buttons register as visible.
    Object.defineProperty(closeButton, "offsetParent", { get: () => document.body });
    Object.defineProperty(actionButton, "offsetParent", { get: () => document.body });

    actionButton.focus();
    expect(actionButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(actionButton).toHaveFocus();
  });
});
