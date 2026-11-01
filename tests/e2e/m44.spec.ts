import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";

// M44 home desktop: sticky left column (triage, call, booking, hours) beside the scrolling file; text ≤ 60 ch.
test("m44: desktop home keeps the triage column in view while the file scrolls", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const hero = page.locator('[data-home="hero"]');
  await expect(hero.getByRole("link", { name: "Prendre rendez-vous" })).toBeVisible();
  await expect(hero.locator('a[href^="tel:"]')).toBeVisible();
  const services = await page.locator('[data-home="solutions"]').boundingBox();
  const heroBox = await hero.boundingBox();
  expect(services!.x).toBeGreaterThan(heroBox!.x + heroBox!.width); // two columns side by side
  expect(heroBox!.height).toBeLessThanOrEqual(DESKTOP.height); // the sticky column fits the screen
  await page.screenshot({ path: `${SCREENSHOTS}/m44-home-desktop.png` });
  await page.locator('[data-home="prices"]').scrollIntoViewIfNeeded();
  await expect(hero.getByRole("link", { name: "Prendre rendez-vous" })).toBeInViewport();
  const wide = await page.evaluate(() =>
    [...document.querySelectorAll("main p")]
      .filter((p) => {
        const r = document.createRange(); // width of the text lines, not of the block
        r.selectNodeContents(p);
        return p.checkVisibility() && r.getBoundingClientRect().width > 60 * parseFloat(getComputedStyle(p).fontSize) * 0.65;
      })
      .map((p) => p.textContent!.trim().slice(0, 30)),
  );
  expect(wide).toEqual([]);
  await page.screenshot({ path: `${SCREENSHOTS}/m44-home-desktop-scrolled.png` });
});

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
