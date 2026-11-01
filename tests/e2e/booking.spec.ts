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

test("booking: no 1-hour intervention claim, booking hours only on /rendez-vous/", () => {
  const files = htmlFiles(OUT);
  const text = (f: string) => fs.readFileSync(f, "utf8").replace(/<[^>]+>/g, " ");
  const claim = /(intervention|créneau|rendez-vous)\s+d[’']\s*(1\s*h\b|une heure)/i;
  expect(files.filter((f) => claim.test(text(f))).map((f) => path.relative(OUT, f))).toEqual([]);
  const withSchedule = files.filter((f) => text(f).includes("Lundi au samedi : 9h – 18h")).map((f) => path.relative(OUT, f));
  expect(withSchedule).toEqual(["rendez-vous/index.html"]);
});

test("booking: pick a service, then its Cal.com page loads", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  await expect(page.locator("h1")).toHaveText("Prendre rendez-vous en ligne");
  await expect(page.getByText("Durée adaptée à chaque intervention")).toBeVisible();
  const iframe = page.locator('iframe[src^="https://cal.com/ha-nuisibles/"]');
  await expect(iframe).toHaveCount(0); // third-party iframe only after a choice
  await page.getByRole("button", { name: /Dératisation/ }).click();
  await expect(iframe).toHaveAttribute("src", "https://cal.com/ha-nuisibles/deratisation");
  await expect(page.locator("[data-booking-fallback]")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.screenshot({ path: `${SCREENSHOTS}/booking-mobile.png`, fullPage: true });
});

test("booking: a service page deep-links to its own agenda", async ({ page }) => {
  await page.goto("/rendez-vous/#punaises-de-lit");
  await expect(page.locator('iframe[src="https://cal.com/ha-nuisibles/punaises-de-lit"]')).toHaveCount(1);
});
