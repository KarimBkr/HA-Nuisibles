import { Phone, CalendarCheck } from "lucide-react";
import { site, telHref } from "@/config/site";
import { SERVICES } from "@/config/services";

// Placeholder home (M1); the real home page comes in M9.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold text-brand-dark">
        {site.name} – {site.tagline}
      </h1>
      <p className="mt-4 text-lg">{site.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={telHref} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-white">
          <Phone aria-hidden size={18} /> {site.phone.display}
        </a>
        <a href="/rendez-vous/" className="inline-flex items-center gap-2 rounded-lg border-2 border-brand px-5 py-3 font-semibold text-brand-dark">
          <CalendarCheck aria-hidden size={18} /> Prendre rendez-vous
        </a>
      </div>
      <ul className="mt-10 grid gap-2 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <li key={s.key}>
            <a href={`/${s.mainSlug}/`} className="underline">
              {s.label}
            </a>{" "}
            – {s.pests.join(", ")}
          </li>
        ))}
      </ul>
      <address className="mt-10 not-italic">
        {site.address.street}, {site.address.postalCode} {site.address.city}
      </address>
    </main>
  );
}
