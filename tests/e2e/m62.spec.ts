import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";
import { TARIFFS, COMMON_ROWS, serviceRows } from "../../src/config/tariffs";
import type { ServiceKey } from "../../src/config/services";

// M62 tester pass: grid amounts everywhere a price table/list is shown, 1 h booking journey, overflow, axe, screenshots.
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "out");
const AXE = require.resolve("axe-core/axe.min.js");
const CAL = "https://cal.com/ha-nuisibles/";
const KEYS = ["deratisation", "punaises-de-lit", "desinsectisation", "guepes-frelons", "depigeonnage", "demoustication", "desinfection", "urgence-dimanche"];

const AMOUNT = /\d+(?:[.,]\d+)?\s*€(?:\s*(?:HT|TTC))?(?:\s*\/\s*(?:m²|boîte))?/g;
const norm = (a: string) => a.replace(/\s*\/\s*/, "/").replace(/\s+/g, " ").trim();
const amountsOf = (rows: { price: string; condition?: string }[]) =>
  new Set(rows.flatMap((r) => [r.price, r.condition ?? ""].flatMap((t) => (t.match(AMOUNT) ?? []).map(norm))));
const ALL = amountsOf(TARIFFS.flatMap((c) => c.rows));

// Page → service from the content frontmatter; pages without one (home, /tarifs/, posts) may show any grid amount.
const SERVICE: Record<string, ServiceKey> = {};
for (const f of fs.readdirSync(path.join(ROOT, "content/pages"))) {
  const m = fs.readFileSync(path.join(ROOT, "content/pages", f), "utf8").match(/^service:\s*"([^"]+)"/m);
  if (m) SERVICE[f.replace(/\.md$/, "")] = m[1] as ServiceKey;
}
const PRICE_PAGES = [
  "",
  ...fs.readdirSync(OUT).filter((d) => !d.startsWith("_") && d !== "404" && fs.existsSync(path.join(OUT, d, "index.html")) && fs.readFileSync(path.join(OUT, d, "index.html"), "utf8").includes("€")),
];
// Real bug (BUGS.md M62): an old-site price table inside a FAQ answer is not replaced by the grid (alignPrices only reads the body).
const KNOWN_FAQ_TABLE = "desinsectisation-villeurbanne";

/** Euro amounts of every price table, grid row, sheet, home preview and « Nos tarifs » list in <main>. */
async function priceAmounts(page: import("@playwright/test").Page) {
  return page.evaluate((src) => {
    const re = new RegExp(src, "g");
    const sel = "main table, main [data-tariff-row], main [data-tariff-info], main [data-sheet], main [data-home='prices'], main section[aria-labelledby='tarifs'] li";
    return [...document.querySelectorAll(sel)].flatMap((el) => (el.textContent ?? "").replace(/\s+/g, " ").match(re) ?? []);
  }, AMOUNT.source);
}

test("m62: every amount in a price table or price list is a grid amount of that page's service", async ({ page }) => {
  test.setTimeout(240_000);
  const bad: string[] = [];
  for (const slug of PRICE_PAGES.filter((s) => s !== KNOWN_FAQ_TABLE)) {
    const svc = SERVICE[slug];
    if (svc && !serviceRows(svc).length) continue; // désinfection, démoustication: no grid row, their text stays (plan M60)
    const allowed = svc ? amountsOf([...serviceRows(svc), ...COMMON_ROWS]) : ALL;
    await page.goto(`/${slug ? slug + "/" : ""}`);
    for (const a of await priceAmounts(page)) if (!allowed.has(norm(a))) bad.push(`/${slug}: ${a}`);
  }
  expect(bad).toEqual([]);
});

test("m62: /desinsectisation-villeurbanne/ FAQ price table shows the grid (no « 70 € TTC », « 3 € / m² »)", async ({ page }) => {
  await page.goto(`/${KNOWN_FAQ_TABLE}/`);
  const allowed = amountsOf([...serviceRows("desinsectisation"), ...COMMON_ROWS]);
  expect((await priceAmounts(page)).filter((a) => !allowed.has(norm(a)))).toEqual([]);
});

test("m62: /tarifs/ and the home preview show every grid amount and no HT/TTC label", async ({ page }) => {
  await page.goto("/tarifs/");
  const main = await page.locator("main").innerText();
  for (const a of ALL) expect(main.replace(/\s*\/\s*/g, "/")).toContain(a);
  expect(main).not.toMatch(/€\s*(HT|TTC)/);
  await page.goto("/");
  expect(await page.locator('[data-home="prices"]').innerText()).not.toMatch(/HT|TTC/);
});

for (const [name, vp] of [["mobile", MOBILE], ["desktop", DESKTOP]] as const) {
  test(`m62: booking, each of the 8 options → its Cal.com page, 1 h only (${name})`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/rendez-vous/");
    const wizard = page.locator("[data-wizard]");
    const rows = wizard.locator("section li button");
    await expect(rows).toHaveCount(KEYS.length);
    for (const [i, key] of KEYS.entries()) {
      await expect(rows.nth(i)).toBeVisible();
      await expect(rows.nth(i)).toContainText(/(?<!\d)1 h(?!\w)/);
      await rows.nth(i).click();
      await expect(page).toHaveURL(new RegExp(`/rendez-vous/#${key}$`));
      await expect(page.locator("iframe")).toHaveAttribute("src", CAL + key);
      await expect(page.locator("[data-recap] dd").nth(1)).toHaveText("1 h");
      // No other duration anywhere in the booking UI (« sous 24h » is a response delay, not a slot length).
      const text = (await wizard.innerText()).replace(/sous 24\s?h/gi, "");
      expect(text.match(/\d+\s?(?:h\b|heures?|min\b|minutes)/gi) ?? [], key).toEqual(["1 h"]);
      await page.getByRole("button", { name: "Changer de problème" }).click();
      await expect(page).toHaveURL(/\/rendez-vous\/$/);
    }
  });
}

test("m62: booking deep links keep the step across back/forward", async ({ page }) => {
  await page.goto("/rendez-vous/#deratisation");
  await expect(page.locator("iframe")).toHaveAttribute("src", CAL + "deratisation");
  await page.evaluate(() => (location.hash = "guepes-frelons"));
  await expect(page.locator("iframe")).toHaveAttribute("src", CAL + "guepes-frelons");
  await page.goBack();
  await expect(page.locator("iframe")).toHaveAttribute("src", CAL + "deratisation");
  await page.goForward();
  await expect(page.locator("iframe")).toHaveAttribute("src", CAL + "guepes-frelons");
});

// Real bug (BUGS.md M62): choose() uses history.replaceState, so Back on step 2 leaves /rendez-vous/ instead of returning to step 1.
test("m62: browser Back on step 2 returns to step 1 of the wizard", async ({ page }) => {
  await page.goto("/tarifs/");
  await page.goto("/rendez-vous/");
  await page.locator("[data-wizard] section li button").first().click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/rendez-vous\/$/);
  await expect(page.locator("[data-wizard] section li button")).toHaveCount(KEYS.length);
});

test("m62: the booking wizard works with the keyboard alone", async ({ page }) => {
  await page.goto("/rendez-vous/");
  const first = page.locator("[data-wizard] section li button").first();
  for (let i = 0; i < 60 && !(await first.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter"); // 2nd option
  await expect(page.locator("iframe")).toHaveAttribute("src", CAL + KEYS[1]);
  await expect(page.locator("#etape-titre")).toBeFocused();
  const change = page.getByRole("button", { name: "Changer de problème" });
  for (let i = 0; i < 60 && !(await change.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(change).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-wizard] section li button")).toHaveCount(KEYS.length);
  await expect(page.locator("#etape-titre")).toBeFocused();
});

test("m62: no horizontal overflow at 360/390/1366/1920", async ({ page }) => {
  test.setTimeout(120_000);
  const bad: string[] = [];
  for (const width of [360, 390, 1366, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const url of ["/", "/tarifs/", "/rendez-vous/", "/rendez-vous/#punaises-de-lit", "/deratisation-lyon-2/", "/entreprise-punaises-de-lit-lyon/", "/destruction-nid-guepes-frelons/", "/desinsectisation-villeurbanne/"]) {
      await page.goto(url);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) bad.push(`${url} @${width}: ${sw}`);
    }
  }
  expect(bad).toEqual([]);
});

test("m62: axe finds no serious/critical violation on /tarifs/ and /rendez-vous/ (both steps)", async ({ page }) => {
  test.setTimeout(120_000);
  const found: string[] = [];
  for (const [label, vp] of [["mobile", MOBILE], ["desktop", DESKTOP]] as const) {
    await page.setViewportSize(vp);
    for (const url of ["/tarifs/", "/rendez-vous/", "/rendez-vous/#deratisation"]) {
      await page.goto(url);
      await page.addScriptTag({ path: AXE });
      const v = await page.evaluate(async () => {
        // @ts-expect-error axe is injected above
        const r = await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] });
        return r.violations.map((x: { impact: string; id: string; nodes: { target: string[] }[] }) => `${x.impact} ${x.id} ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
      });
      found.push(...v.map((x: string) => `${label} ${url} ${x}`));
    }
  }
  fs.writeFileSync(path.join(ROOT, ".athanor/.verif/m62-axe.txt"), found.join("\n"));
  expect(found.filter((x) => / (serious|critical) /.test(x))).toEqual([]);
});

test("m62: screenshots /tarifs/ and /rendez-vous/ at 390 and 1366", async ({ page }) => {
  for (const [w, vp] of [["390", MOBILE], ["1366", DESKTOP]] as const) {
    await page.setViewportSize(vp);
    await page.goto("/tarifs/");
    await page.screenshot({ path: `${SCREENSHOTS}/m62-tarifs-${w}.png`, fullPage: true });
    await page.goto("/rendez-vous/");
    await page.screenshot({ path: `${SCREENSHOTS}/m62-rdv-${w}.png`, fullPage: true });
    await page.goto("/rendez-vous/#punaises-de-lit");
    await page.screenshot({ path: `${SCREENSHOTS}/m62-rdv-step2-${w}.png` });
  }
});
