import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS } from "./serve";

const OUT = path.resolve(__dirname, "../../out");
const REVIEW = "https://g.page/r/CRjoESu5nUf_EBM/review";
const PROFILE = "https://share.google/9NDSqUKEzPx1YSs3D";

// M77 (client, 2026-11-25): 42 Google reviews everywhere, the review button on home, /avis/, service pages and footer; no average rating, no rating markup.
test("reviews: 42 reviews and the Google review button on home, /avis/ and service pages; profile in footer", async ({ page }) => {
  for (const url of ["/", "/avis/", "/deratisation-lyon-2/", "/entreprise-punaises-de-lit-lyon/"]) {
    await page.goto(url);
    const block = page.locator("[data-reviews]");
    await expect(block).toHaveCount(1);
    await expect(block.locator("[data-review-count]")).toHaveText("42 avis Google");
    await expect(block.locator("figure")).toHaveCount(3);
    await expect(block.locator("[data-review-link]")).toHaveAttribute("href", REVIEW);
    await expect(block.locator("[data-review-link]")).toHaveAttribute("target", "_blank");
    // The footer holds its contact block twice (phone fold + desktop column): every copy links right.
    const links = page.locator("footer [data-review-link]");
    expect(await links.count()).toBeGreaterThan(0);
    for (const l of await links.all()) await expect(l).toHaveAttribute("href", REVIEW);
    expect(await page.locator(`footer a[href="${PROFILE}"]`).count()).toBeGreaterThan(0);
  }
  const html = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? html(path.join(dir, d.name)) : d.name.endsWith(".html") ? [path.join(dir, d.name)] : []));
  const pages = html(OUT).map((f) => [f, fs.readFileSync(f, "utf8")] as const);
  expect(pages.filter(([, s]) => /aggregateRating|16 avis|Note clients|5★|(?<![,.\d])5\/5\b/.test(s)).map(([f]) => path.relative(OUT, f))).toEqual([]);
  const home = pages.find(([f]) => f === path.join(OUT, "index.html"))![1];
  expect(home).toContain(`"sameAs":[`);
  expect(home).toMatch(new RegExp(`"sameAs":\\[[^\\]]*${PROFILE.replace(/[./]/g, "\\$&")}`));
});

test("reviews: screenshots of the home reviews block and the footer (phone and desktop)", async ({ page }) => {
  for (const [w, h, tag] of [[390, 844, "mobile"], [1366, 900, "desktop"]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/");
    await page.locator("[data-reviews]").screenshot({ path: `${SCREENSHOTS}/reviews-home-${tag}.png` });
    await page.locator("footer").screenshot({ path: `${SCREENSHOTS}/reviews-footer-${tag}.png` });
  }
});
