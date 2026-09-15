/*
 * Facility identity, and the clinician currently acting in this browser.
 *
 * There is one facility (no multi-site concept yet), so it stays a constant.
 * The clinician is different: once accounts exist, it is whoever is signed
 * in, set by SessionProvider as soon as /auth/me resolves. Code that runs
 * outside a component (lib/mapAnalysis.ts, an event handler) calls
 * activeClinician() for a synchronous snapshot rather than the hook; a
 * component that needs to re-render on sign-in/out should use useSession()
 * from providers/SessionProvider instead.
 */

export interface ClinicianIdentity {
  name: string;
  /** Name as used in a greeting. */
  shortName: string;
  initials: string;
  role: string;
  roleShort: string;
}

export interface Facility {
  name: string;
  type: string;
}

export const SESSION = {
  facility: {
    name: "Rampur Sub-Center",
    type: "Primary sub-centre",
  } satisfies Facility,
  // The persona shown before a real session resolves, and in replay/example
  // mode where there is no API to sign in against.
  demoClinician: {
    name: "Dr. Vikram Patel",
    shortName: "Dr. Vikram",
    initials: "VP",
    role: "Community Health Officer",
    roleShort: "CHO",
  } satisfies ClinicianIdentity,
} as const;

let active: ClinicianIdentity | null = null;

/** Called by SessionProvider whenever the signed-in user changes. */
export function setActiveClinician(identity: ClinicianIdentity | null): void {
  active = identity;
}

/** The clinician acting right now: the real session if one exists, else the demo persona. */
export function activeClinician(): ClinicianIdentity {
  return active ?? SESSION.demoClinician;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length >= 2 ? [parts[0][0], parts[parts.length - 1][0]] : [parts[0]?.[0] ?? "?"];
  return letters.join("").toUpperCase();
}

/** "Good morning" before noon, "Good afternoon" before 17:00, then "Good evening". */
export function greetingFor(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
