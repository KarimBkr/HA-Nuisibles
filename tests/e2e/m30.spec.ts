import { test, expect, SCREENSHOTS, DESKTOP, MOBILE, resolveFile } from "./serve";

const visibleBars = (page: import("@playwright/test").Page) => page.locator("nav.mobile-bar:visible");

test("m30: one sticky bar per service page, booking links carry the service", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  const pages: [string, string][] = [
    ["/deratisation-lyon-2/", "deratisation"],
    ["/deratisation-villeurbanne/", "deratisation"],
    ["/entreprise-punaises-de-lit-lyon/", "punaises-de-lit"],
    ["/nid-guepes-frelons-lyon/", "guepes-frelons"],
  ];
  for (const [url, key] of pages) {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, 1200)); // M33: the bar shows once the top buttons are off screen
    await expect(visibleBars(page), url).toHaveCount(1);
    await expect(visibleBars(page).locator('a[href^="/rendez-vous/"]')).toHaveAttribute("href", `/rendez-vous/#${key}`);
    expect(await page.locator(`main a[href="/rendez-vous/"]`).count(), `${url} main generic booking link`).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(MOBILE.width);
  }
  for (const url of ["/", "/contact/"]) {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, 1200)); // M33: the bar shows once the top buttons are off screen
    await expect(visibleBars(page), url).toHaveCount(1);
    await expect(visibleBars(page).locator('a[href^="/rendez-vous/"]')).toHaveAttribute("href", "/rendez-vous/");
  }
  await page.goto("/rendez-vous/#deratisation");
  await expect(page.locator("iframe")).toHaveCount(1);
  await expect(visibleBars(page)).toHaveCount(0);
  await page.goto("/rendez-vous/");
  await expect(visibleBars(page), "B32: bar on /rendez-vous/ before a choice").toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/7 ?j(ours)? ?(sur|\/) ?7/i);
  await expect(page.locator("main")).toContainText("du lundi au samedi, urgences le dimanche");
});

test("m30: the sticky bar does not cover the end of the page", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  for (const url of ["/deratisation-lyon-2/", "/contact/", "/"]) {
    await page.goto(url);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const bar = await visibleBars(page).boundingBox();
    const last = await page.locator("footer p, footer a").last().boundingBox();
    expect(bar && last && last.y + last.height <= bar.y + 1, `${url} footer last line above the bar`).toBeTruthy();
  }
});

test("m30: body images are lazy, sized and do not shift layout", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/deratisation-villeurbanne/");
  const img = page.locator('img[src*="deratisation-villeurbanne-avec-ha-nuisibles"]');
  await expect(img).toHaveAttribute("loading", "lazy");
  await expect(img).toHaveAttribute("width", "750");
  await expect(img).toHaveAttribute("height", "1000");
  // Before load, the reserved box already has the 3:4 ratio.
  const box = await img.boundingBox();
  expect(box && Math.abs(box.height / box.width - 1000 / 750) < 0.02).toBeTruthy();
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll("main article img, main .prose img")].filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length,
  );
  expect(missing).toBe(0);
});

test("m30: footer links resolve and anchors are distinct per URL", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const links = await page.locator("footer a[href^='/']").evaluateAll((as) => as.map((a) => [a.getAttribute("href")!, a.textContent!.trim()]));
  for (const [href] of links) expect(resolveFile(href.split("#")[0]), href).not.toBeNull();
  const byText = new Map<string, Set<string>>();
  for (const [href, text] of links) byText.set(text, (byText.get(text) || new Set()).add(href.split("#")[0]));
  for (const [text, hrefs] of byText) expect(hrefs.size, `anchor "${text}"`).toBe(1);
  await expect(page.locator("footer")).toContainText("Zones d'intervention"); // M34: local links left the footer, the zones hub stays
});

test("m30: confirmation gets keyboard focus and keeps the phone", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.route("https://api.web3forms.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }));
  await page.goto("/contact/");
  await page.fill("#q-nom", "Martin");
  await page.fill("#q-prenom", "Léa");
  await page.fill("#q-email", "lea@example.fr");
  await page.fill("#q-telephone", "06 12 34 56 78");
  await page.selectOption("#q-service", "Dératisation");
  await page.fill("#q-message", "Des souris.");
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: "Soumettre" }).click();
  const ok = page.locator("[data-quote-success]");
  await expect(ok).toBeVisible();
  await expect(ok.locator("xpath=..").locator('a[href^="tel:"]')).toBeVisible();
  const focusInside = await page.evaluate(() => !!document.activeElement?.closest("[data-quote-success]"));
  expect(focusInside, "focus moved into the confirmation").toBeTruthy();
  await ok.locator("xpath=..").screenshot({ path: `${SCREENSHOTS}/m30-contact-confirmation-mobile.png` });
});

test("m30: no horizontal overflow at 390 and 1280, screenshots", async ({ page }) => {
  const urls = ["/", "/deratisation-lyon-2/", "/contact/", "/rendez-vous/", "/conseils-nuisibles/"];
  await page.goto("/conseils-nuisibles/");
  const post = await page.locator("main a[aria-label^='Lire la suite']").first().getAttribute("href");
  urls.push(post!);
  for (const vp of [MOBILE, { width: 1280, height: 900 }]) {
    await page.setViewportSize(vp);
    for (const url of urls) {
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${url} @${vp.width}`).toBeLessThanOrEqual(vp.width);
    }
  }
  await page.setViewportSize(MOBILE);
  await page.goto("/deratisation-lyon-2/");
  await page.screenshot({ path: `${SCREENSHOTS}/m30-service-mobile.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.screenshot({ path: `${SCREENSHOTS}/m30-service-mobile-end.png` });
  await page.goto(post!);
  await page.locator("main article img, main .prose-body img").last().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m30-post-mobile.png` });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/rendez-vous/");
  await page.screenshot({ path: `${SCREENSHOTS}/m30-rendez-vous-desktop.png` });
  await page.goto("/");
  await page.locator("footer").screenshot({ path: `${SCREENSHOTS}/m30-footer-desktop.png` });
});
