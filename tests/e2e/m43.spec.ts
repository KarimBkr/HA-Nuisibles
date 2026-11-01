import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

// M43 home mobile « dossier d'intervention »: height budget, legible text and thumb-sized targets at 390 px.
test("m43: mobile home fits 3 800 px, no text under 16 px, targets ≥ 44 px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(3800);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((el) => el.checkVisibility() && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
      .map((el) => `${el.tagName} « ${el.textContent!.trim().slice(0, 30)} »`),
  );
  expect(small).toEqual([]);
  const tiny = await page.evaluate(() =>
    [...document.querySelectorAll("main a, main button, main summary")]
      .filter((el) => el.checkVisibility() && !el.closest("p, .prose-body"))
      .filter((el) => el.getBoundingClientRect().height < 44)
      .map((el) => `${el.tagName} « ${el.textContent!.trim().slice(0, 30)} » ${Math.round(el.getBoundingClientRect().height)}px`),
  );
  expect(tiny).toEqual([]);
  // Portrait: descriptive alt, the preloaded LCP file.
  await expect(page.locator('[data-home="hero"] img')).toHaveAttribute("alt", "Technicien HA Nuisibles en intervention");
  // Index rows lead to their service pages with the from-price.
  await expect(page.locator('[data-home="solutions"] a', { hasText: "Dératisation" })).toContainText("dès 150 €");
  // Next review on tap; method detail on tap.
  const quote = page.locator('[data-home="testimonials"] figure:visible');
  const first = await quote.textContent();
  await page.getByRole("button", { name: "Avis suivant" }).click();
  await expect(quote).not.toHaveText(first!);
  await page.locator('[data-home="method"] summary').first().click();
  await expect(page.locator('[data-home="method"] details').first()).toHaveAttribute("open", "");
  await page.screenshot({ path: `${SCREENSHOTS}/m43-home-mobile.png`, fullPage: true });
});
