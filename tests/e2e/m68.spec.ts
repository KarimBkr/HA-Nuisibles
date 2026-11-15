import { test, expect, SCREENSHOTS, MOBILE, DESKTOP, resolveFile } from "./serve";
import { PEST_PAGES } from "../../src/config/pests";
import { TARIFFS } from "../../src/config/tariffs";

// M68: pests hub + 4 pest pages (signs, risks, method, grid price, booking, FAQ, service/city/article links that resolve).
test("m68: pests hub and pest pages", async ({ page }) => {
  await page.goto("/nos-services/");
  await expect(page.locator('a[href="/nuisibles/"]')).toHaveCount(1);
  await page.goto("/nuisibles/");
  for (const p of PEST_PAGES) await expect(page.locator(`[data-pest-hub] a[href="/nuisibles/${p.slug}/"]`)).toHaveCount(1);
  for (const p of PEST_PAGES) {
    for (const size of [MOBILE, DESKTOP]) {
      await page.setViewportSize(size);
      await page.goto(`/nuisibles/${p.slug}/`);
      await expect(page.locator("h1")).toHaveText(p.h1);
      await expect(page.locator(`[data-pest="${p.slug}"] li`)).toHaveCount(p.signs.length + p.risks.length + p.treatment.length + TARIFFS.find((c) => c.title === p.tariff)!.rows.length + 2);
      await expect(page.locator("[data-pest-price]")).toContainText("Déplacement");
      await expect(page.locator(`a[href="/rendez-vous/#${p.service}"]`).first()).toBeVisible();
      for (const href of await page.locator("[data-pest-links] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
        expect(resolveFile(href), href).not.toBeNull();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      if (p.slug === "rats-souris") await page.screenshot({ path: `${SCREENSHOTS}/m68-pest-${size.width}.png`, fullPage: size === MOBILE ? false : true });
    }
  }
  await page.goto("/nuisibles/");
  await page.screenshot({ path: `${SCREENSHOTS}/m68-hub-${DESKTOP.width}.png` });
});
