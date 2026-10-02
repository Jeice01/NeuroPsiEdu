import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", testMatch: "zulliger-release.spec.ts", workers: 1,
  reporter: "list", outputDir: "test-results/release",
  use: { ...devices["Desktop Chrome"], channel: "chrome", baseURL: "http://127.0.0.1:3010", trace: "retain-on-failure" },
  webServer: {
    command: "python -m http.server 3010 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:3010", reuseExistingServer: false,
  },
});
