import { CalendarCheck, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { SECTION } from "@/components/ShortBlock";

type Props = { title?: string; text?: string; home?: string };

// Closing call-to-action band (PDF_BRIEF.md §6 block 11).
export default function CtaBand({
  title = "Prenez Rendez-vous Rapidement",
  text = "Intervention sous 24h – Devis gratuit, rapide et sans engagement !",
  home,
}: Props) {
  return (
    <section data-home={home} className={`${SECTION} bg-brand-dark text-white`}>
      <div className="container-site text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-lg text-white/90">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={BOOKING_HREF} className="btn bg-white text-brand-dark hover:bg-brand-light">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
          <a href={telHref} className="btn border-2 border-white text-white hover:bg-white/10">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
