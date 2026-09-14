"use client";

import { useCallback, useMemo, useState } from "react";
import type { ClinicalCaseData } from "@/lib/casesData";
import { filterCases, type RiskFilter } from "@/lib/caseFilter";

export interface CaseFilterState {
  query: string;
  setQuery: (q: string) => void;
  risk: RiskFilter;
  setRisk: (r: RiskFilter) => void;
  /** True when any filter narrows the list. */
  active: boolean;
  clear: () => void;
  filtered: ClinicalCaseData[];
}

export function useCaseFilter(cases: ClinicalCaseData[], extra?: (c: ClinicalCaseData) => boolean, extraActive = false): CaseFilterState {
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<RiskFilter>("ALL");
  const filtered = useMemo(() => filterCases(cases, { query, risk, extra }), [cases, query, risk, extra]);
  const clear = useCallback(() => {
    setQuery("");
    setRisk("ALL");
  }, []);
  return { query, setQuery, risk, setRisk, active: Boolean(query) || risk !== "ALL" || extraActive, clear, filtered };
}
