import { ChevronRight } from "lucide-react";
import type { NavLink } from "@/config/navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";

// Trail from the home page; the last item is the current page (no link).
export default function Breadcrumbs({ items }: { items: NavLink[] }) {
  const trail = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden size={14} />}
            {i === trail.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href} className="underline-offset-2 hover:text-brand-dark hover:underline">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbLd(trail)} />
    </nav>
  );
}
