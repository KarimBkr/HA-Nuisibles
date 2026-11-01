"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, CircleCheck, Clock, Phone } from "lucide-react";
import { SERVICES } from "@/config/services";
import { site, telHref } from "@/config/site";
import BookingEmbed from "@/components/BookingEmbed";
import { EVENTS, track } from "@/lib/analytics";

type Option = { key: keyof typeof site.booking.hours; label: string };

// Reassurance shown above the agenda once a service is chosen (same promises as the rest of the site).
const [delay, quote, guarantee] = site.promises;
const REASSURANCE = [quote, delay, guarantee];

const OPTIONS: Option[] = [...SERVICES.map((s) => ({ key: s.key, label: s.label })), { key: "urgence-dimanche", label: "Urgence du dimanche" }];

// Step 1: the visitor picks the problem; step 2: the Cal.com page of that service (right duration) loads, only then (third-party iframe on interaction).
export default function BookingPicker() {
  const [key, setKey] = useState<Option["key"] | null>(null);

  // Service pages link to /rendez-vous/#<service key>.
  useEffect(() => {
    const read = () => {
      const found = OPTIONS.find((o) => o.key === window.location.hash.slice(1));
      if (found) setKey(found.key);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  // The choice stays in the URL (#service): reload, back and shared links keep it.
  const choose = (k: Option["key"]) => {
    setKey(k);
    history.replaceState(null, "", `#${k}`);
    track(EVENTS.service, { service: k });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-dark">1. Quel est votre problème ?</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {OPTIONS.map((o) => (
          <li key={o.key}>
            <button
              type="button"
              aria-pressed={key === o.key}
              onClick={() => choose(o.key)}
              className={`flex min-h-11 w-full flex-col items-start rounded-card border-2 p-3 text-left font-bold ${
                key === o.key ? "border-brand bg-brand-light text-brand-dark" : "border-line bg-white text-ink hover:border-brand"
              }`}
            >
              {o.label}
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-normal text-muted">
                <Clock aria-hidden size={14} /> Jusqu&apos;à {site.booking.hours[o.key]} h{o.key === "urgence-dimanche" ? " · +50 %" : ""}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p data-no-online-slot className="mt-4 flex items-start gap-2 rounded-card bg-brand-light p-4 text-ink">
        <Building2 aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
        <span>
          Immeuble, copropriété, local professionnel ou gros chantier : pas de créneau en ligne, nous fixons l&apos;intervention avec vous.{" "}
          <Link href="/contact/#mon-devis" className="font-bold text-brand-dark underline">Demandez un devis gratuit</Link> ou appelez le{" "}
          <a href={telHref} className="font-bold text-brand-dark underline">{site.phone.display}</a>.
        </span>
      </p>
      <h2 className="mt-8 text-xl font-bold text-brand-dark">2. Choisissez votre créneau</h2>
      {key ? (
        <div className="mt-4">
          <ul data-reassurance aria-label="Nos engagements" className="mb-4 grid gap-2 sm:grid-cols-3">
            {REASSURANCE.map((text) => (
              <li key={text} className="flex items-start gap-2 text-ink">
                <CircleCheck aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" /> {text}
              </li>
            ))}
          </ul>
          {key === "urgence-dimanche" && <p className="mb-3 text-ink">Intervention d&apos;urgence le dimanche, majorée de 50 %.</p>}
          <p data-no-slot className="mb-4 flex items-start gap-2 text-ink">
            <Phone aria-hidden size={18} className="mt-1 shrink-0 text-accent" />
            <span>
              Le créneau voulu n&apos;apparaît pas ou tout est complet ? Appelez le{" "}
              <a href={telHref} className="font-bold text-brand-dark underline">{site.phone.display}</a> : nous trouvons un horaire avec vous.
            </span>
          </p>
          <BookingEmbed key={key} url={`${site.booking.base}${key}`} />
        </div>
      ) : (
        <p className="mt-4 text-muted">Sélectionnez d&apos;abord votre problème : la durée réservée dans notre agenda est adaptée à chaque intervention.</p>
      )}
      <p data-consent className="mt-6 text-sm text-muted">
        L&apos;agenda est celui de notre prestataire Cal.com, qui peut déposer des cookies nécessaires à la réservation.{" "}
        <Link href="/confidentalite/" className="underline">En savoir plus</Link>
      </p>
    </div>
  );
}
