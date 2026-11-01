import { BadgeCheck, Clock, FileCheck, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";

const ICONS = [Clock, FileCheck, ShieldCheck, BadgeCheck];

// The old site's four promises, as a band under a service hero.
export default function KeyFacts() {
  return (
    <section aria-label="Nos engagements" className="border-b border-line bg-white py-6">
      <ul className="container-site grid grid-cols-2 gap-4 lg:grid-cols-4">
        {site.promises.map((p, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <li key={p} className="flex items-center gap-3 text-ink">
              <Icon aria-hidden size={22} className="shrink-0 text-brand" /> {p}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
