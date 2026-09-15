"use client";

import React, { useState } from "react";
import { ShieldCheck, LogIn, UserPlus } from "lucide-react";
import { TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EcgMark } from "@/components/layout/Sidebar";
import { useSession } from "@/providers/SessionProvider";
import { ApiError } from "@/lib/api-client";

/*
 * Stands in front of the whole workstation whenever the pipeline API is up
 * and reachable: first-run account creation while none exists, a plain
 * login afterwards. Neither runs in replay/example mode, there is nothing
 * to sign into, so AppShell never mounts this then.
 */
export function SignInScreen() {
  const session = useSession();
  const isSetup = session.status === "setup";

  return (
    <div className="min-h-screen bg-ground flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <EcgMark className="text-risk-high h-8 w-14" />
          <h1 className="text-h2 text-ink">MediGem</h1>
          <p className="text-body-sm text-ink-muted">
            {isSetup ? "No account exists on this machine yet. Create the first one." : "Sign in to the clinical workstation."}
          </p>
        </div>
        {isSetup ? <SetupForm /> : <LoginForm />}
      </div>
    </div>
  );
}

function friendlyError(e: unknown): string {
  if (e instanceof ApiError) return e.userMessage;
  return e instanceof Error ? e.message : "Something went wrong.";
}

function LoginForm() {
  const session = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await session.login(username.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? "Wrong username or password." : friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 border border-rule bg-surface p-6 rounded-card">
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      {error && (
        <p role="alert" className="text-body-sm text-risk-emergency">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="w-full" leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}>
        {busy ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}

function SetupForm() {
  const session = useSession();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    setError(null);
    try {
      await session.setup({ name: name.trim(), username: username.trim(), password });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 border border-rule bg-surface p-6 rounded-card">
      <div className="flex items-center gap-2 text-body-sm text-ink-muted pb-1">
        <ShieldCheck className="h-4 w-4 text-action shrink-0" aria-hidden="true" />
        This account is created as Administrator and can add the rest of the team afterward.
      </div>
      <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} helperText="At least 3 characters: letters, digits, dot or underscore." autoComplete="username" required />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} helperText="At least 8 characters." autoComplete="new-password" required />
      <TextField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
      {error && (
        <p role="alert" className="text-body-sm text-risk-emergency">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="w-full" leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}>
        {busy ? "Creating account" : "Create account and sign in"}
      </Button>
    </form>
  );
}
