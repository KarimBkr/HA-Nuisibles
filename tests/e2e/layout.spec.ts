import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

for (const [name, viewport] of [["desktop", DESKTOP], ["mobile", MOBILE]] as const) {
  test(`layout ${name}: booking and call links visible`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator('a[href="/rendez-vous/"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="tel:+33764464691"]:visible').first()).toBeVisible();
    await expect(page.locator("footer")).toContainText("Mentions légales");
    await page.screenshot({ path: `${SCREENSHOTS}/layout-${name}.png`, fullPage: true });
  });
}

test("layout desktop: services dropdown opens and closes with the keyboard", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const button = page.getByRole("button", { name: "Nos services" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#menu-services")).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/layout-dropdown.png` });
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-services")).toBeHidden();
});

test("layout mobile: burger opens with Enter and closes with Escape", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const burger = page.locator('button[aria-controls="menu-mobile"]');
  await expect(page.locator("#menu-mobile")).toBeHidden();
  await burger.focus();
  await page.keyboard.press("Enter");
  await expect(burger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#menu-mobile")).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/layout-burger.png` });
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-mobile")).toBeHidden();
  await expect(burger).toBeFocused();
});

test("layout 360 px: no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});
