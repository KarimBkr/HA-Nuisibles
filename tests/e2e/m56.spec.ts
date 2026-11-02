import { test, expect, DESKTOP } from "./serve";

// M56: polish of the desktop redesign (aligned heroes, calm zones page, folded contact text, serif prose H2).

test("zones page uses numbered section headers and no shadow cards", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/zones-d-intervention/");
  expect(await page.locator("main .eyebrow").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator("main .shadow-soft")).toHaveCount(0);
});

test("home FAQ comes before the closing call band", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const before = await page.evaluate(() => {
    const faq = document.querySelector('[data-home="faq"]')!, cta = document.querySelector('[data-home="cta"]')!;
    return !!(faq.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(before).toBe(true);
});

test("contact old-site text sits in a closed details", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/contact/");
  const det = page.locator('section[aria-labelledby="contact-savoir"] details');
  await expect(det).toHaveCount(1);
  expect(await det.evaluate((d: HTMLDetailsElement) => d.open)).toBe(false);
  expect(await det.locator(".prose-body").count()).toBe(1);
  await det.locator("summary").focus();
  await page.keyboard.press("Enter");
  expect(await det.evaluate((d: HTMLDetailsElement) => d.open)).toBe(true);
});

test("article H2 in the prose is serif", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/combien-de-temps-dure-une-deratisation/");
  const ff = await page.locator(".prose-body h2").first().evaluate((h) => getComputedStyle(h).fontFamily);
  expect(ff).toMatch(/serif/i);
  expect(ff).not.toMatch(/^Poppins/);
});

for (const [path, content] of [["/tarifs/", "main h2"], ["/mentions-legales/", ".prose-body"]]) {
  test(`hero shares the content left edge on ${path} at 1366`, async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(path);
    const heroLeft = (await page.locator("[data-page-hero] h1").boundingBox())!.x;
    const contentLeft = (await page.locator(content).first().boundingBox())!.x;
    expect(Math.abs(heroLeft - contentLeft)).toBeLessThanOrEqual(2);
  });
}
