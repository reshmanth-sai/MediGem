import { defineConfig, devices } from "@playwright/test";
export default defineConfig({ testDir: "./e2e-live", timeout: 90_000, use: { ...devices["Desktop Chrome"], trace: "retain-on-failure" }, reporter: "list" });
