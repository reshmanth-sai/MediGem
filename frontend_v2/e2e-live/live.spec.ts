import { test, expect } from "@playwright/test";

/*
 * Opt-in: runs against a live pipeline API and a dev server that points at it.
 *
 *   MEDIGEM_DB_PATH=/tmp/live.db MEDIGEM_CORS_ORIGINS=http://localhost:3000 uvicorn backend.api.app:app --port 8000
 *   cd frontend_v2 && npm run dev          # NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 in .env.local
 *   MEDIGEM_LIVE=1 npm run e2e:live
 *
 * Creates its own case (gate-intercepted, so no model call is needed) and
 * exercises every control on it: edit patient, care plan, note, document,
 * history, sign-off, export, delete.
 */
const API = process.env.MEDIGEM_API_URL || "http://localhost:8000";
const WEB = process.env.MEDIGEM_WEB_URL || "http://localhost:3000";
test.skip(process.env.MEDIGEM_LIVE !== "1", "set MEDIGEM_LIVE=1 with the API and dev server running");
test.use({ baseURL: WEB });

test("every case control works against the store", async ({ page, request }) => {
  const created = await request.post(`${API}/analyze`, {
    headers: { "X-Actor": "Dr. Vikram Patel" },
    multipart: { patient_id: "P-LIVE", patient_name: "Kavita Rao", age: "34", gender: "Female", symptoms: '["chest tightness","breathlessness"]', chief_complaint: "Chest tightness" },
  });
  expect(created.ok()).toBeTruthy();
  const CID: string = (await created.json()).case_id;
  await page.goto(`/results/${CID}`);
  await expect(page.getByRole("note")).toContainText(/live queue/i);

  // Edit patient
  await page.getByRole("button", { name: /edit patient/i }).click();
  const dlg = page.getByRole("dialog", { name: /edit patient/i });
  await dlg.getByLabel(/full name/i).fill("Kavita Rao Sharma");
  await dlg.getByLabel(/age/i).fill("35");
  await dlg.getByRole("button", { name: /save changes/i }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kavita Rao Sharma");

  // Care plan
  await page.getByRole("button", { name: /set care plan/i }).click();
  await page.getByRole("textbox", { name: "Next step" }).fill("Recheck blood pressure and headache diary");
  await page.getByRole("textbox", { name: "Follow-up" }).fill("In 3 days");
  await page.getByRole("button", { name: /save plan/i }).click();
  await expect(page.locator("#care-plan")).toContainText("Recheck blood pressure");

  // Note
  await page.getByLabel(/add a note/i).fill("Advised hydration and rest.");
  await page.getByRole("button", { name: /^add note$/i }).click();
  await expect(page.getByText("Advised hydration and rest.")).toBeVisible();

  // Document
  await page.getByLabel(/attach file/i).setInputFiles({ name: "consent.png", mimeType: "image/png", buffer: Buffer.from("89504e470d0a1a0a", "hex") });
  await expect(page.getByRole("link", { name: /consent\.png/i })).toBeVisible();

  // History shows it all
  await page.getByRole("tab", { name: /history/i }).click();
  const hist = page.getByText(/Case created from intake|Patient details updated|Care plan set|Note added|Document attached/);
  await expect(hist).toHaveCount(5);

  // Sign off
  await page.getByRole("tab", { name: /overview/i }).click();
  await page.getByRole("button", { name: /^sign off$/i }).click();
  await expect(page.getByText(/signed off by dr\. vikram patel/i)).toBeVisible();

  // Menu: export + delete
  await page.getByRole("button", { name: /more options/i }).click();
  await expect(page.getByRole("menuitem", { name: /export as json/i })).toBeVisible();
  await page.getByRole("menuitem", { name: /delete case/i }).click();
  await page.getByRole("button", { name: /^delete$/i }).click();
  await expect(page).toHaveURL(/\/history/);
  const r = await request.get(`${API}/cases/${CID}`);
  expect(r.status()).toBe(404);
});
