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
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
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
