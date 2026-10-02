import { expect, test } from "@playwright/test";

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
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await page.locator(".z-nav-cta").click();
  await expect(page).toHaveURL(/\/curso-zulliger\/inscricao\/$/);
  await expect(page.getByRole("heading", { name: "Inscrições em breve", exact: true })).toBeVisible();
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
