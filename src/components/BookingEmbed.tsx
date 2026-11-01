import Link from "next/link";
import { ExternalLink, FileText, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";

// Only the client's Cal.com booking pages are embedded; anything else shows the fallback.
export function isBookingUrl(url: string) {
  return url.startsWith(site.booking.base);
}

// Cal.com booking page of one service (responsive iframe) or, for any other URL, call / quote links.
export default function BookingEmbed({ url }: { url: string }) {
  if (!isBookingUrl(url)) {
    return (
      <div data-booking-fallback className="rounded-card border border-line bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-bold text-brand-dark">Réservez par téléphone ou par devis</h2>
        <p className="mt-3 text-muted">
          L&apos;agenda en ligne n&apos;est pas disponible pour le moment. Appelez-nous ou envoyez votre demande : nous fixons ensemble un rendez-vous, {site.booking.days}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={telHref} className="btn bg-accent text-white hover:opacity-90">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </a>
          <Link href="/contact/#mon-devis" className="btn border-2 border-brand text-brand-dark hover:bg-brand-light">
            <FileText aria-hidden size={18} /> Demander un devis gratuit
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div data-booking>
      {/* New-tab link first: on mobile the iframe is tall and slow to paint (the call button sits in the page header). */}
      <div className="mb-4">
        <a href={url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 text-brand-dark underline-offset-2 hover:underline">
          <ExternalLink aria-hidden size={16} /> Ouvrir l&apos;agenda dans un nouvel onglet
        </a>
      </div>
      <div className="relative overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {/* Shown behind the iframe until the Cal.com page has painted over it. */}
        <p className="absolute inset-x-0 top-10 text-center text-muted" aria-hidden>Chargement de l&apos;agenda…</p>
        <iframe
          src={url}
          title="Agenda de réservation HA Nuisibles"
          className="relative block h-[1100px] w-full md:h-[760px]"
          loading="lazy"
        />
      </div>
    </div>
  );
}
