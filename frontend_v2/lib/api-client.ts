/*
 * The one HTTP client for the pipeline API (backend/api/app.py).
 *
 * Base URL and timeout come from the environment. Every failure is a typed
 * ApiError so a screen can say exactly what happened: the API was not
 * reachable (offline, wrong port), it timed out, it rejected the request, or
 * it answered with something that did not parse.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
export const API_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 120_000);
// Sent as X-API-Key when set. A key in a public bundle is a deterrent
// against casual abuse of a ten-second GPU endpoint, not a secret; the
// server-side rate limit is the real control.
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export type ApiErrorKind = "unconfigured" | "network" | "timeout" | "http" | "parse";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly detail?: unknown;

  constructor(kind: ApiErrorKind, message: string, status?: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.detail = detail;
  }

  /** Plain-language explanation for the person at the screen. */
  get userMessage(): string {
    switch (this.kind) {
      case "unconfigured":
        return "No pipeline API is configured for this build.";
      case "network":
        return "The pipeline API on this machine could not be reached.";
      case "timeout":
        return "The pipeline did not answer in time.";
      case "http":
        return this.status === 422 ? `The request was rejected: ${this.message}` : `The pipeline returned an error (${this.status}).`;
      case "parse":
        return "The pipeline answered with something this workstation could not read.";
    }
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export function isApiConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured()) throw new ApiError("unconfigured", "NEXT_PUBLIC_API_BASE_URL is not set");

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? API_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (options.signal) options.signal.addEventListener("abort", () => controller.abort(), { once: true });

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      body: options.body,
      headers: { ...(API_KEY ? { "X-API-Key": API_KEY } : {}), ...(options.headers ?? {}) },
      // Sessions are an HttpOnly cookie the API sets; this is what makes it
      // ride along on every request, including cross-origin (site on 3000,
      // API on 8000) since the API echoes back an exact-origin CORS header.
      credentials: "include",
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (controller.signal.aborted && !options.signal?.aborted) {
      throw new ApiError("timeout", `No response within ${timeoutMs} ms`);
    }
    throw new ApiError("network", e instanceof Error ? e.message : "fetch failed");
  }
  clearTimeout(timer);

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (res.ok) throw new ApiError("parse", "Response was not JSON");
    }
  }

  if (!res.ok) {
    const detail = (payload as { detail?: unknown } | null)?.detail;
    const message = typeof detail === "string" ? detail : res.statusText || `HTTP ${res.status}`;
    throw new ApiError("http", message, res.status, detail);
  }
  return payload as T;
}
