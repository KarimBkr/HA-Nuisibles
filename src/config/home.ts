// Texts of the home page, taken from the old home (content/pages/home.md); tests/unit/facts.test.ts checks each one against OLD_SITE.md.
// Section titles are plain copy in HomeSections.tsx.

export const hero = {
  zone: "Service de dératisation et désinsectisation à Villeurbanne, Lyon, Rhône, Isère et Haute-Savoie.",
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

// Home price preview (M35): each price quoted verbatim from the old site, linked to its price page.
export const prices = {
  items: [
    { label: "Dératisation", text: "À partir de 150 € TTC", href: "/prix-deratisation/" },
    { label: "Punaises de lit", text: "À partir de 150 € TTC", href: "/prix-traitement-punaise-de-lit/" },
    { label: "Nid de guêpes", text: "À partir de 110 € TTC", href: "/tarif-destruction-nid-de-guepes/" },
    { label: "Nid de frelons", text: "À partir de 130 € TTC", href: "/tarif-destruction-nid-de-guepes/" },
  ],
};
