import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 30_000,
  expect: { timeout: 5000 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: [
    {
      command: "node scripts/serve.mjs dist 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
    },
    {
      command: "node scripts/serve.mjs .test-dist 4174",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
    },
    {
      command: "node scripts/serve.mjs .test-empty 4177",
      url: "http://127.0.0.1:4177",
      reuseExistingServer: false,
    },
  ],
});
