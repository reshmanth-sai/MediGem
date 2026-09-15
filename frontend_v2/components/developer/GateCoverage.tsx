"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Card";
import { BodySm } from "@/components/ui/Typography";
import fixtures from "@/lib/gate/parity.fixtures.json";
import { GATE_RULES } from "@/lib/gate/evaluate";

/*
 * Every rule against phrasings that should and should not fire it. The
 * expectation is written by hand in tests/gate_parity.py; whether the rule
 * fired is the Python engine's answer, and evaluate.test.ts checks the
 * browser port gives the same answer on every row. Disagreements are shown,
 * not filtered: they are the gate's known gaps.
 */

type Row = (typeof fixtures.coverage)[number];

function outcome(r: Row) {
  if (r.should_fire && r.fired) return { label: "fires", tone: "text-ink" };
  if (!r.should_fire && !r.fired) return { label: "silent", tone: "text-ink" };
  if (r.should_fire) return { label: "misses", tone: "text-risk-emergency" };
  return { label: "over-fires", tone: "text-risk-high" };
}

export function GateCoverage() {
  const rows = fixtures.coverage;
  const asExpected = rows.filter((r) => r.should_fire === r.fired).length;
  const missEn = rows.filter((r) => r.should_fire && !r.fired && r.language === "en").length;
  const missHi = rows.filter((r) => r.should_fire && !r.fired && r.language === "hi-Latn").length;
  const hiTotal = rows.filter((r) => r.language === "hi-Latn").length;
  const over = rows.filter((r) => !r.should_fire && r.fired).length;

  return (
    <Section
      heading={
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-ink-muted shrink-0" aria-hidden="true" />
          Emergency gate coverage
        </span>
      }
      headingAs="h3"
    >
      <BodySm className="text-ink-muted">
        Each rule against phrasings that should fire it and phrasings that should not. Answers are the Python engine&apos;s, recorded by <span className="font-mono">tests/gate_parity.py</span>; the in-browser copy of the gate gives the same answer on every row, checked in CI.
      </BodySm>

      <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-rule pt-3">
        {[
          { k: "As expected", v: `${asExpected} / ${rows.length}` },
          { k: "English misses", v: String(missEn) },
          { k: "Romanised Hindi misses", v: `${missHi} / ${hiTotal}` },
          { k: "Over-fires", v: String(over) },
        ].map((s) => (
          <div key={s.k} className="space-y-0.5">
            <dt className="text-body-sm text-ink-muted">{s.k}</dt>
            <dd className="font-mono text-body text-ink tabular">{s.v}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-3 divide-y divide-rule border-t border-rule">
        {GATE_RULES.map((rule) => (
          <li key={rule.rule_id} className="py-3 grid gap-x-4 gap-y-2 sm:grid-cols-[14rem_1fr] text-body-sm">
            <div className="min-w-0">
              <p className="font-mono font-semibold text-ink">{rule.rule_id}</p>
              <p className="text-ink-muted">{rule.rule_name}</p>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label={`Phrasings tested against ${rule.rule_id}`}>
              {rows
                .filter((r) => r.rule_id === rule.rule_id)
                .map((r) => {
                  const o = outcome(r);
                  return (
                    <li key={r.phrase} className="inline-flex items-baseline gap-2 rounded-control border border-rule px-2 py-1" lang={r.language}>
                      <span className="font-mono text-ink">{r.phrase}</span>
                      <span className={`font-semibold ${o.tone}`}>{o.label}</span>
                    </li>
                  );
                })}
            </ul>
          </li>
        ))}
      </ul>

      <BodySm className="text-ink-muted mt-3">
        The remaining misses are all romanised Hindi: no Hindi synonym table exists yet. Over-fires come from substring matching having no idea of negation or severity (&ldquo;no chest pain&rdquo; still trips the cardiac rule, bare &ldquo;fever&rdquo; still trips sepsis); they fail toward referral, and fixing them needs real language handling, not a matcher tweak.
      </BodySm>
    </Section>
  );
}
