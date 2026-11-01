"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import type { ServiceKey } from "@/config/services";

// Sticky call/booking bar under 768 px (DESIGN.md user journeys 1 and 2). Service pages render their own
// with the service pre-selected; the layout's generic one then hides (globals.css).
// One button set at a time: the bar stays away while the header or hero buttons ([data-top-actions]) are on screen.
export default function MobileBar({ service }: { service?: ServiceKey }) {
  const [away, setAway] = useState(true);
  useEffect(() => {
    const targets = document.querySelectorAll("[data-top-actions]"); // the header's always present
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setAway(onScreen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return (
    <nav
      aria-label="Appeler ou réserver"
      data-service={service}
      className={`mobile-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-rule bg-bone/80 p-1.5 backdrop-blur-md transition-transform duration-200 md:hidden ${away ? "invisible translate-y-full" : ""}`}
    >
      <a href={telHref} className="btn whitespace-nowrap rounded-full bg-accent px-2 text-sm text-white">
        <Phone aria-hidden size={18} /> Appeler
      </a>
      <a href={service ? `${BOOKING_HREF}#${service}` : BOOKING_HREF} className="btn gap-1.5 whitespace-nowrap rounded-full bg-brand px-2 text-sm text-white">
        <CalendarCheck aria-hidden size={16} className="max-[419px]:hidden" /> Prendre rendez-vous
      </a>
    </nav>
  );
}
