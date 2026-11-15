import Link from "next/link";

export type LeaderItem = { label: string; value: string; href?: string };

// On narrow screens the value wraps: keep « 3 €/m² » and « < 80 m² » whole (no-break space after a digit or a comparator).
export const glue = (v: string) => v.replace(/([\d<>≤≥]) /g, "$1\u00a0");

/** Leader-dot list: « Dératisation ……… dès 150 € ». The dots are decorative; each row reads « label, value ». */
export default function LeaderList({ items, className = "" }: { items: LeaderItem[]; className?: string }) {
  return (
    <ul className={`divide-y divide-rule ${className}`}>
      {items.map((it) => {
        const row = (
          <>
            <span>{it.label}</span>
            <span aria-hidden="true" className="mx-3 mb-1.5 flex-1 self-end border-b-2 border-dotted border-ink/30" />
            <span className="text-right tabular-nums sm:whitespace-nowrap">{glue(it.value)}</span>
          </>
        );
        return (
          <li key={it.label}>
            {it.href ? (
              <Link href={it.href} className="flex min-h-11 items-center py-2 transition-colors hover:text-brand">
                {row}
              </Link>
            ) : (
              <div className="flex min-h-11 items-center py-2">{row}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
