import { test, expect, SCREENSHOTS, MOBILE, DESKTOP, resolveFile } from "./serve";
import data from "../../content/reviews.json";
import { site } from "../../src/config/site";

// M71: trust pages (about, guarantees, reviews), reachable from every footer, links that resolve, no overflow; update date on posts.
test("m71: trust pages", async ({ page }) => {
  await page.goto("/");
  for (const href of ["/a-propos/", "/garanties/", "/avis/"]) await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    for (const slug of ["a-propos", "garanties", "avis"]) {
      await page.goto(`/${slug}/`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(`[data-trust="${slug}"]`)).toBeVisible();
      for (const href of await page.locator("main a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
        expect(resolveFile(href.split("#")[0]), href).not.toBeNull();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `${SCREENSHOTS}/m71-${slug}-${size.width}.png`, fullPage: size === DESKTOP });
    }
  }
  await page.goto("/a-propos/");
  await expect(page.locator("[data-nap]")).toContainText(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
  await expect(page.locator("main")).toContainText("Tous nos techniciens sont Certibiocide");
  await page.goto("/garanties/");
  for (const t of ["30 jours", "3 mois minimum", "6 mois", "jusqu'à 12 mois", "3 semaines", "ne couvre pas"]) await expect(page.locator("main")).toContainText(t);
  await page.goto("/avis/");
  await expect(page.locator("[data-reviews] figure")).toHaveCount(Math.min(3, data.items.length));
  await expect(page.locator("[data-reviews]")).toContainText(`${data.rating.score} – ${data.rating.count}`);
  // A post whose update date is later than its publication shows both.
  await page.goto("/combien-de-temps-dure-une-deratisation/");
  await expect(page.locator("time[data-updated]")).toHaveAttribute("datetime", "2025-10-08");
  await expect(page.locator("main")).toContainText("Mis à jour le");
});
