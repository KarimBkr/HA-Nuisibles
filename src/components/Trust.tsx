import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

// Shared pieces of the trust pages (M71): /a-propos/, /garanties/, /avis/.
export const TRUST_PAGES = [
  { href: "/a-propos/", label: "Qui sommes-nous : l'entreprise et sa méthode" },
  { href: "/garanties/", label: "Nos garanties, service par service" },
  { href: "/avis/", label: "Les avis de nos clients" },
];
export const SEC = "container-site py-10 md:py-14 lg:max-w-page";
export const LINK = "inline-flex min-h-11 items-center gap-1.5 text-brand-dark underline-offset-2 hover:underline";

export const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="mt-6 max-w-prose list-disc space-y-3 pl-5 marker:text-brand">
    {items.map((s, i) => <li key={i}>{s}</li>)}
  </ul>
);

/** Closing links of a trust page: the other trust pages, then the given service/price/contact links. */
export function TrustLinks({ n, current, more }: { n: number; current: string; more: { href: string; label: string }[] }) {
  return (
    <section aria-labelledby="plus-loin" className={SEC} data-trust-links>
      <SectionHeader n={n} label="Aller plus loin" id="plus-loin" small>Pour aller plus loin</SectionHeader>
      <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {[...TRUST_PAGES.filter((p) => p.href !== current), ...more].map((l) => (
          <li key={l.href}>
            <a href={l.href} className={LINK}><ArrowRight aria-hidden size={16} className="shrink-0 text-brand" /> {l.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
