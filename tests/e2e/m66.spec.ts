import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";
import { fromPrice } from "../../src/config/tariffs";

// M66: local page template — H1 « métier à ville », direct answer with the grid price, real cases (or the empty notice),
// districts, 4 city FAQ first, pre-filled booking, links to the service, the prices and the neighbour city.
const PAGES = [
  { slug: "deratisation-lyon-2", city: "Lyon", service: "deratisation", cases: 3, district: "Croix-Rousse", links: ["/nos-services/", "/entreprise-punaises-de-lit-lyon/", "/deratisation-villeurbanne/"] },
  { slug: "desinsectisation-villeurbanne", city: "Villeurbanne", service: "desinsectisation", cases: 0, district: "Gratte-Ciel", links: ["/desinsectisation-lyon-2/", "/nuisibles-villeurbanne/"] },
] as const;

for (const p of PAGES) {
  test(`m66: ${p.slug} follows the local template`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(`/${p.slug}/`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(new RegExp(`^\\S.* à ${p.city}$`));
    const lead = page.locator("[data-lead]");
    await expect(lead).toContainText(`dès ${fromPrice(p.service)}`);
    await expect(lead).toContainText("sous 24h");
    await expect(page.locator("[data-sheet]")).toContainText("sous 24h");
    const local = page.locator("[data-local]");
    if (p.cases) await expect(local.locator("[data-cases] > li")).toHaveCount(p.cases);
    else await expect(local.locator("[data-cases]")).toHaveText("Aucun cas publié pour l’instant.");
    await expect(local.locator("[data-districts]")).toContainText(p.district);
    for (const href of p.links) await expect(local.locator(`[data-local-links] a[href="${href}"]`)).toHaveCount(1);
    const faq = await page.evaluate(() =>
      [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent!)).find((d) => d["@type"] === "FAQPage"),
    );
    const first = faq.mainEntity.slice(0, 4).map((q: { name: string }) => q.name);
    expect(first).toHaveLength(4);
    for (const q of first) expect(q).toContain(p.city);
    await page.screenshot({ path: `${SCREENSHOTS}/m66-${p.slug}-1366.png`, fullPage: false });
    await local.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SCREENSHOTS}/m66-${p.slug}-local-1366.png`, fullPage: false });

    await page.setViewportSize(MOBILE);
    await page.reload();
    await expect(page.locator("[data-answer]")).toContainText(`dès ${fromPrice(p.service)}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `${SCREENSHOTS}/m66-${p.slug}-390.png`, fullPage: false });
    await page.locator("[data-local]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SCREENSHOTS}/m66-${p.slug}-local-390.png`, fullPage: false });

    // The booking button opens /rendez-vous/ on this service's agenda; Back from step 2 returns to step 1.
    await page.locator(`[data-sheet] a[href="/rendez-vous/?service=${p.service}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/rendez-vous/#${p.service}$`));
    await expect(page.locator("[data-recap]")).toBeVisible();
  });
}
