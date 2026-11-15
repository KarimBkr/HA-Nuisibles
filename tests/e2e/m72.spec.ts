import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";

// M72: a local page links its city's other services and the same service in the other city; a post's aside links
// its service page and its city page. Depth, orphans and anchor variety are audited over out/ (tests/seo-audit.test.ts).
test("m72: local page and post internal links", async ({ page }) => {
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    await page.goto("/deratisation-villeurbanne/");
    const local = page.locator("[data-local-links]");
    for (const href of ["/desinsectisation-villeurbanne/", "/punaise-de-lit-a-villeurbanne/", "/nuisibles-villeurbanne/", "/deratisation-lyon-2/"])
      await expect(local.locator(`a[href="${href}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await local.screenshot({ path: `${SCREENSHOTS}/m72-local-links-${size.width}.png` });

    await page.goto("/rats-villeurbanne-deratisation-intervention-24h/");
    const aside = page.locator("[data-post-service]");
    await expect(aside.locator('a[href="/deratisation-lyon-2/"]')).toHaveCount(1);
    await expect(aside.locator('a[href="/deratisation-villeurbanne/"]')).toHaveCount(1);
    await aside.screenshot({ path: `${SCREENSHOTS}/m72-post-aside-${size.width}.png` });
  }
});
