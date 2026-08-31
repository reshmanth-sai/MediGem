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

function nextStepButton() {
  return screen.getByRole("button", { name: /next step/i });
}

/**
 * Drive the reasoning overlay to completion. Each stage is one timer, and
 * React only runs the queued state update when act flushes, so the clock is
 * advanced in stage-sized steps rather than in one jump.
 */
async function runPipelineToCompletion() {
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });
  }
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
    it("puts the result in the draft store and routes, without sessionStorage", async () => {
      const setItem = vi.spyOn(Storage.prototype, "setItem");
      vi.useFakeTimers();

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
      expect(push).toHaveBeenCalledWith("/results/CASE-CUSTOM");
      expect(
        setItem.mock.calls.some(([key]) => String(key).includes("medigem"))
      ).toBe(false);

      setItem.mockRestore();
    });

    it("reports an unrecorded vital as not recorded rather than as undefined", async () => {
      vi.useFakeTimers();

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
