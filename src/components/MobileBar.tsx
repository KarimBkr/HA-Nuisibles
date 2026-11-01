import { CalendarCheck, Phone } from "lucide-react";
import { telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import type { ServiceKey } from "@/config/services";

// Sticky call/booking bar under 768 px (DESIGN.md user journeys 1 and 2). Service pages render their own
// with the service pre-selected; the layout's generic one then hides (globals.css).
export default function MobileBar({ service }: { service?: ServiceKey }) {
  return (
    <nav aria-label="Appeler ou réserver" data-service={service} className="mobile-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 shadow-soft md:hidden">
      <a href={telHref} className="btn whitespace-nowrap bg-accent px-2 text-sm text-white">
        <Phone aria-hidden size={18} /> Appeler
      </a>
      <a href={service ? `${BOOKING_HREF}#${service}` : BOOKING_HREF} className="btn gap-1.5 whitespace-nowrap bg-brand px-2 text-sm text-white">
        <CalendarCheck aria-hidden size={16} className="max-[419px]:hidden" /> Prendre rendez-vous
      </a>
    </nav>
  );
}
