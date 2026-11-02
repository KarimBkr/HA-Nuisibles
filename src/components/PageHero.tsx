import type { ReactNode } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import type { NavLink } from "@/config/navigation";
import { BOOKING_HREF } from "@/config/navigation";
import type { ServiceKey } from "@/config/services";
import { site, telHref } from "@/config/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Title } from "@/components/ui/SectionHeader";

// Booking (pre-filled with the service when known) + call, the two actions every hero leads with.
export function HeroActions({ service }: { service?: ServiceKey }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3" data-hero-actions data-top-actions>
      <Button href={service ? `${BOOKING_HREF}#${service}` : BOOKING_HREF}>
        <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
      </Button>
      <Button href={telHref} variant="call">
        <Phone aria-hidden size={18} /> {site.phone.display}
      </Button>
    </div>
  );
}

type Props = { trail: NavLink[]; title: string; text?: string; actions?: boolean; service?: ServiceKey; eyebrow?: string; aside?: ReactNode; children?: ReactNode };

// Short header of the contact, blog and content pages (« dossier » vocabulary): trail, small-caps label over a rule,
// one serif H1, one sentence, optional actions or meta; aside: an optional motif shown beside it from md up.
export default function PageHero({ trail, title, text, actions, service, eyebrow, aside, children }: Props) {
  return (
    <header className="border-b border-rule bg-bone py-8 md:py-14" data-page-hero>
      <div className={`container-site ${aside ? "md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12" : ""}`}>
        <div className="max-w-[60ch]">
          <Breadcrumbs items={trail} />
          {eyebrow && <p className="eyebrow mt-4 border-t border-rule pt-3 text-muted">{eyebrow}</p>}
          <Title as="h1" className={eyebrow ? "mt-3" : "mt-4"}>{title}</Title>
          {text && <p className="mt-3 text-lg text-muted">{text}</p>}
          {children}
          {actions && <HeroActions service={service} />}
        </div>
        {aside}
      </div>
    </header>
  );
}
