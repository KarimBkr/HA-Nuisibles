import fs from "node:fs";
import path from "node:path";
import { test, expect, MOBILE, DESKTOP } from "./serve";

// axe-core scan (WCAG 2.1 A/AA) of 10 key pages, mobile and desktop: 0 serious/critical violation.
// Report: .athanor/.verif/a11y.txt (every violation, any impact).
const AXE = require.resolve("axe-core/axe.min.js");
const REPORT = path.resolve(__dirname, "../../.athanor/.verif/a11y.txt");
const PAGES = [
  "/",
  "/deratisation-lyon-2/",
  "/desinsectisation-lyon-2/",
  "/nos-services/",
  "/prix-deratisation/",
  "/conseils-nuisibles/",
  "/comment-se-debarrasser-des-rats-solutions-efficaces/",
  "/contact/",
  "/rendez-vous/",
  "/page-qui-n-existe-pas/",
];

type Violation = { id: string; impact: string | null; help: string; nodes: { target: string[] }[] };

test("a11y: axe-core finds no serious or critical violation on 10 key pages", async ({ page }) => {
  test.setTimeout(180_000);
  const lines: string[] = [];
  const blocking: string[] = [];
  for (const [label, viewport] of [["mobile", MOBILE], ["desktop", DESKTOP]] as const) {
    await page.setViewportSize(viewport);
    for (const url of PAGES) {
      await page.goto(url);
      await page.addScriptTag({ path: AXE });
      const violations: Violation[] = await page.evaluate(async () => {
        // @ts-expect-error axe is injected above
        const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
        return r.violations;
      });
      for (const v of violations) {
        const line = `${label} ${url} [${v.impact}] ${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`;
        lines.push(line);
        if (v.impact === "serious" || v.impact === "critical") blocking.push(line);
      }
    }
  }
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, (lines.length ? lines : ["no violation"]).join("\n") + "\n");
  expect(blocking).toEqual([]);
});
