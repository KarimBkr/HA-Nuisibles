import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

// M46: contact, blog, prices hub and 404 in the « dossier » vocabulary: serif H1, numbered sections, one dark block at most.
const PAGES = [
  ["/contact/", "m46-contact"],
  ["/conseils-nuisibles/", "m46-blog"],
  ["/avis-eradication-nuisibles-deratisation-lyon/", "m46-post"],
  ["/tarifs/", "m46-tarifs"],
  ["/page-qui-n-existe-pas/", "m46-404"],
] as const;

for (const [url, shot] of PAGES) {
  test(`m46: ${url} editorial header, one dark block`, async ({ page }) => {
    for (const [vp, suffix] of [[MOBILE, "mobile"], [DESKTOP, "desktop"]] as const) {
      await page.setViewportSize(vp);
      await page.goto(url);
      const h1 = page.locator("h1");
      await expect(h1).toHaveCount(1);
      expect(await h1.evaluate((e) => getComputedStyle(e).fontFamily)).toContain("Instrument Serif");
      expect(await page.locator("main .bg-forest").count()).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(vp.width);
      await page.screenshot({ path: `${SCREENSHOTS}/${shot}-${suffix}.png` });
    }
  });
}

test("m46: contact shows the phone in large and the booking before the form", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/contact/");
  const tel = page.locator('[data-page-hero] a[href="tel:+33764464691"]');
  await expect(tel).toBeInViewport();
  expect(parseFloat(await tel.evaluate((e) => getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(40);
  const booking = page.locator('[data-page-hero] a[href="/rendez-vous/"]');
  await expect(booking).toBeInViewport();
  expect((await booking.boundingBox())!.y).toBeLessThan((await page.locator("#mon-devis").boundingBox())!.y);
});

test("m46: prices hub reads as leader rows linking to the price pages", async ({ page }) => {
  await page.goto("/tarifs/");
  await expect(page.locator('[data-from-prices] a[href="/prix-deratisation/"]')).toContainText("À partir de 150 € TTC");
  expect(await page.locator('nav[aria-labelledby="detail"] li a').count()).toBeGreaterThanOrEqual(4);
});
