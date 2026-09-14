import React from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import NewCasePage from "./page";
import { useCaseDraft } from "@/lib/store/caseDraft";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/new-case",
  useSearchParams: () => new URLSearchParams(),
}));

// The app shell is chrome around the wizard (sidebar, command palette). These
// tests are about the intake form itself, so the shell is stubbed out to keep
// each assertion pointed at the step being exercised.
vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// The pipeline API is stubbed at the service boundary. The fixture is a real
// EMERGENCY_INTERCEPTED answer shape, so the mapping and routing that follow
// are exercised on what the backend actually returns.
const analyzeMock = vi.fn();
vi.mock("@/lib/api-client", async (orig) => ({
  ...(await orig<typeof import("@/lib/api-client")>()),
  isApiConfigured: () => true,
}));
vi.mock("@/services/analysis.service", async (orig) => ({
  ...(await orig<typeof import("@/services/analysis.service")>()),
  analyze: (...args: unknown[]) => analyzeMock(...args),
}));

const INTERCEPTED_RESPONSE = {
  request_id: "REQ-TEST",
  summary: "EMERGENCY GATE INTERCEPTION: chest pain",
  risk_assessment: {
    risk_level: "EMERGENCY",
    urgency_score: 9.5,
    risk_flags: ["chest pain"],
    rationale: "Triggered rule R-CARDIAC-01",
    recommended_action: "CALL_AMBULANCE",
  },
  referral_summary: null,
  status: "EMERGENCY_INTERCEPTED",
  duration_ms: 3.2,
  timestamp: "2026-09-14T00:00:00Z",
  reasoning: null,
  input_summary: null,
};

function nextStepButton() {
  return screen.getByRole("button", { name: /next step/i });
}

/**
 * Let the stubbed request resolve, then confirm the overlay's result by
 * pressing its open button, which is what hands the case to the results route.
 */
async function runPipelineToCompletion() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  const open = await screen.findByRole("button", { name: /open (referral|assessment)/i });
  fireEvent.click(open);
  await act(async () => {
    await Promise.resolve();
  });
}

async function clickNext() {
  fireEvent.click(nextStepButton());
  // handleNext awaits trigger(), so let the resolver settle before asserting.
  await act(async () => {
    await Promise.resolve();
  });
}

function fillStepOne() {
  fireEvent.change(screen.getByLabelText(/full patient name/i), {
    target: { value: "Sunita Devi" },
  });
  fireEvent.change(screen.getByLabelText(/patient id/i), {
    target: { value: "P-4471" },
  });
  fireEvent.change(screen.getByLabelText(/age in years/i), {
    target: { value: "62" },
  });
  fireEvent.change(screen.getByLabelText(/^gender/i), {
    target: { value: "Female" },
  });
  fireEvent.change(screen.getByLabelText(/chief complaint/i), {
    target: { value: "Substernal chest tightness for the past two hours." },
  });
}

describe("intake wizard", () => {
  beforeEach(() => {
    push.mockClear();
    useCaseDraft.getState().reset();
  });

  afterEach(() => {
    analyzeMock.mockReset();
    vi.useRealTimers();
  });

  describe("starting state", () => {
    it("opens on an empty form with no seeded demo patient", () => {
      render(<NewCasePage />);

      expect(screen.getByLabelText(/full patient name/i)).toHaveValue("");
      expect(screen.getByLabelText(/patient id/i)).toHaveValue("");
      expect(screen.getByLabelText(/chief complaint/i)).toHaveValue("");
      expect(screen.queryByDisplayValue("Ramesh Kumar")).toBeNull();
    });

    it("shows an untouched age as blank rather than as a literal zero", () => {
      render(<NewCasePage />);

      const age = screen.getByLabelText(/age in years/i);
      expect(age).toHaveValue(null);
      expect((age as HTMLInputElement).value).toBe("");
    });

    it("normalises the draft's ambiguous age default to the not-recorded sentinel", () => {
      render(<NewCasePage />);
      expect(Number.isNaN(useCaseDraft.getState().patient.age)).toBe(true);
    });
  });

  describe("blocking advance on an invalid step", () => {
    it("does not advance and shows a focused error summary on an empty submit", async () => {
      render(<NewCasePage />);
      await clickNext();

      const summary = await screen.findByRole("alert");
      expect(summary).toHaveTextContent("There is a problem");
      expect(document.activeElement).toBe(summary);
      // Still on step 1.
      expect(useCaseDraft.getState().step).toBe(1);
      expect(screen.getByLabelText(/full patient name/i)).toBeInTheDocument();
    });

    it("names every unfilled required field, with a cause and a fix", async () => {
      render(<NewCasePage />);
      await clickNext();

      const summary = await screen.findByRole("alert");
      expect(summary).toHaveTextContent(
        "Enter the patient's name (at least 2 characters)"
      );
      expect(summary).toHaveTextContent(
        "Enter a patient ID of 2 to 20 letters, numbers, or hyphens with no spaces"
      );
      expect(summary).toHaveTextContent("Enter an age between 0 and 120");
      expect(summary).toHaveTextContent("Select a gender from the list");
      expect(summary).toHaveTextContent(
        "Describe the chief complaint in at least 10 characters"
      );
      expect(summary).not.toHaveTextContent("Required");
      expect(summary).not.toHaveTextContent("Invalid");
    });

    it("links each summary entry to the control that needs fixing", async () => {
      render(<NewCasePage />);
      await clickNext();

      const link = await screen.findByRole("link", {
        name: "Enter an age between 0 and 120",
      });
      expect(link).toHaveAttribute("href", "#age");
      expect(screen.getByLabelText(/age in years/i)).toHaveAttribute("id", "age");
    });

    it("shows the message inline on the field and marks it invalid", async () => {
      render(<NewCasePage />);
      await clickNext();

      const age = await screen.findByLabelText(/age in years/i);
      await waitFor(() => expect(age).toHaveAttribute("aria-invalid", "true"));
      expect(age.getAttribute("aria-describedby")).toContain("age-error");
      expect(document.getElementById("age-error")).toHaveTextContent(
        "Enter an age between 0 and 120"
      );
    });

    it("rejects a negative age with the bounded message", async () => {
      render(<NewCasePage />);
      fillStepOne();
      fireEvent.change(screen.getByLabelText(/age in years/i), {
        target: { value: "-5" },
      });
      await clickNext();

      const summary = await screen.findByRole("alert");
      expect(summary).toHaveTextContent("Enter an age between 0 and 120");
      expect(useCaseDraft.getState().step).toBe(1);
    });

    it("rejects a diastolic pressure at or above the systolic pressure", async () => {
      render(<NewCasePage />);
      fillStepOne();
      fireEvent.change(screen.getByLabelText(/systolic bp/i), {
        target: { value: "120" },
      });
      fireEvent.change(screen.getByLabelText(/diastolic bp/i), {
        target: { value: "130" },
      });
      await clickNext();

      const summary = await screen.findByRole("alert");
      expect(summary).toHaveTextContent(
        "Enter a diastolic pressure lower than the systolic pressure"
      );
    });
  });

  describe("advancing on valid data", () => {
    it("moves to step 2 and drops the summary once step 1 is valid", async () => {
      render(<NewCasePage />);
      fillStepOne();
      await clickNext();

      await waitFor(() => expect(useCaseDraft.getState().step).toBe(2));
      expect(screen.queryByRole("alert")).toBeNull();
      expect(
        screen.getByRole("heading", {
          name: /presenting symptoms and clinical onset/i,
        })
      ).toBeInTheDocument();
    });

    it("writes step 1 through to the draft store", async () => {
      render(<NewCasePage />);
      fillStepOne();

      const patient = useCaseDraft.getState().patient;
      expect(patient.patientName).toBe("Sunita Devi");
      expect(patient.patientId).toBe("P-4471");
      expect(patient.age).toBe(62);
      expect(patient.gender).toBe("Female");
    });

    it("blocks step 2 until at least one symptom, a duration and a severity exist", async () => {
      render(<NewCasePage />);
      fillStepOne();
      await clickNext();
      await waitFor(() => expect(useCaseDraft.getState().step).toBe(2));

      await clickNext();
      const summary = await screen.findByRole("alert");
      expect(summary).toHaveTextContent(
        "Select at least one symptom before continuing"
      );
      expect(summary).toHaveTextContent(
        "Enter how long the symptoms have been present"
      );
      expect(summary).toHaveTextContent("Select a severity level for the symptoms");
      expect(useCaseDraft.getState().step).toBe(2);

      fireEvent.click(screen.getByRole("button", { name: /^chest tightness/i }));
      fireEvent.change(screen.getByLabelText(/symptom duration or onset/i), {
        target: { value: "2 hours" },
      });
      fireEvent.change(screen.getByLabelText(/severity rating/i), {
        target: { value: "Severe" },
      });

      await clickNext();
      await waitFor(() => expect(useCaseDraft.getState().step).toBe(3));
      expect(useCaseDraft.getState().symptoms.symptoms).toEqual([
        "Chest tightness",
      ]);
    });

    it("toggles a symptom back off through the store", async () => {
      useCaseDraft.getState().setStep(2);
      render(<NewCasePage />);

      const chip = screen.getByRole("button", { name: /^chest tightness/i });
      fireEvent.click(chip);
      expect(useCaseDraft.getState().symptoms.symptoms).toEqual([
        "Chest tightness",
      ]);

      fireEvent.click(screen.getByRole("button", { name: /^chest tightness/i }));
      expect(useCaseDraft.getState().symptoms.symptoms).toEqual([]);
    });

    it("lets the optional history step through untouched", async () => {
      useCaseDraft.getState().setStep(3);
      render(<NewCasePage />);

      await clickNext();
      await waitFor(() => expect(useCaseDraft.getState().step).toBe(4));
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("handing the finished case to the results route", () => {
    it("puts the result in the draft store, persists only to sessionStorage, and routes", async () => {
      const setItem = vi.spyOn(Storage.prototype, "setItem");
      analyzeMock.mockResolvedValue(INTERCEPTED_RESPONSE);

      useCaseDraft.getState().updatePatient({
        patientName: "Sunita Devi",
        patientId: "P-4471",
        age: 62,
        gender: "Female",
        hrBpm: 112,
        systolicBp: 155,
        diastolicBp: 95,
        chiefComplaint: "Substernal chest tightness for the past two hours.",
      });
      useCaseDraft.getState().updateSymptoms({
        symptoms: ["Chest tightness"],
        duration: "2 hours",
        severity: "Severe",
      });
      useCaseDraft.getState().setStep(5);

      render(<NewCasePage />);
      fireEvent.click(
        screen.getByRole("button", { name: /run clinical reasoning/i })
      );

      await runPipelineToCompletion();

      const result = useCaseDraft.getState().result;
      expect(result).not.toBeNull();
      expect(result?.caseId).toBe("CASE-CUSTOM");
      expect(result?.patientName).toBe("Sunita Devi");
      expect(result?.age).toBe(62);
      expect(result?.symptoms).toEqual(["Chest tightness"]);
      expect(result?.riskLevel).toBe("EMERGENCY");
      expect(result?.status).toBe("EMERGENCY_INTERCEPTED");
      expect(result?.recommendedAction).toMatch(/call ambulance/i);
      expect(analyzeMock).toHaveBeenCalledTimes(1);
      const sent = analyzeMock.mock.calls[0][0];
      expect(sent.symptoms).toEqual(["Chest tightness"]);
      expect(sent.vitals.heart_rate_bpm).toBe(112);
      expect(push).toHaveBeenCalledWith("/results/CASE-CUSTOM");
      // The finished result survives a reload of /results/CASE-CUSTOM via
      // sessionStorage (tab-scoped). localStorage must stay untouched so no
      // clinical data is left on disk indefinitely.
      const localSet = vi.spyOn(window.localStorage, "setItem");
      expect(
        setItem.mock.calls.some(([key]) => String(key).includes("medigem-case-draft"))
      ).toBe(true);
      expect(
        localSet.mock.calls.some(([key]) => String(key).includes("medigem-case-draft"))
      ).toBe(false);

      localSet.mockRestore();
      setItem.mockRestore();
    });

    it("reports an unrecorded vital as not recorded rather than as undefined", async () => {
      analyzeMock.mockResolvedValue(INTERCEPTED_RESPONSE);

      useCaseDraft.getState().updatePatient({
        patientName: "Sunita Devi",
        patientId: "P-4471",
        age: 62,
        gender: "Female",
        chiefComplaint: "Substernal chest tightness for the past two hours.",
      });
      useCaseDraft.getState().setStep(5);

      render(<NewCasePage />);
      fireEvent.click(
        screen.getByRole("button", { name: /run clinical reasoning/i })
      );
      await runPipelineToCompletion();

      const result = useCaseDraft.getState().result;
      const temp = result?.vitals.find((v) => v.label === "Temp");
      expect(temp?.value).toBe("Not recorded");
      expect(result?.clinicalSummary).not.toContain("undefined");
    });
  });

  describe("review step", () => {
    it("shows unrecorded values as not recorded, never as zero", () => {
      useCaseDraft.getState().updatePatient({
        patientName: "Sunita Devi",
        patientId: "P-4471",
        age: 62,
        gender: "Female",
        chiefComplaint: "Substernal chest tightness for the past two hours.",
      });
      useCaseDraft.getState().setStep(5);
      render(<NewCasePage />);

      expect(screen.getAllByText("Not recorded").length).toBeGreaterThan(0);
      expect(screen.queryByText("0 bpm")).toBeNull();
    });
  });

  describe("label wiring", () => {
    it("connects every control to its label on every step", () => {
      // Field logs a console.error in development when the control it wraps
      // does not forward the injected id, which is exactly the failure that
      // silently detaches a label and its error text from an input.
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      for (const step of [1, 2, 3, 4, 5] as const) {
        useCaseDraft.getState().setStep(step);
        const view = render(<NewCasePage />);
        view.unmount();
      }

      const fieldWarnings = spy.mock.calls.filter((call) =>
        String(call[0]).startsWith("Field:")
      );
      expect(fieldWarnings).toEqual([]);
      spy.mockRestore();
    });
  });
});
