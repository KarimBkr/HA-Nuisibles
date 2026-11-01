import { describe, expect, it } from "vitest";
import { splitSections } from "../../src/lib/content";

describe("splitSections", () => {
  it("keeps the intro and every level-2 section, deeper headings stay inside", () => {
    const r = splitSections("Intro **bold**\n\n## A\ntext a\n### a1\nmore\n## B\n");
    expect(r.intro).toBe("Intro **bold**");
    expect(r.sections).toEqual([{ title: "A", body: "text a\n### a1\nmore" }, { title: "B", body: "" }]);
  });
  it("handles a body without sections", () => {
    expect(splitSections("only text")).toEqual({ intro: "only text", sections: [] });
  });
});
