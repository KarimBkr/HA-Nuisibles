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
