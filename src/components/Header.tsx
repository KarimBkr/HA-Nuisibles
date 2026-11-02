"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, ChevronDown, Menu, Phone, X } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF, mainNav, servicesNav } from "@/config/navigation";

const PANEL_LINK = "serif-title flex min-h-14 items-center text-[2rem] leading-none hover:text-brand";
const linkClass = "inline-flex min-h-11 items-center whitespace-nowrap px-3 text-ink underline-offset-8 decoration-rule hover:underline hover:decoration-ink";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const close = () => setMenuOpen(false);

  // While the panel is open: focus its close button, stop the page behind from scrolling, and make everything
  // outside the panel inert (siblings at every level up to <body>) so Tab stays inside it.
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", menuOpen);
    if (!menuOpen) return;
    closeRef.current?.focus();
    const outside: HTMLElement[] = [];
    for (let el = panelRef.current; el && el !== document.body; el = el.parentElement)
      for (const sib of el.parentElement?.children ?? []) if (sib !== el && sib instanceof HTMLElement && !sib.inert) outside.push(sib);
    outside.forEach((n) => (n.inert = true));
    return () => {
      outside.forEach((n) => (n.inert = false));
      burgerRef.current?.focus(); // after the inert is lifted, or the focus call is ignored
    };
  }, [menuOpen]);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Escape closes whatever is open; a click outside closes the services dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServicesOpen(false);
      setMenuOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <header className="border-b border-rule bg-white">
      <div className="container-site flex h-18 items-center gap-4 xl:max-w-[1320px]">
        <Link href="/" className="shrink-0" aria-label={`${site.name} – accueil`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.webp" alt={site.name} width={150} height={60} className="h-12 w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden xl:block">
          <ul className="flex items-center">
            <li ref={servicesRef} className="relative">
              <button
                type="button"
                className={`${linkClass} inline-flex items-center gap-1`}
                aria-expanded={servicesOpen}
                aria-controls="menu-services"
                onClick={() => setServicesOpen((o) => !o)}
              >
                Services <ChevronDown aria-hidden size={16} className={servicesOpen ? "rotate-180" : ""} />
              </button>
              <ul
                id="menu-services"
                hidden={!servicesOpen}
                className="absolute left-0 z-30 mt-2 w-80 divide-y divide-rule rounded-2xl border border-rule bg-bone px-4 py-2 shadow-soft"
              >
                {servicesNav.map((l, i) => (
                  <li key={l.href}>
                    <a href={l.href} className="flex min-h-11 items-baseline gap-3 py-2 hover:text-brand-dark">
                      <span aria-hidden className="eyebrow w-6 text-muted">
                        {i < servicesNav.length - 1 ? String(i + 1).padStart(2, "0") : "→"}
                      </span>
                      <span className="serif-title text-xl leading-tight">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            {mainNav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2" data-top-actions>
          <a
            href={telHref}
            className="btn rounded-full bg-accent px-4 text-white hover:brightness-110 max-sm:w-11 max-sm:px-0"
            aria-label={`Appeler le ${site.phone.display}`}
          >
            <Phone aria-hidden size={20} />
            <span className="hidden whitespace-nowrap sm:inline xl:hidden 2xl:inline">{site.phone.display}</span>
          </a>
          <a href={BOOKING_HREF} className="btn hidden whitespace-nowrap rounded-full bg-brand px-6 text-white hover:bg-brand-hover md:inline-flex">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="btn w-11 rounded-full px-0 text-ink xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Menu aria-hidden size={26} />
          </button>
        </div>
      </div>

      {/* Mobile menu: a full-screen panel, big serif links, the two actions at the bottom (thumb zone). */}
      <nav ref={panelRef} id="menu-mobile" aria-label="Menu" hidden={!menuOpen} className="fixed inset-0 z-50 overflow-y-auto bg-bone xl:hidden">
        <div className="container-site flex min-h-full flex-col pb-6">
          <div className="flex h-18 items-center justify-between border-b border-rule">
            <span className="eyebrow text-muted">Menu</span>
            <button ref={closeRef} type="button" onClick={close} aria-label="Fermer le menu" className="btn w-11 px-0 text-ink">
              <X aria-hidden size={26} />
            </button>
          </div>
          <ul className="mt-2 divide-y divide-rule border-b border-rule">
            <li>
              <details className="group">
                <summary className={`${PANEL_LINK} cursor-pointer list-none justify-between [&::-webkit-details-marker]:hidden`}>
                  Services <ChevronDown aria-hidden size={24} className="transition-transform group-open:rotate-180" />
                </summary>
                <ul className="grid pb-3 pl-1">
                  {servicesNav.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="flex min-h-11 items-center text-lg hover:text-brand">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            {mainNav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={PANEL_LINK}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-8">
            <a href={telHref} className="btn min-h-12 w-full rounded-full bg-accent text-white hover:brightness-110">
              <Phone aria-hidden size={18} /> {site.phone.display}
            </a>
            <a href={BOOKING_HREF} className="btn min-h-12 w-full rounded-full bg-brand text-white hover:bg-brand-hover">
              <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
