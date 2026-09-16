import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/*
 * The `large-text` project runs the whole suite with Settings > Accessibility >
 * large text switched on, which is what AccessibilityProvider persists and
 * reads back. Setting it as an init script means <html> carries the attribute
 * before first paint, so no route renders once at the default scale and then
 * reflows -- the layout under test is the one a user with the setting on sees
 * from the start.
 */
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== "large-text") return;
  await page.addInitScript(() => {
    document.documentElement.setAttribute("data-text-scale", "large");
  });
});

// The five things a visitor does, in replay mode. Each must work on a phone.

test("product page loads and opens the workstation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MediGem");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/care that works/i);
  await page.getByRole("link", { name: /open (medigem )?workstation/i }).first().click();
  await expect(page).toHaveURL(/\/workstation$/);
  await expect(page.getByRole("note")).toContainText(/example queue/i);
});

test("the workstation tour walks from the queue to the replay picker", async ({ page, isMobile }) => {
  test.skip(isMobile, "the tour is desktop-width only, by design");
  await page.goto("/workstation?tour=1");
  const dialog = page.getByRole("dialog", { name: /product tour/i });
  await expect(dialog).toContainText("The queue");
  await page.getByRole("button", { name: /^next$/i }).click();
  await expect(dialog).toContainText("A case the gate caught");
  await page.getByRole("button", { name: /^next$/i }).click();
  await expect(dialog).toContainText("Where a live run starts");
  await page.getByRole("button", { name: /^next$/i }).click();
  await expect(page).toHaveURL(/\/new-case\?tour=4$/);
  await expect(dialog).toContainText("Try it");
  await page.getByRole("button", { name: /got it/i }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/new-case$/);
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

test("measured performance is reachable from the sidebar and shows recorded figures", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop sidebar is exercised here; phone nav is its own test");
  await page.goto("/workstation");
  await page.getByRole("link", { name: /measured performance/i }).click();
  await expect(page).toHaveURL(/\/evaluation$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/measured performance/i);
  await expect(page.getByText("80 / 80")).toBeVisible();
  await expect(page.getByText(/mean over 2 sample documents/i)).toBeVisible();
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

  // CASE-CUSTOM is reachable only by finishing an intake, so the route loop
  // below never sees it. Its reasoning card carries a much longer status badge
  // than any preset case, which is exactly what pushed this page 108px wider
  // than a phone once.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, `the replay result scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(0);
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

/*
 * Every route, on the phone project only. Two things regress silently on a
 * phone and are invisible from a desktop run, so they are asserted rather
 * than eyeballed:
 *
 * 1. Horizontal overflow. One un-clipped child is enough to give the whole
 *    page a sideways scrollbar, and it is easy to reintroduce -- an absolutely
 *    positioned `sr-only` span escaping a `static` scroll container did exactly
 *    that to /new-case once.
 * 2. Form controls under 16px. iOS Safari zooms the page in when one is
 *    focused and does not zoom back out, which strands the clinician at the
 *    wrong scale for the rest of the intake. globals.css floors these below
 *    `md`; this is the test that says so.
 */
const MOBILE_ROUTES = [
  "/",
  "/workstation",
  "/new-case",
  "/history",
  "/assessments",
  "/transfers",
  "/learning",
  "/evaluation",
  "/developer",
  "/settings",
  "/assistant",
  "/results/CASE-8901",
];

for (const path of MOBILE_ROUTES) {
  test(`phone layout holds on ${path}`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone project only");
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${path} scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(0);

    const tooSmall = await page.evaluate(() =>
      [...document.querySelectorAll("input, select, textarea")]
        .filter((el) => {
          const type = el.getAttribute("type");
          return type !== "checkbox" && type !== "radio" && type !== "range";
        })
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
        .map((el) => el.getAttribute("name") || el.id || el.tagName.toLowerCase())
    );
    expect(tooSmall, `${path} has controls iOS will zoom into`).toEqual([]);
  });
}

for (const path of ["/", "/workstation", "/new-case", "/results/CASE-8901", "/settings", "/developer", "/evaluation"]) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
  });
}
