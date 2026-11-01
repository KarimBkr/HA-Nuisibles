"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const RAIL_MAX = 5;

/**
 * Snap rail for secondary content only (reviews, before/after): ≤ 5 items, one card plus the edge of the next,
 * no autoplay, arrows on desktop, arrow keys when the focusable track has focus. All text stays in the HTML.
 */
export default function Rail({ label, items }: { label: string; items: React.ReactNode[] }) {
  const track = useRef<HTMLUListElement>(null);
  if (items.length > RAIL_MAX) throw new Error(`Rail « ${label} »: ${items.length} items, ${RAIL_MAX} at most`);
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div role="region" aria-roledescription="carrousel" aria-label={label}>
      <ul
        ref={track}
        tabIndex={0}
        aria-label={`${label} (flèches du clavier pour défiler)`}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            step(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {items.map((item, i) => (
          <li key={i} className="w-[85%] shrink-0 snap-start md:w-[calc((100%-2rem)/3)]">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => step(-1)} aria-label="Précédent" className="btn size-11 rounded-full border border-rule p-0 hover:border-ink">
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Suivant" className="btn size-11 rounded-full border border-rule p-0 hover:border-ink">
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  );
}
