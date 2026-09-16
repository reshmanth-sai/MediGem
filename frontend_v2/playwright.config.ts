import { defineConfig, devices } from "@playwright/test";

/*
 * End-to-end flows against a production build in replay mode (no API), the
 * same configuration the hosted site runs in. The server builds into its own
 * dist dir so it never touches a running `next dev`.
 */
const PORT = 3210;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  /*
   * `phone` alone misses two conditions that break real layouts and nothing
   * in CI otherwise produces:
   *
   * - `narrow` is 320px, the width of an iPhone SE 1st gen and of plenty of
   *   Android hardware still in the field. The intake wizard's button row and
   *   the patient tab bar both overran here while 375px looked clean.
   * - `large-text` drives the Settings > Accessibility text scale, which
   *   raises the root font size to 118% and pushes the same rows over the
   *   edge at ordinary widths.
   *
   * Both reuse the phone device profile, so the phone-only tests
   * (`test.skip(!isMobile)`) run in them too.
   */
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
    {
      name: "narrow",
      use: { ...devices["Pixel 7"], viewport: { width: 320, height: 568 } },
    },
    // The text scale itself is applied by a beforeEach in the spec, keyed on
    // this project name -- it has to run as an init script on <html>, which a
    // project's `use` block cannot express.
    { name: "large-text", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `NEXT_DIST_DIR=.next-e2e npx next build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    // Empty string beats .env.local: replay mode, no API.
    env: { NEXT_PUBLIC_API_BASE_URL: "", NEXT_PUBLIC_API_KEY: "" },
  },
});
