import { defineConfig, devices } from "@playwright/test";

const preview = process.env.CURSOS_TEST_MODE === "preview";
const recoveryDisabled = process.env.CURSOS_TEST_MODE === "recovery-disabled";
const port = preview ? 3003 : 3002;

export default defineConfig({
  testDir: "./e2e", testMatch: preview ? "zulliger.spec.ts" : recoveryDisabled ? "cursos-recovery-disabled.spec.ts" : "cursos-registration.spec.ts", workers: 1,
  reporter: "list", outputDir: "test-results/cursos",
  use: { ...devices["Desktop Chrome"], channel: "chrome", baseURL: `http://127.0.0.1:${port}`, screenshot: "only-on-failure", trace: "retain-on-failure" },
  webServer: {
    command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`, reuseExistingServer: false, timeout: 120000,
    env: { ...process.env,
      NEXT_DEV_INSTANCE: preview ? "cursos-preview" : "cursos",
      NEXT_PUBLIC_CURSOS_ENABLED: preview ? "false" : "true",
      NEXT_PUBLIC_CURSOS_CHECKOUT_SANDBOX_ENABLED: preview ? "false" : "true",
      NEXT_PUBLIC_CURSOS_RECOVERY_ENABLED: recoveryDisabled ? "false" : "true",
      NEXT_PUBLIC_CURSOS_FUNCTION_URL: "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso",
      NEXT_PUBLIC_CURSOS_TURNSTILE_SITE_KEY: "synthetic-test-site-key",
      NEXT_PUBLIC_CURSOS_TERMS_VERSION: "test-v1", NEXT_PUBLIC_CURSOS_PRIVACY_VERSION: "privacy-test-v1",
      NEXT_PUBLIC_CURSOS_TERMS_URL: "https://neuropsiedu.com.br/termos-test/",
      NEXT_PUBLIC_CURSOS_PRIVACY_URL: "https://neuropsiedu.com.br/privacidade-test/",
    },
  },
});
