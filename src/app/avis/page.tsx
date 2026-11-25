import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Reviews from "@/components/Reviews";
import SectionHeader from "@/components/ui/SectionHeader";
import { Bullets, SEC, TrustLinks } from "@/components/Trust";

export const metadata: Metadata = pageMetadata({
  title: "Avis clients HA Nuisibles : dératisation et désinsectisation",
  description:
    "Avis clients de HA Nuisibles à Lyon et Villeurbanne : punaises de lit, cafards, souris. Des avis réels publiés en texte intégral, 42 avis sur notre fiche Google.",
  path: "/avis/",
});

// Reviews page (M71): fed by content/reviews.json only — never an invented review, no rating markup.
export default function ReviewsPage() {
  const reviewUrl = site.reviewUrl;
  return (
    <>
      <PageHero
        trail={[{ label: "Avis clients", href: "/avis/" }]}
        title="Avis clients HA Nuisibles"
        text="Ce que disent les particuliers et les professionnels de Lyon et Villeurbanne après notre passage, mot pour mot."
        actions
        width="lg:max-w-page"
      />
      <div data-trust="avis">
        <Reviews reviewUrl={reviewUrl} />
        <section aria-labelledby="ce-qui-revient" className={SEC}>
          <SectionHeader n={2} label="Ce qui revient" id="ce-qui-revient" small>Ce que nos clients soulignent</SectionHeader>
          <Bullets
            items={[
              <>Une <strong>infestation de punaises de lit réglée en une seule intervention</strong> à Lyon 3e : voir notre <Link href="/entreprise-punaises-de-lit-lyon/" className="underline underline-offset-2">traitement des punaises de lit</Link>.</>,
              <>Des <strong>cafards dans un restaurant</strong> près de Jean Macé, traités le jour même avec un protocole discret : voir nos <Link href="/professionnels/restaurants/" className="underline underline-offset-2">interventions en restauration</Link>.</>,
              <>Des <strong>souris dans les combles</strong> d&apos;une maison à Villeurbanne : diagnostic clair, devis immédiat et suivi sérieux, voir la <Link href="/deratisation-villeurbanne/" className="underline underline-offset-2">dératisation à Villeurbanne</Link>.</>,
            ]}
          />
        </section>
        <section aria-labelledby="regles" className={SEC}>
          <SectionHeader n={3} label="Nos règles" id="regles" small>Comment nous publions les avis</SectionHeader>
          <p className="mt-6 max-w-prose">
            Les avis de cette page sont ceux que nos clients nous ont laissés. Nous les publions en texte intégral, avec le prénom, l&apos;initiale du
            nom et le quartier ou la ville indiqués par le client. Nous ne réécrivons pas un avis, nous n&apos;en inventons aucun et nous
            n&apos;affichons pas de note qui ne vienne pas de notre fiche Google.
          </p>
          <p className="mt-4 max-w-prose">
            La note indiquée plus haut est celle de notre fiche Google au moment de la mise à jour de cette page. Les nouveaux avis sont ajoutés au fil
            des interventions, les plus récents en tête de liste.
          </p>
        </section>
        <section aria-labelledby="laisser" className={SEC}>
          <SectionHeader n={4} label="Votre avis" id="laisser" small>Vous avez fait appel à nous ?</SectionHeader>
          <p className="mt-6 max-w-prose">
            Votre retour aide d&apos;autres habitants de Lyon et de la région à choisir un professionnel en confiance, et nous aide à progresser.
            Quelques lignes suffisent : le nuisible traité, le délai d&apos;intervention, le résultat après le suivi.
          </p>
          {reviewUrl ? (
            <p className="mt-4 max-w-prose">Le bouton « Laisser un avis sur Google », plus haut, ouvre directement notre fiche.</p>
          ) : (
            <p className="mt-4 max-w-prose">Vous pouvez laisser votre avis sur notre fiche Google « HA Nuisibles » ou nous écrire depuis la page contact.</p>
          )}
        </section>
      </div>
      <TrustLinks
        n={5}
        current="/avis/"
        more={[
          { href: "/nos-services/", label: "Tous nos services" },
          { href: "/contact/", label: "Nous contacter" },
        ]}
      />
      <CtaBand />
    </>
  );
}
