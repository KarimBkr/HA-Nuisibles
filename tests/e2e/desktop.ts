import type { Page } from "@playwright/test";

// Desktop layout redesign (request 01): shared page list and measures for M51–M56.
export const DESKTOP_PAGES = [
  "/",
  "/deratisation-lyon-2/",
  "/deratisation-villeurbanne/",
  "/zones-d-intervention/",
  "/tarifs/",
  "/contact/",
  "/rendez-vous/",
  "/conseils-nuisibles/",
  "/combien-de-temps-dure-une-deratisation/",
  "/mentions-legales/",
  "/page-introuvable-m51/",
];
export const WIDE = { width: 1920, height: 1080 };

/** Words of visible text inside the viewport at the current scroll (site header and footer excluded: unchanged by the redesign). */
export function visibleWords(page: Page): Promise<number> {
  return page.evaluate(() => {
    const vh = innerHeight;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let words = 0;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!el || !n.textContent?.trim() || el.closest("body > header, body > footer, script, style, noscript, [aria-hidden=true], details:not([open]) > :not(summary)")) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0") continue;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width && r.height && r.bottom > 0 && r.top < vh) words += n.textContent.trim().split(/\s+/).length;
    }
    return words;
  });
}

/** Max visible words over successive screens of the page (scrolling by one viewport). */
export async function maxWordsPerScreen(page: Page): Promise<{ max: number; screens: number[] }> {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize()!.height;
  const screens: number[] = [];
  for (let y = 0; y < total; y += vh) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    screens.push(await visibleWords(page));
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  return { max: Math.max(...screens), screens };
}

/** Sticky/fixed elements of the content (site header and the booking recap bar excluded). */
export function contentStickies(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter((e) => ["sticky", "fixed"].includes(getComputedStyle(e).position) && e.getClientRects().length && !e.closest("[data-recap]"))
      .map((e) => e.tagName.toLowerCase() + (e.id ? `#${e.id}` : "")),
  );
}
