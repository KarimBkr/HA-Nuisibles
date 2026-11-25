import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import inventory from "../content/url-inventory.json";
import keywords from "../content/keywords.json";
import { site } from "@/config/site";
import { SERVICES } from "@/config/services";
import { TARIFFS } from "@/config/tariffs";
import { allEntries } from "@/lib/content";

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

const words = (s: string) => new Set(s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map((w) => w.replace(/s$/, "")));
const mainWords = (html: string) => textOf((html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "").replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const covers = (text: string, kw: string) => [...words(kw)].every((w) => words(text).has(w));
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
  const GRID_AMOUNTS = new Set(TARIFFS.flatMap((c) => c.rows).map((r) => r.price.match(/^(\d+(?:,\d+)?) €/)?.[1]?.replace(",", ".")).filter(Boolean));
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
        // M81: the offered price is an amount of the official grid (src/config/tariffs.ts), never a made-up one.
        ...(o && !GRID_AMOUNTS.has(String(o.price)) ? [`offer price ${o.price} not in the tariff grid`] : []),
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
// M73 keyword first: the title's first word (articles skipped) belongs to one of the page's keywords.
const STOP = new Set(["le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "a"]);
const wordList = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map((w) => w.replace(/s$/, ""));
const titleStartsWith = (title: string, kw: string) => wordList(kw).includes(wordList(title)[0]);
const wordCounts: string[] = [];
// Listing pages (blog index, pagination, categories) and the booking tool: navigation, exempt from the 400 words (D-M73).
const THIN_OK = /^\/(conseils-nuisibles\/(page\/\d+\/)?|category\/[^/]+\/|rendez-vous\/)$/;
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
  const kws = keywords.filter((k) => (k.page ? `/${k.page}/` : "/") === url).map((k) => k.keyword);
  const kw = kws[0];
  if (kw && !kws.some((k) => titleStartsWith(title, k))) warnings.push(`${url}: title does not start with its keyword "${kw}": "${title}"`);
  const n = mainWords(html).length;
  wordCounts.push(`${n} ${url}`);
  if (n < 400 && !THIN_OK.test(url) && !/data-legal/.test(html)) errors.push(`${url}: ${n} words of main text (< 400)`);
  ldCount.service += types.filter((t) => t === "Service").length;
  ldCount.offers += nodes.filter((n) => n["@type"] === "Service" && n.offers).length;
  ldCount.article += types.filter((t) => t === "Article").length;
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    const alt = decode(attr(img, "alt") ?? "").trim();
    // M73: descriptive alt everywhere (not empty, not a file name), and WebP/SVG for every local image.
    if (alt.split(/\s+/).length < 2 || /\.(webp|png|jpe?g)/i.test(alt)) errors.push(`${url}: img alt not descriptive "${alt}" ${attr(img, "src")}`);
    for (const u of [attr(img, "src") ?? "", ...(attr(img, "srcset") ?? attr(img, "srcSet") ?? "").split(",").map((x) => x.trim().split(" ")[0])])
      if (u.startsWith("/images/") && !/\.(webp|svg)$/.test(u)) errors.push(`${url}: image not WebP ${u}`);
  }
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
// Cannibalisation: one query (same word set, e.g. "punaise de lit Lyon" = "punaises de lit à Lyon") → one page only.
const querySet = (kw: string) => [...words(kw)].filter((w) => w !== "a").sort().join(" ");
const notes: string[] = [];
const gaps: string[] = []; // M78 soft gaps: reported, not failing // report only: long-tail pages whose title and H1 also carry a shorter mapped query
const titleH1 = (html: string) => [textOf(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""), textOf(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "")];
for (const [i, { keyword, page }] of keywords.entries()) {
  const twin = keywords.findIndex((k) => querySet(k.keyword) === querySet(keyword));
  if (twin !== i) errors.push(`keyword "${keyword}" duplicates "${keywords[twin].keyword}"${keywords[twin].page !== page ? " on another page (cannibalisation)" : ""}`);
  const p = pages.find((p) => p.url === (page ? `/${page}/` : "/"));
  if (!p) { errors.push(`keyword "${keyword}": no page /${page}/`); continue; }
  const [title, h1] = titleH1(p.html);
  if (!covers(title, keyword) && !covers(h1, keyword)) errors.push(`keyword "${keyword}" not in the title nor the H1 of ${p.url}`);
  else if (!covers(title, keyword)) gaps.push(`keyword "${keyword}" in the H1 only, not the title, of ${p.url}`);
  for (const o of pages) {
    // The home is the umbrella page (its H1 names both trades): exempt (D-M73).
    if (o === p || o.url === "/" || /name="robots" content="noindex/.test(o.html) || THIN_OK.test(o.url) || !titleH1(o.html).every((t) => covers(t, keyword))) continue;
    // A page targeting a longer query that contains this one (« dératisation restaurant Lyon » ⊃ « dératisation Lyon ») is long tail, not a twin.
    const longTail = keywords.some((k) => (k.page ? `/${k.page}/` : "/") === o.url && [...words(keyword)].every((w) => words(k.keyword).has(w)) && words(k.keyword).size > words(keyword).size);
    (longTail ? notes : warnings).push(`"${keyword}" (${p.url}) also in title and H1 of ${o.url}${longTail ? " (long tail)" : " (cannibalisation)"}`);
  }
}

// M67 local pages (LocalBlock, data-local): ≥ 400 words of main text, and no near-duplicate pair (5-word shingle Jaccard < 0.5).
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
// M71 trust pages (data-trust): ≥ 400 words too.
const trust = pages.filter((p) => p.html.includes("data-trust=")).map((p) => ({ url: p.url, w: mainWords(p.html) }));
for (const l of trust) if (l.w.length < 400) errors.push(`${l.url}: trust page has ${l.w.length} words (< 400)`);
// M71 NAP identical everywhere: every footer, the contact and about pages' main text (the JSON-LD is checked by ldErrors).
const flat = (html: string) => textOf(html).replace(/\s+/g, " ");
const NAP = [site.name, site.address.street, `${site.address.postalCode} ${site.address.city}`, site.phone.display];
for (const p of pages) {
  const footer = flat(p.html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "");
  for (const v of NAP) if (!footer.includes(v)) errors.push(`${p.url}: footer NAP lacks "${v}"`);
}
for (const url of ["/contact/", "/a-propos/"]) {
  const main = flat(pages.find((p) => p.url === url)?.html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "");
  for (const v of NAP) if (!main.includes(v)) errors.push(`${url}: main text lacks NAP "${v}"`);
}
for (const [i, a] of locals.entries())
  for (const b of locals.slice(i + 1)) {
    const j = jaccard(shingles(a.w), shingles(b.w));
    similar.push(`${j.toFixed(2)} ${a.url} ${b.url}`);
    if (j >= 0.5) errors.push(`local pages too similar (Jaccard ${j.toFixed(2)}): ${a.url} ${b.url}`);
  }
similar.sort().reverse();
// M80 useful words: main text minus boilerplate (5-word shingles found on ≥ 4 pages: CTA, reviews, shared FAQ, price grid).
const shingleCount = new Map<string, number>();
for (const p of pages) for (const x of shingles(mainWords(p.html))) shingleCount.set(x, (shingleCount.get(x) ?? 0) + 1);
const usefulWords = (w: string[]) => w.slice(0, -4).filter((_, i) => (shingleCount.get(w.slice(i, i + 5).join(" ")) ?? 0) < 4).length;
// J4 high-potential pages (souris, restaurants, syndics, dépigeonnage Villeurbanne, punaises de lit) + every local, pest and sector page.
const HIGH_POTENTIAL = ["/desourisation/", "/lyon-souris/", "/professionnels/restaurants/", "/professionnels/syndics-coproprietes-collectivites/", "/depigeonnage/", "/nuisibles/punaises-de-lit/", "/entreprise-punaises-de-lit-lyon/", "/punaise-de-lit-a-villeurbanne/"];
const useful = [...new Set([...HIGH_POTENTIAL, ...[...locals, ...pests, ...sectors].map((l) => l.url)])]
  .map((url) => ({ url, n: usefulWords(mainWords(pages.find((p) => p.url === url)?.html ?? "")) }));
for (const u of useful) if (u.n < 400) errors.push(`${u.url}: ${u.n} useful words without the site-wide boilerplate (< 400)`);
// …and no near-duplicate pair among them (souris pages, punaises pages, towns: Jaccard < 0.5, as for the local pages).
const usefulSh = useful.map((u) => ({ url: u.url, sh: shingles(mainWords(pages.find((p) => p.url === u.url)?.html ?? "")) }));
let maxUseful = "";
for (const [i, a] of usefulSh.entries())
  for (const b of usefulSh.slice(i + 1)) {
    const j = jaccard(a.sh, b.sh);
    if (!maxUseful || j > parseFloat(maxUseful)) maxUseful = `${j.toFixed(2)} ${a.url} ${b.url}`;
    if (j >= 0.5) errors.push(`pages too similar (Jaccard ${j.toFixed(2)}): ${a.url} ${b.url}`);
  }

// M72 internal linking: click depth ≤ 3 from home (BFS over every <a>), no orphan, and the data-driven link rules (in <main>).
const linksOf = (html: string) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((m) => ({ href: decode(m[1]).replace(site.url, ""), text: flat(m[2]).trim() }))
    .filter((l) => l.href.startsWith("/") && !l.href.startsWith("//"))
    .map((l) => ({ ...l, href: decodeURIComponent(l.href.split(/[#?]/)[0]).replace(/([^/])$/, "$1/") }));
const byUrl = new Map(pages.map((p) => [p.url, p.html]));
const depth = new Map([["/", 0]]);
for (const queue = ["/"]; queue.length; ) {
  const u = queue.shift()!;
  for (const { href } of linksOf(byUrl.get(u) ?? "")) if (byUrl.has(href) && !depth.has(href)) (depth.set(href, depth.get(u)! + 1), queue.push(href));
}
const inbound = new Set(pages.flatMap((p) => linksOf(p.html).map((l) => l.href).filter((h) => h !== p.url)));
for (const p of pages.filter((p) => !/name="robots" content="noindex/.test(p.html))) {
  if (!depth.has(p.url)) errors.push(`${p.url}: not reachable from home`);
  else if (depth.get(p.url)! > 3) errors.push(`${p.url}: click depth ${depth.get(p.url)} (> 3)`);
  if (p.url !== "/" && !inbound.has(p.url)) errors.push(`${p.url}: orphan page`);
}
const mainLinks = (url: string) => linksOf(byUrl.get(url)?.match(/<main[\s\S]*?<\/main>/)?.[0] ?? "");
const localEntries = allEntries().filter((e) => e.kind === "local");
for (const l of localEntries) {
  const out = new Set(mainLinks(`/${l.slug}/`).map((x) => x.href));
  for (const o of localEntries) if (o !== l && (o.city === l.city || (l.service && o.service === l.service)) && !out.has(`/${o.slug}/`)) errors.push(`/${l.slug}/: no link to its ${o.city === l.city ? "city's" : "service's"} page /${o.slug}/`);
}
for (const s of SERVICES) {
  const out = new Set(mainLinks(`/${s.mainSlug}/`).map((x) => x.href));
  for (const o of localEntries) if (o.service === s.key && o.slug !== s.mainSlug && !out.has(`/${o.slug}/`)) errors.push(`/${s.mainSlug}/: service page without its city page /${o.slug}/`);
}
// M81: towns and services → articles (the posts → service/city direction is checked below).
const postUrls = new Set(allEntries().filter((e) => e.type === "post").map((e) => `/${e.slug}/`));
for (const u of new Set([...localEntries.map((l) => `/${l.slug}/`), ...SERVICES.map((s) => `/${s.mainSlug}/`)]))
  if (!mainLinks(u).some((l) => postUrls.has(l.href))) errors.push(`${u}: town or service page without a link to an article`);
const postAnchors = new Map<string, Set<string>>();
const postCount = new Map<string, number>();
for (const e of allEntries().filter((e) => e.type === "post")) {
  const aside = linksOf(byUrl.get(`/${e.slug}/`)?.match(/<aside[^>]*data-post-service[\s\S]*?<\/aside>/)?.[0] ?? "");
  const service = SERVICES.find((s) => s.key === e.service);
  const serviceHref = service ? `/${service.mainSlug}/` : "/nos-services/";
  const city = aside.find((l) => l.href !== serviceHref && (localEntries.some((o) => `/${o.slug}/` === l.href) || l.href === "/zones-d-intervention/"));
  if (!aside.some((l) => l.href === serviceHref)) errors.push(`/${e.slug}/: post without a link to its service ${serviceHref}`);
  if (!city && !localEntries.some((o) => `/${o.slug}/` === serviceHref)) errors.push(`/${e.slug}/: post without a link to its city page`);
  for (const l of aside) postCount.set(l.href, (postCount.get(l.href) ?? 0) + 1);
  for (const l of aside.filter((l) => l.href !== "/rendez-vous/")) postAnchors.set(l.href, (postAnchors.get(l.href) ?? new Set()).add(l.text.toLowerCase()));
}
// Varied anchors: a target linked from 3+ posts whose page has 2+ multi-word keywords gets 2+ different anchors.
for (const [href, a] of postAnchors) {
  const multi = keywords.filter((k) => `/${k.page}/` === href && k.keyword.includes(" ")).length;
  if (multi > 1 && postCount.get(href)! >= 3 && a.size < 2) errors.push(`${href}: every post links it with the same anchor "${[...a][0]}"`);
}
const linkReport = [...postAnchors].map(([h, a]) => `${postCount.get(h)} posts, ${a.size} anchors → ${h}: ${[...a].join(" | ")}`);
const depthHist = [...depth.values()].reduce<Record<number, number>>((h, d) => ({ ...h, [d]: (h[d] ?? 0) + 1 }), {});

const sitemap = fs.existsSync(path.join(OUT, "sitemap.xml")) ? fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8") : "";
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const indexable = pages.filter((p) => !/name="robots" content="noindex/.test(p.html)).map((p) => abs(p.url));
const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
for (const blk of urlBlocks) if (!/<lastmod>\d{4}-\d{2}-\d{2}/.test(blk)) errors.push(`sitemap: no lastmod for ${blk.match(/<loc>([^<]+)/)?.[1]}`);
// M73 useful 404: links to services, prices, booking and the phone.
const notFound = fs.existsSync(path.join(OUT, "404.html")) ? fs.readFileSync(path.join(OUT, "404.html"), "utf8") : "";
for (const h of ["/nos-services/", "/tarifs/", "/rendez-vous/", `tel:${site.phone.tel}`, `/${SERVICES[0].mainSlug}/`]) if (!notFound.includes(`href="${h}"`)) errors.push(`404: no link to ${h}`);
for (const u of indexable) if (!sitemapUrls.has(u)) errors.push(`sitemap: missing ${u}`);
for (const u of sitemapUrls) if (!indexable.includes(u)) errors.push(`sitemap: lists a non-page ${u}`);
if (!sitemapUrls.has(abs("/zones-d-intervention/"))) errors.push("sitemap: zones hub missing");
for (const i of inventory) if (!resolves(i.path)) errors.push(`old URL not served: ${i.path}`);

// M78 query map (.athanor/docs/SEO_MAP.md, workshop file: skipped when absent): one target per query, live rows = keywords.json.
const MAP = path.join(process.cwd(), ".athanor/docs/SEO_MAP.md");
const mapRows = fs.existsSync(MAP)
  ? fs.readFileSync(MAP, "utf8").split("\n").filter((l) => /^\| \d+ \|/.test(l)).map((l) => l.split("|").map((c) => c.trim())).map((c) => ({ q: c[2], t: c[3].replace(/`/g, ""), f: c[4], s: c[5] }))
  : [];
const kwTarget = (k: { page: string }) => (k.page ? `/${k.page}/` : "/");
const mapSeen = new Map<string, string>();
for (const r of mapRows) {
  const set = querySet(r.q);
  if (mapSeen.has(set)) errors.push(`query map: "${r.q}" mapped twice (${mapSeen.get(set)} and ${r.t})`);
  mapSeen.set(set, r.t);
  if (!byUrl.has(r.t)) errors.push(`query map: "${r.q}" targets a missing page ${r.t}`);
  const k = keywords.find((k) => querySet(k.keyword) === set);
  if (r.s === "live" && (!k || kwTarget(k) !== r.t)) errors.push(`query map: live "${r.q}" → ${r.t} is not in keywords.json with that target`);
  if (r.s !== "live" && k) errors.push(`query map: "${r.q}" is ${r.s} but in keywords.json`);
  if (r.s === "gap" || r.s === "hub") gaps.push(`query "${r.q}" (${r.f}) has no title/H1 target yet: ${r.s} → ${r.t}`);
}
if (mapRows.length) for (const k of keywords) if (!mapSeen.has(querySet(k.keyword))) errors.push(`query map: keywords.json "${k.keyword}" missing from SEO_MAP.md`);
const targeted = new Set(keywords.map(kwTarget));
for (const p of pages) {
  if (/name="robots" content="noindex/.test(p.html) || THIN_OK.test(p.url) || /data-legal/.test(p.html) || targeted.has(p.url)) continue;
  gaps.push(`${p.url}: indexable page with no target query`);
}
// M79 key pages: description opens with one of the page's keywords, and a FAQ of at least 4 questions in FAQPage JSON-LD
// (pages whose old-site FAQ had more than 6 real questions keep them all, D-M79).
const KEY_PAGES = ["/", "/nos-services/", "/tarifs/", "/deratisation-lyon-2/", "/deratisation-villeurbanne/", "/desinsectisation-lyon-2/",
  "/desinsectisation-villeurbanne/", "/entreprise-punaises-de-lit-lyon/", "/punaise-de-lit-a-villeurbanne/", "/nid-guepes-frelons-lyon/",
  "/nid-guepes-frelons-villeurbanne/", "/nuisibles-villeurbanne/", "/desourisation/", "/depigeonnage/", "/depigeonnage-tarif/",
  "/prix-deratisation/", "/tarif-desinsectisation-lyon/", "/tarif-destruction-nid-de-guepes/", "/professionnels/",
  "/professionnels/restaurants/", "/professionnels/syndics-coproprietes-collectivites/", "/professionnels/commerces-bureaux/", "/professionnels/hotels/"];
const faqCount = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => { const d = JSON.parse(m[1]); return d["@graph"] ?? [d]; })
    .filter((n) => n["@type"] === "FAQPage").reduce((s, n) => s + (n.mainEntity?.length ?? 0), 0);
const keyErrors = KEY_PAGES.flatMap((url) => {
  const p = pages.find((x) => x.url === url);
  if (!p) return [`${url}: key page missing from out/`];
  const kws = keywords.filter((k) => kwTarget(k) === url).map((k) => k.keyword);
  const desc = meta(p.html, "description") ?? "";
  return [
    ...(kws.length ? [] : [`${url}: key page without a target keyword`]),
    ...(kws.some((k) => titleStartsWith(desc, k)) ? [] : [`${url}: description does not start with a keyword (${kws[0]}): "${desc.slice(0, 50)}"`]),
    ...(/^[*"«\s]/.test(desc) ? [`${url}: description starts with markup or a quote`] : []),
    ...(faqCount(p.html) >= 4 ? [] : [`${url}: FAQ has ${faqCount(p.html)} questions in FAQPage JSON-LD (needs 4+)`]),
  ];
});
for (const w of wordCounts) if (parseInt(w) >= 400 && parseInt(w) < 500) gaps.push(`${w.split(" ")[1]}: ${parseInt(w)} words (just above 400)`);

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(
  REPORT,
  [`SEO audit: ${pages.length} pages, ${errors.length} errors, ${warnings.length} warnings, ${gaps.length} soft gaps (texts strict: ${STRICT_TEXTS}); query map ${mapRows.length} queries, ${keywords.length} live`, "", "## Errors", ...errors, "", "## Warnings", ...warnings, "", `## Soft gaps (${gaps.length})`, ...gaps, "", "## Competing pages (notes)", ...notes, "", "## Main text words per page", ...wordCounts.sort((x, y) => parseInt(x) - parseInt(y)), "", "## Useful words (boilerplate removed) of the high-potential, local, pest and sector pages", `most similar pair: ${maxUseful}`, ...useful.sort((a, b) => a.n - b.n).map((u) => `${u.n} ${u.url}`), "", `## Local pages (${locals.length}): words and most similar pairs`, ...locals.map((l) => `${l.w.length} ${l.url}`), ...similar.slice(0, 5), "", `## Pest pages (${pests.length}): words`, ...pests.map((l) => `${l.w.length} ${l.url}`), "", `## Sector pages (${sectors.length}): words`, ...sectors.map((l) => `${l.w.length} ${l.url}`), "", `## Trust pages (${trust.length}): words`, ...trust.map((l) => `${l.w.length} ${l.url}`), "", `## Internal links: click depth from home ${JSON.stringify(depthHist)}; post aside anchors per target`, ...linkReport, ""].join("\n"),
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
  it("measures useful words without the boilerplate (M80)", () => {
    if (pages.length) expect(useful.length).toBeGreaterThanOrEqual(HIGH_POTENTIAL.length);
    expect(usefulWords([])).toBe(0);
  });
  it("audits the local pages (word count, similarity)", () => {
    expect(locals.length).toBeGreaterThanOrEqual(9);
    expect(trust.map((t) => t.url).sort()).toEqual(["/a-propos/", "/avis/", "/garanties/"]);
    expect(jaccard(shingles("a b c d e f".split(" ")), shingles("a b c d e g".split(" ")))).toBeCloseTo(1 / 3);
  });
  it("parses internal links (M72)", () => {
    expect(linksOf('<a href="https://x/a">A</a><a href="/b?x=1#c"><b>B</b></a>').map((l) => l.href)).toEqual(["/b/"]);
  });
  it("checks the keyword matcher", () => {
    expect(covers("Entreprise punaises de lit à Lyon", "punaise de lit Lyon")).toBe(true);
    expect(covers("Dératisation à Villeurbanne", "dératisation Lyon")).toBe(false);
    expect(querySet("punaises de lit à Lyon")).toBe(querySet("Punaise de lit Lyon"));
  });
  it("gives the key pages a keyword-first description and a FAQ in FAQPage JSON-LD (M79)", () => {
    expect(KEY_PAGES.length).toBeGreaterThanOrEqual(20);
    expect(keyErrors).toEqual([]);
  });
  it("maps at least 80 queries, each to one page", () => {
    expect(keywords.length).toBeGreaterThanOrEqual(80);
    if (fs.existsSync(MAP)) expect(mapRows.length).toBeGreaterThanOrEqual(80);
    expect(new Set(keywords.map((k) => querySet(k.keyword))).size).toBe(keywords.length);
  });
});
