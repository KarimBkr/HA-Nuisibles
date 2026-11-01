import { test, expect, SCREENSHOTS, MOBILE } from "./serve";

// No third-party request before an explicit click; a consent line sits next to each third-party embed.
test("privacy: no third-party request before a click, consent line next to Cal.com and Google Maps", async ({ page }) => {
  await page.route("https://cal.com/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<p>agenda</p>" }));
  await page.route("https://www.google.com/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<p>carte</p>" }));
  const hosts: string[] = [];
  page.on("request", (r) => hosts.push(new URL(r.url()).host));
  const thirdParty = () => hosts.filter((h) => h !== new URL(page.url()).host);
  await page.setViewportSize(MOBILE);

  for (const url of ["/", "/deratisation-lyon-2/", "/zones-d-intervention/", "/confidentalite/"]) {
    await page.goto(url);
    await page.waitForLoadState("load");
  }
  await page.goto("/rendez-vous/");
  await page.waitForLoadState("load");
  await expect(page.locator("[data-consent]")).toContainText("Cal.com");
  await expect(page.locator('[data-consent] a[href="/confidentalite/"]')).toHaveCount(1);
  await page.goto("/contact/");
  await page.waitForLoadState("load");
  await expect(page.locator("[data-consent]")).toContainText("Google");
  await page.locator("[data-consent]").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/privacy-map-consent-mobile.png` });
  expect(thirdParty()).toEqual([]);

  await page.getByRole("button", { name: "Afficher la carte Google Maps" }).click();
  await expect.poll(() => thirdParty()).toContain("www.google.com");
  await page.goto("/rendez-vous/");
  await page.getByRole("button", { name: /Dératisation/ }).click();
  await expect.poll(() => thirdParty()).toContain("cal.com");
});

test("privacy: the policy lists the real third-party services and says no cookie on browse", async ({ page }) => {
  await page.goto("/confidentalite/");
  const body = page.locator("main");
  for (const name of ["Cal.com", "Google Maps", "Web3Forms", "Plausible"]) await expect(body.locator("table")).toContainText(name);
  await expect(body).toContainText("Aucun cookie n’est déposé lorsque vous consultez le site.");
  await expect(body).not.toContainText("cookies strictement nécessaires");
});
