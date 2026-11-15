import { test, expect, SCREENSHOTS, MOBILE, DESKTOP, resolveFile } from "./serve";
import { SECTOR_PAGES, sectorRows } from "../../src/config/sectors";

// M70: sectors hub + every sector page (stakes, method, organisation, cases, grid price, booking, FAQ, links that resolve).
test("m70: sectors hub and sector pages", async ({ page }) => {
  await page.goto("/nos-services/");
  await expect(page.locator('a[href="/professionnels/"]')).toHaveCount(1);
  await page.goto("/professionnels/");
  for (const s of SECTOR_PAGES) await expect(page.locator(`[data-sector-hub] a[href="/professionnels/${s.slug}/"]`)).toHaveCount(1);
  await page.screenshot({ path: `${SCREENSHOTS}/m70-hub-${DESKTOP.width}.png` });
  for (const s of SECTOR_PAGES) {
    for (const size of [MOBILE, DESKTOP]) {
      await page.setViewportSize(size);
      await page.goto(`/professionnels/${s.slug}/`);
      await expect(page.locator("h1")).toHaveText(s.h1);
      await expect(page.locator(`[data-sector="${s.slug}"] li`)).toHaveCount(s.stakes.length + s.method.length + s.organisation.length + s.cases.length + sectorRows(s).length);
      await expect(page.locator("[data-sector-price]")).toContainText("Déplacement");
      await expect(page.locator(`a[href="/rendez-vous/#${s.service}"]`).first()).toBeVisible();
      for (const href of await page.locator("[data-sector-links] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
        expect(resolveFile(href), href).not.toBeNull();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      if (s.slug === "restaurants") await page.screenshot({ path: `${SCREENSHOTS}/m70-sector-${size.width}.png`, fullPage: size === DESKTOP });
    }
  }
});
