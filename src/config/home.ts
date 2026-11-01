// Texts of the home page, taken from the old home (content/pages/home.md); tests/unit/facts.test.ts checks each one against OLD_SITE.md.
// Section titles are plain copy in HomeSections.tsx.

export const hero = {
  zone: "Service de Dératisation et Désinsectisation à Villeurbanne, Lyon, Rhône, Isère et Haute-Savoie.",
  image: "/images/deratisation-annemasse.webp",
};

export const whyUs = {
  items: [
    { title: "Efficacité et rapidité", text: "Intervention sous 24h (souvent le jour-même) à Lyon & Villeurbanne. Résultat garanti et traitements pros sécurisés." },
    { title: "Zone d’intervention étendue", text: "Basés à Villeurbanne, nous couvrons tous les arrondissements de Lyon et la métropole (Villeurbanne, Bron, Caluire, Vénissieux…)." },
    { title: "Solutions sur mesure", text: "Particuliers, commerces & restaurants, hôtels, syndics et collectivités : protocole adapté, discret, conforme aux normes." },
  ],
};

export const method = {
  steps: [
    { title: "Diagnostic sur place", text: "Identification du nuisible, repérage des nids et des accès, photos/constat." },
    { title: "Traitement ciblé", text: "Gel/pulvérisation/nébulisation, pièges mécaniques, appâts en boîtiers scellés." },
    { title: "Sécurité & conformité", text: "Produits homologués, fiches techniques, zones sensibles protégées (enfants/animaux)." },
    { title: "Prévention", text: "Colmatage, recommandations d’hygiène, plan de contrôle." },
    { title: "Suivi & garantie", text: "Second passage si nécessaire, rapport d’intervention, garantie de résultat." },
  ],
};
