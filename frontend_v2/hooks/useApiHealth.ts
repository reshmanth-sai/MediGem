"use client";

import { useEffect, useState } from "react";
import { health } from "@/services/analysis.service";
import { isApiConfigured } from "@/lib/api-client";
import type { HealthResponse } from "@/lib/schemas/analysis";

export type ApiHealthState =
  | { state: "unconfigured" }
  | { state: "checking" }
  | { state: "up"; health: HealthResponse }
  | { state: "down"; message: string };

/**
 * Polls GET /health on the pipeline API. "down" means the API process is not
 * reachable from this browser; "up" carries what it reported, including
 * whether Ollama itself answered.
 */
export function useApiHealth(intervalMs = 30_000): ApiHealthState {
  const [state, setState] = useState<ApiHealthState>(() => (isApiConfigured() ? { state: "checking" } : { state: "unconfigured" }));

  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    const ac = new AbortController();
    const probe = async () => {
      try {
        const h = await health(ac.signal);
        if (!cancelled) setState({ state: "up", health: h });
      } catch (e) {
        if (!cancelled) setState({ state: "down", message: e instanceof Error ? e.message : String(e) });
      }
    };
    probe();
    const id = setInterval(probe, intervalMs);
    return () => {
      cancelled = true;
      ac.abort();
      clearInterval(id);
    };
  }, [intervalMs]);

  return state;
}
