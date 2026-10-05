import { expect, test, type Page } from "@playwright/test";

const endpoint = "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/interesse-curso";
const invite = "https://chat.whatsapp.com/GX3998AXL59KQkrFNt6xPQ";

async function fill(page: Page, group: boolean) {
  await page.getByLabel("Nome completo (obrigatório)").fill("Pessoa Sintética");
  await page.getByLabel("Email (obrigatório)").fill("synthetic@example.test");
  await page.getByLabel("WhatsApp com DDD (obrigatório)").fill("61 99999-0000");
  await page.getByRole("radio", { name: "Estudante de Psicologia" }).check();
  await page.getByLabel(/Qual dúvida/).fill("Como funciona a interpretação?");
  await page.getByRole("checkbox", { name: /Autorizo/ }).check();
  if (group) await page.getByRole("checkbox", { name: /Quero participar/ }).check();
}

test.beforeEach(async ({ page }) => {
  await page.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "application/javascript",
    body: "window.turnstile={render:(el,opts)=>{setTimeout(()=>opts.callback('synthetic'),10);return 'widget'},remove:()=>{}};" }));
});

for (const group of [false, true]) test(`interest persists before showing success; group opt-in ${group}`, async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], writes: Record<string, unknown>[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
  page.on("requestfailed", request => {
    // Next cancels an obsolete RSC response during navigation; actual API failures still fail the test.
    if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).searchParams.has("_rsc")) return;
    failures.push(request.url());
  });
  page.on("response", response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.route(endpoint, route => {
    const data = route.request().postDataJSON(); writes.push(data);
    return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ status: "interesse_recebido", ...(group ? { grupo_url: invite } : {}) }) });
  });
  await page.goto("/curso-zulliger/");
  await page.locator(".z-nav-cta").click();
  await expect(page.getByRole("heading", { name: "Entre na lista de interesse" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Entrar no grupo do WhatsApp" })).toHaveCount(0);
  await expect(page.getByRole("checkbox", { name: /Quero participar/ })).not.toBeChecked();
  await fill(page, group);
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.screenshot({ path: `test-results/interest/form-mobile-${group}.png`, fullPage: true });
  await page.getByRole("button", { name: "Quero receber as informações" }).focus();
  await expect(page.getByRole("button", { name: "Quero receber as informações" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Interesse registrado!" })).toBeFocused();
  await expect(page.getByText(/não confirma matrícula/)).toBeVisible();
  const link = page.getByRole("link", { name: "Entrar no grupo do WhatsApp" });
  if (group) await expect(link).toHaveAttribute("href", invite); else await expect(link).toHaveCount(0);
  expect(writes).toHaveLength(1); expect(writes[0].telefone).toBe("+5561999990000"); expect(writes[0].aceita_grupo).toBe(group);
  expect(writes[0]).not.toHaveProperty("turma_id");
  expect(errors).toEqual([]); expect(failures).toEqual([]);
});

test("failed save and rate limiting preserve data and never expose the invitation", async ({ page }) => {
  const unexpectedErrors: string[] = [], failedRequests: string[] = [];
  page.on("pageerror", error => unexpectedErrors.push(error.message));
  page.on("requestfailed", request => failedRequests.push(request.url()));
  let attempts = 0;
  await page.route(endpoint, route => route.fulfill({ status: ++attempts === 1 ? 503 : 429, contentType: "application/json", body: '{"error":"synthetic"}' }));
  await page.goto("/curso-zulliger/inscricao/");
  await fill(page, true);
  await page.getByRole("button", { name: "Quero receber as informações" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Não foi possível salvar" })).toBeVisible();
  await expect(page.getByLabel("Nome completo (obrigatório)")).toHaveValue("Pessoa Sintética");
  await expect(page.getByRole("link", { name: "Entrar no grupo do WhatsApp" })).toHaveCount(0);
  await page.getByRole("button", { name: "Quero receber as informações" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Muitas tentativas" })).toBeVisible();
  expect(unexpectedErrors).toEqual([]); expect(failedRequests).toEqual([]);
});
