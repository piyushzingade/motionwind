import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".next/playwright-results",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3001",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bunx next dev --port 3001 --webpack",
    url: "http://localhost:3001",
    reuseExistingServer: true,
  },
});
