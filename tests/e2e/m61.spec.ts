import { test, expect } from "./serve";

const BASE = "https://cal.com/ha-nuisibles/";
const KEYS = ["deratisation", "punaises-de-lit", "desinsectisation", "guepes-frelons", "depigeonnage", "demoustication", "desinfection", "urgence-dimanche"];

// M61: every booking option is one 1 h slot, end to end (step 1 label → step 2 Cal.com URL of that option → recap).
test("m61: each of the 8 options shows 1 h and loads its own Cal.com page", async ({ page }) => {
  await page.goto("/rendez-vous/");
  const rows = page.locator("[data-wizard] section li button");
  await expect(rows).toHaveCount(KEYS.length);
  await expect(page.locator("[data-wizard]")).not.toContainText(/jusqu.à/i);
  for (const [i, key] of KEYS.entries()) {
    await expect(rows.nth(i).locator("span.flex-1 > span.text-muted")).toHaveText(key === "urgence-dimanche" ? "1 h · +50 %" : "1 h");
    await rows.nth(i).click();
    await expect(page).toHaveURL(new RegExp(`#${key}$`));
    await expect(page.locator("iframe")).toHaveAttribute("src", BASE + key);
    await expect(page.locator(`a[target=_blank][href="${BASE + key}"]`)).toHaveCount(1);
    await expect(page.locator("[data-recap] dd").nth(1)).toHaveText("1 h");
    await page.getByRole("button", { name: "Changer de problème" }).click();
  }
});

test("m61: prices page and service sheets give a 1 h duration, never longer", async ({ page }) => {
  await page.goto("/tarifs/");
  const durations = await page.getByText(/^Durée : /).allTextContents();
  expect(durations.length).toBeGreaterThan(0);
  for (const d of durations) expect(d).toBe("Durée : 1 h");
  await page.goto("/deratisation-lyon-2/");
  await expect(page.getByText(/jusqu.à \d+ ?h/i)).toHaveCount(0);
});
