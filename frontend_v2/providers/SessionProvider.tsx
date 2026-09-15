"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isApiConfigured, ApiError } from "@/lib/api-client";
import * as authService from "@/services/auth.service";
import type { User } from "@/lib/schemas/auth";
import { ROLE_LABELS, atLeast, type Role } from "@/lib/schemas/auth";
import { setActiveClinician, initialsOf } from "@/lib/session";

/*
 * The signed-in clinician for this browser, backed by the API's cookie
 * session. Five states:
 *
 *   no-api      no pipeline API configured for this build; nothing to sign
 *               into, the workstation runs on examples/replay as usual
 *   unreachable API is configured but did not answer; treated like no-api so
 *               a flaky connection cannot lock the whole workstation behind
 *               a login screen that could not authenticate anyway
 *   setup       API is up, no account exists yet: the first-run screen
 *   signed-out  API is up, accounts exist, no valid session
 *   signed-in   a session resolved to a user
 */
export type SessionStatus = "no-api" | "unreachable" | "setup" | "signed-out" | "signed-in";

export interface SessionState {
  status: SessionStatus;
  user: User | null;
  /** True once the initial /auth/me check has settled, whatever it found. */
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setup: (input: authService.SetupInput) => Promise<void>;
  refresh: () => Promise<void>;
  /** Whether the signed-in user's role is at least `role`. False when signed out. */
  can: (role: Role) => boolean;
}

const Ctx = createContext<SessionState | null>(null);

function identityFrom(user: User) {
  return {
    name: user.name,
    shortName: user.name.split(/\s+/)[0] || user.name,
    initials: initialsOf(user.name),
    role: ROLE_LABELS[user.role],
    roleShort: user.role.toUpperCase(),
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const configured = isApiConfigured();
  const [status, setStatus] = useState<SessionStatus>(configured ? "unreachable" : "no-api");
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);

  const apply = useCallback((u: User | null) => {
    setUser(u);
    setActiveClinician(u ? identityFrom(u) : null);
  }, []);

  const refresh = useCallback(async () => {
    if (!configured) return;
    try {
      const me = await authService.me();
      if (me.setup_required) {
        setStatus("setup");
        apply(null);
      } else if (me.user) {
        setStatus("signed-in");
        apply(me.user);
      } else {
        setStatus("signed-out");
        apply(null);
      }
    } catch (e) {
      // A network/timeout failure here mirrors how the rest of the
      // workstation treats an unreachable API: degrade, don't hard-block.
      setStatus(e instanceof ApiError && e.kind === "http" ? "signed-out" : "unreachable");
      apply(null);
    } finally {
      setReady(true);
    }
  }, [configured, apply]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (username: string, password: string) => {
      const u = await authService.login(username, password);
      setStatus("signed-in");
      apply(u);
    },
    [apply]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setStatus("signed-out");
      apply(null);
    }
  }, [apply]);

  const setup = useCallback(
    async (input: authService.SetupInput) => {
      const u = await authService.setup(input);
      setStatus("signed-in");
      apply(u);
    },
    [apply]
  );

  const can = useCallback((role: Role) => (user ? atLeast(user.role, role) : false), [user]);

  const value = useMemo<SessionState>(() => ({ status, user, ready, login, logout, setup, refresh, can }), [status, user, ready, login, logout, setup, refresh, can]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: SessionState = {
  status: "no-api",
  user: null,
  ready: true,
  login: async () => {},
  logout: async () => {},
  setup: async () => {},
  refresh: async () => {},
  can: () => false,
};

/** Outside a provider (a component rendered alone in a test) auth is inert and unconfigured. */
export function useSession(): SessionState {
  return useContext(Ctx) ?? FALLBACK;
}
