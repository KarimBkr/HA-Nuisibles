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
