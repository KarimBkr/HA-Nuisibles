import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import inventory from "../content/url-inventory.json";
import keywords from "../content/keywords.json";
import { site } from "@/config/site";

// SEO audit over the static export (out/), run by check.sh after the build. Report: .athanor/.verif/seo-audit.txt.
// Titles 30–65, descriptions 70–165, all unique; every target keyword (content/keywords.json) in its page's title or H1.
const STRICT_TEXTS = true;
const OUT = path.join(process.cwd(), "out");
const REPORT = path.join(process.cwd(), ".athanor/.verif/seo-audit.txt");

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
const decode = (s: string) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, ""));
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const meta = (html: string, key: string) => {
  const tag = html.match(new RegExp(`<meta[^>]*(?:name|property)="${key}"[^>]*>`))?.[0];
  return tag ? decode(attr(tag, "content") ?? "") : undefined;
};

type Page = { url: string; html: string };
const pages: Page[] = fs.existsSync(OUT)
  ? walk(OUT)
      .filter((f) => f.endsWith("index.html"))
      .map((f) => ({ url: "/" + path.relative(OUT, path.dirname(f)).split(path.sep).filter(Boolean).map((s) => s + "/").join(""), html: fs.readFileSync(f, "utf8") }))
  : [];
const abs = (p: string) => new URL(p, site.url).toString();
const resolves = (href: string) => {
  const p = decodeURIComponent(href.split(/[#?]/)[0]);
  if (p === "" || p === "/") return fs.existsSync(path.join(OUT, "index.html"));
  const f = path.join(OUT, p);
  return (fs.existsSync(f) && fs.statSync(f).isFile()) || fs.existsSync(path.join(f, "index.html"));
};

// Required fields per schema.org type (Google rich-result rules + NAP equal to site config); [] = valid.
type Ld = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const isAbs = (u: unknown) => typeof u === "string" && u.startsWith(site.url);
function ldErrors(n: Ld, html = ""): string[] {
  const miss = (keys: string[]) => keys.filter((k) => k.split(".").reduce<Ld | undefined>((o, p) => o?.[p], n) == null).map((k) => `missing ${k}`);
  const h1 = textOf(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  switch (n["@type"]) {
    case "WebSite":
      return miss(["name", "url"]);
    case "Organization":
      return [...miss(["name", "url", "logo"]), ...(n.sameAs ?? []).filter((u: string) => !(Object.values(site.socials) as string[]).includes(u)).map((u: string) => `unknown sameAs ${u}`)];
    case "ProfessionalService": {
      const a = n.address ?? {};
      const nap = n.name === site.name && n.telephone === site.phone.tel && a.streetAddress === site.address.street && a.postalCode === site.address.postalCode && a.addressLocality === site.address.city;
      return [...miss(["name", "url", "telephone", "address.streetAddress", "address.postalCode", "address.addressLocality", "geo.latitude"]), ...(nap ? [] : ["NAP differs from site config"]), ...(n.areaServed?.length > 0 ? [] : ["without areaServed"])];
    }
    case "Service": {
      const city = !Array.isArray(n.areaServed) && n.areaServed?.name;
      const o = n.offers;
      return [
        ...miss(["name", "serviceType", "url", "provider.@id", "areaServed"]),
        ...(city && !h1.includes(city) ? [`areaServed ${city} not in the H1`] : []),
        ...(o && !(o.priceCurrency === "EUR" && Number(o.price) > 0 && isAbs(o.url)) ? ["invalid offers"] : []),
      ];
    }
    case "BreadcrumbList":
      return (n.itemListElement ?? []).length && n.itemListElement.every((it: Ld, i: number) => it.position === i + 1 && it.name && isAbs(it.item)) ? [] : ["invalid itemListElement"];
    case "FAQPage":
      return (n.mainEntity ?? []).length && n.mainEntity.every((q: Ld) => q.name && q.acceptedAnswer?.text) ? [] : ["invalid mainEntity"];
    case "Article":
      return miss(["headline", "url", "datePublished", "dateModified", "author.name", "publisher.name", "publisher.logo.url"]);
    default:
      return [`unexpected type`];
  }
}
const ldCount = { service: 0, offers: 0, article: 0 };

const errors: string[] = [];
const warnings: string[] = [];
for (const { url, html } of pages) {
  const head = html.slice(0, html.indexOf("</head>"));
  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = meta(head, "description") ?? "";
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const noindex = /name="robots" content="noindex/.test(head);
  if (h1 !== 1) errors.push(`${url}: ${h1} H1`);
  if (!title) errors.push(`${url}: no title`);
  if (!desc) errors.push(`${url}: no meta description`);
  if (noindex) continue; // 404 pages: no text, canonical, OG or sitemap checks
  if (title.length < 30 || title.length > 65) warnings.push(`${url}: title ${title.length} chars "${title}"`);
  if (desc.length < 70 || desc.length > 165) warnings.push(`${url}: description ${desc.length} chars`);
  const canonical = head.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0];
  if (!canonical || attr(canonical, "href") !== abs(url)) errors.push(`${url}: canonical ${canonical ? attr(canonical, "href") : "missing"}`);
  if (!meta(head, "og:image") || !meta(head, "twitter:image")) errors.push(`${url}: no OG/Twitter image`);
  if (meta(head, "og:title") !== title) errors.push(`${url}: og:title differs from title`);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      errors.push(`${url}: JSON-LD does not parse`);
      return {};
    }
  });
  const nodes = ld.flatMap((d) => d["@graph"] ?? [d]);
  const types = nodes.map((d) => d["@type"]);
  for (const t of ["WebSite", "Organization", "ProfessionalService"]) if (!types.includes(t)) errors.push(`${url}: no ${t} JSON-LD`);
  if (url !== "/" && !types.includes("BreadcrumbList")) errors.push(`${url}: no BreadcrumbList JSON-LD`);
  if (/aggregateRating/i.test(html) || types.some((t) => t === "Review" || t === "AggregateRating")) errors.push(`${url}: rating or review markup`);
  if (/<h2[^>]*id="faq-titre"/.test(html) && !types.includes("FAQPage")) errors.push(`${url}: FAQ without FAQPage JSON-LD`);
  for (const n of nodes) for (const e of ldErrors(n, html)) errors.push(`${url}: ${n["@type"]} ${e}`);
  ldCount.service += types.filter((t) => t === "Service").length;
  ldCount.offers += nodes.filter((n) => n["@type"] === "Service" && n.offers).length;
  ldCount.article += types.filter((t) => t === "Article").length;
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (attr(img, "alt") === undefined) errors.push(`${url}: img without alt ${attr(img, "src")}`);
  for (const a of html.match(/<a\b[^>]*>/g) ?? []) {
    let href = decode(attr(a, "href") ?? "");
    if (href.startsWith(site.url)) href = href.slice(site.url.length) || "/";
    if (href.startsWith("/") && !href.startsWith("//") && !resolves(href)) errors.push(`${url}: broken link ${href}`);
  }
}
const dup = (key: (p: Page) => string, label: string) => {
  const seen = new Map<string, string[]>();
  for (const p of pages.filter((p) => !/name="robots" content="noindex/.test(p.html))) seen.set(key(p), [...(seen.get(key(p)) ?? []), p.url]);
  for (const [v, urls] of seen) if (urls.length > 1) warnings.push(`duplicate ${label} "${v.slice(0, 60)}": ${urls.join(" ")}`);
};
dup((p) => decode(p.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""), "title");
dup((p) => meta(p.html, "description") ?? "", "description");

// Keyword match: accents, case and punctuation ignored, plural "s" dropped; every word in the title or every word in the H1.
const words = (s: string) => new Set(s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map((w) => w.replace(/s$/, "")));
const covers = (text: string, kw: string) => [...words(kw)].every((w) => words(text).has(w));
// Cannibalisation: one query (same word set, e.g. "punaise de lit Lyon" = "punaises de lit à Lyon") → one page only.
const querySet = (kw: string) => [...words(kw)].filter((w) => w !== "a").sort().join(" ");
const notes: string[] = []; // report only: other pages whose title AND H1 both carry a mapped query (to fix in M73)
const titleH1 = (html: string) => [textOf(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""), textOf(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "")];
for (const [i, { keyword, page }] of keywords.entries()) {
  const twin = keywords.findIndex((k) => querySet(k.keyword) === querySet(keyword));
  if (twin !== i) warnings.push(`keyword "${keyword}" duplicates "${keywords[twin].keyword}"${keywords[twin].page !== page ? " on another page (cannibalisation)" : ""}`);
  const p = pages.find((p) => p.url === (page ? `/${page}/` : "/"));
  if (!p) { warnings.push(`keyword "${keyword}": no page /${page}/`); continue; }
  const [title, h1] = titleH1(p.html);
  if (!covers(title, keyword) && !covers(h1, keyword)) warnings.push(`keyword "${keyword}" not in the title nor the H1 of ${p.url}`);
  for (const o of pages) if (o !== p && !/name="robots" content="noindex/.test(o.html) && titleH1(o.html).every((t) => covers(t, keyword))) notes.push(`"${keyword}" (${p.url}) also in title and H1 of ${o.url}`);
}

// M67 local pages (LocalBlock, data-local): ≥ 400 words of main text, and no near-duplicate pair (5-word shingle Jaccard < 0.5).
const mainWords = (html: string) => textOf((html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "").replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const shingles = (w: string[]) => new Set(w.slice(0, -4).map((_, i) => w.slice(i, i + 5).join(" ")));
const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x)).length / (new Set([...a, ...b]).size || 1);
const locals = pages.filter((p) => p.html.includes("data-local")).map((p) => ({ url: p.url, w: mainWords(p.html) }));
const similar: string[] = [];
for (const l of locals) if (l.w.length < 400) errors.push(`${l.url}: local page has ${l.w.length} words (< 400)`);
// M68 pest pages (data-pest): ≥ 400 words of main text too.
const pests = pages.filter((p) => p.html.includes("data-pest=")).map((p) => ({ url: p.url, w: mainWords(p.html) }));
for (const l of pests) if (l.w.length < 400) errors.push(`${l.url}: pest page has ${l.w.length} words (< 400)`);
// M70 sector pages (data-sector): ≥ 400 words of main text too.
const sectors = pages.filter((p) => p.html.includes("data-sector=")).map((p) => ({ url: p.url, w: mainWords(p.html) }));
for (const l of sectors) if (l.w.length < 400) errors.push(`${l.url}: sector page has ${l.w.length} words (< 400)`);
for (const [i, a] of locals.entries())
  for (const b of locals.slice(i + 1)) {
    const j = jaccard(shingles(a.w), shingles(b.w));
    similar.push(`${j.toFixed(2)} ${a.url} ${b.url}`);
    if (j >= 0.5) errors.push(`local pages too similar (Jaccard ${j.toFixed(2)}): ${a.url} ${b.url}`);
  }
similar.sort().reverse();

const sitemap = fs.existsSync(path.join(OUT, "sitemap.xml")) ? fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const indexable = pages.filter((p) => !/name="robots" content="noindex/.test(p.html)).map((p) => abs(p.url));
for (const u of indexable) if (!sitemapUrls.has(u)) errors.push(`sitemap: missing ${u}`);
for (const u of sitemapUrls) if (!indexable.includes(u)) errors.push(`sitemap: lists a non-page ${u}`);
if (!sitemapUrls.has(abs("/zones-d-intervention/"))) errors.push("sitemap: zones hub missing");
for (const i of inventory) if (!resolves(i.path)) errors.push(`old URL not served: ${i.path}`);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(
  REPORT,
  [`SEO audit: ${pages.length} pages, ${errors.length} errors, ${warnings.length} warnings (texts strict: ${STRICT_TEXTS})`, "", "## Errors", ...errors, "", "## Warnings", ...warnings, "", "## Competing pages (notes)", ...notes, "", `## Local pages (${locals.length}): words and most similar pairs`, ...locals.map((l) => `${l.w.length} ${l.url}`), ...similar.slice(0, 5), "", `## Pest pages (${pests.length}): words`, ...pests.map((l) => `${l.w.length} ${l.url}`), "", `## Sector pages (${sectors.length}): words`, ...sectors.map((l) => `${l.w.length} ${l.url}`), ""].join("\n"),
);

describe("SEO audit of out/", () => {
  it("has a static export to audit", () => {
    expect(pages.length).toBeGreaterThan(70);
    expect(fs.readFileSync(path.join(OUT, "robots.txt"), "utf8")).toContain(`Sitemap: ${abs("/sitemap.xml")}`);
  });
  it("passes the structure checks (H1, canonical, OG, JSON-LD, alt, links, sitemap, old URLs)", () => expect(errors).toEqual([]));
  it.runIf(STRICT_TEXTS)("has titles 30–65 and descriptions 70–165 characters, all unique, and every keyword on its page", () => expect(warnings).toEqual([]));
  it("has Service offers and Article markup, and the JSON-LD validator rejects bad nodes", () => {
    expect(ldCount.service).toBeGreaterThan(5);
    expect(ldCount.offers).toBeGreaterThan(5);
    expect(ldCount.article).toBeGreaterThan(20);
    expect(ldErrors({ "@type": "Article", headline: "x", url: abs("/") })).toContain("missing datePublished");
    expect(ldErrors({ "@type": "Organization", name: "x", url: "u", logo: "l", sameAs: ["https://example.com/"] })).toEqual(["unknown sameAs https://example.com/"]);
    expect(ldErrors({ "@type": "Service", name: "n", serviceType: "s", url: "u", provider: { "@id": "i" }, areaServed: { name: "Bron" } }, "<h1>Dératisation à Lyon</h1>")).toEqual(["areaServed Bron not in the H1"]);
    expect(ldErrors({ "@type": "AggregateRating" })).toEqual(["unexpected type"]);
  });
  it("audits the local pages (word count, similarity)", () => {
    expect(locals.length).toBeGreaterThanOrEqual(9);
    expect(jaccard(shingles("a b c d e f".split(" ")), shingles("a b c d e g".split(" ")))).toBeCloseTo(1 / 3);
  });
  it("checks the keyword matcher", () => {
    expect(covers("Entreprise punaises de lit à Lyon", "punaise de lit Lyon")).toBe(true);
    expect(covers("Dératisation à Villeurbanne", "dératisation Lyon")).toBe(false);
    expect(querySet("punaises de lit à Lyon")).toBe(querySet("Punaise de lit Lyon"));
  });
  it("maps at least 80 queries, each to one page", () => {
    expect(keywords.length).toBeGreaterThanOrEqual(80);
    expect(new Set(keywords.map((k) => querySet(k.keyword))).size).toBe(keywords.length);
  });
});
