"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, ChevronDown, Menu, Phone, X } from "lucide-react";
import { site, telHref } from "@/config/site";
import { BOOKING_HREF, mainNav, secondaryNav, servicesNav } from "@/config/navigation";

const linkClass = "whitespace-nowrap rounded-md px-2 py-2 text-[15px] font-medium text-ink hover:text-brand-dark";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Escape closes whatever is open; a click outside closes the services dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServicesOpen(false);
      setMenuOpen((open) => {
        if (open) burgerRef.current?.focus();
        return false;
      });
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
    <header className="border-b border-line bg-white">
      <div className="container-site flex h-18 items-center gap-4 xl:max-w-[1320px]">
        <Link href="/" className="shrink-0" aria-label={`${site.name} – accueil`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.webp" alt={site.name} width={150} height={60} className="h-12 w-auto" />
        </Link>

        <nav aria-label="Navigation principale" className="ml-auto hidden xl:block">
          <ul className="flex items-center">
            {mainNav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
            <li ref={servicesRef} className="relative">
              <button
                type="button"
                className={`${linkClass} inline-flex items-center gap-1`}
                aria-expanded={servicesOpen}
                aria-controls="menu-services"
                onClick={() => setServicesOpen((o) => !o)}
              >
                Nos services <ChevronDown aria-hidden size={16} className={servicesOpen ? "rotate-180" : ""} />
              </button>
              <ul
                id="menu-services"
                hidden={!servicesOpen}
                className="absolute right-0 z-30 mt-2 w-64 rounded-card border border-line bg-white p-2 shadow-soft"
              >
                {servicesNav.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="block rounded-md px-3 py-2 hover:bg-brand-light hover:text-brand-dark">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            {secondaryNav.map((l) => (
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
            className="btn bg-accent px-3 text-white hover:brightness-110 max-sm:w-11 max-sm:px-0"
            aria-label={`Appeler le ${site.phone.display}`}
          >
            <Phone aria-hidden size={20} />
            <span className="hidden whitespace-nowrap sm:inline xl:hidden 2xl:inline">{site.phone.display}</span>
          </a>
          <a href={BOOKING_HREF} className="btn hidden whitespace-nowrap bg-brand text-white hover:bg-brand-hover md:inline-flex">
            <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="btn w-11 px-0 text-ink xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X aria-hidden size={26} /> : <Menu aria-hidden size={26} />}
          </button>
        </div>
      </div>

      <nav id="menu-mobile" aria-label="Menu" hidden={!menuOpen} className="border-t border-line bg-white xl:hidden">
        <ul className="container-site grid gap-1 py-4">
          {[...mainNav, ...servicesNav.filter((l) => !mainNav.some((m) => m.href === l.href)), ...secondaryNav].map(
            (l) => (
              <li key={l.href}>
                <a href={l.href} className="flex min-h-11 items-center rounded-md px-2 font-medium hover:bg-brand-light">
                  {l.label}
                </a>
              </li>
            ),
          )}
          <li className="mt-2">
            <a href={BOOKING_HREF} className="btn w-full bg-brand text-white hover:bg-brand-hover">
              <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
