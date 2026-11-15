import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { illustration, site, telHref } from "@/config/site";
import { SERVICES } from "@/config/services";
import { BOOKING_HREF, PRICES_HREF } from "@/config/navigation";
import Img from "@/components/Img";
import Button from "@/components/ui/Button";
import { Title } from "@/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Page introuvable – HA Nuisibles", robots: { index: false } };

// Static 404 (out/404.html) for every unknown URL: the client's cream illustration as motif, then the services index.
export default function NotFound() {
  return (
    <section className="container-site grid items-center gap-10 py-12 md:grid-cols-[1fr_auto] md:py-20 lg:py-section">
      <div className="max-w-[60ch]">
        <p className="eyebrow border-t border-rule pt-3 text-muted">Erreur 404</p>
        <Title as="h1" className="mt-3">Page <em>introuvable</em></Title>
        <p className="mt-4 text-lg text-muted">Cette page n&apos;existe pas ou a été déplacée. Un nuisible à traiter ? Nous intervenons sous 24h.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href={telHref} variant="call">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </Button>
        </div>
        <p className="mt-6">
          <Link href={BOOKING_HREF} className="underline hover:text-brand">Prendre rendez-vous en ligne</Link>
          {" · "}
          <Link href={PRICES_HREF} className="underline hover:text-brand">Voir nos tarifs</Link>
          {" · "}
          <Link href="/nos-services/" className="underline hover:text-brand">Tous nos services</Link>
        </p>
        <ul className="mt-10 border-t border-rule">
          {SERVICES.map((s) => (
            <li key={s.key} className="border-b border-rule">
              <a href={`/${s.mainSlug}/`} className="flex min-h-11 items-center justify-between gap-3 py-3 text-lg hover:text-brand">
                {s.label} <ArrowRight aria-hidden size={18} className="shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Img src={illustration.src} alt={illustration.alt} className="mx-auto w-48 rounded-t-full md:w-72" sizes="288px" />
    </section>
  );
}
