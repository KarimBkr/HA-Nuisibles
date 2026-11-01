import Link from "next/link";

const variants = {
  book: "bg-brand text-white hover:bg-brand-hover", // green: booking only
  call: "bg-accent text-white hover:brightness-110", // orange: phone call only
  line: "border border-ink/25 text-ink hover:border-ink",
  light: "border border-bone/40 text-bone hover:border-bone", // on a dark forest block
} as const;

/** Link styled as a button (≥ 44 px). Internal paths use next/link, tel:/external use <a>. */
export default function Button({
  href,
  variant = "book",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = `btn rounded-full px-6 ${variants[variant]} ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
