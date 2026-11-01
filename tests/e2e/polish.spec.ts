import { test, expect, SCREENSHOTS, MOBILE, DESKTOP } from "./serve";

const CALENDAR = 'iframe[src^="https://cal.com/ha-nuisibles/"]';
const BAR = 'nav[aria-label="Appeler ou réserver"]';

test("polish: mobile bar hidden on /rendez-vous/ only; phone and new-tab link above the calendar", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/contact/");
  await expect(page.locator(BAR)).toBeVisible();
  await page.goto("/rendez-vous/#deratisation");
  await expect(page.locator(BAR)).toBeHidden();
  const iframeTop = (await page.locator(CALENDAR).boundingBox())!.y;
  const tel = page.locator('main a[href^="tel:"]').first();
  const newTab = page.getByRole("link", { name: /Ouvrir l.agenda dans un nouvel onglet/ });
  await expect(tel).toBeVisible();
  await expect(newTab).toHaveAttribute("target", "_blank");
  expect((await tel.boundingBox())!.y).toBeLessThan(iframeTop);
  expect((await newTab.boundingBox())!.y).toBeLessThan(iframeTop);
  await page.screenshot({ path: `${SCREENSHOTS}/polish-booking-mobile.png` });
  await page.setViewportSize(DESKTOP);
  await expect(newTab).toBeVisible();
});

test("polish: quote form field order, folded address still sent, first invalid field focused", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const calls: Record<string, unknown>[] = [];
  await page.route("https://api.web3forms.com/**", (route) => {
    calls.push(route.request().postDataJSON());
    route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
  });
  await page.goto("/contact/#mon-devis");
  const ids = await page.locator("#mon-devis :is(input, select, textarea)[id^='q-']").evaluateAll((els) => els.map((e) => e.id));
  expect(ids.slice(0, 8)).toEqual(["q-nom", "q-prenom", "q-telephone", "q-email", "q-codePostal", "q-ville", "q-service", "q-message"]);
  const folded = page.locator("#mon-devis details");
  await expect(folded.locator("summary")).toHaveText(/Adresse complète \(facultatif\)/);
  for (const id of ["q-adresse1", "q-adresse2", "q-region", "q-pays"]) await expect(folded.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("#q-adresse1")).toBeHidden();

  // Only the name filled: the first invalid field (Prénom) gets the focus.
  await page.fill("#q-nom", "Martin");
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("#q-prenom")).toBeFocused();

  await page.fill("#q-prenom", "Léa");
  await page.fill("#q-telephone", "06 12 34 56 78");
  await page.fill("#q-email", "lea@example.fr");
  await page.fill("#q-codePostal", "69100");
  await page.fill("#q-ville", "Villeurbanne");
  await page.selectOption("#q-service", { index: 1 });
  await page.fill("#q-message", "Des rats dans la cave.");
  await folded.locator("summary").click();
  await page.fill("#q-adresse1", "12 rue des Lilas");
  await page.fill("#q-region", "Auvergne-Rhône-Alpes");
  await page.locator("#mon-devis").screenshot({ path: `${SCREENSHOTS}/polish-contact-form-mobile.png` });
  await folded.locator("summary").click(); // folded again: values must still be sent
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("[data-quote-success]")).toBeVisible();
  expect(calls).toHaveLength(1);
  expect(calls[0]).toMatchObject({ codePostal: "69100", ville: "Villeurbanne", adresse1: "12 rue des Lilas", region: "Auvergne-Rhône-Alpes" });
});
