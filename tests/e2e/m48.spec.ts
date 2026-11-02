import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

// M48: one header, nav and footer on every page type (home, service, city, zones, prices, legal, blog, post, 404).
const PAGES = [
  "/",
  "/deratisation-lyon-2/",
  "/deratisation-villeurbanne/",
  "/zones-d-intervention/",
  "/tarifs/",
  "/mentions-legales/",
  "/conseils-nuisibles/",
  "/combien-de-temps-dure-une-deratisation/",
  "/page-introuvable-m48/",
];
const AXE = require.resolve("axe-core/axe.min.js");

test("m48 desktop: same nav, two buttons and 3 numbered footer columns everywhere; axe clean", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize(DESKTOP);
  for (const url of PAGES) {
    await page.goto(url);
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.locator(":scope > ul > li > a, :scope > ul > li > button"), url).toHaveText(["Services", "Tarifs", "Conseils", "Contact"]);
    const actions = page.locator("body > header [data-top-actions] a:visible");
    await expect(actions, url).toHaveCount(2);
    await expect(actions.nth(0)).toHaveAttribute("href", "tel:+33764464691");
    await expect(actions.nth(1)).toHaveAttribute("href", "/rendez-vous/");
    await expect(page.locator("footer h2:visible"), url).toHaveText([/01.*Contact$/, /02.*Services$/, /03.*Tarifs$/]);
    await expect(page.locator('footer a[href="/zones-d-intervention/"]:visible'), url).toHaveCount(1);
    // No text under 16 px in the header and footer (client).
    const small = await page.$$eval("body > header a:visible, body > header button:visible, footer a, footer p, footer li, footer summary", (els) =>
      els.filter((e) => e.getClientRects().length && parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => e.textContent?.trim()),
    );
    expect(small, url).toEqual([]);
    await page.addScriptTag({ path: AXE });
    const serious = await page.evaluate(async () => {
      // @ts-expect-error axe is injected above
      const r = await window.axe.run({ include: [["body > header"], ["footer"]] }, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] });
      return r.violations.filter((v: { impact: string }) => v.impact === "serious" || v.impact === "critical").map((v: { id: string }) => v.id);
    });
    expect(serious, url).toEqual([]);
  }
  await page.goto("/deratisation-villeurbanne/");
  await page.getByRole("button", { name: "Services" }).click();
  await page.screenshot({ path: `${SCREENSHOTS}/m48-dropdown-desktop.png` });
  await page.keyboard.press("Escape");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("footer").screenshot({ path: `${SCREENSHOTS}/m48-footer-desktop.png` });
});

test("m48 mobile: footer starts with contact, lists folded, 44 px targets", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const url of ["/", "/mentions-legales/", "/zones-d-intervention/"]) {
    await page.goto(url);
    const footer = page.locator("footer");
    const cols = footer.locator("[data-footer-col]");
    const tops = await cols.evaluateAll((els) => els.map((e) => [e.getAttribute("data-footer-col"), e.getBoundingClientRect().top] as const));
    tops.sort((a, b) => a[1] - b[1]);
    expect(tops.map((t) => t[0]), url).toEqual(["Contact", "Services", "Tarifs"]);
    await expect(footer.locator('a[href="tel:+33764464691"]:visible')).toHaveCount(1);
    await expect(footer.locator('a[href="/deratisation-lyon-2/"]:visible')).toHaveCount(0);
    const tiny = await footer.locator("a:visible, summary:visible").evaluateAll((els) =>
      els.filter((e) => e.getBoundingClientRect().height < 44).map((e) => e.textContent?.trim()),
    );
    expect(tiny, url).toEqual([]);
  }
  await page.locator("footer summary", { hasText: "Services" }).click();
  await expect(page.locator('footer a[href="/deratisation-lyon-2/"]:visible')).toHaveCount(1);
  await page.locator("footer").screenshot({ path: `${SCREENSHOTS}/m48-footer-mobile.png` });
});
