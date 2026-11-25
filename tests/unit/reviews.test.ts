import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import data from "../../content/reviews.json";
import Reviews from "@/components/Reviews";

const html = (props: Parameters<typeof Reviews>[0]) => renderToStaticMarkup(createElement(Reviews, props));

describe("reviews", () => {
  // 42 reviews: given by the client on 2026-11-25 (Google profile), not the old site's 16. No average rating until the client gives one.
  it("keeps the old site's 3 reviews and the client's 42-review count, with no average rating", () => {
    expect(data.items.map((r) => r.author)).toEqual(["Claire M., Lyon 3e", "Julien P., Lyon 7e", "Sophie D., Villeurbanne"]);
    expect(data.rating).toEqual({ count: "42 avis Google" });
    const out = html({ reviewUrl: "" });
    expect(out).toContain("42 avis Google");
    expect(out).not.toMatch(/aggregateRating|★|\d\/5/);
  });

  it("links the button to the client's Google review window by default", () => {
    expect(html({})).toContain('href="https://g.page/r/CRjoESu5nUf_EBM/review"');
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
