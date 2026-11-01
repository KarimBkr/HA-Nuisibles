/** Numbered section header of the « dossier d'intervention »: « 01 — Services » in small caps above a thin rule, then the serif title. */
export default function SectionHeader({
  n,
  label,
  children,
  id,
  dark = false,
  small = false,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
  id?: string;
  dark?: boolean;
  /** Smaller title, for a section whose question the H1 already asks. */
  small?: boolean;
}) {
  return (
    <header className={`border-t pt-3 ${dark ? "border-white/20" : "border-rule"}`}>
      <p className={`eyebrow ${dark ? "text-bone/80" : "text-muted"}`}>
        {String(n).padStart(2, "0")} — {label}
      </p>
      <Title id={id} size={small ? "sub" : "title"} className={small ? "mt-2" : "mt-3"}>
        {children}
      </Title>
    </header>
  );
}

const SIZES = { display: "text-display", title: "text-title", sub: "text-[1.625rem] leading-tight md:text-title" } as const;

/** Serif title; wrap its one italic word in <em>. size « display » for the page H1, « title » for sections. */
export function Title({
  as: Tag = "h2",
  size = "title",
  className = "",
  id,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id} className={`serif-title ${SIZES[size]} ${className}`}>
      {children}
    </Tag>
  );
}
