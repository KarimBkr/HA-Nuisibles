import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";

// M36: a technician photo or flat illustration replaces the animal close-up; every service now has one (icon panel kept as a fallback).
test("m36: service heroes show people at work or an illustration", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/deratisation-lyon-2/");
  await expect(page.locator("[data-service-hero] img")).toHaveAttribute("src", "/images/villeurbanne-intervention-nuisibles.webp");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-deratisation.png` });
  await page.goto("/demoustication/");
  await expect(page.locator("[data-service-hero] img")).toHaveAttribute("src", /intervention-rapide-a-lyon-contre-cafards-punaises-moustiques/);
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-demoustication.png` });
  await page.goto("/depigeonnage/");
  await expect(page.locator("[data-service-hero] img")).toHaveAttribute("src", /depigeonnage-a-villeurbanne/);
  await expect(page.locator("[data-hero-icon]")).toHaveCount(0);
  await page.goto("/destruction-nid-guepes-frelons/");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-guepes.png` });
  await page.goto("/entreprise-punaises-de-lit-lyon/");
  await page.locator("[data-service-hero]").screenshot({ path: `${SCREENSHOTS}/m36-hero-punaises.png` });
});
