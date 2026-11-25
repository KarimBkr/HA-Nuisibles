import { CalendarCheck, ChevronDown, Clock, Mail, MapPin } from "lucide-react";
import { site, telHref } from "@/config/site";
import { ReviewInvite } from "@/components/Reviews";
import { BOOKING_HREF, footerColumns, legalNav, type NavLink } from "@/config/navigation";

function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mt-3 grid">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline md:min-h-9">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Mobile footer: contact first, the rest folded (client); e-mail, hours and socials fold too on phones.
function ContactMore() {
  return (
    <>
      <a href={`mailto:${site.email}`} className="flex gap-2 break-all hover:text-white">
        <Mail aria-hidden size={18} className="shrink-0 text-bone/60" /> {site.email}
      </a>
      <div className="mt-4 flex gap-2">
        <Clock aria-hidden size={18} className="mt-1 shrink-0 text-bone/60" />
        <ul aria-label="Horaires d’ouverture">
          {site.hours.map((h) => (
            <li key={h.days}>
              {h.days} : {h.hours}
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-2 flex gap-6">
        <li>
          <a href={site.socials.instagram} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white" rel="noopener" target="_blank">
            Instagram
          </a>
        </li>
        <li>
          <a href={site.socials.facebook} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white" rel="noopener" target="_blank">
            Facebook
          </a>
        </li>
        <li>
          <a href={site.socials.google} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white" rel="noopener" target="_blank">
            Fiche Google
          </a>
        </li>
      </ul>
      <ReviewInvite dark sentence />
    </>
  );
}

// Column title in the site's vocabulary: rule above, number, small caps (« 01 — Services »).
function ColTitle({ n, title }: { n: number; title: string }) {
  return (
    <>
      <span aria-hidden className="tabular-nums text-bone/60">
        {String(n).padStart(2, "0")} —{" "}
      </span>
      {title}
    </>
  );
}

const SUMMARY = "eyebrow flex min-h-11 cursor-pointer list-none items-center justify-between text-white [&::-webkit-details-marker]:hidden";

// Three columns (client plan item 3): contact first at every width (mobile rule, keeps the numbering in reading order), then services and prices, folded into native <details> on mobile.
export default function Footer() {
  return (
    <footer className="bg-forest pb-20 pt-8 text-bone/85 md:pt-16 md:pb-10">
      <div className="container-site flex flex-wrap items-end justify-between gap-3 md:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.webp" alt={site.name} width={150} height={60} className="h-12 w-auto rounded bg-white p-1" loading="lazy" />
        <p className="serif-title max-w-xl text-xl leading-tight text-bone md:text-right md:text-3xl">
          Dératisation et désinsectisation à <em>Villeurbanne</em>, Lyon et dans le Rhône.
        </p>
      </div>
      <div className="container-site mt-6 grid md:mt-12 md:grid-cols-3 md:gap-10">
        <div data-footer-col="Contact" className="border-t border-white/15 pb-2 pt-4">
          <h2 className="eyebrow text-white">
            <ColTitle n={1} title="Contact" />
          </h2>
          <address className="mt-3 grid gap-3 not-italic">
            <a href={telHref} className="serif-title flex min-h-11 items-center text-[2rem] leading-none tabular-nums md:text-4xl whitespace-nowrap text-white hover:text-bone">
              {site.phone.display}
            </a>
            <p className="flex gap-2">
              <MapPin aria-hidden size={18} className="mt-1 shrink-0 text-bone/60" />
              <span>
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </span>
            </p>
          </address>
          <div className="mt-3 max-md:hidden">
            <ContactMore />
          </div>
          <details className="group mt-2 md:hidden">
            <summary className={SUMMARY}>
              E-mail, horaires et réseaux <ChevronDown aria-hidden size={20} className="transition-transform group-open:rotate-180" />
            </summary>
            <ContactMore />
          </details>
          <a href={BOOKING_HREF} className="btn mt-5 whitespace-nowrap rounded-full bg-brand px-6 text-white hover:bg-brand-hover max-md:hidden">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
        </div>
        {footerColumns.map((col, i) => (
          <div key={col.title} data-footer-col={col.title} className="border-t border-white/15 md:pt-4">
            <details className="group md:hidden">
              <summary className={SUMMARY}>
                <span>
                  <ColTitle n={i + 2} title={col.title} />
                </span>
                <ChevronDown aria-hidden size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-3">
                <LinkList links={col.links} />
              </div>
            </details>
            <div className="hidden md:block">
              <h2 className="eyebrow text-white">
                <ColTitle n={i + 2} title={col.title} />
              </h2>
              <LinkList links={col.links} />
            </div>
          </div>
        ))}
      </div>
      <div className="container-site mt-4 flex flex-wrap items-center justify-between gap-x-6 border-t border-white/15 pt-2 md:mt-12 md:pt-4">
        <p className="py-2">
          © {new Date().getFullYear()} {site.legalName}
        </p>
        <ul className="flex flex-wrap gap-x-4 md:gap-x-6">
          {legalNav.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
