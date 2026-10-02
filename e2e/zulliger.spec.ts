import { expect, test } from "@playwright/test";

// Validate the requested browser, rather than silently substituting Chromium.
test.use({ channel: "chrome" });

test("prévia preserva dados locais, valida campos e permite recusar opções", async ({ page }) => {
  // Isolate form traffic from global consent/analytics scripts; inspect those separately in Chrome.
  await page.route(/^https:\/\/(consent\.cookiebot\.com|www\.googletagmanager\.com)\//, (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" })
  );
  const errors: string[] = [];
  const writes: string[] = [];
  const failures: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.method() === "POST") writes.push(request.url());
  });
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:3000") && response.status() >= 400) failures.push(response.url());
  });
  await page.goto("/curso-zulliger/inscricao/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Zulliger");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByLabel("Nome completo")).toBeVisible();
  const review = page.getByRole("button", { name: "Conferir demonstração" });
  await review.click();
  await expect(page.locator("#z-name")).toBeFocused();
  await page.getByLabel("Nome completo").fill("Participante de Teste");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).fill("participante@example.com");
  await page.getByRole("radio", { name: "Estudante de Psicologia", exact: true }).check();
  await expect(page.getByRole("checkbox").nth(0)).not.toBeChecked();
  await expect(page.getByRole("checkbox").nth(1)).not.toBeChecked();
  await review.click();
  await expect(page.getByRole("status")).toContainText("Nenhum dado foi enviado");
  await page.getByLabel("Nome completo").fill("Outro Participante");
  await expect(page.getByRole("status")).toBeEmpty();
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
});

test("celular mantém leitura, foco e perguntas acessíveis", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/curso-zulliger/");
  await expect(page.getByRole("img", { name: /Capa de Z-Teste/ })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  await page.locator("summary").filter({ hasText: "Como será o certificado?" }).click();
  await expect(page.getByText(/equivalente a 18 horas/)).toBeVisible();
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.querySelector(".z-page")?.scrollWidth ?? 0,
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);
  await expect(page.locator(".z-nav-cta")).toBeVisible();
});

test("capas carregam e publicações são apresentadas sem prometer material incluído", async ({ page }) => {
  await page.goto("/curso-zulliger/");
  for (const name of [/Capa de Z-Teste/, /Capa do manual Z-SC/]) {
    const cover = page.getByRole("img", { name });
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toBeVisible();
    await expect.poll(() => cover.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await expect(page.getByText(/O Teste de Zulliger utiliza respostas a três manchas/)).toBeVisible();
  await expect(page.getByText(/A exibição não significa que os livros/)).toBeVisible();
});

test("sem JavaScript o formulário demonstrativo não envia dados", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/curso-zulliger/`);
  await page.locator(".z-nav-cta").click();
  await expect(page).toHaveURL(`${baseURL}/curso-zulliger/inscricao/`);
  await page.getByLabel("Nome completo").fill("Teste Local");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).fill("teste@example.com");
  await page.getByRole("textbox", { name: "E-mail (obrigatório)", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Conferir demonstração" }).press("Enter");
  expect(page.url()).toBe(`${baseURL}/curso-zulliger/inscricao/`);
  await expect(page.getByLabel("Nome completo")).toHaveValue("Teste Local");
  await context.close();
});

test("CTAs abrem a página de inscrição na mesma aba por clique e teclado", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/curso-zulliger/");
  await expect(page.locator("form")).toHaveCount(0);
  const ctas = page.locator('a[href="/curso-zulliger/inscricao/"]');
  await expect(page.locator("#professor a")).toHaveText("Quero aprender com o Willian");
  await expect(ctas).toHaveCount(4);
  const support = page.locator('.z-support a');
  expect(new URL((await support.getAttribute("href")) ?? "").pathname).toBe("/5561996436007");
  await expect(support).toHaveAttribute("rel", "noopener noreferrer");
  for (let index = 0; index < 4; index++) {
    await ctas.nth(index).click();
    await expect(page).toHaveURL(/\/curso-zulliger\/inscricao\/$/);
    await expect(page.getByLabel("Nome completo")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sua inscrição em Zulliger");
    await page.getByRole("link", { name: "Voltar aos detalhes do curso" }).click();
    await expect(page).toHaveURL(/\/curso-zulliger\/$/);
  }
  await ctas.first().press("Enter");
  await expect(page).toHaveURL(/\/curso-zulliger\/inscricao\/$/);
  await expect(page.getByLabel("Nome completo")).toBeVisible();
  expect(context.pages()).toHaveLength(1);
});

test("inscrição permite acesso direto, leitura dos termos e layout responsivo", async ({ page }) => {
  await page.goto("/curso-zulliger/inscricao/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://neuropsiedu.com.br/curso-zulliger/inscricao/");
  const summary = page.getByRole("complementary", { name: "Z-Teste Coletivo e Individual" });
  const form = page.getByRole("region", { name: "Dados do participante" });
  await expect(summary).toContainText("R$ 600,00");
  await expect(summary).toContainText("Até 15 participantes");
  await expect(form).toBeVisible();
  const layout = () => page.evaluate(() => {
    const summaryBounds = document.querySelector(".z-registration-summary")?.getBoundingClientRect();
    const formBounds = document.querySelector(".z-form-card")?.getBoundingClientRect();
    if (!summaryBounds || !formBounds) throw new Error("Resumo ou formulário ausente");
    return { sideBySide: summaryBounds.right < formBounds.left, stacked: summaryBounds.bottom < formBounds.top };
  });
  await expect.poll(async () => (await layout()).sideBySide).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect.poll(async () => (await layout()).stacked).toBe(true);
    const policy = page.locator("#cancelamento > summary");
    await policy.press("Enter");
    await expect(page.getByText("Minuta para revisão:", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await policy.press("Enter");
    await expect(page.getByText("Minuta para revisão:", { exact: true })).toBeHidden();
  }
});
