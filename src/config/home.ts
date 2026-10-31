// Texts of the home page, verbatim from the old home (content/pages/home.md); tests/unit/facts.test.ts checks each one against OLD_SITE.md.

export const hero = {
  eyebrow: "Extermination des nuisibles",
  tagline: "Votre partenaire anti nuisibles",
  zone: "Service de Dératisation et Désinsectisation à Villeurbanne, Lyon, Rhône, Isère et Haute-Savoie.",
  image: "/images/deratisation-annemasse.webp",
};

export const quickBlocks = [
  { title: "Contactez-nous", text: "Appelez-nous ou remplissez notre formulaire en ligne en quelques clics.", cta: "07 64 46 46 91", href: "tel" },
  { title: "Devis Immédiat", text: "Recevez un devis clair et personnalisé sans engagement.", cta: "Devis en ligne", href: "/contact/#mon-devis" },
  { title: "Intervention", text: "Nous intervenons sous 24h et garantissons un suivi après traitement.", cta: "7/7", href: "/contact/" },
] as const;

export const presentation = {
  title: "HA Nuisibles – Experts en dératisation & désinsectisation à Lyon et Villeurbanne",
  paragraphs: [
    "Basés à Villeurbanne, nous intervenons en moins de 24h dans tous les arrondissements de Lyon et les communes voisines.",
    "Rats, souris, punaises de lit, cafards, guêpes… nous éliminons tous les nuisibles rapidement et durablement grâce à des traitements professionnels et sécurisés.",
    "Particuliers, commerces, restaurants, hôtels : profitez de notre expertise locale et de notre garantie de résultat.",
  ],
  callout: "Intervention immédiate",
  image: "/images/desinsectisation-a-villeurbanne-et-toute-sa-region.webp",
  imageAlt: "Dératisation & désinsectisation Lyon avec HA Nuisibles",
};

export const solutions = {
  title: "Nos solutions de dératisation et d'extermination de nuisibles à Lyon",
  intro: "Rats, punaises, rongeurs, pigeons… Nous éliminons tous les nuisibles sans exception.",
  cards: [
    { title: "Dératisation", text: "Élimination des rongeurs", href: "/deratisation-lyon-2/", image: "/images/daniil-komov-f-5t2ljlytc-unsplash.webp" },
    { title: "Guêpes & Frelons", text: "Destruction de nids", href: "/nid-guepes-frelons-lyon/", image: "/images/peut-on-laisser-un-nid-de-guepes.webp" },
    { title: "Punaises de lit", text: "Désinsectisation", href: "/entreprise-punaises-de-lit-lyon/", image: "/images/wmremove-transformed.webp" },
    { title: "Blattes & cafards", text: "Désinsectisation", href: "/guide-cafards-blattes/", image: "/images/erik-karits-xvmynybhkf4-unsplash.webp" },
  ],
};

export const whyUs = {
  eyebrow: "Intervention Express, Partout et Pour Tous",
  title: "Pourquoi faire confiance à HA Nuisibles 3D contre les nuisibles ?",
  items: [
    { title: "Efficacité et Rapidité", text: "Intervention sous 24h (souvent le jour-même) à Lyon & Villeurbanne. Résultat garanti et traitements pros sécurisés." },
    { title: "Zone d’Intervention Étendue", text: "Basés à Villeurbanne, nous couvrons tous les arrondissements de Lyon et la métropole (Villeurbanne, Bron, Caluire, Vénissieux…)." },
    { title: "Solutions Sur Mesure", text: "Particuliers, commerces & restaurants, hôtels, syndics et collectivités : protocole adapté, discret, conforme aux normes." },
  ],
};

export const processIntro = {
  title: "Notre processus de traitement de nuisibles à Lyon",
  text: "Rapide, Clair et Efficace : Découvrez Comment Nous Éliminons Vos Nuisibles étape par étape.",
};

export const cases = {
  title: "Nos techniques d’intervention à Lyon & Villeurbanne",
  intro: "Chaque situation est unique. Nous adaptons nos méthodes selon le lieu, l’espèce et le niveau d’infestation pour une éradication rapide, durable et sécurisée.",
  items: [
    { place: "Villeurbanne – Gratte-Ciel", title: "Souris dans immeuble ancien", text: "Diagnostic des points d’entrée, pose de pièges sécurisés, appâts sous boîtiers verrouillés et colmatage des accès. Contrôle à J+14." },
    { place: "Lyon 7e – Jean-Macé", title: "Cafards en restaurant", text: "Intervention discrète hors service : gel alimentaire ciblé + pulvérisation périphérique, protocole d’hygiène et plan de suivi." },
    { place: "Lyon 4e – Croix-Rousse", title: "Dératisation de caves humides", text: "Traçage des circulations, postes d’appâtage sécurisés, pièges mécaniques et prévention longue durée (brosses, grilles, joints)." },
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
  closing: "Intervention sous 24 h à Lyon & Villeurbanne — appel immédiat ou devis en ligne.",
  quoteCta: "Demander un devis gratuit",
};

export const testimonials = {
  eyebrow: "100 % d’efficacité prouvée et des clients pleinement satisfaits !",
  title: "Ce Que Nos Clients Disent de Nous",
  // From the old site's JSON-LD aggregateRating (OLD_SITE.md §1), shown as text only: no stars.
  rating: { score: "5/5", count: "16 avis" },
  items: [
    { quote: "Infestation de punaises de lit réglée en une seule intervention. Équipe ponctuelle, très pro, et surtout efficace. Plus aucune trace depuis, je recommande vivement HA Nuisibles à Lyon !", author: "Claire M., Lyon 3e" },
    { quote: "Cafards dans notre restaurant près de Jean Macé. Intervention rapide le jour-même, protocole discret pour ne pas gêner l’activité. Résultat impeccable, nos clients sont rassurés.", author: "Julien P., Lyon 7e" },
    { quote: "Souris dans les combles de notre maison. Diagnostic clair, devis immédiat, et traitement efficace. Trois semaines après, plus aucun bruit, suivi sérieux. Merci à l’équipe !", author: "Sophie D., Villeurbanne" },
  ],
};

export const audiences = {
  title: "À qui s’adressent nos services ?",
  items: [
    { title: "Particuliers", image: "/images/souris-villeurbane-01.webp" },
    { title: "Professionnels", image: "/images/desinsectisation.webp" },
    { title: "Syndics & copropriétés", image: "/images/fourmie-01.webp" },
    { title: "Collectivités", image: "/images/mouches-01.webp" },
  ],
};
