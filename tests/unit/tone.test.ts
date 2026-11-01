import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Client rule (2026-11-01 evening): sentence case only, short titles, always « vous ».
const root = path.resolve(__dirname, "../..");
const files = ["pages", "posts"].flatMap((t) =>
  fs.readdirSync(path.join(root, "content", t)).map((f) => path.join("content", t, f)),
);
const srcFiles = (d: string): string[] =>
  fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? srcFiles(path.join(d, e.name)) : /\.(tsx?|json)$/.test(e.name) ? [path.join(d, e.name)] : [],
  );

describe("case and tone", () => {
  it("titles, H1s, headings, FAQ questions and link labels are in sentence case", () => {
    const out = execFileSync("python3", ["tools/sentence_case.py", "--check", ...files], { cwd: root, encoding: "utf8" });
    expect(out.trim()).toBe("0 file(s) need fixing");
  });

  it("H1s are short (6 words where possible, never more than 8)", () => {
    const long = files
      .map((f) => String(matter(fs.readFileSync(path.join(root, f), "utf8")).data.h1))
      .filter((h) => h.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length > 8);
    expect(long).toEqual([]);
  });

  it("never uses tutoiement", () => {
    const tu = /(^|[\s«"'(])(tu|toi|ton|ta|tes|t['’](?:es|as|inquiète))(?=[\s,.!?»"')])/i;
    const hits = [...files, ...srcFiles("src"), ...srcFiles("content").filter((f) => !f.includes("archive"))]
      .flatMap((f) => fs.readFileSync(path.join(root, f), "utf8").split("\n").map((l, i) => [f, i + 1, l] as const))
      .filter(([, , l]) => tu.test(l))
      .map(([f, n, l]) => `${f}:${n}: ${l.slice(0, 80)}`);
    expect(hits).toEqual([]);
  });
});
