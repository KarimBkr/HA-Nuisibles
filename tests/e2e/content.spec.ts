import fs from "node:fs";
import path from "node:path";
import inventory from "../../content/url-inventory.json";
import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

const OUT = path.resolve(__dirname, "../../out");
const OWN = ["/", "/contact/", "/conseils-nuisibles/"];

test("content: every old page and post is exported at its old URL, plus a 404", () => {
  const served = inventory.filter((i) => (i.type === "page" || i.type === "post") && !OWN.includes(i.path));
  expect(served).toHaveLength(69);
  for (const { path: p } of served) expect(fs.existsSync(path.join(OUT, p, "index.html")), p).toBe(true);
  expect(fs.existsSync(path.join(OUT, "404.html"))).toBe(true);
});

test("content: FAQ accordion opens with the keyboard", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/prix-deratisation/");
  await expect(page.locator("h1")).toHaveCount(1);
  const button = page.locator("#faq-q-0");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#faq-a-0")).toBeHidden();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-a-0")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("content: prix-deratisation mobile", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/prix-deratisation/");
  await expect(page.locator("h1")).toContainText("dératisation");
  await expect(page.locator('a[href="/rendez-vous/"]:visible').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/content-prix-deratisation-mobile.png`, fullPage: true });
});

test("content: post layout desktop", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/avis-eradication-nuisibles-deratisation-lyon/");
  await expect(page.locator("time")).toHaveAttribute("datetime", "2025-06-17");
  await expect(page.getByRole("heading", { name: "À lire aussi" })).toBeVisible();
  // Full-page captures do not scroll, so lazy images would stay blank.
  await page.evaluate(() => document.querySelectorAll("img").forEach((img) => (img.loading = "eager")));
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${SCREENSHOTS}/content-post-desktop.png`, fullPage: true });
});

// M25: contact, blog and content pages share the short header (PageHero): one H1, no overflow at 360 px.
const NARROW = { width: 360, height: 780 };
for (const [url, shot] of [
  ["/contact/", "m25-contact-360"],
  ["/conseils-nuisibles/", "m25-blog-360"],
  ["/avis-eradication-nuisibles-deratisation-lyon/", "m25-post-360"],
  ["/prix-deratisation/", ""],
  ["/mentions-legales/", ""],
] as const) {
  test(`m25: ${url} short header at 360 px`, async ({ page }) => {
    await page.setViewportSize(NARROW);
    await page.goto(url);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-page-hero]")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(NARROW.width);
    const actions = page.locator("[data-page-hero] [data-hero-actions]");
    if (["/mentions-legales/", "/conseils-nuisibles/"].includes(url) || url.startsWith("/avis-")) await expect(actions).toHaveCount(0);
    else await expect(actions.locator('a[href^="tel:"]')).toBeInViewport();
    if (url === "/contact/") {
      // Call/booking first, then the form, then the coordinates.
      const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y;
      expect(await y("[data-hero-actions]")).toBeLessThan(await y("#mon-devis"));
      expect(await y("#mon-devis")).toBeLessThan(await y("aside"));
    }
    if (url.startsWith("/avis-")) {
      const cta = page.locator("[data-post-service]");
      await expect(cta.locator('a[href="/deratisation-lyon-2/"]')).toHaveText(/dératisation à Lyon/);
      await expect(cta.locator('a[href="/rendez-vous/#deratisation"]')).toHaveCount(1);
    }
    if (shot) await page.screenshot({ path: `${SCREENSHOTS}/${shot}.png` });
  });
}

// M26: zones hub links every real local page; service pages link their own local pages and the hub.
test("m26: zones hub and service↔zone links", async ({ page }) => {
  await page.setViewportSize(NARROW);
  await page.goto("/zones-d-intervention/");
  await expect(page.locator("h1")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(NARROW.width);
  await expect(page.locator("[data-zone-city] a")).toHaveCount(10);
  await expect(page.locator('[data-zone-city="lyon"] a[href="/deratisation-lyon-2/"]')).toHaveText(/Dératisation Lyon/);
  await page.screenshot({ path: `${SCREENSHOTS}/m26-zones-360.png`, fullPage: true });
  await page.goto("/deratisation-lyon-2/");
  const zone = page.locator("[data-zone-block]");
  await expect(zone.locator('a[href="/deratisation-villeurbanne/"]')).toHaveText(/Dératisation Villeurbanne/);
  await expect(zone.locator('a[href="/deratisation-lyon-2/"]')).toHaveCount(0);
  await expect(zone.locator('a[href="/zones-d-intervention/"]')).toHaveCount(1);
});
