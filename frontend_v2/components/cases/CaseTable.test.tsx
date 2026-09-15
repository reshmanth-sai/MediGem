import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CaseTable, OpenCaseAction, columns } from "./CaseTable";
import { allCases } from "@/lib/caseStats";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const cases = allCases();
const cols = [columns.patient, columns.complaint, columns.priority];

describe("CaseTable", () => {
  it("renders a row per case with the open action", () => {
    render(<CaseTable cases={cases} total={cases.length} columns={cols} caption="Queue" renderAction={(c) => <OpenCaseAction c={c} />} />);
    const open = screen.getAllByRole("link", { name: /^open case for/i });
    // Desktop table and phone card list both render, so two per case.
    expect(open).toHaveLength(cases.length * 2);
  });

  it("distinguishes no cases from no matches", () => {
    const clear = vi.fn();
    const { rerender } = render(<CaseTable cases={[]} total={0} columns={cols} caption="Queue" onClearFilters={clear} />);
    expect(screen.getByText(/no cases/i)).toBeInTheDocument();
    rerender(<CaseTable cases={[]} total={3} columns={cols} caption="Queue" onClearFilters={clear} />);
    fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(clear).toHaveBeenCalled();
  });

  it("selectable rows report the case on click and Enter", () => {
    const onSelect = vi.fn();
    render(<CaseTable cases={cases} total={cases.length} columns={cols} caption="History" onSelect={onSelect} selectedCaseId={cases[1].caseId} />);
    const rows = screen.getAllByRole("row").filter((r) => r.getAttribute("tabindex") === "0");
    fireEvent.click(rows[0]);
    expect(onSelect).toHaveBeenCalledWith(cases[0]);
    fireEvent.keyDown(rows[2], { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(cases[2]);
    expect(rows[1]).toHaveAttribute("aria-current", "true");
  });

  it("marks only the first EMERGENCY row for the workstation tour", () => {
    render(<CaseTable cases={cases} total={cases.length} columns={cols} caption="Queue" />);
    const marked = document.querySelectorAll('[data-tour="tour-emergency-row"]');
    const firstEmergencyId = cases.find((c) => c.riskLevel === "EMERGENCY")?.caseId;
    expect(firstEmergencyId).toBeDefined();
    // One in the desktop table, one in the phone card list would both match
    // if this weren't scoped per-render-block; the mobile list never gets
    // the attribute, so exactly one element carries it.
    expect(marked).toHaveLength(1);
    expect(marked[0]).toHaveTextContent(cases.find((c) => c.caseId === firstEmergencyId)!.patientName);
  });
});
