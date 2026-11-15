import { test, expect, SCREENSHOTS, MOBILE, DESKTOP, resolveFile } from "./serve";
import { SERVICES } from "../../src/config/services";

// M67: no new local page (no city beyond Lyon/Villeurbanne has 400 real words, SEO_MAP §2); the zones hub lists every
// service × city with links to the real pages, states what is covered elsewhere, and shows the Bron/Caluire cases.
test("m67: zones hub matrix of cities × services", async ({ page }) => {
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    await page.goto("/zones-d-intervention/");
    await expect(page.locator("h1")).toHaveCount(1);
    const rows = page.locator("[data-zone-matrix] [data-zone-service]");
    await expect(rows).toHaveCount(SERVICES.length);
    await expect(page.locator('[data-zone-service="deratisation"] a[aria-label="Dératisation à Lyon"]')).toHaveAttribute("href", "/deratisation-lyon-2/");
    await expect(page.locator('[data-zone-service="deratisation"] a[aria-label="Dératisation à Villeurbanne"]')).toHaveAttribute("href", "/deratisation-villeurbanne/");
    await expect(page.locator("[data-zone-matrix]")).toContainText("Hors Lyon et Villeurbanne");
    for (const href of await page.locator("[data-zone-matrix] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
      expect(resolveFile(href), href).not.toBeNull();
    await page.locator("[data-zone-cases] summary").click();
    await expect(page.locator("[data-zone-cases]")).toContainText("Caluire-et-Cuire");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.locator("[data-zone-matrix]").screenshot({ path: `${SCREENSHOTS}/m67-zones-matrix-${size.width}.png` });
  }
});
