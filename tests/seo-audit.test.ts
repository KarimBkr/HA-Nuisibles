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
  const types = ld.map((d) => d["@type"]);
  if (!types.includes("PestControlService")) errors.push(`${url}: no LocalBusiness JSON-LD`);
  if (url !== "/" && !types.includes("BreadcrumbList")) errors.push(`${url}: no BreadcrumbList JSON-LD`);
  if (/aggregateRating/i.test(html)) errors.push(`${url}: aggregateRating markup`);
  if (/<h2[^>]*id="faq-titre"/.test(html) && !types.includes("FAQPage")) errors.push(`${url}: FAQ without FAQPage JSON-LD`);
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
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, ""));
for (const [i, { keyword, page }] of keywords.entries()) {
  if (keywords.findIndex((k) => k.keyword.toLowerCase() === keyword.toLowerCase()) !== i) warnings.push(`keyword "${keyword}" targets several pages`);
  const p = pages.find((p) => p.url === (page ? `/${page}/` : "/"));
  if (!p) { warnings.push(`keyword "${keyword}": no page /${page}/`); continue; }
  const title = textOf(p.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const h1 = textOf(p.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  if (!covers(title, keyword) && !covers(h1, keyword)) warnings.push(`keyword "${keyword}" not in the title nor the H1 of ${p.url}`);
}

const sitemap = fs.existsSync(path.join(OUT, "sitemap.xml")) ? fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const indexable = pages.filter((p) => !/name="robots" content="noindex/.test(p.html)).map((p) => abs(p.url));
for (const u of indexable) if (!sitemapUrls.has(u)) errors.push(`sitemap: missing ${u}`);
for (const u of sitemapUrls) if (!indexable.includes(u)) errors.push(`sitemap: lists a non-page ${u}`);
for (const i of inventory) if (!resolves(i.path)) errors.push(`old URL not served: ${i.path}`);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(
  REPORT,
  [`SEO audit: ${pages.length} pages, ${errors.length} errors, ${warnings.length} warnings (texts strict: ${STRICT_TEXTS})`, "", "## Errors", ...errors, "", "## Warnings", ...warnings, ""].join("\n"),
);

describe("SEO audit of out/", () => {
  it("has a static export to audit", () => {
    expect(pages.length).toBeGreaterThan(70);
    expect(fs.readFileSync(path.join(OUT, "robots.txt"), "utf8")).toContain(`Sitemap: ${abs("/sitemap.xml")}`);
  });
  it("passes the structure checks (H1, canonical, OG, JSON-LD, alt, links, sitemap, old URLs)", () => expect(errors).toEqual([]));
  it.runIf(STRICT_TEXTS)("has titles 30–65 and descriptions 70–165 characters, all unique, and every keyword on its page", () => expect(warnings).toEqual([]));
  it("checks the keyword matcher", () => {
    expect(covers("Entreprise punaises de lit à Lyon", "punaise de lit Lyon")).toBe(true);
    expect(covers("Dératisation à Villeurbanne", "dératisation Lyon")).toBe(false);
  });
});
