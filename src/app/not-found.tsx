import Link from "next/link";
import { Home, Phone } from "lucide-react";
import { site, telHref } from "@/config/site";

// Static 404 (out/404.html) for every unknown URL.
export default function NotFound() {
  return (
    <section className="container-site max-w-[72ch] py-20 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold text-brand-dark">Page introuvable</h1>
      <p className="mt-4 text-lg text-muted">Cette page n&apos;existe pas ou a été déplacée. Un nuisible à traiter ? Nous intervenons rapidement.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn bg-brand text-white hover:bg-brand-hover">
          <Home aria-hidden size={18} /> Retour à l&apos;accueil
        </Link>
        <a href={telHref} className="btn border-2 border-brand text-brand-dark hover:bg-brand-light">
          <Phone aria-hidden size={18} /> {site.phone.display}
        </a>
      </div>
    </section>
  );
}
