import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BookingEmbed from "@/components/BookingEmbed";

const URL = "https://cal.com/ha-nuisibles/deratisation";

describe("BookingEmbed", () => {
  it("embeds the Cal.com booking page of the service", () => {
    const html = renderToStaticMarkup(createElement(BookingEmbed, { url: URL }));
    expect(html).toContain(`<iframe src="${URL}"`);
    expect(html).toContain('target="_blank"');
    expect(html).not.toContain("data-booking-fallback");
  });

  it("shows the call / quote fallback, never a calendar, without a valid URL", () => {
    for (const url of ["", "https://example.com/fake", "https://calendar.google.com/calendar/appointments/schedules/X?gv=true"]) {
      const html = renderToStaticMarkup(createElement(BookingEmbed, { url }));
      expect(html).toContain("data-booking-fallback");
      expect(html).not.toContain("<iframe");
      expect(html).toContain('href="tel:+33764464691"');
      expect(html).toMatch(/href="\/contact\/?#mon-devis"/); // trailingSlash only applies inside the Next build
    }
  });
});
