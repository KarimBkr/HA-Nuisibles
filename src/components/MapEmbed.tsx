"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { site } from "@/config/site";

const query = encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`);

// Google Maps loads only after a click (no third-party request, cookie or weight before that).
export default function MapEmbed() {
  const [shown, setShown] = useState(false);
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      {shown ? (
        <iframe
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          title={`Plan d'accès : ${site.address.street}, ${site.address.city}`}
          className="block h-[360px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-[360px] flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin aria-hidden size={36} className="text-brand" />
          <p className="text-ink">
            {site.address.street}, {site.address.postalCode} {site.address.city}
          </p>
          <button type="button" onClick={() => setShown(true)} className="btn bg-brand text-white hover:bg-brand-hover">
            Afficher la carte Google Maps
          </button>
          <p data-consent className="max-w-sm text-sm text-muted">
            La carte est fournie par Google, qui peut déposer des cookies dès son affichage.{" "}
            <Link href="/confidentalite/" className="underline">En savoir plus</Link>
          </p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 text-brand-dark underline-offset-2 hover:underline">
            <ExternalLink aria-hidden size={16} /> Ouvrir dans Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
