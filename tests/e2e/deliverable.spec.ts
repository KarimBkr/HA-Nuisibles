import fs from "node:fs";
import path from "node:path";
import { test, expect, MOBILE } from "./serve";

// Runs only against the delivery folder: SERVE_ROOT=deliverable npx playwright test deliverable
const ROOT = path.resolve(__dirname, "../../deliverable");
test.skip(process.env.SERVE_ROOT !== "deliverable", "delivery folder check only");

test("deliverable: Apache config and the real form key", () => {
  const htaccess = fs.readFileSync(path.join(ROOT, ".htaccess"), "utf8");
  expect(htaccess).toContain("ErrorDocument 404 /404.html");
  const js = fs.readdirSync(path.join(ROOT, "_next/static/chunks"), { recursive: true })
    .map((f) => path.join(ROOT, "_next/static/chunks", String(f)))
    .filter((f) => f.endsWith(".js"))
    .map((f) => fs.readFileSync(f, "utf8")).join("");
  expect(js).not.toContain("check-placeholder-key");
});

for (const [url, h1] of [
  ["/", /Dératisation à Lyon/],
  ["/deratisation-lyon-2/", /Dératisation à Lyon/],
  ["/rendez-vous/", /Prendre rendez-vous en ligne/],
  ["/contact/", /Contactez HA Nuisibles/],
] as const) {
  test(`deliverable: ${url} renders`, async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const res = await page.goto(url);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1);
    await expect(page.locator('a[href="tel:+33764464691"]').first()).toBeAttached();
  });
}
