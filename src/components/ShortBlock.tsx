import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

// Shared style of the home page (HomeSections): one heading scale, one section rhythm, one card.
export const H2 = "text-3xl font-bold leading-tight tracking-tight text-brand-dark md:text-4xl";
export const SECTION = "py-16 md:py-24";
export const CARD = "rounded-card bg-white p-6 shadow-soft";

// Short block: icon + title + 3–5 points, the unit every page is built from.
export default function ShortBlock({ Icon, title, points }: { Icon: LucideIcon; title: string; points: readonly string[] }) {
  return (
    <div className={CARD}>
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
        <Icon aria-hidden size={24} />
      </span>
      <h3 className="mt-4 text-xl font-bold text-brand-dark">{title}</h3>
      <ul className="mt-3 grid gap-2 text-muted">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2">
            <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-brand" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
