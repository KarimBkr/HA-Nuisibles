import { CalendarCheck, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF, footerColumns, legalNav } from "@/config/navigation";

const zone = ["Villeurbanne", "Lyon", ...site.zone.nearby];

// Five columns (PDF_BRIEF.md §4): presentation + zone, services, pests, prices, contact.
export default function Footer() {
  return (
    <footer className="bg-forest pb-24 pt-14 text-white/85 md:pb-10">
      <div className="container-site grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.webp" alt={site.name} width={150} height={60} className="h-12 w-auto rounded bg-white p-1" loading="lazy" />
          <p className="mt-4 text-sm leading-relaxed">
            Dératisation, désinsectisation et traitement des nuisibles à Villeurbanne, Lyon et dans le Rhône.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            <span className="font-semibold text-white">Zone d’intervention : </span>
            {zone.join(", ")} et toute la région {site.address.region}.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <a href={BOOKING_HREF} className="btn whitespace-nowrap bg-brand px-4 text-white hover:bg-brand-hover">
              <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
            </a>
            <a href={telHref} className="btn whitespace-nowrap bg-accent px-4 text-white hover:brightness-110">
              <Phone aria-hidden size={18} /> {site.phone.display}
            </a>
          </div>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h2 className="font-semibold text-white">{col.title}</h2>
            <ul className="mt-3 grid gap-1 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="inline-block py-1 hover:text-white hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-semibold text-white">Contact</h2>
          <address className="mt-3 grid gap-3 text-sm not-italic">
            <p className="flex gap-2">
              <MapPin aria-hidden size={18} className="mt-0.5 shrink-0 text-brand" />
              <span>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </p>
            <a href={telHref} className="flex gap-2 hover:text-white">
              <Phone aria-hidden size={18} className="shrink-0 text-brand" /> {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="flex gap-2 break-all hover:text-white">
              <Mail aria-hidden size={18} className="shrink-0 text-brand" /> {site.email}
            </a>
          </address>
          <div className="mt-4 flex gap-2 text-sm">
            <Clock aria-hidden size={18} className="mt-0.5 shrink-0 text-brand" />
            <ul aria-label="Horaires d’ouverture">
              {site.hours.map((h) => (
                <li key={h.days}>
                  {h.days} : {h.hours}
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-4 flex gap-4 text-sm">
            <li>
              <a href={site.socials.instagram} className="underline hover:text-white" rel="noopener" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.socials.facebook} className="underline hover:text-white" rel="noopener" target="_blank">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6 text-sm">
        <p>
          © {new Date().getFullYear()} {site.legalName}
        </p>
        <ul className="flex flex-wrap gap-4">
          {legalNav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-white hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
