import fs from "node:fs";
import path from "node:path";
import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

const OUT = path.resolve(__dirname, "../../out");
const htmlFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? htmlFiles(path.join(dir, d.name)) : d.name.endsWith(".html") ? [path.join(dir, d.name)] : [],
  );

test("booking: every built page links to /rendez-vous/", () => {
  const missing = htmlFiles(OUT).filter((f) => !fs.readFileSync(f, "utf8").includes('href="/rendez-vous/"'));
  expect(missing.map((f) => path.relative(OUT, f))).toEqual([]);
});

test("booking: page intro and fallback without a configured URL", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  await expect(page.locator("h1")).toHaveText("Prendre rendez-vous en ligne");
  await expect(page.getByText("Créneaux d'intervention d'1 h")).toBeVisible();
  const fallback = page.locator("[data-booking-fallback]");
  // The check builds without NEXT_PUBLIC_BOOKING_URL; the embedded case is covered by tests/unit/booking.test.ts.
  await expect(fallback).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(fallback.locator('a[href="tel:+33764464691"]')).toBeVisible();
  await expect(fallback.locator('a[href="/contact/#mon-devis"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/booking-mobile.png`, fullPage: true });
});
