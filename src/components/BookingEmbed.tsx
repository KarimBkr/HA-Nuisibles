import Link from "next/link";
import { ExternalLink, FileText, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";

// Only a Google Calendar appointment page is embedded; anything else shows the fallback.
export function isBookingUrl(url: string) {
  return url.startsWith("https://calendar.google.com/");
}

// Google Calendar appointment schedule (responsive iframe) or, while no URL is configured, call / quote links.
export default function BookingEmbed({ url = site.booking.url }: { url?: string }) {
  if (!isBookingUrl(url)) {
    return (
      <div data-booking-fallback className="rounded-card border border-line bg-white p-6 shadow-soft md:p-8">
        <h2 className="text-2xl font-bold text-brand-dark">Réservez par téléphone ou par devis</h2>
        <p className="mt-3 text-muted">
          L&apos;agenda en ligne arrive bientôt. En attendant, appelez-nous ou envoyez votre demande : nous fixons ensemble un créneau d&apos;1 h, 7 jours sur 7.
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
      <div className="relative overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {/* Shown behind the iframe until Google's page has painted over it. */}
        <p className="absolute inset-x-0 top-10 text-center text-muted" aria-hidden>Chargement de l&apos;agenda…</p>
        <iframe
          src={url}
          title="Agenda de réservation HA Nuisibles"
          className="relative block h-[1100px] w-full md:h-[760px]"
          loading="lazy"
        />
      </div>
      <a href={url} target="_blank" rel="noopener" className="mt-3 inline-flex min-h-11 items-center gap-2 text-brand-dark underline-offset-2 hover:underline">
        <ExternalLink aria-hidden size={16} /> Ouvrir l&apos;agenda dans un nouvel onglet
      </a>
    </div>
  );
}
