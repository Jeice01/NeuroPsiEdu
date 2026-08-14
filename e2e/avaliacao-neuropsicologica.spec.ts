import { expect, test } from "@playwright/test";

const route = "/avaliacao-neuropsicologica/";

test("publica conteúdo, SEO e dados estruturados da avaliação", async ({ page }) => {
  await page.goto(route);

  await expect(page).toHaveTitle(/Avaliação Neuropsicológica em Brasília.*NeuroPsiEdu/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://neuropsiedu.com.br/avaliacao-neuropsicologica/"
  );
  await expect(
    page.getByRole("heading", { level: 1, name: /Avaliação Neuropsicológica/i })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dúvidas sobre a avaliação" })).toBeVisible();

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const pageSchema = schemas.find((schema) => schema.includes('"@type":"Service"'));
  expect(pageSchema).toBeTruthy();
  expect(pageSchema).toContain('"@type":"FAQPage"');
  expect(pageSchema).toContain('"@type":"BreadcrumbList"');
});

test("registra visualização e clique no WhatsApp sem gerar lead falso", async ({ page }) => {
  await page.goto(route);
  await expect.poll(async () =>
    page.evaluate(() => window.dataLayer?.some((item) => item.event === "view_avaliacao"))
  ).toBe(true);

  const cta = page.getByRole("link", { name: /Conversar pelo WhatsApp/i });
  await cta.evaluate((link) => link.addEventListener("click", (event) => event.preventDefault(), { once: true }));
  await cta.click();

  const events = await page.evaluate(() => window.dataLayer || []);
  expect(events).toEqual(expect.arrayContaining([
    expect.objectContaining({ event: "view_avaliacao" }),
    expect.objectContaining({ event: "click_whatsapp_avaliacao", cta_origin: "hero" }),
  ]));
  expect(events.filter((item) => item.event === "click_whatsapp_avaliacao")).toHaveLength(1);
  expect(events.some((item) => item.event === "lead_avaliacao")).toBe(false);
});

for (const viewport of [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "notebook", width: 1024, height: 768 },
  { name: "wide", width: 1440, height: 900 },
]) {
  test(`mantém layout responsivo em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(route);

    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("link", { name: /Conversar pelo WhatsApp/i })).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow).toBe(false);
  });
}
