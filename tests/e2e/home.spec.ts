import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

for (const [name, viewport] of [["desktop", DESKTOP], ["mobile", MOBILE]] as const) {
  test(`home ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('a[href="tel:+33764464691"]').first()).toBeVisible();
    await expect(page.locator('a[href="/rendez-vous/"]').first()).toBeVisible();
    await page.screenshot({ path: `${SCREENSHOTS}/home-${name}.png`, fullPage: true });
  });
}

test("unknown URL shows the 404 page", async ({ page }) => {
  const res = await page.goto("/cette-page-n-existe-pas/");
  expect(res?.status()).toBe(404);
});
