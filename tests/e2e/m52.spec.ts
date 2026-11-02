import links from "./home-links.json";
import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";
import { maxWordsPerScreen, contentStickies } from "./desktop";

// M52 home desktop: one column — hero band (text left, portrait right), then numbered sections at the same width;
// ≤ 120 words per 1366×900 screen, ≥ 96 px between sections, no sticky, every link of the old home still there.
test("m52: desktop home is one calm column with the same links", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const hero = page.locator('[data-home="hero"]');
  await expect(hero.getByRole("link", { name: "Prendre rendez-vous" })).toBeInViewport();
  await expect(hero.locator('a[href^="tel:"]')).toBeInViewport();
  const h1 = await hero.locator("h1").boundingBox();
  const img = await hero.locator("img").boundingBox();
  expect(img!.x).toBeGreaterThan(h1!.x + h1!.width); // portrait right of the text
  expect(await contentStickies(page)).toEqual([]);
  await page.screenshot({ path: `${SCREENSHOTS}/m52-home-desktop.png` });

  // Sections share the hero's column and keep ≥ 96 px of padding above their content.
  const boxes = await page.evaluate(() =>
    ["solutions", "method", "prices", "testimonials"].map((k) => {
      const el = document.querySelector(`[data-home="${k}"]`)!;
      return { k, x: el.getBoundingClientRect().x, pad: parseFloat(getComputedStyle(el).paddingTop) };
    }),
  );
  const heroX = (await hero.boundingBox())!.x;
  for (const b of boxes) {
    expect(Math.abs(b.x - heroX), b.k).toBeLessThanOrEqual(1);
    expect(b.pad, b.k).toBeGreaterThanOrEqual(96);
  }

  const { max, screens } = await maxWordsPerScreen(page);
  expect(max, `words per screen ${screens.join(",")}`).toBeLessThanOrEqual(120);

  const now = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")!))].sort());
  expect(now).toEqual(links);
  await page.locator('[data-home="prices"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m52-home-desktop-scrolled.png` });
});
