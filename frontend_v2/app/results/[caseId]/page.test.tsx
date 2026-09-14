import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CaseResultsPage from "./page";
import { useCaseDraft } from "@/lib/store/caseDraft";
import { PRESET_CASES } from "@/lib/casesData";

let caseId = "";
vi.mock("next/navigation", () => ({
  useParams: () => ({ caseId }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => `/results/${caseId}`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("results route", () => {
  beforeEach(() => {
    useCaseDraft.getState().reset();
  });

  it("renders a bundled preset by id", () => {
    caseId = "CASE-8901";
    render(<CaseResultsPage />);
    expect(screen.getAllByText(PRESET_CASES["CASE-8901"].patientName).length).toBeGreaterThan(0);
  });

  it("never shows another patient's record for an unknown id", () => {
    caseId = "DOES-NOT-EXIST";
    render(<CaseResultsPage />);
    expect(screen.getByText(/case not found/i)).toBeInTheDocument();
    for (const c of Object.values(PRESET_CASES)) {
      expect(screen.queryByText(c.patientName)).toBeNull();
    }
  });

  it("shows the result this tab produced under its own id only", () => {
    const own = { ...PRESET_CASES["CASE-8901"], caseId: "CASE-CUSTOM", patientName: "Own Intake Patient" };
    useCaseDraft.getState().setResult(own);
    caseId = "CASE-CUSTOM";
    render(<CaseResultsPage />);
    expect(screen.getAllByText("Own Intake Patient").length).toBeGreaterThan(0);
  });
});
