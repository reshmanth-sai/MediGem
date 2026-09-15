"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isApiConfigured } from "@/lib/api-client";
import { listCases } from "@/services/cases.service";
import { mapStoredCase } from "@/lib/mapAnalysis";
import { allCases as exampleCases } from "@/lib/caseStats";
import type { ClinicalCaseData } from "@/lib/casesData";

/*
 * The one case list every workstation screen reads.
 *
 *   live     the API answered: these are the cases stored on this machine
 *   example  no API configured, or it did not answer: the bundled examples
 *
 * Screens never decide this themselves; they render `cases` and show
 * `source` so a reader always knows which they are looking at.
 */

export type CaseSource = "live" | "example";

export interface CaseListState {
  cases: ClinicalCaseData[];
  source: CaseSource;
  /** True while the first live fetch is in flight. */
  loading: boolean;
  /** Why the list is the example set when an API is configured. */
  reason: string | null;
  refresh: () => Promise<void>;
  /** Milliseconds since the live list was last fetched, or null. */
  fetchedAt: number | null;
}

const Ctx = createContext<CaseListState | null>(null);

export function CasesProvider({ children, pollMs = 30_000 }: { children: React.ReactNode; pollMs?: number }) {
  const configured = isApiConfigured();
  const [live, setLive] = useState<ClinicalCaseData[] | null>(null);
  const [loading, setLoading] = useState(configured);
  const [reason, setReason] = useState<string | null>(configured ? null : "No pipeline API is configured for this build.");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const inflight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (!configured) return;
    inflight.current?.abort();
    const ac = new AbortController();
    inflight.current = ac;
    try {
      const rows = await listCases(ac.signal);
      if (ac.signal.aborted) return;
      setLive(rows.map(mapStoredCase));
      setReason(null);
      setFetchedAt(Date.now());
    } catch (e) {
      if (ac.signal.aborted) return;
      setLive(null);
      setReason(e instanceof Error ? e.message : "The pipeline API did not answer.");
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    if (!configured) return;
    refresh();
    const id = setInterval(refresh, pollMs);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      inflight.current?.abort();
    };
  }, [configured, pollMs, refresh]);

  const examples = useMemo(() => exampleCases(), []);
  const value = useMemo<CaseListState>(
    () => ({
      cases: live ?? examples,
      source: live ? "live" : "example",
      loading,
      reason,
      refresh,
      fetchedAt,
    }),
    [live, examples, loading, reason, refresh, fetchedAt]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: CaseListState = {
  cases: [],
  source: "example",
  loading: false,
  reason: "No provider",
  refresh: async () => {},
  fetchedAt: null,
};

/** The case list. Outside a provider (a component rendered alone in a test) it is the example set. */
export function useCaseList(): CaseListState {
  const ctx = useContext(Ctx);
  const examples = useMemo(() => exampleCases(), []);
  return ctx ?? { ...FALLBACK, cases: examples };
}
