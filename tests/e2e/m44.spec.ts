import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

// Fixed bottom bar: away while the header buttons are on screen, back once they scroll out, away again at the top.
test("m44: mobile bottom bar hides while the top buttons are visible", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const bar = page.getByRole("navigation", { name: "Appeler ou réserver" });
  await expect(bar).toBeHidden();
  await page.mouse.wheel(0, 1500);
  await expect(bar).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/m44-mobile-bar.png` });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bar).toBeHidden();
});
