import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The five things a visitor does, in replay mode. Each must work on a phone.

test("product page loads and opens the workstation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MediGem");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/care that works/i);
  await page.getByRole("link", { name: /open (medigem )?workstation/i }).first().click();
  await expect(page).toHaveURL(/\/workstation$/);
  await expect(page.getByRole("note")).toContainText(/example queue/i);
});

test("the landing gate evaluates what the visitor types", async ({ page }) => {
  await page.goto("/");
  const field = page.getByRole("textbox", { name: "Try the gate", exact: true });
  const state = page.getByLabel("Gate state for this input");
  await expect(state).toContainText("R-CARDIAC-01");
  await expect(state).toContainText("Not allowed");

  await field.fill("mild headache, dizziness");
  await expect(state).toContainText("Clear");
  await expect(state).toContainText("Allowed");

  await page.getByRole("button", { name: "slurred speech, arm weakness" }).click();
  await expect(field).toHaveValue("slurred speech, arm weakness");
  await expect(state).toContainText("R-STROKE-01");
});

test("intake replays a recorded run and lands on a result", async ({ page }) => {
  await page.goto("/new-case");
  await page.getByRole("button", { name: /load demo case/i }).click();
  await page.getByRole("button", { name: /replay a recorded run/i }).click();
  await page.getByRole("button", { name: /emergency gate case/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toContainText(/emergency gate matched/i);
  await dialog.getByRole("button", { name: /open referral/i }).click();
  await expect(page).toHaveURL(/\/results\/CASE-CUSTOM$/);
  const card = page.getByRole("region", { name: /reasoning card/i });
  await expect(card).toBeVisible();
  await expect(card.getByText(/replay\./i)).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/synthetic demo patient/i);
});

test("a lab-report replay shows the reasoning card", async ({ page }) => {
  await page.goto("/new-case");
  await page.getByRole("button", { name: /load demo case/i }).click();
  await page.getByRole("button", { name: /replay a recorded run/i }).click();
  await page.getByRole("button", { name: /^lab report/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: /open assessment/i }).click();
  await expect(page).toHaveURL(/\/results\/CASE-CUSTOM$/);
  await expect(page.getByRole("region", { name: /reasoning card/i })).toBeVisible();
  await expect(page.getByText(/^observations$/i).first()).toBeVisible();
  await expect(page.getByText(/^limitations$/i).first()).toBeVisible();
});

test("an unknown case id is not another patient", async ({ page }) => {
  await page.goto("/results/DOES-NOT-EXIST");
  await expect(page.getByText(/case not found/i)).toBeVisible();
  await expect(page.getByText(/lakshmi ammal/i)).toHaveCount(0);
});

test("navigation works on a phone", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone project only");
  await page.goto("/workstation");
  await page.getByRole("button", { name: /open navigation/i }).click();
  await page.getByRole("dialog", { name: /navigation/i }).getByRole("link", { name: /patient queue/i }).click();
  await expect(page).toHaveURL(/\/history/);
  const width = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(width).toBeLessThanOrEqual(0);
});

for (const path of ["/", "/workstation", "/new-case", "/results/CASE-8901", "/settings", "/developer"]) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
  });
}
