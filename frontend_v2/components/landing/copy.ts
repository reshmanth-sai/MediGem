// Every word on the landing page. Kept in one place so the total stays small
// and so nothing on the page drifts from what the product actually does.

export const SECTIONS = [
  { id: "signal", index: "01", name: "Signal" },
  { id: "place", index: "02", name: "The place" },
  { id: "pipeline", index: "03", name: "The pipeline" },
  { id: "gate", index: "04", name: "The gate" },
  { id: "reasoning", index: "05", name: "The reasoning" },
  { id: "proof", index: "06", name: "The proof" },
  { id: "contract", index: "07", name: "The contract" },
  { id: "workstation", index: "08", name: "The workstation" },
] as const;

export const copy = {
  signal: {
    headline: ["Care that works", "when the network", "doesn't."],
    lede: "Clinical decision support, built for disconnected care.",
    explore: "Explore the system",
  },
  place: {
    statement: "When connectivity disappears, care shouldn't.",
    body:
      "Front-line health workers in remote clinics evaluate lab reports, ECG strips, prescriptions and wound photos without a specialist on site and, often, without a connection. MediGem runs the whole assessment on the machine in the room.",
    bar: "Uplink",
  },
  pipeline: {
    statement: "One local system. Four clinical inputs.",
    steps: ["Input", "Quality", "OCR", "Assessment"] as const,
  },
  gate: {
    label: "Clinical safety gate",
    statement: "Clinical safety before AI.",
    body: "Deterministic rules run before any model is called. A match stops inference and writes the referral itself.",
    blocked: "Inference blocked",
    architecture: ["Input", "Safety gate", "Vision / OCR", "Structured data", "Clinical reasoning", "Local assessment"],
    architectureNote: "No cloud dependency.",
  },
  reasoning: {
    statement: "Every recommendation has a trail.",
    parts: [
      { index: "01", name: "Observations", note: "What the input actually shows, with its source." },
      { index: "02", name: "Assessment", note: "Risk level, qualitative confidence, red flags." },
      { index: "03", name: "Recommendations", note: "The next step, referral, and whether a person must review." },
      { index: "04", name: "Patient summary", note: "The same finding in plain language." },
      { index: "05", name: "Limitations", note: "What this assessment cannot tell you." },
    ],
  },
  proof: {
    statement: "Measured, not marketed.",
    body: "Every figure below was recorded on this machine by the capture script in the repository. Nothing is quoted from a slide.",
  },
  contract: {
    statement: "MediGem knows where its role ends.",
    verbs: ["It extracts.", "It checks.", "It explains.", "It flags.", "It recommends."],
    decides: "The clinician decides.",
    nevers: ["We will never diagnose.", "We will never prescribe.", "We will never replace clinicians."],
  },
  workstation: {
    statement: "The system is ready.",
    sub: "No uplink required.",
    cta: "Open MediGem workstation",
    ctaShort: "Open workstation",
    tagline: "Care. Connected.",
  },
} as const;
