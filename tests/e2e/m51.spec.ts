import fs from "node:fs";
import path from "node:path";
import { test, expect, DESKTOP } from "./serve";
import { DESKTOP_PAGES, WIDE, maxWordsPerScreen, contentStickies } from "./desktop";

// M51: desktop baseline for the layout redesign. Every page type at 1366×900 and 1920×1080: no horizontal overflow,
// at most one sticky content column, header nav and footer present; words per screen recorded (budget enforced from M52 on).
test("m51 desktop baseline: overflow, stickies, header/footer, words per screen", async ({ page }) => {
  test.setTimeout(180_000);
  const report: string[] = [];
  for (const size of [DESKTOP, WIDE]) {
    await page.setViewportSize(size);
    for (const url of DESKTOP_PAGES) {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${url} @${size.width}`).toBeLessThanOrEqual(0);
      expect((await contentStickies(page)).length, `${url} @${size.width}`).toBeLessThanOrEqual(1);
      await expect(page.getByRole("navigation", { name: "Navigation principale" }), url).toBeVisible();
      await expect(page.locator("footer"), url).toHaveCount(1);
      const { max, screens } = await maxWordsPerScreen(page);
      report.push(`${size.width}x${size.height} ${url} max=${max} screens=${screens.join(",")}`);
    }
  }
  const out = path.resolve(__dirname, "../../.athanor/.verif/desktop-words.txt");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, report.join("\n") + "\n");
});
