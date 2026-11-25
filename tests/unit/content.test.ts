import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = (type: string) => path.resolve(__dirname, "../../content", type);
const load = (type: string) =>
  fs.readdirSync(dir(type)).map((f) => {
    const raw = fs.readFileSync(path.join(dir(type), f), "utf8");
    return { file: f, raw, ...matter(raw) };
  });
// Pages written after the import (frontmatter `origin: "new"`, M77) have no old URL.
const added = load("pages").filter((p) => p.data.origin === "new");
const pages = load("pages").filter((p) => p.data.origin !== "new");
const posts = load("posts");
const all = [...pages, ...posts];
// Headings may carry inline emphasis or links in the Markdown; compare plain text.
const plain = (md: string) => md.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*\\]/g, "");

describe("imported content", () => {
  it("has every old page and post", () => {
    expect(pages).toHaveLength(33);
    expect(posts).toHaveLength(39);
    expect(pages.find((p) => p.file === "home.md")?.data.slug).toBe("");
  });

  it("has the frontmatter contract on every file", () => {
    for (const { file, data } of all) {
      for (const key of ["title", "description", "h1", "kind", "oldUrl"]) expect(data[key], `${file} ${key}`).toBeTruthy();
      expect(typeof data.slug, file).toBe("string");
      expect(data.oldUrl, file).toBe(`https://hanuisibles.fr/${data.slug}${data.slug ? "/" : ""}`);
    }
    for (const { file, data } of posts) expect(data.date, file).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const { file, data } of added) for (const key of ["title", "description", "h1", "kind", "modified"]) expect(data[key], `${file} ${key}`).toBeTruthy();
    const slugs = [...all, ...added].map((a) => a.data.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("is free of WordPress/Elementor markup", () => {
    for (const { file, raw } of all) expect(raw, file).not.toMatch(/<script|<style|style=|elementor|<form|<svg/i);
  });

  it("keeps the old headings verbatim", () => {
    const body = (file: string) => plain(all.find((a) => a.file === file)!.content);
    expect(body("home.md")).toContain("## Votre partenaire anti nuisibles");
    expect(body("deratisation-lyon-2.md")).toContain("## Signes d'une infestation de rats ou souris à Lyon");
    // Posts were reworked in M13 (original headings in content/archive/posts/).
    expect(body("guide-complet-punaises-lit-elimination-definitive.md")).toContain(
      "## Comment détecter les punaises de lit ? Identification et signaux d’alerte 🔍",
    );
  });

  it("extracts FAQs as question/answer pairs", () => {
    const faqs = all.flatMap((a) => (a.data.faq ?? []) as { q: string; a: string }[]);
    expect(faqs.length).toBeGreaterThan(200);
    for (const f of faqs) {
      expect(f.q).toMatch(/\?$/);
      expect(f.a.length).toBeGreaterThan(0);
    }
    expect(pages.find((p) => p.file === "home.md")!.data.faq[0].q.replace(/\u00a0/g, " ")).toBe(
      "En combien de temps intervenez-vous à Lyon et Villeurbanne ?",
    );
  });

  it("lists every old URL in the inventory", () => {
    const inv = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../content/url-inventory.json"), "utf8"));
    expect(inv.filter((u: { type: string }) => u.type === "category")).toHaveLength(5);
    expect(inv).toHaveLength(33 + 39 + 5);
    for (const u of inv.filter((u: { file?: string }) => u.file)) expect(fs.existsSync(path.resolve(__dirname, "../..", u.file))).toBe(true);
  });
});
