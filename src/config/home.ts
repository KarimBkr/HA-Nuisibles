// Texts of the home page, taken from the old home (content/pages/home.md); tests/unit/facts.test.ts checks each one against OLD_SITE.md.

export const hero = {
  zone: "Service de Dératisation et Désinsectisation à Villeurbanne, Lyon, Rhône, Isère et Haute-Savoie.",
  image: "/images/deratisation-annemasse.webp",
};

export const whyUs = {
  title: "Pourquoi faire confiance à HA Nuisibles 3D contre les nuisibles ?",
  items: [
    { title: "Efficacité et Rapidité", text: "Intervention sous 24h (souvent le jour-même) à Lyon & Villeurbanne. Résultat garanti et traitements pros sécurisés." },
    { title: "Zone d’Intervention Étendue", text: "Basés à Villeurbanne, nous couvrons tous les arrondissements de Lyon et la métropole (Villeurbanne, Bron, Caluire, Vénissieux…)." },
    { title: "Solutions Sur Mesure", text: "Particuliers, commerces & restaurants, hôtels, syndics et collectivités : protocole adapté, discret, conforme aux normes." },
  ],
};

export const method = {
  title: "Notre méthode, étape par étape",
  steps: [
    { title: "Diagnostic sur place", text: "identification du nuisible, repérage des nids et des accès, photos/constat." },
    { title: "Traitement ciblé", text: "gel/pulvérisation/nébulisation, pièges mécaniques, appâts en boîtiers scellés." },
    { title: "Sécurité & conformité", text: "produits homologués, fiches techniques, zones sensibles protégées (enfants/animaux)." },
    { title: "Prévention", text: "colmatage, recommandations d’hygiène, plan de contrôle." },
    { title: "Suivi & garantie", text: "second passage si nécessaire, rapport d’intervention, garantie de résultat." },
  ],
};

export const testimonials = {
  title: "Ce Que Nos Clients Disent de Nous",
  // From the old site's JSON-LD aggregateRating (OLD_SITE.md §1), shown as text only: no stars.
  rating: { score: "5/5", count: "16 avis" },
  items: [
    { quote: "Infestation de punaises de lit réglée en une seule intervention. Équipe ponctuelle, très pro, et surtout efficace. Plus aucune trace depuis, je recommande vivement HA Nuisibles à Lyon !", author: "Claire M., Lyon 3e" },
    { quote: "Cafards dans notre restaurant près de Jean Macé. Intervention rapide le jour-même, protocole discret pour ne pas gêner l’activité. Résultat impeccable, nos clients sont rassurés.", author: "Julien P., Lyon 7e" },
    { quote: "Souris dans les combles de notre maison. Diagnostic clair, devis immédiat, et traitement efficace. Trois semaines après, plus aucun bruit, suivi sérieux. Merci à l’équipe !", author: "Sophie D., Villeurbanne" },
  ],
};
