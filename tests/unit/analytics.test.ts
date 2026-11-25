import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { analyticsConfig, eventForHref, EVENTS, track } from "@/lib/analytics";
import Analytics from "@/components/Analytics";

describe("analytics", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("loads nothing when the env is empty", () => {
    expect(analyticsConfig("", "")).toBeNull();
    expect(analyticsConfig(undefined, undefined)).toBeNull();
    expect(renderToStaticMarkup(createElement(Analytics, { config: null }))).toBe("");
  });

  it("renders a deferred cookie-free script when the domain is set", () => {
    const config = analyticsConfig(" ha-nuisibles.fr ", "");
    expect(config).toEqual({ domain: "ha-nuisibles.fr", src: "https://plausible.io/js/script.js" });
    const html = renderToStaticMarkup(createElement(Analytics, { config }));
    expect(html).toContain('<script defer="" data-domain="ha-nuisibles.fr" src="https://plausible.io/js/script.js">');
    expect(analyticsConfig("x.fr", "https://stats.example/js/script.js")?.src).toBe("https://stats.example/js/script.js");
  });

  it("maps call and booking links to events", () => {
    expect(eventForHref("tel:+33764464691")).toBe(EVENTS.call);
    expect(eventForHref("/rendez-vous/")).toBe(EVENTS.booking);
    expect(eventForHref("/rendez-vous/#deratisation")).toBe(EVENTS.booking);
    expect(eventForHref("https://www.ha-nuisibles.fr/rendez-vous/")).toBe(EVENTS.booking);
    expect(eventForHref("/contact/")).toBeNull();
    expect(eventForHref("/rendez-vous-ailleurs/")).toBeNull();
    expect(eventForHref(null)).toBeNull();
  });

  it("track sends to window.plausible when present and is a no-op otherwise", () => {
    expect(() => track(EVENTS.quote)).not.toThrow();
    const plausible = vi.fn();
    vi.stubGlobal("window", { plausible });
    track(EVENTS.service, { service: "deratisation" });
    track(EVENTS.quote);
    expect(plausible.mock.calls).toEqual([[EVENTS.service, { props: { service: "deratisation" } }], [EVENTS.quote, undefined]]);
  });
});
