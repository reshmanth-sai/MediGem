/*
 * The first-visit workstation tour: four real elements, in the order a
 * reviewer should actually look at them. Every target already exists for
 * its own reason (the queue, an intercepted example, the intake entry
 * point, the replay picker); nothing is added just to have something to
 * point at, and no step claims a reasoning card or sign-off exists for a
 * case that was never run through the pipeline (see components/cases/CaseTable.tsx
 * and lib/casesData.ts -- the bundled examples carry no `pipeline` field,
 * so a real one only ever appears after an actual replay).
 */

export interface TourStep {
  step: number;
  path: "/workstation" | "/new-case";
  selector: string;
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    path: "/workstation",
    selector: '[data-tour="tour-queue"]',
    title: "The queue",
    body: "Ordered by the emergency gate first, then triage severity. Nothing here is scored by a model.",
  },
  {
    step: 2,
    path: "/workstation",
    selector: '[data-tour="tour-emergency-row"]',
    title: "A case the gate caught",
    body: "The emergency gate intercepted this one before any model was called for it. That is why it sorts to the top.",
  },
  {
    step: 3,
    path: "/workstation",
    selector: '[data-tour="tour-new-intake"]',
    title: "Where a live run starts",
    body: "This build only replays recorded runs, because there is no GPU behind a hosted demo. Start an intake here to see the real thing.",
  },
  {
    step: 4,
    path: "/new-case",
    selector: '[data-tour="tour-replay-demo"]',
    title: "Try it",
    body: "Load the demo case, then replay a run. The pipeline overlay times each stage for real and lands on a genuine reasoning card with sign-off, not a mockup.",
  },
];

export const TOUR_TOTAL = TOUR_STEPS.length;
export const TOUR_SEEN_KEY = "medigem-tour-seen";

export function tourStepFor(pathname: string, step: number): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.step === step && s.path === pathname);
}

export function parseTourParam(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= TOUR_TOTAL ? n : null;
}
