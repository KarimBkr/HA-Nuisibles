import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import fs from "node:fs";

// M38: only Poppins 400 and 700 are shipped; no source may ask for another weight.
describe("font weights", () => {
  it("layout imports only Poppins 400 and 700", () => {
    const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
    expect(layout.match(/@fontsource\/poppins\/\d+\.css/g)).toEqual(["@fontsource/poppins/400.css", "@fontsource/poppins/700.css"]);
  });
  it("no source uses weights 500/600 or other weight classes", () => {
    const hits = execSync("grep -rnE 'font-(thin|extralight|light|medium|semibold|extrabold|black)\\b|font-weight: *[1-35689]00' src || true").toString();
    expect(hits).toBe("");
  });
});
