import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock, FileText, MapPin, Phone, SlidersHorizontal, Zap } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF } from "@/config/navigation";
import { audiences, cases, hero, method, presentation, processIntro, quickBlocks, solutions, testimonials, whyUs } from "@/config/home";
import Img from "@/components/Img";

// The 11 first sections of the home page (PDF_BRIEF.md §6); the FAQ comes from content/pages/home.md.

const H2 = "text-3xl font-bold leading-tight text-brand-dark md:text-4xl";
const SECTION = "py-16 md:py-24";

export function Hero({ h1 }: { h1: string }) {
  return (
    <section data-home="hero" className="relative isolate overflow-hidden bg-brand-dark text-white">
      <Img src={hero.image} alt="" priority sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 grayscale-[30%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/40" />
      <div className="container-site pb-28 pt-16 md:pb-40 md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/80">{hero.eyebrow}</p>
        <h1 className="mt-4 max-w-[22ch] text-4xl font-bold leading-tight md:text-5xl">{h1}</h1>
        <p className="mt-5 text-xl font-semibold">{hero.tagline}</p>
        <p className="mt-2 max-w-[55ch] text-lg text-white/90">{hero.zone}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={BOOKING_HREF} className="btn bg-white text-brand-dark hover:bg-brand-light">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
          <a href={telHref} className="btn bg-accent text-white hover:brightness-110">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}

export function QuickBlocks() {
  const icons = [Phone, FileText, Clock];
  return (
    <section data-home="quick" aria-label="Contact, devis et intervention" className="relative z-10 -mt-20 md:-mt-24">
      <div className="container-site grid gap-4 md:grid-cols-3">
        {quickBlocks.map((b, i) => {
          const Icon = icons[i];
          return (
            <div key={b.title} className="rounded-card border border-line bg-white p-6 shadow-soft">
              <Icon aria-hidden className="text-brand" size={28} />
              <h2 className="mt-3 text-xl font-bold text-brand-dark">{b.title}</h2>
              <p className="mt-2 text-muted">{b.text}</p>
              <a href={b.href === "tel" ? telHref : b.href} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-dark underline-offset-4 hover:underline">
                {b.cta} <ArrowRight aria-hidden size={16} />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Presentation() {
  return (
    <section data-home="presentation" className={SECTION}>
      <div className="container-site grid items-center gap-10 md:grid-cols-2">
        <Img src={presentation.image} alt={presentation.imageAlt} className="order-last max-h-[26rem] w-full rounded-card object-cover object-top shadow-soft md:order-first md:max-h-none" sizes="(max-width: 768px) 100vw, 580px" />
        <div>
          <h2 className={H2}>{presentation.title}</h2>
          {presentation.paragraphs.map((p) => (
            <p key={p} className="mt-4 text-lg text-muted">{p}</p>
          ))}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={telHref} className="btn bg-brand text-white hover:bg-brand-hover">
              <Phone aria-hidden size={18} /> {site.phone.display} – {presentation.callout}
            </a>
            <Link href="/contact/" className="btn border-2 border-brand-dark text-brand-dark hover:bg-brand-light">Nous contacter</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Solutions() {
  return (
    <section data-home="solutions" className={`${SECTION} bg-brand-light`}>
      <div className="container-site">
        <h2 className={`${H2} max-w-[30ch]`}>{solutions.title}</h2>
        <p className="mt-3 text-lg text-muted">{solutions.intro}</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solutions.cards.map((c) => (
            <li key={c.title} className="group relative overflow-hidden rounded-card border border-line bg-white shadow-soft">
              <Img src={c.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-brand-dark">
                  {/* The link covers the whole card. */}
                  <a href={c.href} className="after:absolute after:inset-0">{c.title}</a>
                </h3>
                <p className="mt-1 text-muted">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/nos-services/" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-dark underline-offset-4 hover:underline">
          Voir tous nos services <ArrowRight aria-hidden size={16} />
        </Link>
      </div>
    </section>
  );
}

export function WhyUs() {
  const icons = [Zap, MapPin, SlidersHorizontal];
  return (
    <section data-home="why" className={SECTION}>
      <div className="container-site">
        <p className="font-semibold uppercase tracking-widest text-brand">{whyUs.eyebrow}</p>
        <h2 className={`${H2} mt-3 max-w-[30ch]`}>{whyUs.title}</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {whyUs.items.map((it, i) => {
            const Icon = icons[i];
            return (
              <div key={it.title}>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Icon aria-hidden size={24} />
                </span>
                <h3 className="mt-4 text-xl font-bold text-brand-dark">{it.title}</h3>
                <p className="mt-2 text-muted">{it.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/nos-services/" className="btn bg-brand text-white hover:bg-brand-hover">Nos services</Link>
          <Link href="/contact/" className="btn border-2 border-brand-dark text-brand-dark hover:bg-brand-light">Nous contacter</Link>
        </div>
      </div>
    </section>
  );
}

export function ProcessIntro() {
  return (
    <section data-home="process" className="bg-surface pt-16 md:pt-24">
      <div className="container-site text-center">
        <h2 className={H2}>{processIntro.title}</h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-lg text-muted">{processIntro.text}</p>
      </div>
    </section>
  );
}

export function Cases() {
  return (
    <section data-home="cases" className="bg-surface pb-16 pt-12 md:pb-24">
      <div className="container-site">
        <h2 className="text-2xl font-bold text-brand-dark md:text-3xl">{cases.title}</h2>
        <p className="mt-3 max-w-[72ch] text-muted">{cases.intro}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cases.items.map((c) => (
            <article key={c.title} className="rounded-card bg-white p-6 shadow-soft">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                <MapPin aria-hidden size={16} /> {c.place}
              </p>
              <h3 className="mt-2 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-muted">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Method() {
  return (
    <section data-home="method" className={SECTION}>
      <div className="container-site max-w-[72ch]">
        <h2 className={H2}>{method.title}</h2>
        <ol className="mt-8 space-y-5">
          {method.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
              <p className="pt-1.5">
                <strong className="text-brand-dark">{s.title}</strong> : {s.text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-8 font-semibold">{method.closing}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={telHref} className="btn bg-accent text-white hover:brightness-110">
            <Phone aria-hidden size={18} /> {site.phone.display}
          </a>
          <Link href="/contact/#mon-devis" className="btn border-2 border-brand-dark text-brand-dark hover:bg-brand-light">{method.quoteCta}</Link>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section data-home="testimonials" className={`${SECTION} bg-brand-light`}>
      <div className="container-site">
        <p className="font-semibold text-brand">{testimonials.eyebrow}</p>
        <h2 className={`${H2} mt-3`}>{testimonials.title}</h2>
        <p className="mt-3 text-lg font-semibold text-ink">
          Note clients : {testimonials.rating.score} – {testimonials.rating.count}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t) => (
            <figure key={t.author} className="flex flex-col rounded-card bg-white p-6 shadow-soft">
              <blockquote className="flex-1 text-ink">« {t.quote} »</blockquote>
              <figcaption className="mt-4 font-semibold text-brand-dark">{t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Audiences() {
  return (
    <section data-home="audiences" className={SECTION}>
      <div className="container-site">
        <h2 className={`${H2} text-center`}>{audiences.title}</h2>
        <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {audiences.items.map((a) => (
            <li key={a.title} className="flex flex-col items-center rounded-card border border-line p-6 text-center">
              <Img src={a.image} alt="" className="h-24 w-auto" sizes="150px" />
              <h3 className="mt-4 font-bold text-brand-dark">{a.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
