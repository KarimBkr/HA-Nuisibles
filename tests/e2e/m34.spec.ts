import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";

// M34: simplified navigation (client plan item 3).
test("m34 nav: desktop header is Services ▾, Tarifs, Conseils, Contact; footer has 3 columns", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(nav.locator(":scope > ul > li > a, :scope > ul > li > button")).toHaveText(["Services", "Tarifs", "Conseils", "Contact"]);
  await expect(page.locator("#menu-services a")).toHaveCount(8);
  await nav.getByRole("link", { name: "Tarifs" }).click();
  await expect(page).toHaveURL(/\/tarifs\/$/);
  await expect(page.locator("main a[href='/prix-deratisation/']").last()).toBeVisible();
  const cols = page.locator("footer [data-footer-col]");
  await expect(cols).toHaveCount(3);
  await expect(page.locator("footer h2:visible")).toHaveText([/Contact$/, /Services$/, /Tarifs$/]);
  await expect(page.locator('footer a[href="/zones-d-intervention/"]:visible')).toHaveCount(1);
});

test("m34 nav: mobile burger folds services, footer lists fold", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu.locator('a[href="/depigeonnage/"]')).toBeHidden();
  await menu.locator("summary", { hasText: "Services" }).click();
  await expect(menu.locator('a[href="/depigeonnage/"]')).toBeVisible();
  await expect(menu.locator('a[href="/tarifs/"]')).toBeVisible();
  await page.screenshot({ path: `${SCREENSHOTS}/m34-burger.png` });
  await page.keyboard.press("Escape"); // the full-screen panel (M47) covers the footer

  const footer = page.locator("footer");
  await expect(footer.locator('a[href="/prix-deratisation/"]:visible')).toHaveCount(0);
  await footer.locator("summary", { hasText: "Tarifs" }).click();
  await expect(footer.locator('a[href="/prix-deratisation/"]:visible')).toHaveCount(1);
  await expect(footer.locator('a[href="tel:+33764464691"]:visible').first()).toBeVisible();
  await footer.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m34-footer-mobile.png`, fullPage: true });
});
