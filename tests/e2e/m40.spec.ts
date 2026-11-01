import { test, expect, SCREENSHOTS, DESKTOP, resolveFile } from "./serve";

// M40 tester pass: edge cases of the Phase F pages (M34-M39) not covered by m34-m39 specs.
const SMALL = { width: 360, height: 740 };
const PAGES = ["/", "/deratisation-lyon-2/", "/rendez-vous/#deratisation", "/tarifs/"];

test("m40: no horizontal overflow at 360px on home, a service page, booking and prices", async ({ page }) => {
  await page.setViewportSize(SMALL);
  for (const url of PAGES) {
    await page.goto(url);
    const over = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > w + 1 && getComputedStyle(e).visibility !== "hidden")
        .slice(0, 3)
        .map((e) => `${e.tagName}.${(e as HTMLElement).className}`.slice(0, 80));
      return { scroll: document.documentElement.scrollWidth - w, wide };
    });
    expect(over.scroll, `${url} overflows: ${over.wide.join(" | ")}`).toBeLessThanOrEqual(0);
  }
  await page.goto("/deratisation-lyon-2/");
  await page.screenshot({ path: `${SCREENSHOTS}/m40-service-360.png` });
  await page.goto("/tarifs/");
  await page.screenshot({ path: `${SCREENSHOTS}/m40-tarifs-360.png`, fullPage: true });
});

test("m40: services dropdown works from the keyboard and Escape closes it", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const btn = page.getByRole("navigation", { name: "Navigation principale" }).getByRole("button", { name: "Services" });
  await btn.focus();
  await page.keyboard.press("Enter");
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  const first = page.locator("#menu-services a").first();
  await expect(first).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#menu-services")).toBeHidden();
  await btn.focus();
  await page.keyboard.press(" ");
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await page.locator("main").click({ position: { x: 5, y: 5 } });
  await expect(page.locator("#menu-services")).toBeHidden();
});

test("m40: every tel: link on the Phase F pages is tel:+33764464691", async ({ page }) => {
  for (const url of PAGES) {
    await page.goto(url);
    const hrefs = await page.locator('a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs.length, url).toBeGreaterThan(0);
    for (const h of hrefs) expect(h, url).toBe("tel:+33764464691");
  }
});

test("m40: footer details toggle open and closed on mobile", async ({ page }) => {
  await page.setViewportSize(SMALL);
  await page.goto("/");
  const details = page.locator("footer details");
  const n = await details.count();
  expect(n).toBeGreaterThanOrEqual(2);
  for (let i = 0; i < n; i++) {
    const d = details.nth(i);
    await expect(d).not.toHaveAttribute("open", "");
    await d.locator("summary").click();
    await expect(d).toHaveAttribute("open", "");
    await expect(d.locator("a").first()).toBeVisible();
    await d.locator("summary").click();
    await expect(d.locator("a").first()).toBeHidden();
  }
});

test("m40: header and footer internal links of the home page resolve to a built page", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("header a[href^='/'], footer a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
  expect(hrefs.length).toBeGreaterThan(15);
  const broken = hrefs.filter((h) => !resolveFile(new URL(h, "http://x").pathname));
  expect(broken).toEqual([]);
});

test("m40: home heading and mobile menu both buttons reachable", async ({ page }) => {
  await page.setViewportSize(SMALL);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Quel nuisible vous pose problème ?" })).toBeVisible();
  await expect(page.locator("header a[href^='tel:']").first()).toBeVisible();
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.locator('#menu-mobile a[href="/rendez-vous/"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-mobile")).toBeHidden();
  await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
});

test("m40: only the M42 font faces ship (Poppins 400/500, Instrument Serif 400 + italic)", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const faces = await page.evaluate(() => [...new Set([...document.fonts].map((f) => `${f.family.replace(/"/g, "")} ${f.weight} ${f.style}`))].sort());
  expect(faces).toEqual(["Instrument Serif 400 italic", "Instrument Serif 400 normal", "Poppins 400 normal", "Poppins 500 normal"]);
});

test("m40: /tarifs/ shows the from-prices before the detail links", async ({ page }) => {
  await page.goto("/tarifs/");
  await expect(page.locator("[data-from-prices] li")).toHaveCount(4);
  await expect(page.locator("[data-from-prices]")).toContainText("À partir de 150 € TTC");
});
