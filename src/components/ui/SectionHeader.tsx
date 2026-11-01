/** Numbered section header of the « dossier d'intervention »: « 01 — Services » in small caps above a thin rule, then the serif title. */
export default function SectionHeader({
  n,
  label,
  children,
  id,
  dark = false,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
  id?: string;
  dark?: boolean;
}) {
  return (
    <header className={`border-t pt-3 ${dark ? "border-white/20" : "border-rule"}`}>
      <p className={`eyebrow ${dark ? "text-bone/80" : "text-muted"}`}>
        {String(n).padStart(2, "0")} — {label}
      </p>
      <Title id={id} className="mt-4">
        {children}
      </Title>
    </header>
  );
}

/** Serif title; wrap its one italic word in <em>. size « display » for the page H1, « title » for sections. */
export function Title({
  as: Tag = "h2",
  size = "title",
  className = "",
  id,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: "display" | "title";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag id={id} className={`serif-title ${size === "display" ? "text-display" : "text-title"} ${className}`}>
      {children}
    </Tag>
  );
}
