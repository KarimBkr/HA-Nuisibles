import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, LayoutGrid, MapPin, Phone, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { SERVICES } from "@/config/services";
import { hero, method, whyUs } from "@/config/home";
import reviews from "../../../content/reviews.json";
import { ICONS } from "@/components/ServiceIcons";
import Img from "@/components/Img";
import { CARD, H2, SECTION } from "@/components/ShortBlock";

// The 6 first sections of the home page (the FAQ, the zones and the closing band come from their own components).

export function Hero({ h1 }: { h1: string }) {
  return (
    <section data-home="hero" className="bg-gradient-to-b from-brand-light to-white">
      <div className="container-site grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-brand-dark shadow-soft ring-1 ring-line">
            <ShieldCheck aria-hidden size={16} className="text-brand" /> {reviews.rating.score} · {reviews.rating.count}
          </p>
          <h1 className="mt-5 max-w-[22ch] text-4xl font-bold leading-[1.1] tracking-tight text-brand-dark md:text-5xl">{h1}</h1>
          <p className="mt-5 max-w-[48ch] text-lg text-muted">{hero.zone}</p>
          {/* On mobile the sticky bar already carries both actions. */}
          <div className="mt-8 hidden flex-wrap gap-3 md:flex">
            <a href={BOOKING_HREF} className="btn bg-brand text-white shadow-soft hover:bg-brand-hover">
              <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
            </a>
            <a href={telHref} className="btn bg-accent text-white hover:brightness-110">
              <Phone aria-hidden size={18} /> {site.phone.display}
            </a>
          </div>
          <ul className="mt-8 grid gap-2 text-sm font-medium text-ink sm:grid-cols-2">
            {site.promises.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-brand" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <Img
          src={hero.image}
          alt=""
          priority
          sizes="(max-width: 768px) 100vw, 520px"
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_20px_60px_rgb(24_89_40/0.18)] md:aspect-[4/5]"
        />
      </div>
    </section>
  );
}

export function Services() {
  const tile = "group flex h-full flex-col gap-3 rounded-card border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-soft";
  return (
    <section data-home="solutions" className={SECTION}>
      <div className="container-site">
        <h2 className={H2}>Nos services</h2>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.key}>
                <a href={`/${s.mainSlug}/`} className={tile}>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-white transition group-hover:bg-forest">
                    <Icon aria-hidden size={28} />
                  </span>
                  <span className="text-lg font-bold text-brand-dark">{s.label}</span>
                  <span className="text-sm text-muted">{s.pests.join(" · ")}</span>
                </a>
              </li>
            );
          })}
          <li>
            <Link href="/nos-services/" className={`${tile} justify-center bg-brand-light`}>
              <LayoutGrid aria-hidden size={24} className="text-brand" />
              <span className="inline-flex items-center gap-2 text-lg font-bold text-brand-dark">
                Tous nos services <ArrowRight aria-hidden size={16} />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function WhyUs() {
  const icons = [Zap, MapPin, SlidersHorizontal];
  return (
    <section data-home="why" className={`${SECTION} bg-brand-light`}>
      <div className="container-site">
        <h2 className={`${H2} max-w-[30ch]`}>Pourquoi nous choisir ?</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {whyUs.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <div key={it.title} className={CARD}>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Icon aria-hidden size={24} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-brand-dark">{it.title}</h3>
                <p className="mt-2 text-muted">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Method() {
  return (
    <section data-home="method" className={SECTION}>
      <div className="container-site">
        <h2 className={H2}>Notre méthode en 5 étapes</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {method.steps.map((s, i) => (
            <li key={s.title} className="rounded-card border border-line p-5">
              <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 font-bold text-brand-dark">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
