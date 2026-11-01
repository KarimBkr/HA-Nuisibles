import { CalendarCheck, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF, footerColumns, legalNav, type NavLink } from "@/config/navigation";

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mt-3 grid gap-1 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className="inline-block py-1 hover:text-white hover:underline">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Three columns (client plan item 3): services, prices, contact. On mobile the link lists fold into native <details>.
export default function Footer() {
  return (
    <footer className="bg-forest pb-24 pt-14 text-white/85 md:pb-10">
      <div className="container-site">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.webp" alt={site.name} width={150} height={60} className="h-12 w-auto rounded bg-white p-1" loading="lazy" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed">
          Dératisation, désinsectisation et traitement des nuisibles à Villeurbanne, Lyon et dans le Rhône.
        </p>
      </div>
      <div className="container-site mt-8 grid gap-6 md:grid-cols-3 md:gap-10">
        {footerColumns.map((col) => (
          <div key={col.title} data-footer-col={col.title}>
            <details className="group border-b border-white/15 pb-2 md:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold text-white">
                {col.title} <ChevronDown aria-hidden size={18} className="group-open:rotate-180" />
              </summary>
              <LinkList links={col.links} />
            </details>
            <div className="hidden md:block">
              <h2 className="font-semibold text-white">{col.title}</h2>
              <LinkList links={col.links} />
            </div>
          </div>
        ))}
        <div data-footer-col="Contact">
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
          <a href={BOOKING_HREF} className="btn mt-5 whitespace-nowrap bg-brand px-4 text-sm text-white hover:bg-brand-hover">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
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
