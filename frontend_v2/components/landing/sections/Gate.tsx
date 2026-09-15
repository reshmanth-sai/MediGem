"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { capture } from "../data";
import { TraceStrip } from "../Trace";
import { evaluateGate, parseSymptoms } from "@/lib/gate/evaluate";

const g = capture.gate;

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// One evaluation is below timer resolution in most browsers, so time a
// batch and report the mean. Measured after mount, never during render, so
// the server markup and the first client render agree.
function meanEvalMs(symptoms: string[]) {
  const runs = 200;
  const start = performance.now();
  for (let i = 0; i < runs; i++) evaluateGate(symptoms);
  return (performance.now() - start) / runs;
}

// The interlock. A hard cut to black, the eleven rules as a ledger, and a
// live input: the real rules evaluated in the browser on every keystroke,
// walking INPUT > RULE GATE > BLOCK > LLM.
export function Gate({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [text, setText] = useState<string>(copy.gate.presets[0].text);
  const symptoms = useMemo(() => parseSymptoms(text), [text]);
  const result = useMemo(() => evaluateGate(symptoms), [symptoms]);
  const [perEvalMs, setPerEvalMs] = useState<number | null>(null);
  useEffect(() => setPerEvalMs(meanEvalMs(symptoms)), [symptoms]);
  const hit = result.emergency_detected;
  const preset = copy.gate.presets.find((p) => p.text === text);
  const [open, setOpen] = useState<string | null>(g.match_case.matched_rules[0] ?? null);
  useEffect(() => {
    if (result.matched_rules[0]) setOpen(result.matched_rules[0]);
  }, [result]);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".gate-ledger li", {
        opacity: 0,
        duration: 0.01,
        stagger: 0.05,
        scrollTrigger: { trigger: ".gate-ledger", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  const rule = g.rules.find((r) => r.id === open);

  return (
    <section ref={ref} id="gate" data-section="gate" className="section ground-ink gate" aria-labelledby="gate-h">
      <TraceStrip mode="flatline" reduced={reduced} />
      <div className="section-index">
        <span className="t-label">04</span>
        <span className="t-label">{copy.gate.label}</span>
      </div>
      <h2 id="gate-h" className="t-statement t-section">{copy.gate.statement}</h2>
      <p className="t-body">{copy.gate.body}</p>

      <div className="gate-figures t-mono-lg" role="list">
        <div role="listitem"><span>{g.rule_count}</span><span className="t-label">rules</span></div>
        <div role="listitem"><span>{fmt(g.latency_ms.match_median)} ms</span><span className="t-label">median, matching case</span></div>
        <div role="listitem"><span>{fmt(g.latency_ms.match_p95)} ms</span><span className="t-label">p95 over {g.iterations.toLocaleString("en-US")} evaluations</span></div>
      </div>

      <div className="gate-grid">
        <ul className="gate-ledger t-mono" aria-label="Emergency rules">
          {g.rules.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className={`gate-rule${open === r.id ? " is-open" : ""}${result.matched_rules.includes(r.id) ? " is-hit" : ""}`}
                aria-expanded={open === r.id}
                onMouseEnter={() => setOpen(r.id)}
                onFocus={() => setOpen(r.id)}
                onClick={() => setOpen(r.id)}
              >
                <span>{r.id}{result.matched_rules.includes(r.id) && <span className="gate-rule-hit"> · matched</span>}</span>
                <span className="gate-rule-cat">{r.category}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="gate-detail">
          {rule && (
            <>
              <div className="t-label">{rule.id} · {rule.name}</div>
              <p className="t-body">{rule.description}</p>
              <div className="t-mono gate-detail-meta">
                <div>symptoms_required: {rule.symptoms_required.join(", ")}</div>
                <div>min_match_count: {rule.min_match_count} · priority: {String(rule.priority)}</div>
                <div>recommended_action: {rule.recommended_action}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="gate-demo">
        <div className="gate-demo-path">
          <label htmlFor="gate-try" className="t-label">{copy.gate.tryLabel}</label>
          <input
            id="gate-try"
            className="t-mono gate-field"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-describedby="gate-try-hint"
          />
          <p id="gate-try-hint" className="t-mono stage-note">{copy.gate.tryHint}</p>
          <ul className="gate-presets" aria-label="Example inputs">
            {copy.gate.presets.map((p) => (
              <li key={p.text}>
                <button type="button" className="t-mono gate-preset" aria-pressed={text === p.text} onClick={() => setText(p.text)}>
                  {p.text}
                </button>
              </li>
            ))}
          </ul>
          <ol className="gate-path t-mono">
            <li>Input · {symptoms.length} {symptoms.length === 1 ? "symptom" : "symptoms"}</li>
            <li>Rule gate · {hit ? result.matched_rules.join(", ") : "no rule matched"}{perEvalMs != null && ` · ${fmt(perEvalMs, 3)} ms in this browser`}</li>
            <li>{result.priority} · {result.recommended_action}</li>
            <li className="gate-llm">
              LLM
              <span className={hit ? "gate-blocked" : "gate-passed"}>{hit ? copy.gate.blocked : copy.gate.passed}</span>
            </li>
          </ol>
          {preset && <p className="t-body gate-note">{preset.note}</p>}
        </div>
        <div className="gate-state" aria-label="Gate state for this input" aria-live="polite">
          <div className="gate-state-row">
            <span className="t-label">Trigger</span>
            <span className="t-mono">
              {hit
                ? result.triggered[0].matched.map((m) => <span key={m}>{m}<br /></span>)
                : "none"}
            </span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Rule</span>
            <span className="t-mono-lg">{hit ? result.matched_rules[0] : "None"}</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Status</span>
            <span className={hit ? "t-mono-lg gate-state-blocked" : "t-mono-lg"}>{hit ? "Blocked" : "Clear"}</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">LLM inference</span>
            <span className="t-mono-lg">{result.safe_for_ai_processing ? "Allowed" : "Not allowed"}</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Action</span>
            <span className="t-mono-lg">{result.recommended_action.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      <ol className="gate-arch t-mono" aria-label="Architecture, in execution order">
        {copy.gate.architecture.map((s, i) => (
          <li key={s}>
            <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="t-lede">{copy.gate.architectureNote}</p>
    </section>
  );
}
