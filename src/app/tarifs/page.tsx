import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PRICES_HREF, pricesNav } from "@/config/navigation";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { H2, SECTION } from "@/components/ShortBlock";

export const metadata: Metadata = pageMetadata({
  title: "Tarifs anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Prix de la dératisation, des punaises de lit, de la désinsectisation, des nids de guêpes, du dépigeonnage et de la désinfection à Lyon. Devis gratuit.",
  path: PRICES_HREF,
});

// Prices hub: the header "Tarifs" link, listing the old site's price pages (no figure of its own).
export default function PricesHub() {
  return (
    <>
      <PageHero trail={[{ label: "Tarifs", href: PRICES_HREF }]} title="Nos tarifs à Lyon et Villeurbanne" text={metadata.description as string} actions />
      <section aria-labelledby="tarifs" className={SECTION}>
        <div className="container-site">
          <h2 id="tarifs" className={H2}>Prix par intervention</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pricesNav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="flex h-full items-start justify-between gap-3 rounded-card border border-line bg-white p-5 font-medium shadow-soft hover:border-brand hover:text-brand-dark">
                  {l.label} <ArrowRight aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
