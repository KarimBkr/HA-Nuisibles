import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

const bar = (page: import("@playwright/test").Page) => page.locator("nav.mobile-bar:visible");

for (const [url, name] of [["/deratisation-lyon-2/", "service"], ["/avis-eradication-nuisibles-deratisation-lyon/", "blog"], ["/", "home"]] as const) {
  test(`m33: ${name} page, one button set: bar hidden at top, shown after scroll`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(url);
    await expect(page.locator("[data-top-actions] a[href^='tel:']").first()).toBeInViewport();
    await expect(bar(page)).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(bar(page)).toHaveCount(1);
    await expect(bar(page).locator("a[href^='tel:']")).toBeInViewport();
    if (name === "service") await page.screenshot({ path: `${SCREENSHOTS}/m33-service-scrolled.png` });
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(bar(page)).toHaveCount(0);
  });
}
