import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

test("m37: reassurance and no-slot call message above the agenda, #service kept", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  await expect(page.locator("[data-reassurance]")).toHaveCount(0); // only after a choice
  await page.goto("/rendez-vous/#guepes-frelons");
  const bullets = page.locator("[data-reassurance] li");
  await expect(bullets).toHaveText(["Devis gratuit sans engagement", "Intervention sous 24h", "Garantie de résultat"]);
  const noSlot = page.locator("[data-no-slot]");
  await expect(noSlot).toContainText("n'apparaît pas");
  await expect(noSlot.locator('a[href^="tel:"]')).toBeVisible();
  const iframe = page.locator('iframe[src^="https://cal.com/ha-nuisibles/"]');
  const top = async (l: typeof iframe) => (await l.boundingBox())!.y;
  expect(await top(bullets.first())).toBeLessThan(await top(iframe));
  expect(await top(noSlot)).toBeLessThan(await top(iframe));
  await page.getByRole("button", { name: /Dératisation/ }).click();
  await expect(page).toHaveURL(/#deratisation$/);
  await expect(bullets).toHaveCount(3);
  await noSlot.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m37-booking-reassurance.png` });
});
