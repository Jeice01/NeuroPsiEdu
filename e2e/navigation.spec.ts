import { expect, test } from "@playwright/test";

test("carrega a home e navega para o blog", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/NeuroPsiEdu/i);
  await expect(page.locator("main")).toBeVisible();

  await page.waitForLoadState("networkidle");
  const blogLink = page.locator('nav a[href^="/blog"]:visible');
  await expect(blogLink).toBeInViewport();
  await blogLink.click();
  await expect(page).toHaveURL(/\/blog\/?$/);
  await expect(page.getByRole("heading", { name: "Nosso Blog" })).toBeVisible();
});

test("renderiza todos os artigos publicados", async ({ page }) => {
  await page.goto("/blog/");
  const articleLinks = page.locator('main a[href^="/blog/"]');
  const hrefs = await articleLinks.evaluateAll((links) =>
    [...new Set(links.map((link) => link.getAttribute("href")).filter(Boolean))] as string[]
  );

  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("exibe página 404 para rota inexistente", async ({ page }) => {
  const response = await page.goto("/rota-que-nao-existe/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /could not be found/i })).toBeVisible();
});

test("abre menu mobile e preserva links externos principais", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /abrir menu/i }).click();
  await expect(page.getByRole("link", { name: "Blog", exact: true }).last()).toBeVisible();

  const whatsapp = page.locator('a[href^="https://wa.me/"]').first();
  await expect(whatsapp).toHaveAttribute("target", "_blank");
  await expect(whatsapp).toHaveAttribute("rel", /noopener/);
});
