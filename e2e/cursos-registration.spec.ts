import { expect, test, type Page } from "@playwright/test";

const endpoint = "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso";
const saved = { etapa_funil: "lead_capturado", valor_centavos: 60000, moeda: "BRL", sessao_expira_em: "2030-01-01T00:00:00Z" };
test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/(consent\.cookiebot\.com|www\.googletagmanager\.com)\//, route => route.fulfill({ contentType: "text/javascript", body: "" }));
  await page.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "text/javascript", body: `window.turnstile={render:(el,opts)=>{if(opts.action!=='cadastro_curso')throw Error('Wrong action');setTimeout(()=>opts.callback('synthetic'),10);return 'test-widget'},remove:()=>{}};` }));
});
async function fill(page: Page) {
  await page.goto("/curso-zulliger/inscricao/");
  await page.getByLabel("Nome completo").fill("Pessoa Sintética");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).fill("person@example.test");
  await page.getByLabel("Telefone com DDD").fill("61 99999-0000");
  await page.getByRole("checkbox", { name: /Li e aceito/ }).check();
}
test("salva uma vez, mantém opções recusadas e apresenta resumo sem cobrar", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], writes: object[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  await page.route(endpoint, async route => {
    if (route.request().method() === "POST") {
      writes.push(route.request().postDataJSON());
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    await route.fulfill({ json: route.request().method() === "POST" ? { status: "solicitacao_recebida" } : saved,
      status: route.request().method() === "POST" ? 202 : 200 });
  });
  await fill(page);
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.getByRole("button", { name: "Aguarde…" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Cadastro recebido");
  await expect(page.getByRole("button", { name: "Ir para pagamento" })).toBeEnabled();
  const summary = page.locator(".z-order-summary");
  await expect(summary).toContainText("Z-Teste Coletivo e Individual — Técnica de Zulliger");
  await expect(summary).toContainText("1 inscrição · 1 participante");
  await expect(summary.getByRole("img", { name: "NeuroPsiEdu" })).toBeVisible();
  expect(await summary.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("spinbutton")).toHaveCount(0);
  await page.screenshot({ path: "backups/checkout-brand-desktop.png", fullPage: true });
  expect(writes).toHaveLength(1);
  expect(writes[0]).toMatchObject({ aceita_imagem: false, aceita_marketing: false, telefone: "+5561999990000" });
  await expect(page.getByRole("heading", { name: "Situação da inscrição" })).toBeFocused();
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Cadastro recebido");
  expect(errors).toEqual([]); expect(failures).toEqual([]);
});

const checkoutEndpoint = "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/checkout-curso";
test("checkout abre no PagBank e retorno só confirma matrícula após consulta autorizada", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [], calls: object[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  let stage = "lead_capturado";
  await page.route(endpoint, route => route.fulfill({ status: route.request().method() === "POST" ? 202 : 200,
    json: route.request().method() === "POST" ? { status: "solicitacao_recebida" } : { ...saved, etapa_funil: stage } }));
  await page.route(checkoutEndpoint, async route => {
    calls.push(route.request().postDataJSON()); stage = "pagamento_pendente";
    expect(route.request().headers()["x-registration-token"]).toMatch(/^[a-f0-9]{64}$/);
    await new Promise(resolve => setTimeout(resolve, 250));
    await route.fulfill({ json: { status: "checkout_iniciado", url: "https://pagamento.sandbox.pagbank.com.br/pagamento?code=synthetic", expira_em: "2030-01-01T00:00:00Z" } });
  });
  await page.route("https://pagamento.sandbox.pagbank.com.br/**", route => route.fulfill({ contentType: "text/html", body: "<h1>Pagamento simulado</h1>" }));
  await fill(page); await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await page.getByRole("button", { name: "Ir para pagamento" }).click();
  await expect(page.getByRole("button", { name: "Aguarde…" })).toBeDisabled();
  await expect(page).toHaveURL(/pagamento\.sandbox\.pagbank\.com\.br/);
  expect(calls).toHaveLength(1); expect(Object.keys(calls[0])).toEqual(["idempotencia"]);
  await page.goto("/curso-zulliger/resultado/?status=PAID");
  await expect(page.getByRole("status")).toContainText("aguardando a confirmação");
  await expect(page.locator("header").getByRole("img", { name: "NeuroPsiEdu" })).toBeVisible();
  await expect(page.locator(".z-order-summary")).toContainText("1 inscrição · 1 participante");
  await expect(page.getByRole("button", { name: "Ir para pagamento" })).toHaveCount(0);
  stage = "matricula_confirmada";
  await page.getByRole("button", { name: "Atualizar situação" }).click();
  await expect(page.getByRole("status")).toContainText("Sua matrícula está confirmada");
  expect(errors).toEqual([]); expect(failures).toEqual([]);
});

test("timeout ambíguo preserva chave e link externo inválido é recusado", async ({ page }) => {
  const keys: string[] = [];
  await page.route(endpoint, route => route.fulfill({ status: route.request().method() === "POST" ? 202 : 200,
    json: route.request().method() === "POST" ? { status: "solicitacao_recebida" } : saved }));
  await page.route(checkoutEndpoint, route => {
    keys.push(route.request().postDataJSON().idempotencia);
    return route.fulfill(keys.length === 1 ? { status: 202, json: { status: "conciliacao_pendente" } } :
      { json: { status: "checkout_iniciado", url: "https://evil.test/pagamento?code=bad", expira_em: "2030-01-01T00:00:00Z" } });
  });
  await fill(page); await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await page.getByRole("button", { name: "Ir para pagamento" }).click();
  await expect(page.getByText("Estamos verificando a tentativa", { exact: false })).toBeVisible();
  await page.reload(); await page.getByRole("button", { name: "Ir para pagamento" }).click();
  await expect(page.locator(".z-registration-error")).toContainText("Não foi possível concluir a consulta");
  await expect(page.locator(".z-registration-error")).toBeFocused();
  expect(keys).toHaveLength(2); expect(keys[0]).toBe(keys[1]);
  await expect(page).toHaveURL(/curso-zulliger\/inscricao/);
});

test("resultado sem sessão não confia na URL e revisão mantém pagamento bloqueado no celular", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/curso-zulliger/resultado/?status=PAID");
  await expect(page.getByText("Recupere o acesso pelo e-mail do cadastro", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ir para pagamento" })).toHaveCount(0);
  await page.evaluate(() => sessionStorage.setItem("neuropsiedu.cursos.continuacao.v1", "a".repeat(64)));
  await page.route(endpoint, route => route.fulfill({ json: { ...saved, etapa_funil: "revisao_necessaria" } }));
  await page.reload(); await expect(page.getByRole("status")).toContainText("precisa de conferência");
  await expect(page.getByRole("button", { name: "Ir para pagamento" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: "backups/checkout-brand-mobile.png", fullPage: true });
});

test("checkout encerrado permite nova chave de tentativa sem perder o cadastro", async ({ page }) => {
  const oldKey = "00000000-0000-4000-8000-000000000001";
  await page.goto("/curso-zulliger/resultado/");
  await page.evaluate(key => {
    sessionStorage.setItem("neuropsiedu.cursos.continuacao.v1", "a".repeat(64));
    sessionStorage.setItem("neuropsiedu.cursos.checkout.v1", key);
  }, oldKey);
  await page.route(endpoint, route => route.fulfill({ json: { ...saved, etapa_funil: "checkout_abandonado" } }));
  let attemptKey = "";
  await page.route(checkoutEndpoint, route => {
    attemptKey = route.request().postDataJSON().idempotencia;
    return route.fulfill({ status: 202, json: { status: "conciliacao_pendente" } });
  });
  await page.reload(); await page.getByRole("button", { name: "Ir para pagamento" }).click();
  await expect(page.getByText("Estamos verificando a tentativa", { exact: false })).toBeVisible();
  expect(attemptKey).not.toBe(oldKey); expect(attemptKey).toMatch(/^[a-f0-9-]{36}$/);
});
test("recupera por código e permite tentar novamente após código inválido", async ({ page }) => {
  let verified = false;
  await page.route(endpoint, async route => {
    const req = route.request();
    if (req.method() === "GET") return route.fulfill({ status: verified ? 200 : 404, json: verified ? saved : { error: "continuacao_indisponivel" } });
    const body = req.postDataJSON();
    if (body.action === "validar_codigo") {
      if (body.codigo !== "01234567") return route.fulfill({ status: 401, json: { error: "codigo_invalido" } });
      verified = true;
    }
    return route.fulfill({ status: 202, json: { status: "solicitacao_recebida" } });
  });
  await fill(page);
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.getByRole("heading", { name: "Continue com seu e-mail" })).toBeVisible();
  await page.getByRole("button", { name: "Enviar código de acesso" }).click();
  const codeInput = page.getByLabel("Código de oito dígitos");
  await codeInput.fill("123456");
  expect(await codeInput.evaluate((element: HTMLInputElement) => element.checkValidity())).toBe(false);
  await codeInput.fill("00000000");
  await page.getByRole("button", { name: "Validar código" }).click();
  await expect(page.locator(".z-registration-error")).toContainText("Código inválido");
  await page.getByLabel("Código de oito dígitos").fill("01234567");
  await page.getByRole("button", { name: "Validar código" }).click();
  await expect(page.getByRole("status")).toContainText("Cadastro recebido");
});
test("falha preserva tentativa, layout cabe no celular e JavaScript ausente não envia", async ({ page, browser }) => {
  const tokens: string[] = [];
  let failed = false;
  await page.route(endpoint, route => {
    if (route.request().method() === "POST") {
      tokens.push(route.request().headers()["x-registration-token"]);
      if (!failed) { failed = true; return route.fulfill({ status: 503, json: { error: "servico_indisponivel" } }); }
    }
    return route.fulfill({ status: route.request().method() === "POST" ? 202 : 200,
      json: route.request().method() === "POST" ? { status: "solicitacao_recebida" } : saved });
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await fill(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.locator(".z-registration-error")).toContainText("Não foi possível concluir");
  await expect(page.getByLabel("Nome completo")).toHaveValue("Pessoa Sintética");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("status")).toContainText("Cadastro recebido");
  expect(tokens).toHaveLength(2); expect(tokens[0]).toBe(tokens[1]);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await context.newPage();
  await noJs.goto("http://127.0.0.1:3002/curso-zulliger/inscricao/");
  await expect(noJs.getByRole("button", { name: "Salvar e continuar" })).toBeDisabled();
  await expect(noJs.getByLabel("Nome completo")).toBeDisabled();
  await context.close();
});
