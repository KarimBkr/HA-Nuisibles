import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

test("m35: home urgency band under the header and price preview linking to the prices page", async ({ page }) => {
  await page.goto("/");
  const band = page.locator('[data-home="urgency"]');
  await expect(band).toContainText("Urgence ?");
  await expect(band).toContainText("Dimanche : urgences, +50 %");
  await expect(band.locator("a[href^='tel:']")).toBeVisible();
  const order = await page.evaluate(() => ["header", '[data-home="urgency"]', '[data-home="hero"]'].map((s) => document.querySelector(s)!.getBoundingClientRect().top));
  expect(order).toEqual([...order].sort((a, b) => a - b));
  const preview = page.locator('[data-home="prices"]');
  await expect(preview).toContainText("À partir de 150 € TTC");
  await expect(preview.locator('a[href="/tarifs/"]')).toBeVisible();
  await page.setViewportSize(MOBILE);
  await page.screenshot({ path: `${SCREENSHOTS}/m35-home-mobile.png` });
  await preview.scrollIntoViewIfNeeded();
  await preview.screenshot({ path: `${SCREENSHOTS}/m35-prices-mobile.png` });
  await preview.locator('a[href="/tarifs/"]').click();
  await expect(page).toHaveURL(/\/tarifs\/$/);
});
