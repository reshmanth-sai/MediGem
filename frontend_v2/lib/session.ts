/*
 * The one place the signed-in clinician, the facility and the data source are
 * described. Every greeting, avatar, header readout and case attribution reads
 * from here so the workstation cannot disagree with itself.
 *
 * There is no authentication yet. Until there is, the session is the demo
 * persona the bundled cases were written for (see lib/casesData.ts activeUser),
 * and `dataSource` is "demo" so the shell can say so on screen.
 */

export interface ClinicianSession {
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

export type DataSource = "demo" | "live";

export const SESSION = {
  clinician: {
    name: "Dr. Vikram Patel",
    shortName: "Dr. Vikram",
    initials: "VP",
    role: "Community Health Officer",
    roleShort: "CHO",
  } satisfies ClinicianSession,
  facility: {
    name: "Rampur Sub-Center",
    type: "Primary sub-centre",
  } satisfies Facility,
  // Flip to "live" once analysis results come from the pipeline API rather
  // than the bundled presets.
  dataSource: (process.env.NEXT_PUBLIC_API_BASE_URL ? "live" : "demo") as DataSource,
} as const;

/** "Good morning" before noon, "Good afternoon" before 17:00, then "Good evening". */
export function greetingFor(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
