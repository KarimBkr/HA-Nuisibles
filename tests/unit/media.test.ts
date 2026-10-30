import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");
const media: Record<string, { width: number; height: number; small: string; smallWidth: number }> = JSON.parse(
  fs.readFileSync(path.join(root, "content/media.json"), "utf8"),
);
const contentFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? contentFiles(path.join(dir, e.name)) : [path.join(dir, e.name)],
  );
const files = contentFiles(path.join(root, "content"));
const pub = (src: string) => path.join(root, "public", src);

describe("imported media", () => {
  it("leaves no old wp-content URL in content/", () => {
    for (const f of files) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/wp-content/);
  });

  it("has every referenced image in public/images with its media.json entry", () => {
    const refs = new Set(files.filter((f) => f.endsWith(".md")).flatMap((f) => fs.readFileSync(f, "utf8").match(/\/images\/[a-z0-9-]+\.webp/g) ?? []));
    expect(refs.size).toBeGreaterThan(30);
    for (const src of refs) {
      expect(media[src], src).toBeDefined();
      expect(fs.existsSync(pub(src)), src).toBe(true);
    }
    for (const [src, m] of Object.entries(media)) {
      expect(m.width > 0 && m.height > 0 && m.width <= 1200, src).toBe(true);
      expect(m.smallWidth <= 480 && fs.existsSync(pub(m.small)), m.small).toBe(true);
    }
  });

  it("keeps every image file under 250 KB", () => {
    for (const f of fs.readdirSync(pub("images"))) expect(fs.statSync(pub(`images/${f}`)).size, f).toBeLessThanOrEqual(250 * 1024);
  });

  it("has the logo and the icons", () => {
    for (const f of ["public/images/logo.webp", "public/images/logo.png", "src/app/icon.png", "src/app/apple-icon.png"])
      expect(fs.existsSync(path.join(root, f)), f).toBe(true);
  });
});
