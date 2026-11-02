import { test, expect, resolveFile, ORIGIN, MOBILE } from "./serve";

// M49 tester pass: cross-page probes after the M43–M48 redesign. There is no /blog/ in out/: the blog is /conseils-nuisibles/.
const PAGES = ["/", "/deratisation-lyon-2/", "/contact/", "/rendez-vous/", "/tarifs/", "/conseils-nuisibles/"];
const SIZES = [MOBILE, { width: 1280, height: 800 }];

test("m49: every internal link resolves to a file of out/", async ({ page }) => {
  const broken: string[] = [];
  for (const url of PAGES) {
    await page.goto(url);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const h of new Set(hrefs)) {
      const u = new URL(h);
      if (u.origin === ORIGIN && !resolveFile(u.pathname)) broken.push(`${url} -> ${u.pathname}`);
    }
  }
  expect(broken).toEqual([]);
});

test("m49: no horizontal overflow at 360 and 390 px", async ({ page }) => {
  const over: string[] = [];
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const url of PAGES) {
      await page.goto(url);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) over.push(`${url}@${width}: ${sw}`);
    }
  }
  expect(over).toEqual([]);
});

test("m49: no console errors at 390 and 1280 px", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const size of SIZES) {
    await page.setViewportSize(size);
    for (const url of PAGES) await page.goto(url, { waitUntil: "networkidle" });
  }
  // Third-party requests (cal.com, analytics) are aborted offline by serve.ts: their net errors are not app bugs.
  expect(errors.filter((e) => !/ERR_FAILED|net::/.test(e))).toEqual([]);
});

test("m49: tel links, one H1, meta description, canonical", async ({ page }) => {
  const bad: string[] = [];
  for (const url of PAGES) {
    await page.goto(url);
    const tels = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute("href")));
    for (const t of tels) if (t !== "tel:+33764464691") bad.push(`${url} tel ${t}`);
    const h1 = await page.locator("h1").count();
    if (h1 !== 1) bad.push(`${url} h1=${h1}`);
    const desc = await page.locator('meta[name="description"]').getAttribute("content").catch(() => null);
    if (!desc?.trim()) bad.push(`${url} no meta description`);
    if ((await page.locator('link[rel="canonical"]').count()) !== 1) bad.push(`${url} canonical count`);
  }
  expect(bad).toEqual([]);
});

test("m49: images have alt, links and buttons have accessible names (390 and 1280)", async ({ page }) => {
  const bad: string[] = [];
  for (const size of SIZES) {
    await page.setViewportSize(size);
    for (const url of PAGES) {
      await page.goto(url);
      const noAlt = await page.$$eval("img:not([alt])", (is) => is.map((i) => (i as HTMLImageElement).src));
      for (const s of noAlt) bad.push(`${url} img no alt ${s}`);
      const unnamed = await page.$$eval("a[href], button", (els) =>
        els
          .filter((e) => e.getClientRects().length && !e.closest("[aria-hidden=true]"))
          .filter((e) => {
            const t = (e.getAttribute("aria-label") || e.getAttribute("title") || e.textContent || "").trim();
            const imgAlt = [...e.querySelectorAll("img[alt], svg[aria-label]")].some((i) => (i.getAttribute("alt") || i.getAttribute("aria-label") || "").trim());
            const labelled = e.getAttribute("aria-labelledby");
            return !t && !imgAlt && !labelled;
          })
          .map((e) => e.outerHTML.slice(0, 120)),
      );
      for (const u of unnamed) bad.push(`${url}@${size.width} unnamed ${u}`);
    }
  }
  expect(bad).toEqual([]);
});

test("m49: mobile menu opens and closes with the keyboard from Tab order", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Ouvrir le menu" });
  for (let i = 0; i < 15 && !(await burger.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(burger).toBeFocused();
  await expect(burger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  const panel = page.locator("#menu-mobile");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(burger).toBeFocused();
});

// Fixed M49: the page behind the open panel is inert; past the last link focus may only leave to the browser (body).
test("m49: Tab stays inside the open mobile menu", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const panel = page.locator("#menu-mobile");
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const where = await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 120));
    expect(await panel.evaluate((p) => p.contains(document.activeElement) || document.activeElement === document.body), where).toBe(true);
  }
});

test("m49: booking wizard step 1 to step 2 with the keyboard only", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/rendez-vous/");
  const first = page.locator("[data-wizard] section li button").first();
  for (let i = 0; i < 40 && !(await first.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-steps] [aria-current=step]")).toContainText("Votre créneau");
  await expect(page.getByRole("heading", { name: /créneau/ })).toBeFocused();
  const back = page.locator("[data-recap]").getByRole("button", { name: "Changer de problème" });
  for (let i = 0; i < 40 && !(await back.evaluate((b) => b === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(back).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.locator("[data-steps] [aria-current=step]")).toContainText("Votre problème");
});
