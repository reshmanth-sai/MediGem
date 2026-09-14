"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { copy } from "../copy";
import { prefersReducedMotion } from "@/lib/motion";
import { capture } from "../data";
import { TraceStrip } from "../Trace";

const g = capture.gate;

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

// The interlock. A hard cut to black, the eleven rules as a ledger, and the
// path INPUT > RULE GATE > BLOCK > LLM driven by scroll with no easing at all.
export function Gate({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(g.match_case.matched_rules[0] ?? null);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>(".gate-path li");
      steps.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0.6 },
          {
            opacity: 1,
            duration: 0.01,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: `${20 + i * 12}% 60%`, toggleActions: "play none none reverse" },
          }
        );
      });
      gsap.fromTo(
        ".gate-blocked",
        { visibility: "hidden" },
        { visibility: "visible", duration: 0.01, scrollTrigger: { trigger: ref.current, start: "60% 60%", toggleActions: "play none none reverse" } }
      );
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
                className={open === r.id ? "gate-rule is-open" : "gate-rule"}
                aria-expanded={open === r.id}
                onMouseEnter={() => setOpen(r.id)}
                onFocus={() => setOpen(r.id)}
                onClick={() => setOpen(r.id)}
              >
                <span>{r.id}</span>
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
          <div className="t-label">A real input, evaluated by the gate</div>
          <div className="t-mono gate-input">symptoms = [{g.match_case.symptoms.map((s) => `"${s}"`).join(", ")}]</div>
          <ol className="gate-path t-mono">
            <li>Input</li>
            <li>Rule gate · {g.match_case.matched_rules.join(", ")} · match in {fmt(g.orchestrator_block.duration_ms ?? g.latency_ms.match_median)} ms</li>
            <li>{g.match_case.priority} · {g.match_case.recommended_action}</li>
            <li className="gate-llm">
              LLM
              <span className="gate-blocked" style={reduced ? { visibility: "visible" } : undefined}>{copy.gate.blocked}</span>
            </li>
          </ol>
          <div className="t-mono stage-note">status {g.orchestrator_block.status} · safe_for_ai_processing {String(g.match_case.safe_for_ai_processing)}</div>
        </div>
        <div className="gate-state" aria-label="Gate state for this input">
          <div className="gate-state-row">
            <span className="t-label">Trigger</span>
            <span className="t-mono">{g.match_case.symptoms.map((x, i) => <span key={x}>&ldquo;{x}&rdquo; &rarr; {g.match_case.matched_symptoms[i] ?? ""}<br /></span>)}</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Rule</span>
            <span className="t-mono-lg">{g.match_case.matched_rules[0]}</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Status</span>
            <span className="t-mono-lg gate-state-blocked">Blocked</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">LLM inference</span>
            <span className="t-mono-lg">Not allowed</span>
          </div>
          <div className="gate-state-row">
            <span className="t-label">Action</span>
            <span className="t-mono-lg">{g.match_case.recommended_action.replace(/_/g, " ")}</span>
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
