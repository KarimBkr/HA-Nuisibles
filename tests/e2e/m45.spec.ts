import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

// M45 service pages as an « intervention sheet »: height budget at 390 px, one H1, JSON-LD kept, sticky sheet on desktop.
const SLUGS = ["deratisation-lyon-2", "deratisation-villeurbanne", "entreprise-punaises-de-lit-lyon", "punaise-de-lit-a-villeurbanne",
  "desinsectisation-lyon-2", "desinsectisation-villeurbanne", "destruction-nid-guepes-frelons", "nid-guepes-frelons-lyon",
  "nid-guepes-frelons-villeurbanne", "nid-de-guepes-villeurbanne", "demoustication", "depigeonnage", "desinfection"];

test("m45: service sheets fit 6 screens at 390 px, one H1, Service JSON-LD", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const slug of SLUGS) {
    await page.goto(`/${slug}/`);
    expect(await page.evaluate(() => document.documentElement.scrollHeight), slug).toBeLessThanOrEqual(6 * MOBILE.height + 120); // M81: + one « À lire » article row (D-M81)
    expect(await page.evaluate(() => document.documentElement.scrollWidth), slug).toBeLessThanOrEqual(MOBILE.width);
    await expect(page.locator("h1")).toHaveCount(1);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((t) => t.includes('"Service"')), slug).toBe(true);
    await expect(page.locator("[data-sheet] dd").first(), slug).toHaveText(/dès \d+ €|sur devis/);
  }
  await page.goto("/destruction-nid-guepes-frelons/");
  await expect(page.locator("[data-sheet]")).toContainText("dès 110 €");
  await expect(page.locator("[data-sheet]")).toContainText("1 h");
  await expect(page.locator('[data-sheet] a[href="/rendez-vous/#guepes-frelons"]')).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/m45-service-mobile.png`, fullPage: true });
});

test("m45: desktop sheet stays in view while the content scrolls", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  await page.screenshot({ path: `${SCREENSHOTS}/m45-service-desktop.png` });
  await page.locator("#zone").scrollIntoViewIfNeeded();
  const box = await page.locator('[data-sheet] a[href^="tel:"]').boundingBox();
  expect(box && box.y >= 0 && box.y + box.height <= DESKTOP.height).toBe(true);
  await page.screenshot({ path: `${SCREENSHOTS}/m45-service-desktop-scrolled.png` });
});
