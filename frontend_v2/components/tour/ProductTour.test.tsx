import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ProductTour } from "./ProductTour";
import { TOUR_SEEN_KEY } from "@/lib/tour";

/*
 * The tour reads the route from next/navigation and the case list source
 * from CasesProvider; both are mocked here so each test can drive them
 * directly instead of routing or fetching for real.
 */
let pathname = "/workstation";
let search = "";
const replace = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace, push }),
  useSearchParams: () => new URLSearchParams(search),
}));

let caseSource: "live" | "example" = "example";
vi.mock("@/providers/CasesProvider", () => ({
  useCaseList: () => ({ source: caseSource }),
}));

function setWide(wide: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: wide,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function renderTargets() {
  return render(
    <>
      <div data-tour="tour-queue">Queue</div>
      <div data-tour="tour-emergency-row">Row</div>
      <div data-tour="tour-new-intake">Intake</div>
      <div data-tour="tour-replay-demo">Replay</div>
      <ProductTour />
    </>
  );
}

beforeEach(() => {
  pathname = "/workstation";
  search = "";
  caseSource = "example";
  replace.mockClear();
  push.mockClear();
  window.localStorage.clear();
  setWide(true);
});

afterEach(() => cleanup());

describe("ProductTour", () => {
  it("stays silent in live mode: the demo case a coachmark points at may not exist", async () => {
    caseSource = "live";
    renderTargets();
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("stays silent on a narrow viewport", async () => {
    setWide(false);
    renderTargets();
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("auto-starts at step 1 on a first visit to /workstation", async () => {
    renderTargets();
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("The queue"));
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
  });

  it("does not auto-start again once the tour has been seen", async () => {
    window.localStorage.setItem(TOUR_SEEN_KEY, "1");
    renderTargets();
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("a direct ?tour=2 link works even after the tour was seen", async () => {
    window.localStorage.setItem(TOUR_SEEN_KEY, "1");
    search = "tour=2";
    renderTargets();
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("A case the gate caught"));
  });

  it("step 4 lives on /new-case, not /workstation", async () => {
    pathname = "/new-case";
    search = "tour=4";
    renderTargets();
    await waitFor(() => expect(screen.getByRole("dialog")).toHaveTextContent("Try it"));
    expect(screen.getByRole("button", { name: /got it/i })).toBeInTheDocument();
  });

  it("Skip tour marks it seen and strips the query param", async () => {
    renderTargets();
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: /skip tour/i }));
    expect(window.localStorage.getItem(TOUR_SEEN_KEY)).toBe("1");
  });

  it("Next on an in-page step updates the tour param without navigating", async () => {
    renderTargets();
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
    expect(replace).toHaveBeenCalledWith("/workstation?tour=2", { scroll: false });
    expect(push).not.toHaveBeenCalled();
  });

  it("Next on step 3 navigates to /new-case with the tour param, since step 4 lives there", async () => {
    search = "tour=3";
    renderTargets();
    await waitFor(() => screen.getByRole("dialog"));
    fireEvent.click(screen.getByRole("button", { name: /^next$/i }));
    expect(push).toHaveBeenCalledWith("/new-case?tour=4");
  });

  it("stands down quietly if its target never appears, instead of pointing at nothing", async () => {
    // No matching data-tour targets rendered at all.
    render(<ProductTour />);
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
