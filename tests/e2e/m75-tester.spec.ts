import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";

// M75 SEO review: pages added in M64–M73 at 390/1366 have no horizontal overflow, no console error,
// and no serious/critical axe-core violation. Full report: .athanor/.verif/m75-a11y.txt.
const AXE = require.resolve("axe-core/axe.min.js");
const REPORT = path.resolve(__dirname, "../../.athanor/.verif/m75-a11y.txt");
const LOCAL = ["/deratisation-lyon-2/", "/deratisation-villeurbanne/", "/desinsectisation-lyon-2/", "/desinsectisation-villeurbanne/", "/entreprise-punaises-de-lit-lyon/", "/nid-de-guepes-villeurbanne/", "/nid-guepes-frelons-lyon/", "/nid-guepes-frelons-villeurbanne/", "/nuisibles-villeurbanne/", "/punaise-de-lit-a-villeurbanne/", "/zones-d-intervention/"];
const PESTS = ["/nuisibles/", ...["cafards-blattes", "chenilles-processionnaires", "fourmis", "guepes-frelons", "mouches", "moustiques", "pigeons", "punaises-de-lit", "rats-souris"].map((p) => `/nuisibles/${p}/`)];
const SECTORS = ["/professionnels/", ...["commerces-bureaux", "hotels", "restaurants", "syndics-coproprietes-collectivites"].map((p) => `/professionnels/${p}/`)];
const OTHER = ["/a-propos/", "/garanties/", "/avis/", "/tarifs/", "/page-qui-n-existe-pas/"];
const SHOTS: Record<string, string> = { "/deratisation-villeurbanne/": "local", "/nuisibles/rats-souris/": "pest", "/professionnels/restaurants/": "sector" };

type Violation = { id: string; impact: string | null; help: string; nodes: { target: string[] }[] };

for (const [name, pages] of Object.entries({ local: LOCAL, pests: PESTS, sectors: SECTORS, other: OTHER })) {
  test(`m75: ${name} pages, no overflow and no serious axe violation at 390/1366`, async ({ page }) => {
    test.setTimeout(240_000);
    const lines: string[] = [];
    const failures: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`${page.url()} ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error" && !/404/.test(m.text())) errors.push(`${page.url()} ${m.text()}`); });
    for (const size of [MOBILE, DESKTOP]) {
      await page.setViewportSize(size);
      for (const url of pages) {
        await page.goto(url);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        if (over > 0) failures.push(`${size.width}px ${url} overflows by ${over}px`);
        await page.addScriptTag({ path: AXE });
        const violations: Violation[] = await page.evaluate(async () => {
          // @ts-expect-error axe is injected above
          const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
          return r.violations;
        });
        for (const v of violations) {
          const line = `${size.width}px ${url} [${v.impact}] ${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`;
          lines.push(line);
          if (v.impact === "serious" || v.impact === "critical") failures.push(line);
        }
        if (SHOTS[url]) await page.screenshot({ path: `${SCREENSHOTS}/m75-${SHOTS[url]}-${size.width}.png`, fullPage: true });
      }
    }
    fs.mkdirSync(path.dirname(REPORT), { recursive: true });
    fs.appendFileSync(REPORT, [`# ${name}`, ...(lines.length ? lines : ["no violation"]), ""].join("\n"));
    expect([...failures, ...errors]).toEqual([]);
  });
}
