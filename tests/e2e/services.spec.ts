import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

const SLUGS = [
  "deratisation-lyon-2",
  "deratisation-villeurbanne",
  "entreprise-punaises-de-lit-lyon",
  "punaise-de-lit-a-villeurbanne",
  "desinsectisation-lyon-2",
  "desinsectisation-villeurbanne",
  "destruction-nid-guepes-frelons",
  "nid-guepes-frelons-lyon",
  "nid-guepes-frelons-villeurbanne",
  "nid-de-guepes-villeurbanne",
];

test("services: rich pages have the hero, booking and call CTAs", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  for (const slug of SLUGS) {
    await page.goto(`/${slug}/`);
    const hero = page.locator("[data-service-hero]");
    await expect(hero.locator("h1"), slug).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(hero.locator('a[href^="/rendez-vous/"]'), slug).toBeVisible();
    await expect(hero.locator('a[href="tel:+33764464691"]'), slug).toBeVisible();
    await expect(page.locator("#zone"), slug).toBeVisible();
  }
});

test("services: mobile hero shows H1 and both buttons above the fold; long sections fold", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const slug of SLUGS) {
    await page.goto(`/${slug}/`);
    const hero = page.locator("[data-service-hero]");
    for (const sel of ["h1", 'a[href^="/rendez-vous/"]', 'a[href="tel:+33764464691"]']) {
      const box = await hero.locator(sel).first().boundingBox();
      expect(box && box.y + box.height, `${slug} ${sel}`).toBeLessThanOrEqual(MOBILE.height);
    }
    // Prices (when any) and FAQ come before the folded old-site sections.
    const order = await page.evaluate(() => ["#tarifs", "#faq-titre", "[data-sections]"].map((s) => document.querySelector(s)?.getBoundingClientRect().top ?? null));
    const present = order.filter((y): y is number => y !== null);
    expect(present, slug).toEqual([...present].sort((a, b) => a - b));
    const details = page.locator("[data-sections] details");
    expect(await details.count(), slug).toBeGreaterThan(0);
    await expect(details.first().locator("summary h2")).toBeVisible();
    expect(await details.first().getAttribute("open"), slug).toBeNull();
  }
  await page.goto("/deratisation-lyon-2/");
  const first = page.locator("[data-sections] details").first();
  await first.locator("summary").click();
  await expect(first.locator(".prose-body").first()).toBeVisible();
});

test("services: punaises de lit Lyon mobile and desktop", async ({ page }) => {
  for (const [vp, name] of [[MOBILE, "mobile"], [DESKTOP, "desktop"]] as const) {
    await page.setViewportSize(vp);
    await page.goto("/entreprise-punaises-de-lit-lyon/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(vp.width);
    await page.screenshot({ path: `${SCREENSHOTS}/service-punaises-${name}.png`, fullPage: true });
  }
});

test("services: deratisation-lyon-2 desktop", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  await expect(page.locator("#tarifs")).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/service-deratisation-desktop.png`, fullPage: true });
});

test("services: deratisation-lyon-2 mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/deratisation-lyon-2/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/service-deratisation-mobile.png`, fullPage: true });
});

test("services: every pest page is reachable from the header dropdown via the hub", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  expect(await page.locator('header a[href="/nos-services/"]').count()).toBeGreaterThan(0);
  await page.goto("/nos-services/");
  await expect(page.locator("h1")).toHaveCount(1);
  const links = await page.locator("[data-pests] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  expect(links.length).toBeGreaterThanOrEqual(11);
  for (const href of links) {
    await page.goto(href);
    await expect(page.locator("[data-service-hero] h1"), href).toBeVisible();
  }
});

test("services: hub mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/nos-services/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/nos-services-mobile.png`, fullPage: true });
});

test("services: the hero photo is not repeated in the intro", async ({ page }) => {
  for (const slug of SLUGS) {
    await page.goto(`/${slug}/`);
    const src = await page.locator("[data-service-hero] img").first().getAttribute("src");
    if (!src) continue;
    const name = src.split("/").pop()!.split(".")[0];
    const repeats = await page.locator(`main img[src*="${name}"]:not([data-service-hero] img)`).evaluateAll((els) => els.filter((e) => !e.closest("details") && !e.closest("[data-service-hero]")).length);
    expect(repeats, slug).toBe(0);
  }
});
