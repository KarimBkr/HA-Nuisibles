import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";

// M36: a technician photo replaces the rat close-up; a service without one gets the light icon panel.
test("m36: service heroes show people at work or the service icon", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  await expect(page.locator("[data-service-hero] img")).toHaveAttribute("src", "/images/villeurbanne-intervention-nuisibles.webp");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-deratisation.png` });
  await page.goto("/demoustication/");
  await expect(page.locator("[data-service-hero] img")).toHaveCount(0);
  await expect(page.locator("[data-hero-icon] svg")).toBeVisible();
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-demoustication.png` });
  await page.goto("/destruction-nid-guepes-frelons/");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-guepes.png` });
  await page.goto("/entreprise-punaises-de-lit-lyon/");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-punaises.png` });
});
