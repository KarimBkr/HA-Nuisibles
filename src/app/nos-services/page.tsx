import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PESTS, SERVICES } from "@/config/services";
import { ICONS } from "@/components/ServiceIcons";
import { getEntry } from "@/lib/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import ZoneBlock from "@/components/ZoneBlock";

export const metadata: Metadata = pageMetadata({
  title: "Nos services anti-nuisibles à Lyon et Villeurbanne",
  description:
    "Dératisation, punaises de lit, désinsectisation, nids de guêpes et frelons, dépigeonnage, démoustication et désinfection : tous les services HA Nuisibles.",
  path: "/nos-services/",
});

// Services hub: every pest, then every service with all its pages (only pages that exist).
export default function ServicesHub() {
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14">
        <div className="container-site max-w-[72ch]">
          <Breadcrumbs items={[{ label: "Nos services", href: "/nos-services/" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">Nos services anti-nuisibles</h1>
          <p className="mt-4 text-lg text-muted">{metadata.description}</p>
        </div>
      </header>
      <section aria-labelledby="nuisibles" className="py-12">
        <div className="container-site">
          <h2 id="nuisibles" className="text-2xl font-bold text-brand-dark md:text-3xl">Quel nuisible vous gêne ?</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" data-pests>
            {PESTS.map((p) => (
              <li key={p.name}>
                <a href={`/${p.slug}/`} className="flex h-full min-h-11 items-center justify-between gap-2 rounded-card border border-line bg-white p-4 shadow-soft hover:border-brand hover:text-brand-dark">
                  {p.name} <ArrowRight aria-hidden size={16} className="shrink-0 text-brand" />
                </a>
              </li>
            ))}
          </ul>
          <Link href="/nuisibles/" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-dark underline underline-offset-2">
            Fiches nuisibles : signes, risques et traitement <ArrowRight aria-hidden size={16} />
          </Link>
          <Link href="/professionnels/" className="mt-2 flex min-h-11 items-center gap-1.5 font-bold text-brand-dark underline underline-offset-2">
            Professionnels : restaurants, hôtels, syndics, commerces <ArrowRight aria-hidden size={16} />
          </Link>
        </div>
      </section>
      <section aria-labelledby="services" className="bg-brand-light py-12">
        <div className="container-site">
          <h2 id="services" className="text-2xl font-bold text-brand-dark md:text-3xl">Toutes nos prestations</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              const pages = [s.mainSlug, ...s.relatedSlugs].flatMap((slug) => getEntry(slug) ?? []);
              return (
                <article key={s.key} className="rounded-card border border-line bg-white p-6 shadow-soft">
                  <h3 className="flex items-center gap-3 text-xl font-bold text-ink">
                    <Icon aria-hidden size={24} className="text-brand" />
                    <a href={`/${s.mainSlug}/`} className="hover:text-brand-dark hover:underline">{s.label}</a>
                  </h3>
                  <p className="mt-1 text-sm text-muted">{s.pests.join(", ")}</p>
                  <ul className="mt-4 space-y-2">
                    {pages.map((e) => (
                      <li key={e.slug}>
                        <a href={`/${e.slug}/`} className="text-brand-dark underline-offset-2 hover:underline">{e.h1}</a>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <ZoneBlock />
      <CtaBand />
    </>
  );
}
