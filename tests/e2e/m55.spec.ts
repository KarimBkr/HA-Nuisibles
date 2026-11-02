import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";
import { maxWordsPerScreen, contentStickies, WIDE } from "./desktop";

// M55 blog, article, zones, city, legal and 404 on desktop: no overflow from 1280 to 1920, no sticky outside the city card,
// ≤ 120 words per screen (≤ 200 on reading text: article and legal), category chips on one row, cards of one ratio,
// reading column ≤ 720 px.
const ARTICLE = "/combien-de-temps-dure-une-deratisation/";
const CALM = ["/conseils-nuisibles/", "/zones-d-intervention/", "/deratisation-villeurbanne/", "/page-introuvable-m55/"];
const READING = [ARTICLE, "/mentions-legales/"];

test("m55: blog, article, zones, city, legal and 404 are calm on desktop", async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize(DESKTOP);
  await page.goto("/conseils-nuisibles/");
  const category = (await page.locator("[data-blog-chips] a").first().getAttribute("href"))!;

  for (const size of [{ width: 1280, height: 800 }, DESKTOP, { width: 1600, height: 900 }, WIDE]) {
    await page.setViewportSize(size);
    for (const url of [...CALM, ...READING, category]) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${url} @${size.width}`).toBeLessThanOrEqual(0);
      expect((await contentStickies(page)).length, `${url} @${size.width}`).toBeLessThanOrEqual(url.includes("villeurbanne") ? 1 : 0);
      if (size.width === 1280 || size.width === 1600) continue;
      const { max, screens } = await maxWordsPerScreen(page, url.includes("villeurbanne") ? "[data-service-hero]" : "");
      const budget = READING.includes(url) ? 200 : 120;
      expect(max, `${url} ${size.width} words per screen ${screens.join(",")}`).toBeLessThanOrEqual(budget);
    }
  }

  await page.setViewportSize(DESKTOP);
  for (const url of ["/conseils-nuisibles/", category]) {
    await page.goto(url);
    const tops = await page.locator("[data-blog-chips] a").evaluateAll((as) => as.map((a) => Math.round(a.getBoundingClientRect().top)));
    expect(new Set(tops).size, `${url} chips on one row`).toBe(1);
    const ratios = await page.locator("[data-post-card] img").evaluateAll((imgs) => imgs.map((i) => (i.clientWidth / i.clientHeight).toFixed(2)));
    expect(new Set(ratios).size, `${url} card ratios ${ratios.join(",")}`).toBe(1);
  }
  await page.goto("/conseils-nuisibles/");
  await page.screenshot({ path: `${SCREENSHOTS}/m55-blog-desktop.png` });

  for (const url of READING) {
    await page.goto(url);
    expect((await page.locator("[data-reading]").boundingBox())!.width, url).toBeLessThanOrEqual(720);
  }
  await page.goto(ARTICLE);
  await page.locator("[data-reading]").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m55-article-desktop.png` });
  await page.goto("/zones-d-intervention/");
  await page.screenshot({ path: `${SCREENSHOTS}/m55-zones-desktop.png`, fullPage: true });
});
