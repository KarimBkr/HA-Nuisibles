import { CalendarCheck } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import Button from "@/components/ui/Button";
import type { ServiceKey } from "@/config/services";

type Props = { title?: string; text?: string; home?: string; service?: ServiceKey };

// The page's one dark forest block: the phone number as the graphic element, then booking (same look as the home's ClosingBlock).
export default function CtaBand({ title = "Un appel suffit", text = "Intervention sous 24h · devis gratuit et sans engagement.", home, service }: Props) {
  return (
    <section data-home={home} aria-labelledby="cta-titre" className="bg-forest text-bone">
      <div className="container-site py-16 md:py-24">
        <h2 id="cta-titre" className="eyebrow text-bone/80">{title}</h2>
        <a href={telHref} className="serif-title mt-3 block text-[3.25rem] leading-none tabular-nums whitespace-nowrap text-white hover:text-bone md:text-8xl">
          {site.phone.display}
        </a>
        <p className="mt-4 max-w-[60ch] text-lg text-bone/85">{text}</p>
        <Button href={service ? `${BOOKING_HREF}#${service}` : BOOKING_HREF} variant="light" className="mt-6 min-h-12">
          <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
        </Button>
      </div>
    </section>
  );
}
