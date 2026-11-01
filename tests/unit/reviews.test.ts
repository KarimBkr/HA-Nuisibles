import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import data from "../../content/reviews.json";
import Reviews from "@/components/Reviews";

const html = (props: Parameters<typeof Reviews>[0]) => renderToStaticMarkup(createElement(Reviews, props));

describe("reviews", () => {
  it("keeps the old site's 3 reviews and 5/5 (16 avis) as text", () => {
    expect(data.items.map((r) => r.author)).toEqual(["Claire M., Lyon 3e", "Julien P., Lyon 7e", "Sophie D., Villeurbanne"]);
    expect(data.rating).toEqual({ score: "5/5", count: "16 avis" });
    const out = html({ reviewUrl: "" });
    expect(out).toContain("Note clients : 5/5 – 16 avis");
    expect(out).not.toMatch(/aggregateRating|★/);
  });

  it("hides the review button and 'voir plus' when there is nothing to show", () => {
    const out = html({ reviewUrl: "" });
    expect(out).not.toContain("data-review-link");
    expect(out).not.toContain("data-reviews-more");
  });

  it("shows the button to the Google review URL when set, and folds reviews after the 3rd", () => {
    const items = [1, 2, 3, 4, 5].map((n) => ({ quote: `Avis ${n}`, author: `Client ${n}` }));
    const out = html({ items, reviewUrl: "https://g.page/r/example/review" });
    expect(out).toContain('href="https://g.page/r/example/review"');
    const [visible, folded] = out.split("data-reviews-more");
    expect(visible.match(/<figure/g)).toHaveLength(3);
    expect(folded).toContain("Voir plus d&#x27;avis (2)");
    expect(folded.match(/<figure/g)).toHaveLength(2);
  });
});
