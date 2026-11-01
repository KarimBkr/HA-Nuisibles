import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import { test, expect, SCREENSHOTS, MOBILE, DESKTOP, resolveFile } from "./serve";
import { servicesNav } from "../../src/config/navigation";

const OUT = path.resolve(__dirname, "../../out");
const htmlFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? htmlFiles(path.join(dir, d.name)) : d.name.endsWith(".html") ? [path.join(dir, d.name)] : [],
  );
const SERVICE_HREFS = servicesNav.map((l) => l.href).filter((h) => h !== "/nos-services/");
const CALENDAR = 'iframe[src*="calendar.google.com/calendar/appointments/schedules/"]';
const KEY_PAGES: Record<string, string> = {
  home: "/",
  service: "/deratisation-lyon-2/",
  prix: "/prix-deratisation/",
  blog: "/conseils-nuisibles/",
  post: "/comment-se-debarrasser-des-rats-solutions-efficaces/",
  contact: "/contact/",
  "rendez-vous": "/rendez-vous/",
  "404": "/page-qui-n-existe-pas/",
};
const isNotFound = (page: Page) => page.getByText(/page introuvable|404/i).first().isVisible().catch(() => false);
const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test("journeys: mobile service page → call button and booking → Google Calendar", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/cafards-restaurant-intervention-rapide-discrete-lyon/");
  await expect(page.locator('a[href="tel:+33764464691"]:visible').first()).toBeVisible();
  const booking = page.locator('a[href="/rendez-vous/"]:visible').first();
  await expect(booking).toBeVisible();
  await booking.click();
  await expect(page).toHaveURL(/\/rendez-vous\/$/);
  await expect(page.locator(CALENDAR)).toHaveCount(1);
});

test("journeys: quote form on /contact/#mon-devis sends and confirms", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const calls: unknown[] = [];
  await page.route("https://api.web3forms.com/**", (route) => {
    calls.push(route.request().postDataJSON());
    route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
  });
  await page.goto("/contact/#mon-devis");
  await page.fill("#q-nom", "Durand");
  await page.fill("#q-prenom", "Paul");
  await page.fill("#q-email", "paul@example.fr");
  await page.fill("#q-telephone", "0612345678");
  await page.selectOption("#q-service", { index: 1 });
  await page.fill("#q-message", "Cafards dans la cuisine du restaurant.");
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("[data-quote-success]")).toBeVisible();
  expect(calls).toHaveLength(1);
});

test("journeys: blog index → post → service page", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/conseils-nuisibles/");
  await page.locator("[data-post-card] h2 a, [data-post-card] h3 a").first().click();
  await expect(page.locator("h1")).toHaveCount(1);
  const sel = SERVICE_HREFS.map((h) => `main a[href="${h}"]`).join(", ");
  const link = page.locator(sel).first();
  await expect(link).toBeAttached();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await isNotFound(page)).toBe(false);
});

test("journeys: desktop services dropdown and mobile burger menu", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const menu = page.locator("#menu-services");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Nos services" }).click();
  await expect(menu).toBeVisible();
  await expect(menu.locator("a")).toHaveCount(servicesNav.length);
  await menu.locator('a[href="/depigeonnage/"]').click();
  await expect(page).toHaveURL(/\/depigeonnage\/$/);
  await expect(page.locator("h1")).toHaveCount(1);

  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const burger = page.locator("#menu-mobile");
  await expect(burger).toBeVisible();
  await burger.locator('a[href="/contact/"]').click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("journeys: every exported page has one H1, no dead internal link, no img without alt", () => {
  const badH1: string[] = [];
  const dead = new Set<string>();
  const noAlt: string[] = [];
  for (const f of htmlFiles(OUT)) {
    const rel = path.relative(OUT, f);
    const html = fs.readFileSync(f, "utf8");
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) badH1.push(`${rel} (${h1})`);
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="/.test(img)) noAlt.push(rel);
    for (const [, href] of html.matchAll(/href="(\/[^"#]*)/g)) {
      if (href.startsWith("//") || href.startsWith("/_next/")) continue;
      if (!resolveFile(href)) dead.add(`${rel} → ${href}`);
    }
  }
  expect(badH1).toEqual([]);
  expect([...dead]).toEqual([]);
  expect(noAlt).toEqual([]);
});

test("journeys: no horizontal overflow at 360 px for key pages", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 }); // REQUIREMENTS: no horizontal scroll at 360 px
  const over: string[] = [];
  for (const url of Object.values(KEY_PAGES)) {
    await page.goto(url);
    const px = await overflow(page);
    if (px > 0) over.push(`${url} +${px}px`);
  }
  expect(over).toEqual([]);
});

test("journeys: screenshots", async ({ page }) => {
  test.setTimeout(180_000);
  for (const [vp, size] of [["desktop", DESKTOP], ["mobile", MOBILE]] as const) {
    await page.setViewportSize(size);
    for (const [name, url] of Object.entries(KEY_PAGES)) {
      await page.goto(url);
      await page.waitForLoadState("load");
      await page.screenshot({ path: `${SCREENSHOTS}/journey-${name}-${vp}.png`, fullPage: true });
    }
  }
});
