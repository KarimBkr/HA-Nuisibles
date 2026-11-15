import type { Metadata } from "next";
import Link from "next/link";
import { site, telHref } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeader from "@/components/ui/SectionHeader";
import { Bullets, LINK, SEC, TrustLinks } from "@/components/Trust";

export const metadata: Metadata = pageMetadata({
  title: "Dératiseur certifié Certibiocide : à propos de HA Nuisibles",
  description:
    "HA Nuisibles, entreprise de dératisation et désinsectisation basée à Villeurbanne : qui nous sommes, certification Certibiocide, méthode et garantie de résultat.",
  path: "/a-propos/",
});

// About page (M71, E-E-A-T): publisher, company, address, Certibiocide as worded on the old site (OLD_SITE.md 471, 1289), method (OLD_SITE.md 262–270).
export default function About() {
  const a = site.address;
  return (
    <>
      <PageHero
        trail={[{ label: "À propos", href: "/a-propos/" }]}
        title="À propos de HA Nuisibles, dératiseur certifié Certibiocide"
        text={site.description}
        actions
        width="lg:max-w-page"
      />
      <div data-trust="a-propos">
        <section aria-labelledby="entreprise" className={SEC}>
          <SectionHeader n={1} label="L'entreprise" id="entreprise" small>Une entreprise locale, basée à Villeurbanne</SectionHeader>
          <p className="mt-6 max-w-prose">
            {site.name} est le nom commercial de <strong>{site.legalName}</strong>, {site.legalForm.toLowerCase()} représentée par {site.publisher}, également
            responsable de la publication de ce site. Nos techniciens interviennent depuis Villeurbanne à Lyon, dans tous ses arrondissements, et dans
            toute la région Rhône-Alpes, auprès des particuliers, des professionnels et des collectivités.
          </p>
          <dl className="mt-6 grid max-w-prose gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]" data-nap>
            <dt className="text-muted">Adresse</dt>
            <dd>{a.street}, {a.postalCode} {a.city}</dd>
            <dt className="text-muted">Téléphone</dt>
            <dd><a href={telHref} className={LINK}>{site.phone.display}</a></dd>
            <dt className="text-muted">E-mail</dt>
            <dd><a href={`mailto:${site.email}`} className={LINK}>{site.email}</a></dd>
            <dt className="text-muted">Horaires</dt>
            <dd>{site.hours.map((h) => <span key={h.days} className="block">{h.days} : {h.hours}</span>)}</dd>
            <dt className="text-muted">Zone</dt>
            <dd>{site.zone.contactCities.join(", ")} et leurs environs</dd>
          </dl>
        </section>
        <section aria-labelledby="certification" className={SEC}>
          <SectionHeader n={2} label="Certification" id="certification" small>Des techniciens certifiés Certibiocide</SectionHeader>
          <p className="mt-6 max-w-prose">
            Tous nos techniciens sont Certibiocide, utilisent des produits pros homologués et un équipement adapté. Cette certification est obligatoire
            pour utiliser des biocides professionnels en France. Elle garantit la qualification du technicien et l&apos;accès à des produits homologués
            réellement efficaces, que les particuliers ne trouvent pas en grande surface.
          </p>
          <p className="mt-4 max-w-prose">
            Les produits sont choisis selon le nuisible et le lieu : dispositifs sécurisés, zones sensibles protégées, consignes claires après
            l&apos;intervention pour la sécurité des enfants et des animaux.
          </p>
        </section>
        <section aria-labelledby="methode" className={SEC}>
          <SectionHeader n={3} label="Méthode" id="methode" small>Notre méthode, étape par étape</SectionHeader>
          <ol className="mt-6 max-w-prose list-decimal space-y-3 pl-5 marker:font-medium marker:text-brand">
            <li><strong>Diagnostic sur place</strong> : identification du nuisible, repérage des nids et des accès, photos et constat.</li>
            <li><strong>Traitement ciblé</strong> : gel, pulvérisation ou nébulisation, pièges mécaniques, appâts en boîtiers scellés, traitement thermique pour les punaises de lit.</li>
            <li><strong>Sécurité et conformité</strong> : produits homologués, fiches techniques, zones sensibles protégées (enfants, animaux).</li>
            <li><strong>Prévention</strong> : colmatage, recommandations d&apos;hygiène, plan de contrôle.</li>
            <li><strong>Suivi et garantie</strong> : second passage si nécessaire, rapport d&apos;intervention, garantie de résultat.</li>
          </ol>
        </section>
        <section aria-labelledby="engagements" className={SEC}>
          <SectionHeader n={4} label="Engagements" id="engagements" small>Ce sur quoi nous nous engageons</SectionHeader>
          <Bullets
            items={[
              <><strong>Intervention sous 24h</strong> à Lyon et Villeurbanne, du lundi au samedi, et urgences le dimanche.</>,
              <><strong>Devis gratuit et sans engagement</strong>, avec des prix de départ publiés sur notre <Link href="/tarifs/" className="underline underline-offset-2">grille tarifaire</Link>.</>,
              <><strong>Garantie de résultat écrite</strong> : si l&apos;infestation persiste malgré notre protocole, nous revenons gratuitement (conditions précisées dans le devis).</>,
              <><strong>Discrétion</strong> : véhicules banalisés, interventions discrètes, suivi individuel ; votre tranquillité et votre image sont respectées.</>,
              <><strong>Suivi humain et local</strong> : notre équipe vous répond en direct, sans plateforme anonyme, et le suivi après intervention est inclus.</>,
            ]}
          />
        </section>
      </div>
      <TrustLinks
        n={5}
        current="/a-propos/"
        more={[
          { href: "/nos-services/", label: "Tous nos services anti-nuisibles" },
          { href: "/zones-d-intervention/", label: "Nos zones d'intervention" },
          { href: "/contact/", label: "Nous contacter ou demander un devis" },
        ]}
      />
      <CtaBand />
    </>
  );
}
