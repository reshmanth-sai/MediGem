import { z } from "zod";

export const ROLES = ["anm", "cho", "mo", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const RANK: Record<Role, number> = { anm: 0, cho: 1, mo: 2, admin: 3 };

/** True when `role` grants at least `min`. */
export function atLeast(role: Role, min: Role): boolean {
  return RANK[role] >= RANK[min];
}

export const ROLE_LABELS: Record<Role, string> = {
  anm: "ANM",
  cho: "Community Health Officer",
  mo: "Medical Officer",
  admin: "Administrator",
};

export const User = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  role: z.enum(ROLES),
  active: z.boolean(),
  created_at: z.string(),
  last_login_at: z.string().nullable().optional(),
});
export type User = z.infer<typeof User>;

export const Me = z.object({
  user: User.nullable(),
  setup_required: z.boolean(),
  roles: z.array(z.enum(ROLES)),
});
export type Me = z.infer<typeof Me>;
