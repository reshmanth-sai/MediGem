import { test, expect, type Page } from "@playwright/test";

/*
 * Opt-in, sequential: exercises the real accounts system against a running
 * API and dev server (same setup as live.spec.ts). Tests share state within
 * this file (an admin account, then an ANM account created from it), so they
 * run in order and are not safe to run in parallel with each other.
 *
 *   MEDIGEM_DB_PATH=/tmp/live.db MEDIGEM_CORS_ORIGINS=http://localhost:3000 uvicorn backend.api.app:app --port 8000
 *   cd frontend_v2 && npm run dev
 *   MEDIGEM_LIVE=1 npx playwright test --config=playwright.live.config.ts e2e-live/auth.spec.ts
 */
const API = process.env.MEDIGEM_API_URL || "http://localhost:8000";
const WEB = process.env.MEDIGEM_WEB_URL || "http://localhost:3000";
test.skip(process.env.MEDIGEM_LIVE !== "1", "set MEDIGEM_LIVE=1 with the API and dev server running");
test.use({ baseURL: WEB });
test.describe.configure({ mode: "serial" });

const ADMIN = { username: "e2e_admin", name: "Dr. Vikram Patel", password: "correct horse battery" };
const ANM = { username: "e2e_anm", name: "Asha Devi", password: "asha-pass-e2e-1" };

/** Signs in as the admin, creating the account on a fresh database. */
async function ensureAdminSignedIn(page: Page) {
  await page.goto("/workstation");
  const setupHeading = page.getByRole("heading", { name: "MediGem" });
  await expect(setupHeading).toBeVisible();
  // getByRole(name:) uses the real computed accessible name (which correctly
  // excludes the aria-hidden required-asterisk); getByLabel would compare
  // against the <label>'s raw textContent, "Username *", and never match.
  // Password inputs carry no ARIA textbox role at all, hence the ordinal
  // fallback for those two fields.
  if (await page.getByRole("button", { name: /create account and sign in/i }).isVisible().catch(() => false)) {
    await page.getByRole("textbox", { name: "Full name", exact: true }).fill(ADMIN.name);
    await page.getByRole("textbox", { name: "Username", exact: true }).fill(ADMIN.username);
    const pw = page.locator('input[type="password"]');
    await pw.nth(0).fill(ADMIN.password);
    await pw.nth(1).fill(ADMIN.password);
    await page.getByRole("button", { name: /create account and sign in/i }).click();
  } else {
    await page.getByRole("textbox", { name: "Username", exact: true }).fill(ADMIN.username);
    await page.locator('input[type="password"]').fill(ADMIN.password);
    await page.getByRole("button", { name: /^sign in$/i }).click();
  }
  // /workstation does not navigate on sign-in (Gate swaps content, not
  // route), so waiting on the URL alone would resolve immediately
  // whether or not auth actually finished. Wait for the sign-in wall
  // itself to be gone instead.
  await expect(page.getByRole("heading", { name: "MediGem", level: 1 })).toBeHidden();
}

test("a signed-out visitor sees the sign-in wall, not the workstation", async ({ page }) => {
  await page.goto("/workstation");
  await expect(page.getByRole("heading", { name: "MediGem" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /good (morning|afternoon|evening)/i })).toHaveCount(0);
});

test("first account (or an existing one) signs in and reaches the workstation", async ({ page }) => {
  await ensureAdminSignedIn(page);
  await expect(page.getByText(ADMIN.name)).toBeVisible();
});

test("sign out returns to the wall, and the session does not survive a reload", async ({ page }) => {
  await ensureAdminSignedIn(page);
  await page.getByRole("button", { name: /sign out/i }).click();
  await expect(page.getByRole("heading", { name: "MediGem" })).toBeVisible();
  await page.goto("/history");
  await expect(page.getByRole("heading", { name: "MediGem" })).toBeVisible();
});

test("an ANM can note a case but cannot sign off or delete it; an admin can", async ({ page }) => {
  await ensureAdminSignedIn(page);

  // Create the ANM account as admin, via the same authenticated cookie jar.
  const created = await page.request.post(`${API}/users`, { data: { ...ANM, role: "anm" } });
  if (!created.ok() && created.status() !== 422) throw new Error(`could not create ANM: ${created.status()}`);

  // A case to work on.
  const analyzed = await page.request.post(`${API}/analyze`, {
    multipart: { age: "40", gender: "Male", symptoms: '["chest tightness","breathlessness"]', chief_complaint: "Chest tightness", patient_name: "Auth Test Patient" },
  });
  expect(analyzed.ok()).toBeTruthy();
  const cid: string = (await analyzed.json()).case_id;

  await page.getByRole("button", { name: /sign out/i }).click();
  await page.getByRole("textbox", { name: "Username", exact: true }).fill(ANM.username);
  await page.locator('input[type="password"]').fill(ANM.password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page.getByRole("heading", { name: "MediGem", level: 1 })).toBeHidden();

  await page.goto(`/results/${cid}`);
  await page.getByLabel(/add a note/i).fill("Seen by ANM.");
  await page.getByRole("button", { name: /^add note$/i }).click();
  await expect(page.getByText("Seen by ANM.")).toBeVisible();

  const signOffAsAnm = await page.request.post(`${API}/cases/${cid}/review`, { data: { decision: "approved" } });
  expect(signOffAsAnm.status()).toBe(403);
  const deleteAsAnm = await page.request.delete(`${API}/cases/${cid}`);
  expect(deleteAsAnm.status()).toBe(403);

  await page.getByRole("button", { name: /sign out/i }).click();
  await ensureAdminSignedIn(page);
  await page.goto(`/results/${cid}`);
  await page.getByRole("button", { name: /^sign off$/i }).click();
  await expect(page.getByText(new RegExp(`signed off by ${ADMIN.name}`, "i"))).toBeVisible();
});
