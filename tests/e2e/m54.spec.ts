import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";
import { maxWordsPerScreen, contentStickies, WIDE } from "./desktop";

// M54 contact, prices hub, booking on desktop: ≤ 120 words per screen at 1366 and 1920, no sticky in the content,
// contact form and coordinates side by side with the hours said once, price groups on the official grid, booking in one centred reading column.
test("m54: contact, prices and booking are calm on desktop", async ({ page }) => {
  for (const size of [DESKTOP, WIDE]) {
    await page.setViewportSize(size);
    for (const url of ["/contact/", "/tarifs/", "/rendez-vous/"]) {
      await page.goto(url);
      expect(await contentStickies(page), url).toHaveLength(0);
      const { max, screens } = await maxWordsPerScreen(page);
      expect(max, `${url} ${size.width} words per screen ${screens.join(",")}`).toBeLessThanOrEqual(120);
    }
  }

  await page.setViewportSize(DESKTOP);
  await page.goto("/contact/");
  const form = (await page.locator("#contact-devis").boundingBox())!;
  const coords = (await page.locator("#coord-titre").boundingBox())!;
  expect(Math.abs(form.y - coords.y)).toBeLessThan(8); // side by side
  expect(coords.x).toBeGreaterThan(form.x + form.width);
  expect(await page.locator("main").innerText()).not.toMatch(/Horaires/);
  await page.screenshot({ path: `${SCREENSHOTS}/m54-contact-desktop.png` });

  await page.goto("/tarifs/");
  expect(await page.locator("[data-price-group]").count()).toBe(7); // M59: the official grid's 7 bookable categories, every row shown
  await page.screenshot({ path: `${SCREENSHOTS}/m54-prices-desktop.png` });

  await page.goto("/rendez-vous/");
  const col = (await page.locator("[data-steps]").boundingBox())!;
  expect(col.width).toBeLessThanOrEqual(720);
  expect(Math.abs(col.x + col.width / 2 - DESKTOP.width / 2)).toBeLessThan(24); // centred
  await page.locator(`section[aria-labelledby="etape-titre"] ul button`).first().click();
  await expect(page.locator("[data-recap]")).toHaveCSS("position", "static");
  await page.screenshot({ path: `${SCREENSHOTS}/m54-booking-desktop.png` });
});
