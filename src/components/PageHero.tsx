import type { ReactNode } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import type { NavLink } from "@/config/navigation";
import { BOOKING_HREF } from "@/config/navigation";
import type { ServiceKey } from "@/config/services";
import { site, telHref } from "@/config/site";
import Breadcrumbs from "@/components/Breadcrumbs";

// Booking (pre-filled with the service when known) + call, the two actions every hero leads with.
export function HeroActions({ service }: { service?: ServiceKey }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3" data-hero-actions>
      <a href={service ? `${BOOKING_HREF}#${service}` : BOOKING_HREF} className="btn bg-brand text-white hover:bg-brand-hover">
        <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
      </a>
      <a href={telHref} className="btn bg-accent text-white hover:brightness-110">
        <Phone aria-hidden size={18} /> {site.phone.display}
      </a>
    </div>
  );
}

type Props = { trail: NavLink[]; title: string; text?: string; actions?: boolean; service?: ServiceKey; children?: ReactNode };

// Short header of the contact, blog and content pages: trail, one H1, one sentence, optional actions or meta.
export default function PageHero({ trail, title, text, actions, service, children }: Props) {
  return (
    <header className="bg-brand-light py-8 md:py-12" data-page-hero>
      <div className="container-site max-w-[72ch]">
        <Breadcrumbs items={trail} />
        <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-brand-dark md:text-4xl">{title}</h1>
        {text && <p className="mt-3 text-lg text-muted">{text}</p>}
        {children}
        {actions && <HeroActions service={service} />}
      </div>
    </header>
  );
}
