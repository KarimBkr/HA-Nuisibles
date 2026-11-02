import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FileText, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookingPicker from "@/components/BookingPicker";
import Button from "@/components/ui/Button";
import { Title } from "@/components/ui/SectionHeader";

export const metadata: Metadata = pageMetadata({
  title: "Prendre rendez-vous en ligne – HA Nuisibles Lyon",
  description:
    "Réservez en ligne votre intervention anti-nuisibles, du lundi au samedi et le dimanche en urgence, à Lyon, Villeurbanne et dans toute la région Rhône-Alpes.",
  path: "/rendez-vous/",
});

// Booking as a wizard (client, 2026-11-02): short header (call and quote always there: the mobile bar is hidden here), then the steps.
export default function BookingPage() {
  return (
    <div className="bg-bone">
      <header className="container-site max-w-3xl pt-6 md:pt-12" data-booking-page>
        <Breadcrumbs items={[{ label: "Prendre rendez-vous", href: "/rendez-vous/" }]} />
        <p className="eyebrow mt-4 border-t border-rule pt-3 text-muted">Rendez-vous</p>
        <Title as="h1" className="mt-3">Prendre rendez-vous en ligne</Title>
        <p className="mt-3 text-lg text-muted">
          Votre problème, puis votre créneau : un technicien {site.name} intervient chez vous, {site.booking.days}.
        </p>
        <p className="mt-2 text-muted">{site.booking.schedule.join(" · ")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={telHref} variant="call">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </Button>
          <Button href="/contact/#mon-devis" variant="line">
            <FileText aria-hidden size={18} /> Devis gratuit
          </Button>
        </div>
      </header>
      <section aria-label="Réservation" className="container-site max-w-3xl py-8 md:py-12">
        <BookingPicker />
      </section>
    </div>
  );
}
