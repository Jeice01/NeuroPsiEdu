import { expect, test } from "@playwright/test";

test("Sandbox grava somente turma de teste e não oferece consentimentos opcionais", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], writes: Record<string, unknown>[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  await page.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "application/javascript", body: "window.turnstile={render:(el,opts)=>{setTimeout(()=>opts.callback('synthetic'),10);return 'test-widget'},remove:()=>{}};" }));
  await page.route("https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso", route => {
    if (route.request().method() === "POST") {
      writes.push(route.request().postDataJSON());
      return route.fulfill({ contentType: "application/json", body: JSON.stringify({ status: "solicitacao_recebida" }), status: 202 });
    }
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ etapa_funil: "lead_capturado", valor_centavos: 60000, moeda: "BRL", sessao_expira_em: new Date(Date.now() + 3600000).toISOString() }) });
  });
  await page.goto("/curso-zulliger/teste/");
  await expect(page.getByRole("heading", { name: "Teste de cadastro e pagamento" })).toBeVisible();
  await expect(page.getByText(/Este teste não reserva vagas/)).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(1);
  await expect(page.locator('input[name="imagem"],input[name="marketing"]')).toHaveCount(0);
  await page.getByLabel("Nome completo").fill("Pessoa Sintética");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).fill("synthetic@example.test");
  await page.getByLabel("Telefone com DDD").fill("61 99999-0000");
  await page.getByRole("checkbox", { name: /Li e aceito/ }).check();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.getByText(/Não garantem vaga no curso real/)).toBeVisible();
  expect(writes).toHaveLength(1);
  expect(writes[0].turma_id).toBe("1349d08b-4fc6-4b1f-a485-2e691f716ab2");
  expect(writes[0].aceita_imagem).toBe(false);
  expect(writes[0].aceita_marketing).toBe(false);
  await page.getByRole("button", { name: "Encerrar acesso neste navegador" }).click();
  await expect(page.getByRole("heading", { name: "Continue com seu e-mail" })).toBeFocused();
  await page.goto("/curso-zulliger/teste/condicoes/");
  await expect(page.getByRole("heading", { name: "Condições do Sandbox" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Privacidade durante a homologação" })).toBeVisible();
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});

test("navegação pública não carrega Cookiebot ou rastreamento", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], trackingRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  page.on("request", request => {
    if (/cookiebot|googletagmanager|google-analytics|clarity\.ms/.test(request.url())) trackingRequests.push(request.url());
  });
  for (const path of ["/", "/curso-zulliger/", "/curso-zulliger/inscricao/", "/curso-zulliger/resultado/"]) {
    await page.goto(path);
    await expect(page.locator("body")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page.locator('#Cookiebot, #tracking-consent, #consented-gtm, iframe[src*="googletagmanager"]')).toHaveCount(0);
  }
  expect(trackingRequests).toEqual([]);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});
test("artefato público informa abertura futura sem coletar dados ou iniciar pagamento", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], courseRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", response => {
    if (response.url().startsWith("http://127.0.0.1:3010") && response.status() >= 400) failures.push(response.url());
  });
  page.on("request", request => {
    if (/ydmvbssgiffqrmwigkae|pagseguro|pagbank/.test(request.url())) courseRequests.push(request.url());
  });
  // Unrelated global analytics/consent are tested in the existing suite.
  await page.route(/^https:\/\/(consent\.cookiebot\.com|www\.googletagmanager\.com)\//,
    route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.goto("/curso-zulliger/");
  await expect(page.locator(".z-preview-bar")).toContainText("INSCRIÇÕES EM BREVE");
  await expect(page.locator(".z-nav-cta")).toHaveText(/Inscrições em breve/);
  await expect(page.getByText("Emissão em até 20 dias após o término do curso, mediante frequência mínima de 75%.", { exact: true })).toBeVisible();
  await expect(page.getByText(/Nesta prévia|a versão final terá/)).toHaveCount(0);
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await page.locator(".z-nav-cta").click();
  await expect(page).toHaveURL(/\/curso-zulliger\/inscricao\/$/);
  await expect(page.getByRole("heading", { name: "Inscrições em breve", exact: true })).toBeVisible();
  await expect(page.locator("dd").filter({ hasText: "Emissão em até 20 dias após o término do curso." })).toBeVisible();
  await expect(page.locator("form, input")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Falar com a NeuroPsiEdu", exact: true })).toHaveAttribute("href", /^https:\/\/wa.me\//);
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  expect(courseRequests).toEqual([]);
});
