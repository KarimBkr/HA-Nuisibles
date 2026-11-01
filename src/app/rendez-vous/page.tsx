import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { CalendarClock, Clock, FileText, MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookingPicker from "@/components/BookingPicker";
import ZoneBlock from "@/components/ZoneBlock";

export const metadata: Metadata = pageMetadata({
  title: "Prendre rendez-vous en ligne – HA Nuisibles Lyon",
  description:
    "Réservez en ligne votre intervention anti-nuisibles, du lundi au samedi et le dimanche en urgence, à Lyon, Villeurbanne et dans toute la région Rhône-Alpes.",
  path: "/rendez-vous/",
});

const FACTS = [
  { Icon: Clock, text: "Durée adaptée à chaque intervention" },
  ...site.booking.schedule.map((text) => ({ Icon: CalendarClock, text })),
  { Icon: MapPin, text: "Lyon, Villeurbanne et toute la région Rhône-Alpes" },
];

export default function BookingPage() {
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14" data-booking-page>
        <div className="container-site max-w-[72ch]">
          <Breadcrumbs items={[{ label: "Prendre rendez-vous", href: "/rendez-vous/" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">Prendre rendez-vous en ligne</h1>
          <p className="mt-4 text-lg text-muted">
            Choisissez votre problème, puis le créneau qui vous convient : un technicien {site.name} intervient chez vous, {site.booking.days}.
          </p>
          <ul aria-label="Réservation en ligne" className="mt-6 grid gap-3 sm:grid-cols-2">
            {FACTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2 font-medium text-ink">
                <Icon aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" /> {text}
              </li>
            ))}
          </ul>
          {/* Call and quote always visible: the mobile bar is hidden on this page. */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telHref} className="btn bg-accent text-white hover:opacity-90">
              <Phone aria-hidden size={18} /> {site.phone.display}
            </a>
            <Link href="/contact/#mon-devis" className="btn border-2 border-brand text-brand-dark hover:bg-brand-light">
              <FileText aria-hidden size={18} /> Demander un devis gratuit
            </Link>
          </div>
        </div>
      </header>
      <section aria-label="Réservation" className="py-12">
        <div className="container-site max-w-[960px]">
          <BookingPicker />
        </div>
      </section>
      <ZoneBlock />
    </>
  );
}
