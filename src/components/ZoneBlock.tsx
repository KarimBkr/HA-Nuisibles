import { MapPin } from "lucide-react";
import { site } from "@/config/site";

const GROUPS = [
  { title: "Villeurbanne", places: site.zone.villeurbanne },
  { title: "Lyon", places: site.zone.lyon },
  { title: "Communes voisines", places: site.zone.nearby },
  { title: "Nous intervenons aussi à", places: site.zone.contactCities.filter((c) => c !== "Lyon" && c !== "Villeurbanne") },
];

// Intervention area, from site.ts (old site's zones and contact cities).
export default function ZoneBlock() {
  const a = site.address;
  return (
    <section aria-labelledby="zone" className="py-16">
      <div className="container-site">
        <h2 id="zone" className="text-2xl font-bold text-brand-dark md:text-3xl">Zone d&apos;intervention</h2>
        <p className="mt-2 flex items-start gap-2 text-muted">
          <MapPin aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
          Basés au {a.street}, {a.postalCode} {a.city}, nous intervenons dans le Rhône, l&apos;Isère, la Haute-Savoie et toute la région Rhône-Alpes.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="font-semibold text-ink">{g.title}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.places.map((p) => (
                  <li key={p} className="rounded-full bg-surface px-3 py-1 text-sm text-ink">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
