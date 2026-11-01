"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Clock } from "lucide-react";
import { SERVICES } from "@/config/services";
import { site, telHref } from "@/config/site";
import BookingEmbed from "@/components/BookingEmbed";

type Option = { key: keyof typeof site.booking.hours; label: string };

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
              className={`flex min-h-11 w-full flex-col items-start rounded-card border-2 p-3 text-left font-semibold ${
                key === o.key ? "border-brand bg-brand-light text-brand-dark" : "border-line bg-white text-ink hover:border-brand"
              }`}
            >
              {o.label}
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-normal text-muted">
                <Clock aria-hidden size={14} /> {site.booking.hours[o.key]} h réservées
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p data-no-online-slot className="mt-4 flex items-start gap-2 rounded-card bg-brand-light p-4 text-ink">
        <Building2 aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
        <span>
          Immeuble, copropriété, local professionnel ou gros chantier : pas de créneau en ligne, nous fixons l&apos;intervention avec vous.{" "}
          <Link href="/contact/#mon-devis" className="font-semibold text-brand-dark underline">Demandez un devis gratuit</Link> ou appelez le{" "}
          <a href={telHref} className="font-semibold text-brand-dark underline">{site.phone.display}</a>.
        </span>
      </p>
      <h2 className="mt-8 text-xl font-bold text-brand-dark">2. Choisissez votre créneau</h2>
      {key ? (
        <div className="mt-4">
          {key === "urgence-dimanche" && <p className="mb-3 font-medium text-ink">Intervention d&apos;urgence le dimanche, majorée de 50 %.</p>}
          <BookingEmbed key={key} url={`${site.booking.base}${key}`} />
        </div>
      ) : (
        <p className="mt-4 text-muted">Sélectionnez d&apos;abord votre problème : la durée réservée dans notre agenda est adaptée à chaque intervention.</p>
      )}
    </div>
  );
}
