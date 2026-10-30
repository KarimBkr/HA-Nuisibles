import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

const SLUGS = [
  "deratisation-lyon-2",
  "deratisation-villeurbanne",
  "entreprise-punaises-de-lit-lyon",
  "punaise-de-lit-a-villeurbanne",
  "desinsectisation-lyon-2",
  "desinsectisation-villeurbanne",
  "destruction-nid-guepes-frelons",
  "nid-guepes-frelons-lyon",
  "nid-guepes-frelons-villeurbanne",
  "nid-de-guepes-villeurbanne",
];

test("services: rich pages have the hero, booking and call CTAs", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  for (const slug of SLUGS) {
    await page.goto(`/${slug}/`);
    const hero = page.locator("[data-service-hero]");
    await expect(hero.locator("h1"), slug).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(hero.locator('a[href="/rendez-vous/"]'), slug).toBeVisible();
    await expect(hero.locator('a[href="tel:+33764464691"]'), slug).toBeVisible();
    await expect(page.locator("#zone"), slug).toBeVisible();
  }
});

test("services: deratisation-lyon-2 desktop", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  await expect(page.locator("#tarifs")).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/service-deratisation-desktop.png`, fullPage: true });
});

test("services: deratisation-lyon-2 mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/deratisation-lyon-2/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/service-deratisation-mobile.png`, fullPage: true });
});
