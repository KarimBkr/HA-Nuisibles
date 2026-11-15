import { test, expect } from "./serve";

// The check builds with no NEXT_PUBLIC_ANALYTICS_* / NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: nothing must load.
test("analytics: nothing third-party and no verification tag when the env is empty", async ({ page }) => {
  const hosts = new Set<string>();
  page.on("request", (r) => hosts.add(new URL(r.url()).host));
  await page.goto("/");
  await page.waitForLoadState("load");
  const own = new URL(page.url()).host;
  expect([...hosts].filter((h) => h !== own)).toEqual([]);
  await expect(page.locator('script[data-domain], meta[name="google-site-verification"]')).toHaveCount(0);
  expect(await page.evaluate(() => "plausible" in window)).toBe(false);
});

// With a stub window.plausible (what the stats script provides), the four events fire on the real pages.
test("analytics: call, booking, service choice and quote events fire", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { plausible: (e: string, o?: unknown) => void };
    w.plausible = (e, o) => sessionStorage.setItem("ev", JSON.stringify([...JSON.parse(sessionStorage.getItem("ev") || "[]"), [e, o]]));
    document.addEventListener("click", (e) => (e.target as Element).closest?.('a[href^="tel:"]') && e.preventDefault());
  });
  const events = () => page.evaluate(() => JSON.parse(sessionStorage.getItem("ev") || "[]") as [string, { props?: Record<string, string> }][]);
  await page.route("https://api.web3forms.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }));
  await page.route("https://cal.com/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<p>agenda</p>" }));

  await page.goto("/deratisation-lyon-2/");
  await page.locator('a[href^="tel:"]:visible').first().click();
  await page.locator('a[href^="/rendez-vous/"]:visible').first().click();
  await page.waitForURL(/\/rendez-vous\//);
  await page.getByRole("button", { name: /Dératisation/ }).click();
  await page.goto("/contact/");
  await page.fill("#q-nom", "Martin");
  await page.fill("#q-prenom", "Léa");
  await page.fill("#q-email", "lea@example.fr");
  await page.fill("#q-telephone", "06 12 34 56 78");
  await page.selectOption("#q-service", "Dératisation");
  await page.selectOption("#q-source", "Fiche Google");
  await page.fill("#q-message", "Des souris dans la cuisine.");
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.locator("[data-quote-success]")).toBeVisible();

  expect(await events()).toEqual([
    ["Appel", { props: { page: "/deratisation-lyon-2/" } }],
    ["Prendre rendez-vous", { props: { page: "/deratisation-lyon-2/" } }],
    ["Choix service", { props: { service: "deratisation" } }],
    ["Devis envoyé", { props: { service: "Dératisation", source: "Fiche Google" } }],
  ]);
});
