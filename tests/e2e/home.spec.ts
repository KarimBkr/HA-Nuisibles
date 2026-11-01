import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

for (const [name, viewport] of [["desktop", DESKTOP], ["mobile", MOBILE]] as const) {
  test(`home ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("section[data-home]")).toHaveCount(8);
    await expect(page.locator('a[href="tel:+33764464691"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="/rendez-vous/"]:visible').first()).toBeVisible();
    await expect(page.locator('main a[href="/nos-services/"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    // Load the lazy images before the full-page screenshot.
    await page.evaluate(() => document.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
    await expect.poll(() => page.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0))).toBe(true);
    await page.screenshot({ path: `${SCREENSHOTS}/home-${name}.png`, fullPage: true });
  });
}

test("home hero image is preloaded and the service cards lead to their pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="preload"][as="image"][imagesrcset*="/images/deratisation-annemasse.webp 1200w"]')).toHaveCount(1);
  await page.locator('[data-home="solutions"] a', { hasText: "Punaises de lit" }).click();
  await expect(page).toHaveURL(/\/entreprise-punaises-de-lit-lyon\/$/);
});

test("home FAQ opens with the keyboard", async ({ page }) => {
  await page.goto("/");
  const q = page.locator('[data-home="faq"] button').first();
  await q.focus();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "true");
});

test("unknown URL shows the 404 page", async ({ page }) => {
  const res = await page.goto("/cette-page-n-existe-pas/");
  expect(res?.status()).toBe(404);
});
