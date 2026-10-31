import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
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

// Text rework (M11–M13): each file of content/archive/<type>s/ is the imported body of an entry rewritten since.
// The new body keeps every fact of the old one and adds none.
const ARCHIVE = path.resolve(__dirname, "../../content/archive");
const archived = () =>
  ["pages", "posts"].flatMap((dir) => {
    const d = path.join(ARCHIVE, dir);
    if (!fs.existsSync(d)) return [];
    return fs.readdirSync(d).map((f) => {
      return { slug: f.replace(/\.md$/, ""), old: matter(fs.readFileSync(path.join(d, f), "utf8")).content };
    });
  });
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘]/g, "'").toLowerCase();
const prose = (md: string) => md.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/<[^>]+>/g, " ");
const numbers = (md: string) => new Set([...prose(md).matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => m[0].replace(".", ",")));
const links = (md: string) => new Set([...md.matchAll(/\]\((\/[^)\s#]*)/g)].map((m) => m[1].replace(/\/?$/, "/")));
// Capitalised words not opening a sentence, line, heading or list item: cities, quartiers, names.
const names = (md: string) =>
  prose(md)
    .split(/(?<=[.!?:…])\s+|\n+/)
    .map((s) => s.replace(/^[\s#>*_\-–—+|«"(\[\d.)]+/, ""))
    .flatMap((s) => [...s.slice(s.search(/\s/) + 1 || s.length).matchAll(/(?<![\p{L}'’-])\p{Lu}[\p{L}'’-]+/gu)].map((m) => m[0]));
const STOP = new Set("avec dans pour votre vous nous notre nos sont tout tous toute toutes comment quels quelles quelle quel faire leur leurs entre chez apres avant plus sans cette comme".split(" "));
const keywords = (h: string) => fold(h).split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP.has(w));
const headings = (md: string, level: RegExp) => md.split("\n").filter((l) => level.test(l)).map((l) => l.replace(/^#+\s*/, ""));

describe.skipIf(!fs.existsSync(OLD))("text rework", () => {
  const oldSite = fold(fs.existsSync(OLD) ? fs.readFileSync(OLD, "utf8") : "");

  it("covers at least the 10 main service pages", () => {
    expect(archived().length).toBeGreaterThanOrEqual(10);
    for (const { slug } of archived()) expect(getEntry(slug), slug).toBeDefined();
  });

  it("keeps every number, price, phone and internal link of the old body and adds none", () => {
    const diffs: string[] = [];
    for (const { slug, old } of archived()) {
      const body = getEntry(slug)!.body;
      const [o, n] = [numbers(old), numbers(body)];
      for (const x of o) if (!n.has(x)) diffs.push(`${slug}: lost ${x}`);
      for (const x of n) if (!o.has(x)) diffs.push(`${slug}: added ${x}`);
      const nl = links(body);
      for (const l of links(old)) if (!nl.has(l)) diffs.push(`${slug}: lost link ${l}`);
    }
    expect(diffs).toEqual([]);
  });

  it("names no city, quartier or proper noun absent from the old site", () => {
    const added: string[] = [];
    for (const { slug } of archived())
      for (const w of new Set(names(getEntry(slug)!.body))) if (!oldSite.includes(fold(w))) added.push(`${slug}: ${w}`);
    expect(added).toEqual([]);
  });

  it("keeps at least 90 % of the old H2 topics as headings", () => {
    const low: string[] = [];
    for (const { slug, old } of archived()) {
      const now = headings(getEntry(slug)!.body, /^#{2,4}\s/).map((h) => new Set(keywords(h)));
      const topics = headings(old, /^##\s/).map(keywords).filter((k) => k.length);
      const kept = topics.filter((k) => now.some((h) => k.filter((w) => h.has(w)).length >= Math.ceil(k.length / 2)));
      if (kept.length < 0.9 * topics.length) low.push(`${slug}: ${kept.length}/${topics.length}`);
    }
    expect(low).toEqual([]);
  });

  it("is a rework: short paragraphs and at least one list per page", () => {
    const bad: string[] = [];
    for (const { slug } of archived()) {
      const body = getEntry(slug)!.body;
      const paras = body.split(/\n\s*\n/).filter((p) => !/^\s*([#|>!-]|\d+\.|\*\s)/.test(p));
      const long = paras.filter((p) => p.split(/\s+/).length > 90);
      if (long.length || !/^\s*(-|\*|\d+\.)\s/m.test(body)) bad.push(`${slug}: ${long.length} long paragraphs`);
    }
    expect(bad).toEqual([]);
  });
});
