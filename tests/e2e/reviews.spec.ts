import fs from "node:fs";
import path from "node:path";
import { test, expect } from "./serve";

const OUT = path.resolve(__dirname, "../../out");

// Built without NEXT_PUBLIC_GOOGLE_REVIEW_URL: reviews as text on home + service pages, no button, no rating markup anywhere.
test("reviews: shown on home and service pages, no aggregateRating, no review button", async ({ page }) => {
  for (const url of ["/", "/deratisation-lyon-2/", "/entreprise-punaises-de-lit-lyon/"]) {
    await page.goto(url);
    const block = page.locator("[data-reviews]");
    await expect(block).toHaveCount(1);
    await expect(block.getByText("Note clients : 5/5 – 16 avis")).toBeVisible();
    await expect(block.locator("figure")).toHaveCount(3);
    await expect(page.locator("[data-review-link], [data-reviews-more]")).toHaveCount(0);
  }
  const html = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? html(path.join(dir, d.name)) : d.name.endsWith(".html") ? [path.join(dir, d.name)] : []));
  expect(html(OUT).filter((f) => fs.readFileSync(f, "utf8").includes("aggregateRating"))).toEqual([]);
});
