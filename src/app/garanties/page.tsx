import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import LeaderList from "@/components/ui/LeaderList";
import SectionHeader from "@/components/ui/SectionHeader";
import { Bullets, SEC, TrustLinks } from "@/components/Trust";

export const metadata: Metadata = pageMetadata({
  title: "Garanties dératisation et punaises de lit | HA Nuisibles",
  description:
    "Garantie de résultat écrite : suivi gratuit de 30 jours en dératisation, 3, 6 ou 12 mois pour les punaises de lit, nouveau nid de guêpes traité gratuitement.",
  path: "/garanties/",
});

// Guarantees page (M71): exact old-site durations — dératisation OLD_SITE.md 2832–2847 and 3152, punaises de lit 4059, guêpes/frelons 1722, general 463.
export default function Guarantees() {
  return (
    <>
      <PageHero
        trail={[{ label: "Garanties", href: "/garanties/" }]}
        title="Nos garanties en dératisation, punaises de lit et nids de guêpes"
        text="Chaque intervention est couverte par une garantie de résultat écrite. Voici, service par service, ce qu'elle couvre, combien de temps, et ce qu'elle ne couvre pas."
        actions
        width="lg:max-w-page"
      />
      <div data-trust="garanties">
        <section aria-labelledby="principe" className={SEC}>
          <SectionHeader n={1} label="Le principe" id="principe" small>Une garantie de résultat écrite</SectionHeader>
          <p className="mt-6 max-w-prose">
            Si l&apos;infestation persiste malgré notre protocole, nous revenons gratuitement. Les conditions sont précisées dans le devis, remis
            gratuitement et sans engagement avant toute intervention. La garantie est incluse dans nos tarifs, sans supplément.
          </p>
          <LeaderList
            className="mt-6 max-w-prose border-y border-rule"
            items={[
              { label: "Dératisation (rats, souris)", value: "suivi gratuit 30 jours" },
              { label: "Punaises de lit", value: "3, 6 ou 12 mois" },
              { label: "Nid de guêpes ou de frelons", value: "3 semaines" },
            ]}
          />
        </section>
        <section aria-labelledby="deratisation" className={SEC}>
          <SectionHeader n={2} label="Dératisation" id="deratisation" small>Dératisation : 30 jours de suivi gratuit</SectionHeader>
          <p className="mt-6 max-w-prose">
            Appel de suivi à J+7, visite de contrôle gratuite à J+14, vérification finale à J+30 si nécessaire. Si les rongeurs réapparaissent dans
            les 30 jours, nous revenons gratuitement.
          </p>
          <Bullets
            items={[
              "Éradication complète des rongeurs traités.",
              "Deuxième passage gratuit si nécessaire (J+14).",
              "Suivi gratuit pendant 30 jours.",
              "Recommandations de prévention incluses.",
            ]}
          />
          <p className="mt-4"><Link href="/deratisation-lyon-2/" className="underline underline-offset-2">Notre service de dératisation à Lyon</Link></p>
        </section>
        <section aria-labelledby="punaises" className={SEC}>
          <SectionHeader n={3} label="Punaises de lit" id="punaises" small>Punaises de lit : 3, 6 ou 12 mois selon le traitement</SectionHeader>
          <p className="mt-6 max-w-prose">
            La garantie de résultat est systématiquement incluse dans tous nos tarifs, sans aucun supplément. Sa durée dépend du traitement choisi :
          </p>
          <LeaderList
            className="mt-6 max-w-prose border-y border-rule"
            items={[
              { label: "Traitement chimique ou thermique standard vapeur", value: "3 mois minimum" },
              { label: "Traitement combiné", value: "6 mois" },
              { label: "Avec un contrat de suivi préventif", value: "jusqu'à 12 mois" },
            ]}
          />
          <p className="mt-4 max-w-prose">
            Concrètement, si des punaises de lit réapparaissent durant cette période, nous intervenons gratuitement autant de fois que nécessaire
            jusqu&apos;à éradication complète, sans limitation ni frais supplémentaires.
          </p>
          <p className="mt-4"><Link href="/entreprise-punaises-de-lit-lyon/" className="underline underline-offset-2">Notre traitement des punaises de lit à Lyon</Link></p>
        </section>
        <section aria-labelledby="guepes" className={SEC}>
          <SectionHeader n={4} label="Guêpes et frelons" id="guepes" small>Nids de guêpes et de frelons : un nouveau nid traité gratuitement</SectionHeader>
          <p className="mt-6 max-w-prose">
            Notre suivi est inclus. Si un nouveau nid apparaît dans la même zone dans les 3 semaines suivant l&apos;intervention, nous revenons
            gratuitement pour le traiter.
          </p>
          <p className="mt-4"><Link href="/destruction-nid-guepes-frelons/" className="underline underline-offset-2">Destruction de nids de guêpes et de frelons</Link></p>
        </section>
        <section aria-labelledby="exclusions" className={SEC}>
          <SectionHeader n={5} label="Limites" id="exclusions" small>Ce que la garantie ne couvre pas</SectionHeader>
          <Bullets
            items={[
              "La réinfestation due à un défaut de prévention (portes ouvertes, aliments exposés).",
              "Les rongeurs d'espèces différentes de ceux traités lors de l'intervention initiale.",
              "Pour les autres traitements (cafards, désinsectisation, désinfection, dépigeonnage, moustiques), la durée et les conditions de la garantie sont écrites dans le devis, avant l'intervention.",
            ]}
          />
          <p className="mt-4 max-w-prose">
            Les recommandations remises après chaque passage (colmatage des accès, rangement hermétique des aliments, élimination des points
            d&apos;eau) font partie du traitement : les suivre, c&apos;est garder la garantie active et éviter la récidive.
          </p>
        </section>
      </div>
      <TrustLinks
        n={6}
        current="/garanties/"
        more={[
          { href: "/tarifs/", label: "Nos tarifs, garantie comprise" },
          { href: "/rendez-vous/", label: "Réserver une intervention" },
        ]}
      />
      <CtaBand />
    </>
  );
}
