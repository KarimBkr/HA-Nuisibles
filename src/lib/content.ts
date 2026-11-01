import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { ServiceKey } from "@/config/services";

// Build-time access to content/pages and content/posts (Markdown sanitized by tools/import-wp.mjs).

export type Faq = { q: string; a: string };
export type Entry = {
  type: "page" | "post";
  slug: string;
  title: string;
  description: string;
  h1: string;
  kind: string;
  service?: ServiceKey;
  city?: string;
  image?: string;
  date?: string;
  modified?: string;
  category?: string;
  faqTitle?: string;
  faqIntro?: string;
  faq?: Faq[];
  body: string;
};

export const CATEGORIES: Record<string, string> = {
  "conseils-nuisibles": "Conseils nuisibles",
  "reconnaitre-nuisible": "Reconnaître un nuisible",
  "traitements-nuisibles": "Traitements des nuisibles",
  "duree-intervention-nuisibles": "Durée d'intervention",
  uncategorized: "Actualités",
};

/** Slugs served by their own route (home M9, contact M10, blog index M12). */
export const OWN_ROUTES = new Set(["", "contact", "conseils-nuisibles"]);

const ROOT = path.join(process.cwd(), "content");

function load(type: Entry["type"]): Entry[] {
  const dir = path.join(ROOT, `${type}s`);
  return fs.readdirSync(dir).map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    const entry = { ...(data as Omit<Entry, "type" | "body">), type, body: content };
    if (type === "post") entry.service ??= postService(entry.slug);
    return entry;
  });
}

// Posts have no service in their frontmatter: inferred from the slug, for the related-service links.
const POST_SERVICES: [RegExp, ServiceKey][] = [
  [/punaise/, "punaises-de-lit"],
  [/(^|-)rats?(-|$)|souris|deratis/, "deratisation"],
  [/guepe|frelon/, "guepes-frelons"],
  [/pigeon/, "depigeonnage"],
  [/moustique/, "demoustication"],
  [/cafard|blatte|fourmi|mouche|mite|araignee|insecte|puce/, "desinsectisation"],
];
export const postService = (slug: string) => POST_SERVICES.find(([re]) => re.test(slug))?.[1];

let cache: Entry[] | undefined;
export function allEntries(): Entry[] {
  // Posts newest first; pages in file order.
  cache ??= [...load("page"), ...load("post").sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))];
  return cache;
}

export const getEntry = (slug: string) => allEntries().find((e) => e.slug === slug);
export const routedEntries = () => allEntries().filter((e) => !OWN_ROUTES.has(e.slug));
export const posts = () => allEntries().filter((e) => e.type === "post");

export const POSTS_PER_PAGE = 9;
export const pageCount = () => Math.ceil(posts().length / POSTS_PER_PAGE);
/** Posts of blog page n (1-based), newest first. */
export const postsPage = (n: number) => posts().slice((n - 1) * POSTS_PER_PAGE, n * POSTS_PER_PAGE);

/** Up to n other posts, same category first, then the most recent. */
export function relatedPosts(entry: Entry, n = 3): Entry[] {
  const others = posts().filter((p) => p.slug !== entry.slug);
  const same = others.filter((p) => p.category && p.category === entry.category);
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, n);
}

// Links of the old texts to pages that never existed on the old site (404 there too) → closest existing page.
const DEAD_LINKS: Record<string, string> = {
  "comment-se-debarrasser-des-cafards": "/guide-cafards-blattes/",
  "deratisation-lyon": "/deratisation-lyon-2/",
  "dératisation-lyon": "/deratisation-lyon-2/",
  "depigeonnage-villeurbanne": "/depigeonnage/",
  "desinfection-villeurbanne": "/desinfection/",
  "desinsectisation-lyon": "/desinsectisation-lyon-2/",
  "quest-ce-que-la-desinsectisation": "/desinsectisation-lyon-2/",
  "traitement-cafards-lyon": "/desinsectisation-lyon-2/",
  "traitement-cafards-villeurbanne": "/desinsectisation-villeurbanne/",
  "destruction-nid-de-guepes": "/destruction-nid-guepes-frelons/",
  devis: "/contact/#mon-devis",
  "erreurs-a-eviter-pour-se-debarrasser-des-nuisibles": "/erreurs-a-eviter-pour-se-debarasser-des-nuisibles/",
  "punaise-de-lit-lyon": "/entreprise-punaises-de-lit-lyon/",
  "punaises-de-lit-lyon": "/entreprise-punaises-de-lit-lyon/",
  "punaises-de-lit": "/entreprise-punaises-de-lit-lyon/",
  "punaise-de-lit-villeurbanne": "/punaise-de-lit-a-villeurbanne/",
  "tarif-desinsectisation-cafard": "/tarif-desinsectisation-cafard-2026/",
  "tarif-desinsectisation-cafard-2025": "/tarif-desinsectisation-cafard-2026/",
  "nuisibles-lyon": "/nos-services/",
  services: "/nos-services/",
  tarifs: "/nos-services/",
  // City pages announced but never published: the contact page lists the whole zone.
  "nuisibles-annecy": "/contact/",
  "nuisibles-annemasse": "/contact/",
  "nuisibles-bourg-en-bresse": "/contact/",
  "nuisibles-grenoble": "/contact/",
  "nuisibles-saint-etienne": "/contact/",
  "villefranche-sur-saone": "/contact/",
  "zones-intervention": "/contact/",
};

/** Markdown → HTML; absolute links to the old domain become site-relative, quote anchors point at the contact form, dead links are redirected. */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true });
  return html
    .replace(/href="https?:\/\/(?:www\.)?hanuisibles\.fr(\/[^"]*)?"/g, (_, p: string | undefined) => `href="${p ?? "/"}"`)
    .replace(/href="(?:\/contact\/?)?#mon-devis"/g, 'href="/contact/#mon-devis"')
    .replace(/href="\/([^"/#?]+)\/?"/g, (m, s: string) => (DEAD_LINKS[decodeURIComponent(s)] ? `href="${DEAD_LINKS[decodeURIComponent(s)]}"` : m))
    .replace(/<table>/g, '<table tabindex="0">'); // tables scroll sideways on mobile: reachable by keyboard
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export type PriceItem = { label?: string; text: string };
export const PRICE_RE = /\d[\d\s ]*(?:,\d+)?\s?€/;

const plain = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/^\s*(?:[-+]\s+|\d+\.\s+)/, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Price lines of a page body, verbatim (prices are never invented): table rows with a price, and short lines
 * with a price; a line that starts with the amount takes the short label line just above it.
 * shortcut: heuristic on the imported Markdown layout, revisit if the content is re-edited by hand.
 */
export function priceItems(body: string, max = 8): PriceItem[] {
  const items: PriceItem[] = [];
  const lines = body.split("\n");
  let prev = "";
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("|")) {
      const cells = line.split("|").slice(1, -1).map(plain);
      const price = cells.find((c) => PRICE_RE.test(c));
      if (price && cells[0] !== price) items.push({ label: cells[0].replace(/\s*:$/, ""), text: price });
    } else if (!line.startsWith("#") && PRICE_RE.test(line)) {
      const text = plain(line);
      if (text.length <= 110) {
        const label = /^(\d|à partir|dès)/i.test(text) && prev.length <= 60 && !/[\d€#[]/.test(prev) ? prev.replace(/\s*:$/, "") : undefined;
        items.push(label ? { label, text } : { text });
      }
    }
    prev = line.startsWith("|") || line.startsWith("#") ? "" : plain(line);
  }
  const seen = new Set<string>();
  return items.filter((i) => !seen.has(i.label + i.text) && seen.add(i.label + i.text)).slice(0, max);
}

export type Section = { title: string; body: string };

// Splits a body at its level-2 headings: the intro stays visible, each section folds (service pages).
export function splitSections(body: string): { intro: string; sections: Section[] } {
  const [intro, ...rest] = body.split(/^## +/m);
  return {
    intro: intro.trim(),
    sections: rest.map((s) => {
      const nl = s.indexOf("\n");
      return { title: (nl < 0 ? s : s.slice(0, nl)).trim(), body: nl < 0 ? "" : s.slice(nl + 1).trim() };
    }),
  };
}
