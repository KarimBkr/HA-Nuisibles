import type { Metadata } from "next";
import { CalendarClock, Clock, MapPin } from "lucide-react";
import { site } from "@/config/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookingEmbed from "@/components/BookingEmbed";
import ZoneBlock from "@/components/ZoneBlock";

export const metadata: Metadata = {
  title: "Prendre rendez-vous en ligne – HA Nuisibles Lyon",
  description:
    "Réservez en ligne votre intervention anti-nuisibles d'1 h, 7 jours sur 7, à Lyon, Villeurbanne et dans toute la région Rhône-Alpes.",
  alternates: { canonical: "/rendez-vous/" },
};

const FACTS = [
  { Icon: Clock, text: `Créneaux d'intervention d'1 h` },
  { Icon: CalendarClock, text: `Réservation ${site.booking.days}` },
  { Icon: MapPin, text: "Lyon, Villeurbanne et toute la région Rhône-Alpes" },
];

export default function BookingPage() {
  return (
    <>
      <header className="bg-brand-light py-10 md:py-14">
        <div className="container-site max-w-[72ch]">
          <Breadcrumbs items={[{ label: "Prendre rendez-vous", href: "/rendez-vous/" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">Prendre rendez-vous en ligne</h1>
          <p className="mt-4 text-lg text-muted">
            Choisissez le créneau qui vous convient : un technicien {site.name} intervient chez vous pour une intervention d&apos;1 h, 7 jours sur 7.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {FACTS.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2 font-medium text-ink">
                <Icon aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" /> {text}
              </li>
            ))}
          </ul>
        </div>
      </header>
      <section aria-label="Réservation" className="py-12">
        <div className="container-site max-w-[960px]">
          <BookingEmbed />
        </div>
      </section>
      <ZoneBlock />
    </>
  );
}
