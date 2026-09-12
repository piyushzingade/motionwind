import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".next/playwright-results",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3102",
    colorScheme: "dark",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bunx next dev --port 3102",
    url: "http://localhost:3102/playground",
    reuseExistingServer: false,
    env: {
      ...process.env,
      RESEND_API_KEY: "",
    },
  },
});
