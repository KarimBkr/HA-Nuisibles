// Cookie-free statistics (Plausible or any Plausible-compatible host). Nothing third-party loads unless
// NEXT_PUBLIC_ANALYTICS_DOMAIN is set at build time; events are sent through window.plausible when present.

export type AnalyticsConfig = { domain: string; src: string };

export const analyticsConfig = (
  domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN,
  src = process.env.NEXT_PUBLIC_ANALYTICS_SRC,
): AnalyticsConfig | null => (domain?.trim() ? { domain: domain.trim(), src: src?.trim() || "https://plausible.io/js/script.js" } : null);

export const EVENTS = { call: "Appel", booking: "Prendre rendez-vous", service: "Choix service", quote: "Devis envoyé" } as const;

type Props = Record<string, string>;
type Plausible = (event: string, options?: { props?: Props }) => void;

export function track(event: string, props?: Props) {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: Plausible }).plausible;
  plausible?.(event, props ? { props } : undefined);
}

// Event for a clicked link: phone calls and every "Prendre rendez-vous" link (header, bars, service pages).
export function eventForHref(href: string | null): string | null {
  if (!href) return null;
  if (href.startsWith("tel:")) return EVENTS.call;
  if (/^(https?:\/\/[^/]+)?\/rendez-vous\/?(#|$)/.test(href)) return EVENTS.booking;
  return null;
}
