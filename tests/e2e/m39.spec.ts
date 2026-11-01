import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

// M39 competitor gaps: problem-first services heading, what a price includes next to the prices.
test("m39: problem-first services heading and price inclusions on home and service pages", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Quel nuisible vous pose problème ?" })).toBeVisible();
  const prices = page.locator('[data-home="prices"]');
  await expect(prices).toContainText("rapport d’intervention, second passage si nécessaire et garantie de résultat");
  await prices.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m39-home-prices-mobile.png` });
  await page.goto("/deratisation-villeurbanne/");
  await expect(page.locator('section[aria-labelledby="tarifs"]')).toContainText("second passage si nécessaire");
});
