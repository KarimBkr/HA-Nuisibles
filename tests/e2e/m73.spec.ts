import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";

// M73: useful 404, hub FAQs, and the LCP of the main templates measured locally (report .athanor/.verif/lcp.txt).
// shortcut: local LCP (in-process serving, no network latency) only catches render-blocking regressions; field data comes from Search Console.
const LCP_BUDGET = 2500;
const LCP_PAGES = ["/", "/deratisation-lyon-2/", "/nuisibles/punaises-de-lit/", "/tarifs/", "/rats-villeurbanne-deratisation-intervention-24h/"];

test("m73: 404 links to services, prices, booking and phone", async ({ page }) => {
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    await page.goto("/page-qui-n-existe-pas/");
    const main = page.locator("main");
    for (const href of ["/nos-services/", "/tarifs/", "/rendez-vous/", "tel:+33764464691", "/deratisation-lyon-2/"]) await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `${SCREENSHOTS}/m73-404-${size.width}.png`, fullPage: true });
  }
});

test("m73: hub FAQ answers", async ({ page }) => {
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    await page.goto("/tarifs/");
    const q = page.getByRole("button", { name: "Le diagnostic est-il payant ?" });
    await q.click();
    await expect(page.getByText("Non, le diagnostic est gratuit.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await q.locator("xpath=ancestor::section[1]").screenshot({ path: `${SCREENSHOTS}/m73-tarifs-faq-${size.width}.png` });
  }
});

test("m73: LCP of the main templates stays under budget", async ({ page }) => {
  const rows: string[] = [];
  for (const size of [MOBILE, DESKTOP]) {
    await page.setViewportSize(size);
    for (const url of LCP_PAGES) {
      await page.goto(url, { waitUntil: "load" });
      const lcp = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            new PerformanceObserver((list) => {
              const e = list.getEntries();
              resolve(e[e.length - 1].startTime);
            }).observe({ type: "largest-contentful-paint", buffered: true });
            setTimeout(() => resolve(-1), 3000);
          }),
      );
      rows.push(`${Math.round(lcp)} ms  ${size.width}px  ${url}`);
      expect(lcp, `${url} at ${size.width}px`).toBeGreaterThan(0);
      expect(lcp, `${url} at ${size.width}px`).toBeLessThanOrEqual(LCP_BUDGET);
    }
  }
  fs.writeFileSync(path.resolve(__dirname, "../../.athanor/.verif/lcp.txt"), [`LCP (local, budget ${LCP_BUDGET} ms)`, ...rows, ""].join("\n"));
});
