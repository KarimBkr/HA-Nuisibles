import { test, expect, SCREENSHOTS, DESKTOP, MOBILE } from "./serve";
import type { Page } from "@playwright/test";

// The check builds with a placeholder Web3Forms key (see .athanor/check.sh); Web3Forms itself is route-mocked.
const fill = async (page: Page) => {
  await page.fill("#q-nom", "Martin");
  await page.fill("#q-prenom", "Léa");
  await page.fill("#q-email", "lea@example.fr");
  await page.fill("#q-telephone", "06 12 34 56 78");
  await page.selectOption("#q-service", "Dératisation");
  await page.fill("#q-message", "Des souris dans la cuisine.");
  await page.check('input[name="consent"]');
};
const mockWeb3Forms = (page: Page, status: number) => {
  const calls: unknown[] = [];
  page.route("https://api.web3forms.com/**", (route) => {
    calls.push(route.request().postDataJSON());
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ success: status === 200 }) });
  });
  return calls;
};

test("contact: page, coordinates, map loaded only on click", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/contact/");
  await expect(page.locator("h1")).toHaveCount(1);
  for (const city of ["Lyon", "Villeurbanne", "Grenoble", "Annecy", "Bourg-en-Bresse", "Villefranche-sur-Saône", "Saint-Étienne", "Annemasse"])
    await expect(page.locator("[data-page-hero]")).toContainText(city); // H1 short (Lyon, Villeurbanne), all cities in the sentence
  await expect(page.getByText("127 cours Tolstoï").first()).toBeVisible();
  await expect(page.locator('main a[href="tel:+33764464691"]').first()).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Afficher la carte Google Maps" }).click();
  await expect(page.locator('iframe[src^="https://www.google.com/maps"]')).toHaveCount(1);
});

test("contact: empty submit shows the required-field errors", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/contact/#mon-devis");
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator('#mon-devis [aria-invalid="true"]')).toHaveCount(6);
  await expect(page.getByText("Ce champ est obligatoire.")).toHaveCount(5);
  await expect(page.locator("#q-nom")).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(MOBILE.width);
  await page.locator("#mon-devis").screenshot({ path: `${SCREENSHOTS}/contact-form-errors-mobile.png` });
});

test("contact: Web3Forms 200 shows the success message and clears the form", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const calls = mockWeb3Forms(page, 200);
  await page.goto("/contact/");
  await fill(page);
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("[data-quote-success]")).toBeVisible();
  expect(calls).toHaveLength(1);
  expect(calls[0]).toMatchObject({ nom: "Martin", email: "lea@example.fr", service: "Dératisation" });
  await expect(page.locator("#q-nom")).toHaveCount(0); // the sent form gives way to the confirmation
  await page.screenshot({ path: `${SCREENSHOTS}/contact-mobile.png`, fullPage: true });
  await page.getByRole("button", { name: "Envoyer une autre demande" }).click();
  await expect(page.locator("#q-nom")).toHaveValue("");
});

test("contact: Web3Forms 500 shows an error, keeps the data and retries", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const calls = mockWeb3Forms(page, 500);
  await page.goto("/contact/");
  await fill(page);
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("[data-quote-error]")).toBeVisible();
  await expect(page.locator("#q-nom")).toHaveValue("Martin");
  await expect(page.locator("#q-message")).toHaveValue("Des souris dans la cuisine.");
  await page.getByRole("button", { name: "Réessayer" }).click();
  await expect.poll(() => calls.length).toBe(2);
});
