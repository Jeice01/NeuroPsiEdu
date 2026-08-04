import { expect, Page, test } from "@playwright/test";

const EDGE_FUNCTION = "**/functions/v1/create-lead-formacao";

async function prepareFormTest(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: (_element: unknown, options: { callback: (token: string) => void }) => {
        queueMicrotask(() => options.callback("e2e-turnstile-token"));
        return "e2e-widget";
      },
      remove: () => {},
      reset: () => {},
    };
  });
  await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
}

async function mockSuccessfulLead(page: Page, expectedFormation: string) {
  await page.route(EDGE_FUNCTION, async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    expect(payload.formacao_interesse).toBe(expectedFormation);
    expect(payload.turnstile_token).toBe("e2e-turnstile-token");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Lead E2E recebido." }),
    });
  });
}

async function fillContactFields(page: Page) {
  await page.getByPlaceholder("Seu nome completo").fill("Maria Silva");
  await page.getByPlaceholder("(61) 99999-9999").fill("61987654321");
  const email = page.locator('input[type="email"], input[placeholder="seuemail@email.com"]');
  await email.fill("maria@example.com");
}

test("abre, fecha e envia o formulário FANP com API simulada", async ({ page }) => {
  await prepareFormTest(page);
  await mockSuccessfulLead(page, "8ª Turma FANP");
  await page.goto("/fnp/");

  await page.getByRole("button", { name: "Quero garantir minha vaga" }).first().click();
  await expect(page.getByPlaceholder("Seu nome completo")).toBeVisible();
  await page.getByRole("button", { name: "Fechar" }).click();
  await expect(page.getByPlaceholder("Seu nome completo")).toBeHidden();

  await page.getByRole("button", { name: "Quero garantir minha vaga" }).first().click();
  await fillContactFields(page);
  await page.locator('label:has-text("Autorizo a NeuroPsiEdu") > div').click();
  await page.getByRole("button", { name: /enviar meus dados/i }).click();
  await expect(page.getByText("Lead E2E recebido.")).toBeVisible();
});

test("envia o formulário FAMAF com API simulada", async ({ page }) => {
  const formation =
    "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo";
  await prepareFormTest(page);
  await mockSuccessfulLead(page, formation);
  await page.goto("/famaf/");

  await page.getByRole("button", { name: /quero garantir minha pré-inscrição/i }).click();
  await fillContactFields(page);
  await page.getByRole("checkbox").check();
  await page.locator("form").getByRole("button", { name: "Quero receber informações" }).click();
  await expect(page.getByText("Lead E2E recebido.")).toBeVisible();
});

test("fecha o modal pelo teclado", async ({ page }) => {
  await prepareFormTest(page);
  await page.goto("/fnp/");
  await page.getByRole("button", { name: "Quero garantir minha vaga" }).first().click();
  await expect(page.getByPlaceholder("Seu nome completo")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByPlaceholder("Seu nome completo")).toBeHidden();
});
