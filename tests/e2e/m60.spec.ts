import { test, expect, SCREENSHOTS, MOBILE } from "./serve";
import { fromPrice, TARIFFS } from "../../src/config/tariffs";

// M60: home, service pages and old price pages show the official grid amounts, never the old-site ones.
const OLD = ["150 € TTC", "dès 150 €", "600€", "250 – 400 €", "entre 250 € et 450 € TTC"];

test("m60: home preview and services index read the grid", async ({ page }) => {
  await page.goto("/");
  const preview = page.locator('[data-home="prices"]');
  for (const t of [`dès ${fromPrice("deratisation")}`, `dès ${fromPrice("punaises-de-lit")}`, "110 €", "130 €"]) await expect(preview).toContainText(t);
  await expect(page.locator('[data-home="solutions"] a', { hasText: "Guêpes et frelons" })).toContainText("dès 110 €");
  for (const t of OLD) await expect(page.locator("main")).not.toContainText(t);
});

test("m60: a service page lists its grid rows and the common ones", async ({ page }) => {
  await page.goto("/destruction-nid-guepes-frelons/");
  await expect(page.locator("[data-sheet]")).toContainText("dès 110 €");
  const tarifs = page.locator('section[aria-labelledby="tarifs"]');
  for (const t of [/Guêpes\s*110\s€/, /Frelons\s*130\s€/, /Diagnostic\s*Gratuit/, /Déplacement\s*70\s€/]) await expect(tarifs).toContainText(t);
});

test("m60: old price pages show the grid table instead of the old amounts", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const [slug, title] of [["prix-traitement-punaise-de-lit", "Punaises de lit"], ["prix-deratisation", "Rats et souris"], ["tarif-desinsectisation-cafard-2026", "Blattes / Cafards"]]) {
    await page.goto(`/${slug}/`);
    const main = page.locator("main");
    for (const r of TARIFFS.find((c) => c.title === title)!.rows) await expect(main.locator("table").first()).toContainText(r.price);
    await expect(main.locator("table").first()).toContainText("70 €");
    for (const t of ["entre 250 € et 450 € TTC", "250 € - 350 €", "90 – 150 €", "273,00 €"]) await expect(main).not.toContainText(t);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: `${SCREENSHOTS}/m60-prix-cafard-360.png`, fullPage: false });
  await page.goto("/prix-traitement-punaise-de-lit/");
  await page.locator("main table").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m60-prix-punaises-table-360.png` });
});

test("m60: the narrowest sheet fits « dès 10 €/boîte » at 360 px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/deratisation-lyon-2/");
  const sheet = page.locator("[data-sheet]");
  await expect(sheet).toContainText("dès 10 €/boîte");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await sheet.screenshot({ path: `${SCREENSHOTS}/m60-sheet-deratisation-360.png` });
});
