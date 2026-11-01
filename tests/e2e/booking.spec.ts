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

test("booking: page intro and the client's Google Calendar embed", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  await expect(page.locator("h1")).toHaveText("Prendre rendez-vous en ligne");
  await expect(page.getByText("Créneaux d'intervention d'1 h")).toBeVisible();
  // The client's schedule is the default (site.ts); the fallback case is covered by tests/unit/booking.test.ts.
  const iframe = page.locator('iframe[src*="calendar.google.com/calendar/appointments/schedules/"]');
  await expect(iframe).toHaveCount(1);
  await expect(page.locator("[data-booking-fallback]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/booking-mobile.png`, fullPage: true });
});
