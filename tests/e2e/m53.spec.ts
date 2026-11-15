import ld from "./service-ld.json";
import { test, expect, SCREENSHOTS, DESKTOP } from "./serve";
import { maxWordsPerScreen, contentStickies } from "./desktop";

// M53 service pages desktop: slim sticky card (H1, figures, buttons, small photo) ≤ one 1280×720 screen; scrolling column
// lead → prices → FAQ → details → process → links; ≤ 120 words per 1366×900 screen; Service JSON-LD byte-identical (baseline service-ld.json, regenerated in M65 when offers were added).
const SMALL = { width: 1280, height: 720 };

test("m53: desktop service sheet is a slim card beside one calm column", async ({ page }) => {
  for (const slug of Object.keys(ld)) {
    await page.setViewportSize(SMALL);
    await page.goto(`/${slug}/`);
    const card = page.locator("[data-service-hero]");
    const box = (await card.boundingBox())!;
    expect(box.height, `${slug} card height`).toBeLessThanOrEqual(SMALL.height - 16);
    expect(box.width, slug).toBeLessThanOrEqual(352);
    await expect(card.locator("nav[aria-label]")).toHaveCount(0); // breadcrumbs sit above the grid
    expect(await contentStickies(page), slug).toHaveLength(1);
    const now = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((e) => e.textContent!).filter((t) => t.includes('"Service"')));
    expect(now, slug).toEqual(ld[slug as keyof typeof ld]);

    await page.setViewportSize(DESKTOP);
    const order = await page.evaluate(() =>
      ["[data-lead]", "#tarifs", "#faq-titre", "[data-sections]", "[data-process]", "[data-zone-block]"].map((s) => document.querySelector(s)?.getBoundingClientRect().top ?? null),
    );
    const present = order.filter((t): t is number => t !== null);
    expect(present, slug).toEqual([...present].sort((a, b) => a - b));
    // The card's figures and buttons are not said again in the column: the lead is one sentence.
    expect(await page.locator("[data-lead]").innerText(), slug).not.toMatch(/\.\s+\S/);
    const { max, screens } = await maxWordsPerScreen(page, "[data-service-hero]");
    expect(max, `${slug} words per screen ${screens.join(",")}`).toBeLessThanOrEqual(120);
  }
  await page.goto("/deratisation-lyon-2/");
  await page.screenshot({ path: `${SCREENSHOTS}/m53-service-desktop.png` });
  await page.locator("[data-process]").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SCREENSHOTS}/m53-service-desktop-scrolled.png` });
});
