import { ArrowRight } from "lucide-react";
import type { PriceItem } from "@/lib/content";

type Props = { items: PriceItem[]; more?: { href: string; label: string } };

// Old-site prices of the page, quoted verbatim from its own text (see priceItems).
export default function PriceBlock({ items, more }: Props) {
  return (
    <section aria-labelledby="tarifs" className="bg-brand-light py-16">
      <div className="container-site">
        <h2 id="tarifs" className="text-2xl font-bold text-brand-dark md:text-3xl">Nos tarifs</h2>
        <p className="mt-2 text-muted">Devis gratuit et sans engagement, rapport d’intervention, second passage si nécessaire et garantie de résultat.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={`${i.label}${i.text}`} className="rounded-card border border-line bg-white p-5 shadow-soft">
              {i.label && <p className="font-bold text-ink">{i.label}</p>}
              <p className={i.label ? "mt-1 text-lg font-bold text-brand-dark" : "text-ink"}>{i.text}</p>
            </li>
          ))}
        </ul>
        {more && (
          <a href={more.href} className="mt-6 inline-flex items-center gap-2 font-bold text-brand-dark underline-offset-4 hover:underline">
            {more.label} <ArrowRight aria-hidden size={18} />
          </a>
        )}
      </div>
    </section>
  );
}
