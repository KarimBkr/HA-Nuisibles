"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { SERVICES } from "@/config/services";
import { site, telHref } from "@/config/site";
import BookingEmbed from "@/components/BookingEmbed";
import { EVENTS, track } from "@/lib/analytics";

type Option = { key: keyof typeof site.booking.hours; label: string };

// Reassurance shown above the agenda once a service is chosen (same promises as the rest of the site).
const [delay, quote, guarantee] = site.promises;
const REASSURANCE = [quote, delay, guarantee];

const OPTIONS: Option[] = [...SERVICES.map((s) => ({ key: s.key, label: s.label })), { key: "urgence-dimanche", label: "Urgence du dimanche" }];
const STEPS = ["Votre problème", "Votre créneau"];

// Booking wizard, one screen per step: 1. the problem (numbered rows, « 1 h »); 2. the Cal.com page of that
// service, loaded only then (third-party iframe on interaction), with a recap bar at the bottom. The choice lives in #service.
export default function BookingPicker() {
  const [key, setKey] = useState<Option["key"] | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // focus the new step's title only after a visitor action, not on load

  // Service pages link to /rendez-vous/#<service key>; back/forward and reload keep the step.
  useEffect(() => {
    const read = () => setKey(OPTIONS.find((o) => o.key === window.location.hash.slice(1))?.key ?? null);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [key]);

  const choose = (k: Option["key"] | null) => {
    moved.current = true;
    setKey(k);
    history.replaceState(null, "", k ? `#${k}` : location.pathname);
    if (k) track(EVENTS.service, { service: k });
  };
  const chosen = OPTIONS.find((o) => o.key === key);
  const step = chosen ? 1 : 0;

  return (
    <div data-wizard>
      <ol aria-label="Étapes de la réservation" className="grid grid-cols-2 gap-3" data-steps>
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className={`border-t-2 pt-2 ${i <= step ? "border-forest text-ink" : "border-rule text-muted"}`}>
            <span className="eyebrow">Étape {i + 1} sur 2</span>
            <span className="block">{s}</span>
          </li>
        ))}
      </ol>

      {!chosen ? (
        <section aria-labelledby="etape-titre" className="mt-8">
          <h2 id="etape-titre" ref={heading} tabIndex={-1} className="serif-title text-[1.625rem] leading-tight outline-none md:text-title">
            Quel est votre <em>problème</em> ?
          </h2>
          <ul className="mt-4 border-t border-rule">
            {OPTIONS.map((o, i) => (
              <li key={o.key} className="border-b border-rule">
                <button
                  type="button"
                  onClick={() => choose(o.key)}
                  className="group flex min-h-14 w-full items-center gap-4 py-3 text-left hover:text-brand"
                >
                  <span aria-hidden className="serif-title w-8 shrink-0 text-2xl tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="serif-title block text-[1.5rem] leading-tight md:text-3xl">{o.label}</span>
                    <span className="text-muted">
                      {site.booking.hours[o.key]} h{o.key === "urgence-dimanche" ? " · +50 %" : ""}
                    </span>
                  </span>
                  <ArrowRight aria-hidden size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              </li>
            ))}
          </ul>
          <p data-no-online-slot className="mt-6 max-w-[60ch] text-ink">
            Immeuble, copropriété, local professionnel ou gros chantier : pas de créneau en ligne, nous fixons l&apos;intervention avec vous.{" "}
            <Link href="/contact/#mon-devis" className="underline underline-offset-4 hover:text-brand">Demandez un devis gratuit</Link> ou appelez le{" "}
            <a href={telHref} className="underline underline-offset-4 hover:text-brand">{site.phone.display}</a>.
          </p>
        </section>
      ) : (
        <section aria-labelledby="etape-titre" className="mt-8">
          <h2 id="etape-titre" ref={heading} tabIndex={-1} className="serif-title text-[1.625rem] leading-tight outline-none md:text-title">
            Choisissez votre <em>créneau</em>
          </h2>
          <ul data-reassurance aria-label="Nos engagements" className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-ink">
            {REASSURANCE.map((text) => (
              <li key={text} className="before:mr-2 before:text-brand before:content-['—']">{text}</li>
            ))}
          </ul>
          {key === "urgence-dimanche" && <p className="mt-3 text-ink">Intervention d&apos;urgence le dimanche, majorée de 50 %.</p>}
          <p data-no-slot className="mt-3 mb-4 max-w-[60ch] text-ink">
            Le créneau voulu n&apos;apparaît pas ou tout est complet ? Appelez le{" "}
            <a href={telHref} className="underline underline-offset-4 hover:text-brand">{site.phone.display}</a> : nous trouvons un horaire avec vous.
          </p>
          <BookingEmbed key={key} url={`${site.booking.base}${key}`} />
          <div data-recap className="sticky bottom-0 z-30 md:static -mx-4 mt-4 flex items-center gap-3 border-t border-rule bg-bone/90 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
            <dl className="min-w-0 flex-1">
              <dt className="sr-only">Service</dt>
              <dd className="serif-title truncate text-xl leading-tight">{chosen.label}</dd>
              <dt className="sr-only">Durée réservée</dt>
              <dd className="text-muted">{site.booking.hours[chosen.key]} h</dd>
            </dl>
            <button type="button" onClick={() => choose(null)} aria-label="Changer de problème" className="btn shrink-0 rounded-full border border-ink/25 px-4 hover:border-ink">
              <ArrowLeft aria-hidden size={18} /> Changer
            </button>
            <a href={telHref} aria-label={`Appeler le ${site.phone.display}`} className="btn w-11 shrink-0 rounded-full bg-accent px-0 text-white hover:brightness-110">
              <Phone aria-hidden size={18} />
            </a>
          </div>
        </section>
      )}
      <p data-consent className="mt-6 text-sm text-muted">
        L&apos;agenda est celui de notre prestataire Cal.com, qui peut déposer des cookies nécessaires à la réservation.{" "}
        <Link href="/confidentalite/" className="underline">En savoir plus</Link>
      </p>
    </div>
  );
}
