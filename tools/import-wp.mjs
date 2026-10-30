#!/usr/bin/env node
// One-shot importer: old WordPress site (REST API) → content/pages/*.md, content/posts/*.md, content/url-inventory.json.
// Re-runnable: API responses are cached in .cache/wp/ and reused when the site is unreachable.
// Usage: node tools/import-wp.mjs [--refresh]   (--refresh ignores the cache and refetches)
import fs from "node:fs";
import path from "node:path";
import domino from "@mixmark-io/domino";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { SERVICES } from "../src/config/services.ts";

const SITE = "https://hanuisibles.fr";
const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(ROOT, ".cache/wp");
const OUT = path.join(ROOT, "content");
const refresh = process.argv.includes("--refresh");

async function fetchList(type) {
  const file = path.join(CACHE, `${type}.json`);
  if (!refresh && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  try {
    const res = await fetch(`${SITE}/wp-json/wp/v2/${type}?per_page=100`, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data));
    return data;
  } catch (e) {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
    throw new Error(`Cannot fetch ${type} from ${SITE} and no cache in ${file}: ${e.message}`);
  }
}

const text = (html) => domino.createDocument(`<p>${html}</p>`).body.textContent.replace(/​/g, "").trim();
const SUFFIX = / [-–|] (HA|Ha) Nuisibles.*$/;

// --- HTML cleanup: Elementor wrappers, scripts, styles, forms, icons and attributes go away; text stays.
const KEEP_ATTRS = new Set(["href", "src", "alt", "title", "colspan", "rowspan"]);
function cleanHtml(html) {
  const doc = domino.createDocument(`<div id="root">${html}</div>`);
  const root = doc.getElementById("root");
  const drop = "script,style,noscript,svg,form,iframe,button,input,select,textarea,link,meta," +
    ".elementor-widget-google_maps,.elementor-widget-fluent-form-widget,.elementor-widget-shortcode," +
    ".elementor-widget-divider,.elementor-widget-spacer,.elementor-toggle-icon,.elementor-accordion-icon";
  // Custom FAQ accordions put the question in a <button>: keep it as a heading.
  Array.from(root.querySelectorAll("button")).forEach((b) => {
    Array.from(b.querySelectorAll("[class*=toggle],[class*=icon]")).forEach((el) => el.remove());
    const q = b.textContent.replace(/\s+/g, " ").trim();
    if (/\?$/.test(q)) { const h = doc.createElement("h3"); h.textContent = q; b.replaceWith(h); }
  });
  Array.from(root.querySelectorAll(drop)).forEach((el) => el.remove());
  const toH3 = (el, title) => { const h = doc.createElement("h3"); h.textContent = title; el.replaceWith(h); return h; };
  // FAQ widgets become "### Question ?" + answer so a single extraction path handles them.
  Array.from(root.querySelectorAll("details")).forEach((d) => {
    const s = d.querySelector("summary");
    const frag = doc.createElement("div");
    if (s) { toH3(s, s.textContent.trim()); }
    while (d.firstChild) frag.appendChild(d.firstChild);
    d.replaceWith(frag);
  });
  Array.from(root.querySelectorAll(".elementor-tab-title")).forEach((t) => toH3(t, t.textContent.trim()));
  Array.from(root.querySelectorAll("img")).forEach((img) => {
    const lazy = img.getAttribute("data-lazy-src") || img.getAttribute("data-src");
    if (lazy) img.setAttribute("src", lazy);
  });
  Array.from(root.querySelectorAll("*")).forEach((el) => {
    for (const a of Array.from(el.attributes)) if (!KEEP_ATTRS.has(a.name)) el.removeAttribute(a.name);
  });
  Array.from(root.querySelectorAll("a[href]")).forEach((a) => {
    const href = a.getAttribute("href");
    if (href.startsWith(SITE + "/") && !href.includes("/wp-content/")) a.setAttribute("href", href.slice(SITE.length));
  });
  return root;
}

const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced", emDelimiter: "*" });
td.use(gfm);
td.remove(["head", "title"]);

// --- FAQ: the questions after a "FAQ"/"Questions fréquentes" heading move to frontmatter (rendered as accordion + JSON-LD).
const FAQ_RE = /\bFAQ\b|questions? fr[ée]quentes|vos questions/i;
function extractFaq(md) {
  const lines = md.split("\n");
  const head = (l) => /^(#{1,6})\s+(.*)$/.exec(l);
  const clean = (t) => t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[\u200b*]/g, "").trim();
  // A question is a heading ending with "?" or a paragraph made only of a bold question.
  const question = (l) => {
    const h = head(l.replace(/^\s*-\s+(?=#)/, "")); // some FAQs are lists of headings
    if (h) return /\?$/.test(clean(h[2])) ? clean(h[2]) : null;
    const b = /^\*\*([^*]+\?)\s*\*\*\s*$/.exec(l.trim()) || /^([A-ZÀ-Ý][^*#\[\n]{5,180}\?)$/.exec(l.trim());
    return b ? clean(b[1]) : null;
  };
  const start = lines.findIndex((l) => { const h = head(l); return h && FAQ_RE.test(h[2]); });
  if (start < 0) return { body: md, faq: [] };
  const level = head(lines[start])[1].length;
  let title = clean(head(lines[start])[2]);
  const faq = [];
  let end = lines.length, cur = null, subtitle = true;
  const intro = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (!lines[i].trim()) { if (cur) cur.a.push(""); continue; }
    const q = question(lines[i]);
    if (q) { cur = { q, a: [] }; faq.push(cur); subtitle = false; continue; }
    const h = head(lines[i]);
    if (h && subtitle) { subtitle = false; if (FAQ_RE.test(h[2])) title = clean(h[2]); continue; } // "## FAQ" directly followed by its subtitle heading
    subtitle = false;
    if (h && (h[1].length <= level || cur)) { end = i; break; }
    if (cur) cur.a.push(lines[i]); else intro.push(lines[i].replace(/^#+\s+/, ""));
  }
  const items = faq.map((f) => ({ q: f.q, a: f.a.join("\n").trim() })).filter((f) => f.a);
  if (!items.length) return { body: md, faq: [] };
  const body = [...lines.slice(0, start), ...lines.slice(end)].join("\n");
  return { body, faq: items, faqTitle: title, faqIntro: intro.join("\n").trim() };
}

function toMarkdown(html) {
  const root = cleanHtml(html);
  // The first H1 goes to frontmatter; other H1s become H2 (one H1 per page).
  const h1s = Array.from(root.querySelectorAll("h1"));
  const h1 = h1s[0]?.textContent.replace(/​/g, "").trim();
  h1s[0]?.remove();
  h1s.slice(1).forEach((h) => { const h2 = h.ownerDocument.createElement("h2"); h2.innerHTML = h.innerHTML; h.replaceWith(h2); });
  let md = td.turndown(root.innerHTML)
    .replace(/​/g, "")
    .replace(/\[\]\([^)]*\)/g, "") // empty links of icon-only Elementor boxes
    .replace(/^(#{1,6})\s*$/gm, "") // empty headings left by icon-only Elementor boxes
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { h1, ...extractFaq(md) };
}

// --- Classification of old pages (kind, service, city).
const serviceOf = (slug) => SERVICES.find((s) => s.mainSlug === slug || s.relatedSlugs.includes(slug))?.key;
function kindOf(slug) {
  if (slug === "") return "home";
  if (slug === "conseils-nuisibles") return "blog";
  if (slug === "contact") return "contact";
  if (["mentions-legales", "confidentalite"].includes(slug)) return "legal";
  if (/^(tarif|prix)-|-tarif$/.test(slug)) return "price";
  if (/^(comment|peut-on|guide)-|que-faire$/.test(slug)) return "guide";
  if (/lyon|villeurbanne/.test(slug)) return "local";
  return "service";
}
const cityOf = (slug) => (/villeurbanne/.test(slug) ? "villeurbanne" : /lyon/.test(slug) ? "lyon" : undefined);

const yaml = (obj) => {
  const out = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || (v === "" && k !== "slug") || (Array.isArray(v) && !v.length)) continue;
    if (Array.isArray(v)) {
      out.push(`${k}:`);
      for (const it of v) out.push(`  - q: ${JSON.stringify(it.q)}`, `    a: ${JSON.stringify(it.a)}`);
    } else out.push(`${k}: ${JSON.stringify(v)}`);
  }
  out.push("---", "");
  return out.join("\n");
};

function firstImage(md) { return /!\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)/.exec(md)?.[1]; }

function convert(item, type, categories) {
  const slug = new URL(item.link).pathname.replace(/^\/|\/$/g, "");
  const y = item.yoast_head_json || {};
  const { h1, body, faq, faqTitle, faqIntro } = toMarkdown(item.content.rendered);
  const oldTitle = y.title || text(item.title.rendered);
  const title = oldTitle.replace(SUFFIX, "").trim();
  const excerpt = text(item.excerpt?.rendered || "");
  const description = y.description || y.og_description || excerpt.slice(0, 160);
  const cat = categories.find((c) => item.categories?.includes(c.id) && c.slug !== "uncategorized") ||
    categories.find((c) => item.categories?.includes(c.id));
  const fm = {
    slug, title, description,
    h1: h1 || text(item.title.rendered),
    kind: type === "posts" ? "post" : kindOf(slug),
    service: serviceOf(slug),
    city: cityOf(slug),
    image: y.og_image?.[0]?.url || firstImage(body),
    date: type === "posts" ? item.date.slice(0, 10) : undefined,
    modified: item.modified.slice(0, 10),
    category: cat?.slug,
    faqTitle, faqIntro, faq,
    oldUrl: item.link, oldTitle, oldDescription: y.description,
  };
  return { slug, file: `${slug || "home"}.md`, md: yaml(fm) + body + "\n", title: text(item.title.rendered) };
}

const [pages, posts, categories] = await Promise.all(["pages", "posts", "categories"].map(fetchList));
const inventory = [];
for (const [type, list] of [["pages", pages], ["posts", posts]]) {
  const dir = path.join(OUT, type);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const item of list.filter((i) => i.status === "publish")) {
    const r = convert(item, type, categories);
    fs.writeFileSync(path.join(dir, r.file), r.md);
    inventory.push({ url: item.link, path: `/${r.slug}${r.slug ? "/" : ""}`, type: type.slice(0, -1), file: `content/${type}/${r.file}`, title: r.title });
  }
}
for (const c of categories) inventory.push({ url: c.link, path: new URL(c.link).pathname, type: "category", slug: c.slug, title: text(c.name), count: c.count });
fs.writeFileSync(path.join(OUT, "url-inventory.json"), JSON.stringify(inventory, null, 2) + "\n");
console.log(`Imported ${pages.length} pages, ${posts.length} posts, ${categories.length} categories → content/`);
