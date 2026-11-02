import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

const CALENDAR = 'iframe[src^="https://cal.com/ha-nuisibles/"]';

// M47: booking wizard (one screen per step, choice in #service, agenda within 3 screens) and the full-screen mobile menu.
test("m47: booking wizard steps, #service, agenda ≤ 3 screens down, recap", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  await expect(page.locator(CALENDAR)).toHaveCount(0);
  await expect(page.locator("[data-steps] [aria-current=step]")).toContainText("Votre problème");
  const rows = page.locator("[data-wizard] section li button");
  await expect(rows).toHaveCount(8);
  await expect(rows.first()).toContainText(/jusqu’à \d+ h/);
  await page.screenshot({ path: `${SCREENSHOTS}/m47-booking-step1-mobile.png`, fullPage: true });
  await rows.filter({ hasText: "Punaises de lit" }).click();
  await expect(page).toHaveURL(/#punaises-de-lit$/);
  await expect(page.locator("[data-steps] [aria-current=step]")).toContainText("Votre créneau");
  await expect(page.getByRole("heading", { name: /créneau/ })).toBeFocused();
  const top = await page.locator(CALENDAR).evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
  expect(top).toBeLessThanOrEqual(3 * MOBILE.height);
  const recap = page.locator("[data-recap]");
  await expect(recap).toContainText("Punaises de lit");
  await expect(recap).toContainText("jusqu’à 5 h");
  await expect(recap.locator('a[href^="tel:"]')).toBeVisible(); // sticky at the bottom of the screen
  await page.screenshot({ path: `${SCREENSHOTS}/m47-booking-step2-mobile.png` });
  await recap.getByRole("button", { name: "Changer de problème" }).click();
  await expect(page.locator(CALENDAR)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /problème/ })).toBeFocused();
});

test("m47: mobile menu is a full-screen panel, keyboard open/close, actions at the bottom", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/deratisation-lyon-2/");
  const burger = page.getByRole("button", { name: "Ouvrir le menu" });
  await burger.focus();
  await page.keyboard.press("Enter");
  const panel = page.locator("#menu-mobile");
  const box = (await panel.boundingBox())!;
  expect(box.width).toBe(MOBILE.width);
  expect(box.height).toBe(MOBILE.height);
  await expect(page.getByRole("button", { name: "Fermer le menu" })).toBeFocused();
  for (const sel of ['a[href^="tel:"]', 'a[href="/rendez-vous/"]']) {
    const b = (await panel.locator(sel).boundingBox())!;
    expect(b.y).toBeGreaterThan(MOBILE.height / 2); // thumb zone
  }
  await page.screenshot({ path: `${SCREENSHOTS}/m47-menu-mobile.png` });
  await page.keyboard.press("Enter"); // the focused close button
  await expect(panel).toBeHidden();
  await expect(burger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});
