import { z } from "zod";
import { apiRequest, ApiError } from "@/lib/api-client";
import { Me, User, type Role } from "@/lib/schemas/auth";

function parse<S extends z.ZodTypeAny>(schema: S, payload: unknown): z.output<S> {
  const r = schema.safeParse(payload);
  if (!r.success) throw new ApiError("parse", "Response did not match the expected schema", undefined, r.error);
  return r.data;
}

const json = (body: unknown) => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), timeoutMs: 8_000 });

export async function me(signal?: AbortSignal): Promise<Me> {
  return parse(Me, await apiRequest<unknown>("/auth/me", { timeoutMs: 6_000, signal }));
}

export async function login(username: string, password: string): Promise<User> {
  return parse(User, await apiRequest<unknown>("/auth/login", { method: "POST", ...json({ username, password }) }));
}

export async function logout(): Promise<void> {
  await apiRequest<unknown>("/auth/logout", { method: "POST", timeoutMs: 6_000 });
}

export interface SetupInput {
  username: string;
  name: string;
  password: string;
}

/** Creates the very first account. The API makes it an admin regardless of what is asked. */
export async function setup(input: SetupInput): Promise<User> {
  return parse(User, await apiRequest<unknown>("/auth/setup", { method: "POST", ...json({ ...input, role: "admin" }) }));
}

export async function listUsers(): Promise<User[]> {
  return parse(z.array(User), await apiRequest<unknown>("/users", { timeoutMs: 8_000 }));
}

export interface CreateUserInput {
  username: string;
  name: string;
  role: Role;
  password: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  return parse(User, await apiRequest<unknown>("/users", { method: "POST", ...json(input) }));
}

export async function deactivateUser(id: string): Promise<User> {
  return parse(User, await apiRequest<unknown>(`/users/${encodeURIComponent(id)}/deactivate`, { method: "POST", timeoutMs: 8_000 }));
}
