import inventory from "../../content/url-inventory.json";
import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

const POSTS = inventory.filter((i) => i.type === "post").map((i) => i.path);
const CATEGORIES = inventory.filter((i) => i.type === "category").map((i) => i.path);

test("blog: the index pages link every post, pagination next/prev work", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/conseils-nuisibles/");
  await expect(page.locator("h1")).toHaveCount(1);
  const linked = new Set<string>();
  for (let n = 1; ; n++) {
    await expect(page.locator("[data-post-card]").first()).toBeVisible();
    expect(await page.locator("[data-post-card]").count()).toBeLessThanOrEqual(9);
    for (const href of await page.locator("[data-post-card] h2 a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) linked.add(href);
    const next = page.locator('[data-pagination] a[rel="next"]');
    if (!(await next.count())) break;
    await next.click();
    await expect(page).toHaveURL(new RegExp(`/conseils-nuisibles/page/${n + 1}/$`));
  }
  expect([...linked].sort()).toEqual([...POSTS].sort());
  await page.locator('[data-pagination] a[rel="prev"]').click();
  await expect(page.locator('[data-pagination] a[aria-current="page"]')).not.toHaveText("1");
});

test("blog: the 5 old category URLs list their posts", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  expect(CATEGORIES).toHaveLength(5);
  let total = 0;
  for (const path of CATEGORIES) {
    await page.goto(path);
    await expect(page.locator("h1"), path).toHaveCount(1);
    total += await page.locator("[data-post-card]").count();
  }
  expect(total).toBe(POSTS.length);
});

test("blog: a post links its category and a related service", async ({ page }) => {
  await page.goto("/rats-combles-elimination-infestation-reelle/");
  await expect(page.locator('main a[href^="/category/"]').first()).toBeVisible();
  await expect(page.locator('#services-lies ~ ul a[href="/deratisation-lyon-2/"]')).toBeVisible();
});

test("blog: index mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/conseils-nuisibles/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/blog-index-mobile.png`, fullPage: true });
});
