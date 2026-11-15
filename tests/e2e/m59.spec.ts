import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS } from "./serve";
import { WIDE } from "./desktop";
import { TARIFFS, TARIFFS_EDITION } from "../../src/config/tariffs";
import { SERVICES } from "../../src/config/services";

// M59: /tarifs/ is the official grid: every row with its exact price, diagnostic and travel first, 1 h next to each booking link.
test("m59: every row of the official grid is on /tarifs/", async ({ page }) => {
  await page.goto("/tarifs/");
  const main = page.locator("main");
  await expect(main).toContainText(TARIFFS_EDITION);
  const info = page.locator("[data-tariff-info]");
  await expect(info).toContainText(/Diagnostic\s*Gratuit/);
  await expect(info).toContainText(/Déplacement\s*70 €/);
  for (const c of TARIFFS.filter((c) => c.service)) {
    const group = page.locator(`[data-price-group="${c.title}"]`);
    const rows = group.locator("[data-tariff-row]");
    await expect(rows).toHaveCount(c.rows.length);
    for (const [i, r] of c.rows.entries()) {
      const row = rows.nth(i);
      await expect(row).toBeVisible();
      for (const t of [r.price, r.condition, r.treatment, r.label === c.title && r.treatment ? undefined : r.label])
        if (t) await expect(row).toContainText(t);
    }
    const svc = SERVICES.find((s) => s.key === c.service)!;
    await expect(group.locator(`h2 a[href="/${svc.mainSlug}/"]`)).toHaveCount(1);
    await expect(group.locator(`a[href="/rendez-vous/#${c.service}"]`)).toHaveCount(1);
    await expect(group).toContainText("Durée : 1 h");
  }
  // Links resolve: each service page and the booking page exist in the export.
  for (const href of new Set(await main.locator("a[href^='/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")!.split("#")[0])))) {
    expect(fs.existsSync(path.resolve(__dirname, "../../out", `.${href}`, "index.html")), href).toBe(true);
  }
});

test("m59: /tarifs/ has no horizontal overflow, screenshots", async ({ page }) => {
  for (const [vp, name] of [[{ width: 360, height: 780 }, "mobile"], [{ width: 1366, height: 768 }, "1366"], [WIDE, "1920"]] as const) {
    await page.setViewportSize(vp);
    await page.goto("/tarifs/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth), name).toBeLessThanOrEqual(vp.width);
    if (name !== "1366") await page.screenshot({ path: `${SCREENSHOTS}/m59-tarifs-${name}.png`, fullPage: true });
  }
});
