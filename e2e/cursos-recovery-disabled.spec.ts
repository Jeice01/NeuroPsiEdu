import { expect, test } from "@playwright/test";

const endpoint = "https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso";
const saved = { etapa_funil: "lead_capturado", valor_centavos: 60000, moeda: "BRL", sessao_expira_em: "2030-01-01T00:00:00Z" };

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/(consent\.cookiebot\.com|www\.googletagmanager\.com)\//, route => route.fulfill({ contentType: "text/javascript", body: "" }));
  await page.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "text/javascript", body: "window.turnstile={render:(el,opts)=>{setTimeout(()=>opts.callback('synthetic'),10);return 'test-widget'},remove:()=>{}};" }));
});

test("sem SMTP não oferece código de acesso e orienta cadastro inacessível", async ({ page }) => {
  const errors: string[] = [], failures: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
  page.on("requestfailed", request => failures.push(request.url()));
  await page.route(endpoint, route => route.fulfill({ status: route.request().method() === "POST" ? 202 : 404,
    json: route.request().method() === "POST" ? { status: "solicitacao_recebida" } : { error: "continuacao_indisponivel" } }));
  await page.goto("/curso-zulliger/inscricao/");
  await expect(page.getByRole("button", { name: /recuperar acesso/ })).toHaveCount(0);
  await page.getByLabel("Nome completo").fill("Pessoa Sintética");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).fill("person@example.test");
  await page.getByLabel("Telefone com DDD").fill("61 99999-0000");
  await page.getByRole("checkbox", { name: /Li e aceito/ }).check();
  await page.getByRole("button", { name: "Salvar e continuar" }).click();
  await expect(page.locator(".z-registration-error")).toContainText("recuperação por e-mail ainda está indisponível");
  await expect(page.locator(".z-registration-error")).toBeFocused();
  await expect(page.getByRole("button", { name: "Enviar código de acesso" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Precisa de ajuda/ })).toHaveAttribute("href", /^https:\/\/wa.me\//);
  // Chrome reports the deliberately simulated inaccessible registration as HTTP 404.
  expect(errors).toEqual(["Failed to load resource: the server responded with a status of 404 (Not Found)"]);
  expect(failures).toEqual([]);
});

test("encerrar sessão permite novo cadastro com campos habilitados", async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: saved }));
  await page.goto("/curso-zulliger/inscricao/");
  await page.evaluate(() => sessionStorage.setItem("neuropsiedu.cursos.continuacao.v1", "a".repeat(64)));
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Cadastro recebido");
  await page.getByRole("button", { name: "Encerrar acesso neste navegador" }).click();
  await expect(page.getByLabel("Nome completo")).toBeEnabled();
  await expect(page.getByRole("button", { name: "Enviar código de acesso" })).toHaveCount(0);
});

test("retorno sem sessão orienta suporte no celular sem confirmar pagamento", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/curso-zulliger/resultado/?status=PAID");
  await expect(page.getByText("Não há uma inscrição acessível nesta aba.", { exact: false })).toBeVisible();
  await expect(page.getByText("Sua matrícula está confirmada.")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Voltar à inscrição", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
