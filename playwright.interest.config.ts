import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", testMatch: "cursos-interest.spec.ts", workers: 1,
  reporter: "list", outputDir: "test-results/interest",
  use: { ...devices["Desktop Chrome"], channel: "chrome", baseURL: "http://127.0.0.1:3014", trace: "retain-on-failure" },
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3014",
    url: "http://127.0.0.1:3014", reuseExistingServer: false, timeout: 120000,
    env: { ...process.env, NEXT_DEV_INSTANCE: "cursos-preview", ZULLIGER_INFORMATION_ONLY: "true",
      NEXT_PUBLIC_CURSOS_INTERESSE_ENABLED: "true", NEXT_PUBLIC_CURSOS_ENABLED: "false",
      NEXT_PUBLIC_CURSOS_TURNSTILE_SITE_KEY: "synthetic-test-site-key" },
  },
});
