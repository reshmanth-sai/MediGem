import { NextResponse } from "next/server";

/*
 * Protocol lookup for the Clinical Assistant page.
 *
 * Scope, matching the contract on the landing page and the schema defaults in
 * backend/reasoning: the assistant extracts, checks, explains and flags. It
 * does not diagnose and it does not prescribe, so nothing in this file states
 * a dose, an interval or a maximum daily amount, and the model is instructed
 * not to either. Dosing comes from the facility's formulary and the clinician.
 *
 * Order of operations for every question:
 *   1. Emergency gate (backend, deterministic). A match returns the referral
 *      instruction and no model is consulted.
 *   2. Local model through Ollama, when reachable.
 *   3. Reference text, keyword-matched, labelled as such.
 */

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const MODEL_NAME = process.env.MODEL_NAME || "gemma3:4b";
// The FastAPI layer over the Python pipeline (backend/api). Unset means the
// gate cannot be consulted and the route says so in its response.
const MEDIGEM_API_URL = process.env.MEDIGEM_API_URL || "";
const MEDIGEM_API_KEY = process.env.MEDIGEM_API_KEY || "";

const SYSTEM_PROMPT = `You are MediGem, a clinical decision-support assistant for front-line health workers (CHOs, ANMs, medical officers) in rural primary care, often without a specialist or an internet connection.

You help with: triage steps, red flags that require referral, what to assess and document, first-aid and stabilisation protocols, and where a topic sits in national guidelines (NHM, WHO, IMNCI, STG).

Hard limits, without exception:
- Do not state a drug dose, dosing interval, maximum daily amount, or route-specific quantity. If asked, say dosing must be taken from the facility formulary or Standard Treatment Guidelines and confirmed by the clinician.
- Do not give a diagnosis. Describe what the findings are consistent with and what would distinguish the possibilities.
- Do not tell the user to withhold referral. When in doubt, refer.
- End every answer with one line: "The clinician decides."

Format with short headed sections: Assess, Red flags (refer if any), Immediate steps, Document. Plain language. No preamble.`;

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface GateResult {
  emergency_detected: boolean;
  category?: string;
  priority?: string;
  recommended_action?: string;
  matched_reason?: string;
}

// Free-text symptom mentions the gate understands. The gate's own vocabulary
// is the source of truth; this only turns a sentence into the list it takes.
const SYMPTOM_TERMS = [
  "chest pain", "chest tightness", "shortness of breath", "breathlessness", "difficulty breathing",
  "unconscious", "unresponsive", "seizure", "convulsion", "stroke", "facial droop", "slurred speech",
  "severe bleeding", "heavy bleeding", "vomiting blood", "coughing blood",
  "snake bite", "snakebite", "anaphylaxis", "swelling of the face", "swollen tongue",
  "high fever", "stiff neck", "severe headache", "blurred vision",
  "severe abdominal pain", "poisoning", "overdose", "burn", "severe dehydration",
  "not breathing", "blue lips", "cyanosis",
];

function extractSymptoms(text: string): string[] {
  const q = text.toLowerCase();
  return SYMPTOM_TERMS.filter((t) => q.includes(t));
}

async function consultGate(question: string): Promise<GateResult | null> {
  if (!MEDIGEM_API_URL) return null;
  const symptoms = extractSymptoms(question);
  if (symptoms.length === 0) return { emergency_detected: false };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${MEDIGEM_API_URL}/gate/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(MEDIGEM_API_KEY ? { "X-API-Key": MEDIGEM_API_KEY } : {}) },
      body: JSON.stringify({ symptoms }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return (await res.json()) as GateResult;
  } catch {
    return null;
  }
}

function referralAnswer(g: GateResult): string {
  const action = (g.recommended_action ?? "IMMEDIATE_REFERRAL").replace(/_/g, " ").toLowerCase();
  return `**Emergency gate: ${g.category ?? "emergency"} · ${g.priority ?? "CRITICAL"}**

The deterministic safety rules matched this presentation before any model was consulted.

**Immediate step**
- ${action.charAt(0).toUpperCase() + action.slice(1)}. Do not delay referral for further assessment here.
- Keep the patient monitored and accompanied until handover.

**Document**
- Time of onset, vitals at first contact, and the time the referral was initiated.

${g.matched_reason ? `_${g.matched_reason}_\n\n` : ""}The clinician decides.`;
}

// Reference text used when no model is reachable. Protocol shape only: what
// to assess, what to refer for, what to do first. No quantities.
function referenceText(query: string): { text: string; source: string } {
  const q = query.toLowerCase();
  const source = "Reference text. No model was consulted.";
  const close = "\n\nDosing, where relevant, comes from the facility formulary or Standard Treatment Guidelines and is confirmed by the clinician.\n\nThe clinician decides.";

  if (/paracetamol|acetaminophen|dolo|crocin|calpol|fever/.test(q)) {
    return {
      source,
      text: `**Fever and analgesia at the sub-centre**

**Assess**
- Temperature, pulse, respiratory rate, hydration, level of alertness. In children, feeding and activity.
- Duration, pattern, travel, rash, localising symptoms (cough, dysuria, ear pain, neck stiffness).

**Red flags (refer if any)**
- Altered consciousness, neck stiffness, non-blanching rash, convulsion.
- Breathing difficulty, poor perfusion, inability to drink or feed.
- Fever beyond seven days, or in an infant under two months.

**Immediate steps**
- Treat per the STG antipyretic entry; check the patient is not already taking a combination product containing the same drug.
- Known liver disease or chronic alcohol use changes the choice; check the formulary caution.
- Tepid sponging and fluids; reassess in the recommended interval.

**Document**
- Temperature trend, any antipyretic already taken at home and when.${close}`,
    };
  }

  if (/aspirin|acs|chest pain|chest tightness|stemi|myocardial|heart attack/.test(q)) {
    return {
      source,
      text: `**Suspected acute coronary syndrome**

This presentation is on the emergency gate. It is a referral, not a work-up.

**Assess**
- Onset, character and radiation of pain; sweating, breathlessness, nausea.
- Vitals including SpO2; 12-lead ECG within ten minutes if available.

**Red flags (refer immediately)**
- Any suspected ACS. Call the ambulance first, then continue assessment while waiting.

**Immediate steps**
- Antiplatelet loading per STG unless contraindicated (active bleeding, known allergy, suspected dissection).
- Oxygen only if saturation is low per the STG threshold.
- Keep the patient at rest, monitored, and accompanied.

**Document**
- Time of onset, time of first contact, ECG if taken, time the ambulance was called.${close}`,
    };
  }

  if (/snake|bite|envenom|cobra|viper|krait/.test(q)) {
    return {
      source,
      text: `**Suspected venomous snakebite**

**Assess**
- Time of bite, site, local swelling, bleeding from gums or bite site.
- Neurological signs: ptosis, double vision, difficulty swallowing or breathing.
- 20-minute whole blood clotting test in a clean, dry glass tube.

**Red flags (refer immediately)**
- Any systemic sign: non-clotting blood, neurological signs, breathing difficulty, hypotension.

**Immediate steps**
- Reassure and immobilise; splint the bitten limb at heart level; remove rings and tight clothing.
- Do not apply a tourniquet, cut, suck, or apply anything to the wound.
- Anti-snake venom is given at a facility that can manage anaphylaxis; arrange transfer now and keep adrenaline available per STG.

**Document**
- Time of bite, clotting test result and time, neurological findings, time of transfer.${close}`,
    };
  }

  if (/hypertension|blood pressure|\bbp\b|amlodipine|telmisartan|headache/.test(q)) {
    return {
      source,
      text: `**Raised blood pressure with headache**

**Assess**
- Repeat BP in both arms after fifteen minutes of rest.
- Vision, chest pain, breathlessness, focal weakness, confusion, pregnancy.
- Fundoscopy if available.

**Red flags (refer if any)**
- Very high readings per the STG emergency threshold with any symptom above.
- Pregnancy with raised BP.
- New focal neurological sign.

**Immediate steps**
- Without red flags: restart or continue the STG first-line agent the patient was on; confirm adherence.
- Do not give rapid-acting sublingual agents.

**Document**
- Both readings with times, symptoms, current medication and last dose taken.${close}`,
    };
  }

  if (/ors|diarrh|dehydrat|zinc|loose stool/.test(q)) {
    return {
      source,
      text: `**Acute diarrhoea and dehydration**

**Assess**
- Number of stools, blood in stool, vomiting, ability to drink, urine output.
- Dehydration signs: sunken eyes, slow skin pinch, lethargy, restlessness.

**Red flags (refer if any)**
- Severe dehydration (lethargy, cannot drink, skin pinch very slow).
- Blood in stool with fever, or a child under six months not feeding.

**Immediate steps**
- Low-osmolarity ORS after each loose stool per the IMNCI plan that matches the dehydration grade.
- Zinc for children per the IMNCI age band.
- Continue breastfeeding and food.

**Document**
- Dehydration grade, ORS given, time of reassessment.${close}`,
    };
  }

  if (/asthma|salbutamol|wheez|bronchospasm|inhaler/.test(q)) {
    return {
      source,
      text: `**Acute wheeze**

**Assess**
- Respiratory rate, ability to speak in sentences, SpO2, use of accessory muscles, chest sounds.

**Red flags (refer if any)**
- Silent chest, cyanosis, exhaustion, confusion, SpO2 below the STG threshold, no improvement after the first bronchodilator course.

**Immediate steps**
- Short-acting bronchodilator via spacer or nebuliser per STG, reassessed at the STG interval.
- Systemic steroid per STG for moderate or severe exacerbation.
- Oxygen if saturation is low.

**Document**
- Pre- and post-treatment respiratory rate and SpO2.${close}`,
    };
  }

  if (/rabies|dog|animal bite|monkey|cat bite/.test(q)) {
    return {
      source,
      text: `**Animal bite and rabies post-exposure prophylaxis**

**Assess**
- Category of exposure (I, II, III) by depth, bleeding and mucosal contact.
- Animal type, provocation, whether it can be observed.

**Red flags (refer if any)**
- Category III exposure, bites to the head or neck, immunocompromised patient.

**Immediate steps**
- Wash the wound with soap and running water for fifteen minutes; apply antiseptic; do not suture.
- Start the rabies vaccine schedule per NRCP for category II and III.
- Category III also needs immunoglobulin at a facility that stocks it.
- Tetanus prophylaxis per immunisation status.

**Document**
- Exposure category, wound care time, vaccine dates given and due.${close}`,
    };
  }

  return {
    source,
    text: `**General triage**

**Assess**
- Full vitals: BP, pulse, respiratory rate, SpO2, temperature; level of consciousness.
- Presenting complaint with onset and progression; current medicines; allergies; pregnancy.

**Red flags (refer if any)**
- Severe or worsening chest pain, breathing difficulty, altered consciousness, uncontrolled bleeding, seizure, new focal weakness.

**Immediate steps**
- Stabilise, monitor, and prepare the referral note if any red flag is present.
- Otherwise follow the STG entry for the presenting complaint.

**Document**
- Findings, decision, and who was informed.${close}`,
  };
}

export async function GET() {
  const status = { model: MODEL_NAME, ollamaOnline: false, gateConfigured: Boolean(MEDIGEM_API_URL) };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    status.ollamaOnline = res.ok;
  } catch {
    // Ollama is stopped or not present on this host.
  }
  return NextResponse.json({
    ...status,
    provider: status.ollamaOnline ? `Local model (${MODEL_NAME})` : "Reference text only",
  });
}

export async function POST(req: Request) {
  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.text?.trim()) {
    return NextResponse.json({ error: "A user message is required." }, { status: 400 });
  }
  const question = last.text.trim();

  // 1. Deterministic gate first. A match ends the request here.
  const gate = await consultGate(question);
  if (gate?.emergency_detected) {
    return NextResponse.json({
      text: referralAnswer(gate),
      source: "Emergency gate (deterministic). No model was consulted.",
      provider: "gate",
      gate,
    });
  }
  const gateNote = gate === null && MEDIGEM_API_URL ? "Emergency gate unreachable for this answer." : undefined;

  // 2. Local model.
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-8).map((m) => ({ role: m.role, content: m.text })),
        ],
        options: { num_predict: 400, temperature: 0.1 },
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const content: string | undefined = data.message?.content;
      if (content) {
        return NextResponse.json({
          text: content,
          source: `Local model (${MODEL_NAME}) via Ollama${gateNote ? ` · ${gateNote}` : ""}`,
          provider: "ollama",
        });
      }
    }
  } catch {
    // Ollama offline. Fall through to reference text.
  }

  // 3. Reference text, labelled as such.
  const ref = referenceText(question);
  return NextResponse.json({
    text: ref.text,
    source: gateNote ? `${ref.source} ${gateNote}` : ref.source,
    provider: "reference",
  });
}
