import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BookingEmbed from "@/components/BookingEmbed";

const URL = "https://calendar.google.com/calendar/appointments/schedules/TEST123?gv=true";

describe("BookingEmbed", () => {
  it("embeds the configured Google Calendar URL", () => {
    const html = renderToStaticMarkup(createElement(BookingEmbed, { url: URL }));
    expect(html).toContain(`<iframe src="${URL.replace("&", "&amp;")}"`);
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain("data-booking-fallback");
  });

  it("shows the call / quote fallback, never a calendar, without a valid URL", () => {
    for (const url of ["", "https://example.com/fake"]) {
      const html = renderToStaticMarkup(createElement(BookingEmbed, { url }));
      expect(html).toContain("data-booking-fallback");
      expect(html).not.toContain("<iframe");
      expect(html).toContain('href="tel:+33764464691"');
      expect(html).toMatch(/href="\/contact\/?#mon-devis"/); // trailingSlash only applies inside the Next build
    }
  });
});
