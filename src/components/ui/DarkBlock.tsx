/** The one dark forest block per page, for rhythm. */
export default function DarkBlock({
  children,
  className = "",
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={`bg-forest text-bone ${className}`}>
      <div className="container-site py-16 md:py-24">{children}</div>
    </section>
  );
}
