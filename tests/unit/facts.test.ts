import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allEntries, getEntry, priceItems, PRICE_RE } from "@/lib/content";
import { PESTS } from "@/config/services";
import { site } from "@/config/site";
import * as home from "@/config/home";

// Every price and promise shown by the service template must come from the old site (.athanor/docs/OLD_SITE.md).
const OLD = path.resolve(__dirname, "../../.athanor/docs/OLD_SITE.md");
const norm = (s: string) => s.replace(/[\s ]+/g, " ").replace(/ ?€/g, "€").replace(/[*_]/g, "");
const prices = (s: string) => [...s.matchAll(new RegExp(PRICE_RE, "g"))].map((m) => norm(m[0]).trim());

export const servicePages = () => allEntries().filter((e) => ["service", "local", "guide"].includes(e.kind));

describe.skipIf(!fs.existsSync(OLD))("facts", () => {
  const old = fs.existsSync(OLD) ? norm(fs.readFileSync(OLD, "utf8")) : "";

  it("covers the 10 rich service pages of M7", () => {
    const slugs = servicePages().map((e) => e.slug);
    for (const s of ["deratisation-lyon-2", "deratisation-villeurbanne", "entreprise-punaises-de-lit-lyon", "punaise-de-lit-a-villeurbanne", "desinsectisation-lyon-2", "desinsectisation-villeurbanne", "destruction-nid-guepes-frelons", "nid-guepes-frelons-lyon", "nid-guepes-frelons-villeurbanne", "nid-de-guepes-villeurbanne"])
      expect(slugs).toContain(s);
  });

  it("every price on the service pages occurs on the old site", () => {
    const missing: string[] = [];
    for (const e of servicePages()) {
      const shown = [e.description, ...priceItems(e.body).flatMap((i) => [i.label ?? "", i.text])].join("\n");
      for (const p of prices(shown)) if (!old.includes(p)) missing.push(`${e.slug}: ${p}`);
    }
    expect(missing).toEqual([]);
  });

  it("the promises of the key facts occur on the old site", () => {
    for (const p of site.promises) expect(old.toLowerCase()).toContain(p.toLowerCase());
  });

  it("every pest of the services hub links to an existing page of its service", () => {
    for (const p of PESTS) expect(getEntry(p.slug)?.service, p.name).toBe(p.service);
    for (const name of ["Rats", "Souris", "Punaises de lit", "Cafards", "Fourmis", "Guêpes", "Frelons", "Moustiques", "Pigeons", "Chenilles", "désinfection"])
      expect(PESTS.some((p) => p.name.includes(name)), name).toBe(true);
  });

  it("every text of the home page occurs on the old site, and its hero image is ≤150 KB", () => {
    const loose = (t: string) => norm(t).replace(/[’‘]/g, "'").replace(/[«»"]/g, "").replace(/\s+/g, " ").trim();
    const oldLoose = loose(old);
    const texts: string[] = [];
    const walk = (v: unknown, key = "") => {
      if (typeof v === "string") { if (!/^(image|href)$/.test(key) && !v.startsWith("/")) texts.push(v); }
      else if (Array.isArray(v)) v.forEach((x) => walk(x));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
    };
    walk({ ...home });
    expect(texts.length).toBeGreaterThan(40);
    expect(texts.filter((t) => !oldLoose.includes(loose(t)))).toEqual([]);
    expect(fs.statSync(path.resolve(__dirname, "../../public", home.hero.image.slice(1))).size).toBeLessThanOrEqual(150 * 1024);
  });

  it("priceItems keeps table rows and labels short price lines", () => {
    const md = "| Offre | Prix |\n|---|---|\n| **Petit logement** | 150 – 250 € |\n\nVapeur seule\n\n500 € HT\n\nUn long paragraphe sans prix.";
    expect(priceItems(md)).toEqual([{ label: "Petit logement", text: "150 – 250 €" }, { label: "Vapeur seule", text: "500 € HT" }]);
  });
});
