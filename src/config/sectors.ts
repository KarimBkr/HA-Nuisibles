import type { ServiceKey } from "@/config/services";
import { COMMON_ROWS, TARIFFS } from "@/config/tariffs";

// Sector pages /professionnels/<slug>/ (M70): only facts from the old site (.athanor/docs/OLD_SITE.md, content/pages, content/posts),
// condensed, never copied paragraphs; prices come only from the grid (src/config/tariffs.ts). A sector without 400 real words
// is merged with a neighbour sector (one page, both names), never padded.

export type SectorPage = {
  slug: string; // URL /professionnels/<slug>/
  name: string; // « Restaurants », « Commerces et bureaux »
  service: ServiceKey; // main service: its page and the booking key /rendez-vous/#key
  tariffs: string[]; // TARIFFS category titles whose rows are shown (then Diagnostic and Déplacement)
  title: string; // <title>, 30–65 chars, keyword first
  description: string; // meta description, 70–165 chars
  h1: string;
  intro: string; // direct answer, 2–3 sentences
  stakes: string[]; // what this sector risks / needs
  method: string[]; // HA Nuisibles intervention, in order
  organisation: string[]; // hours, discretion, report, follow-up, as written on the old site
  cases: { title: string; place: string; text: string }[]; // real old-site cases only ([] when none)
  faq: { q: string; a: string }[];
  articles: string[]; // slugs of existing pages/posts (must exist in content/)
};

export const SECTORS_HREF = "/professionnels/";
export const sectorHref = (slug: string) => `${SECTORS_HREF}${slug}/`;

/** Grid rows of the sector's categories, then the rows common to every intervention. */
export const sectorRows = (s: SectorPage) => [
  ...s.tariffs.flatMap((t) => TARIFFS.find((c) => c.title === t)?.rows ?? []),
  ...COMMON_ROWS,
];

export const SECTOR_PAGES: SectorPage[] = [
  {
    slug: "restaurants",
    name: "Restaurants",
    service: "deratisation",
    tariffs: ["Rats et souris", "Blattes / Cafards"],
    title: "Dératisation restaurant Lyon : rats, souris et cafards",
    description:
      "Dératisation et désinsectisation de restaurants à Lyon et Villeurbanne : intervention discrète hors service, protocole respectant l’HACCP, rapport détaillé.",
    h1: "Dératisation de restaurant à Lyon et Villeurbanne",
    intro:
      "Un rat dans la réserve ou des cafards en cuisine menacent directement un restaurant : contrôle sanitaire, fermeture administrative, confiance des clients. HA Nuisibles intervient à Lyon et Villeurbanne hors heures d’ouverture, avec un protocole qui respecte les exigences d’hygiène HACCP de votre cuisine, sans perturber le service.",
    stakes: [
      "Un rongeur ou un cafard repéré lors d’un contrôle sanitaire peut suffire à déclencher une fermeture administrative : l’hygiène exigée par la démarche HACCP ne tolère aucune trace de nuisibles.",
      "Une cuisine professionnelle réunit tout ce qu’il leur faut : chaleur des moteurs de frigos et de fours, humidité des plonges et des évacuations, résidus alimentaires accessibles la nuit.",
      "Les cafards arrivent souvent avec les livraisons (cartons, palettes, cagettes), puis passent de la réserve à la cuisine et à la salle par les gaines et les tuyauteries.",
      "Une photo de nuisible partagée par un client peut abîmer durablement la réputation de l’établissement, sans compter les stocks à jeter.",
      "À Lyon, la densité des restaurants et commerces alimentaires du centre-ville et les immeubles anciens pleins de failles facilitent le passage d’un établissement à l’autre.",
    ],
    method: [
      "Diagnostic sur place : identification de l’espèce, repérage des nids et des points d’entrée (canalisations, faux plafonds, conduits), constat photo.",
      "Rongeurs : pièges et boîtes d’appâts sécurisées, verrouillées, puis obturation des accès repérés.",
      "Cafards : gel appât professionnel dans les fissures, les moteurs et les joints, complété si besoin par une pulvérisation ou une nébulisation ciblée.",
      "Prévention : colmatage, conseils d’hygiène (déchets fermés, denrées en boîtes hermétiques, décartonnage hors de la cuisine) et plan de contrôle.",
      "Suivi : second passage si nécessaire, visite de contrôle et rapport d’intervention.",
    ],
    organisation: [
      "Intervention hors heures d’ouverture, tôt le matin ou un jour de fermeture, pour ne pas gêner le service.",
      "Véhicules sans marquage et techniciens discrets : vos clients ne remarquent rien.",
      "Produits professionnels homologués, appliqués en respectant le protocole HACCP ; techniciens certifiés Certibiocide.",
      "Rapport d’intervention détaillé (produits utilisés, zones traitées), à garder dans votre dossier sanitaire pour les contrôles.",
      "En dératisation, garantie de résultat : deuxième passage gratuit si nécessaire et suivi gratuit pendant 30 jours.",
      "Contrat d’entretien possible, avec passages trimestriels ou mensuels selon le niveau de risque.",
    ],
    cases: [
      {
        title: "Rats dans un restaurant",
        place: "Lyon 7e – Jean-Macé",
        text: "Rats visibles en fin de service dans la cuisine ouverte. Appel à 14 h, intervention à 17 h : quatre points d’entrée identifiés, nid dans les conduits, pièges, appâts et colmatage. Plus aucun rat après deux semaines.",
      },
      {
        title: "Rat dans la réserve d’une brasserie",
        place: "Villeurbanne – Gratte-Ciel",
        text: "Un rat surpris juste avant le service du midi. Équipe sur place en moins de deux heures, accès par les canalisations arrière repéré, six boîtes d’appâts posées, entrées obturées, désinfection localisée et suivi. Le restaurant est resté ouvert.",
      },
      {
        title: "Cafards en restaurant",
        place: "Lyon 7e – Jean-Macé",
        text: "Intervention discrète hors service : gel alimentaire ciblé et pulvérisation périphérique, protocole d’hygiène et plan de suivi.",
      },
    ],
    faq: [
      {
        q: "Pouvez-vous intervenir sans fermer le restaurant ?",
        a: "Oui. Nous intervenons hors heures d’ouverture, tôt le matin ou un jour de fermeture, en respectant le protocole HACCP de votre cuisine, sans perturber l’activité.",
      },
      {
        q: "Le rapport d’intervention sert-il lors d’un contrôle sanitaire ?",
        a: "Il indique les produits utilisés et les zones traitées : c’est la trace écrite de votre lutte contre les nuisibles, à classer dans votre dossier sanitaire.",
      },
      {
        q: "Une seule intervention suffit-elle ?",
        a: "Pas toujours. Contre les rongeurs, la garantie prévoit un deuxième passage gratuit si nécessaire et un suivi gratuit pendant 30 jours ; contre les cafards, un second passage élimine les jeunes sortis des oothèques.",
      },
      {
        q: "Proposez-vous un suivi à l’année ?",
        a: "Oui : un contrat d’entretien avec passages réguliers, postes de surveillance et rapport à chaque visite, pour intégrer la lutte anti-nuisibles à votre plan de maîtrise sanitaire.",
      },
    ],
    articles: ["cafards-restaurant-intervention-rapide-discrete-lyon", "deratisation-lyon-2", "loi-obligation-deratisation"],
  },
  {
    slug: "hotels",
    name: "Hôtels",
    service: "punaises-de-lit",
    tariffs: ["Punaises de lit", "Blattes / Cafards"],
    title: "Désinsectisation hôtel à Lyon : punaises de lit et cafards",
    description:
      "Désinsectisation d’hôtel à Lyon et Villeurbanne : détection canine des punaises de lit, traitement des chambres touchées, intervention discrète et rapport.",
    h1: "Désinsectisation d’hôtel à Lyon et Villeurbanne",
    intro:
      "Dans un hôtel, des punaises de lit dans une chambre ou des cafards en cuisine se traduisent vite en signalements de clients et en chambres bloquées. HA Nuisibles localise les foyers, traite les chambres touchées et intervient discrètement, avec un rapport d’intervention et une garantie de résultat.",
    stakes: [
      "Les punaises de lit voyagent dans les bagages : avec le tourisme, les locations courte durée et la mobilité, les hôtels de Lyon (3e, 6e, Part-Dieu, Bellecour) comptent parmi les lieux les plus exposés.",
      "Une chambre contaminée peut gagner les chambres voisines en quelques jours ; il faut alors traiter plus largement le bâtiment.",
      "Les signalements de clients et les avis en ligne touchent directement l’image de l’établissement.",
      "Un cafard détecté lors d’un contrôle sanitaire peut entraîner la fermeture administrative de l’établissement.",
      "Les insecticides vendus dans le commerce n’en viennent pas à bout : les punaises de lit ont développé une résistance aux pyréthrinoïdes.",
    ],
    method: [
      "Diagnostic : détection canine et inspection visuelle pour localiser précisément les foyers, même invisibles à l’œil nu, et éviter les traitements inutiles.",
      "Protocole préparatoire remis à l’équipe : aspiration des sols, matelas et plinthes, linge lavé à haute température, meubles laissés en place pour ne pas propager les insectes.",
      "Traitement des chambres touchées : vapeur haute température qui détruit punaises et œufs, complétée par un traitement chimique raisonné ; surgélation possible pour les textiles.",
      "Cafards et autres insectes : gel professionnel, pulvérisation ou nébulisation selon le niveau d’infestation.",
      "Bilan détaillé, conseils de prévention, suivi et possibilité de passage de contrôle.",
    ],
    organisation: [
      "Véhicules banalisés et interventions discrètes : la tranquillité de vos clients et votre image sont respectées.",
      "Horaires flexibles et interventions de nuit possibles pour ne pas perturber l’activité.",
      "Rapport et certificat d’intervention remis après le traitement.",
      "Garantie de résultat écrite : si l’infestation persiste malgré notre protocole, nous revenons gratuitement, selon les conditions précisées dans le devis.",
      "Techniciens certifiés Certibiocide, produits professionnels homologués.",
      "Conseil de prévention : un protocole régulier d’inspection des chambres, surtout pendant les pics d’activité.",
    ],
    cases: [
      {
        title: "Hôtel 2 étoiles – 16 chambres",
        place: "Lyon 2e",
        text: "Signalements de clients, punaises de lit propagées dans cinq chambres. Foyers localisés par détection canine, traitement vapeur et chimique, consignes strictes pour le linge. Zéro activité en dix jours, sans nouvelle infestation.",
      },
      {
        title: "Crise de punaises de lit dans un hôtel",
        place: "Lyon",
        text: "Témoignage du gérant : hôtel de nouveau pleinement opérationnel après une forte infestation. Le technicien a expliqué toute la démarche, puis est revenu vérifier une seconde fois sans surcoût.",
      },
    ],
    faq: [
      {
        q: "Comment savoir quelles chambres traiter ?",
        a: "La détection canine localise précisément les zones infestées, même quand les punaises ne se voient pas. Ce diagnostic évite les traitements inutiles et cible les chambres réellement touchées.",
      },
      {
        q: "Pouvez-vous intervenir sans que les clients le remarquent ?",
        a: "Oui : véhicules sans marquage, techniciens sobres, horaires adaptés et interventions de nuit possibles pour ne pas perturber l’activité.",
      },
      {
        q: "Que couvre la garantie de résultat ?",
        a: "Elle est écrite : si l’infestation persiste malgré notre protocole, nous revenons gratuitement, selon les conditions précisées dans le devis.",
      },
      {
        q: "Comment limiter le retour des punaises de lit ?",
        a: "Inspectez régulièrement les chambres, surtout pendant les pics d’activité, lavez le linge à haute température et réagissez dès le premier signalement d’un client.",
      },
    ],
    articles: [
      "entreprise-punaises-de-lit-lyon",
      "guide-complet-punaises-lit-elimination-definitive",
      "comment-savoir-si-on-a-des-punaises-de-lit",
    ],
  },
  {
    slug: "syndics-coproprietes-collectivites",
    name: "Syndics, copropriétés et collectivités",
    service: "deratisation",
    tariffs: ["Rats et souris", "Blattes / Cafards", "Pigeons", "Guêpes et frelons"],
    title: "Dératisation syndic copropriété : caves, parties communes",
    description:
      "Dératisation pour syndics de copropriété et collectivités à Lyon et Villeurbanne : diagnostic des parties communes, postes sécurisés, rapport par logement.",
    h1: "Dératisation pour syndic de copropriété et collectivités",
    intro:
      "Rats dans les caves, souris dans les parties communes, pigeons en façade : en copropriété, c’est au syndic d’organiser l’intervention dès que les parties communes sont touchées. HA Nuisibles traite l’immeuble dans son ensemble, aux horaires convenus avec le syndic, et fournit un rapport d’intervention pour chaque logement. Écoles, crèches et lieux publics bénéficient de la même méthode.",
    stakes: [
      "Le Règlement sanitaire départemental impose aux propriétaires et aux syndics de lutter contre les rongeurs ; des arrêtés municipaux peuvent rendre la dératisation obligatoire et la mairie peut mettre en demeure.",
      "Parties communes (caves, hall, local poubelles, cour) : traitement à la charge du syndicat des copropriétaires ; parties privatives : à la charge du copropriétaire concerné.",
      "Traiter un seul appartement échoue si le reste de l’immeuble reste infesté : il faut raisonner à l’échelle du bâtiment, pas du logement.",
      "En urgence sanitaire (rats visibles dans les parties communes, câbles rongés), le syndic peut agir sans attendre l’assemblée générale ; un contrat annuel, lui, se vote en AG.",
      "Écoles, crèches et lieux publics accueillent des enfants : rats dans une école ou nid de frelons dans un faux plafond imposent une intervention rapide et sécurisée.",
    ],
    method: [
      "Diagnostic des zones communes (caves, vide sanitaire, combles, locaux poubelles, parkings) et des extérieurs ; identification de l’espèce par les traces.",
      "Postes d’appâtage sécurisés, fermés à clé, numérotés et cartographiés, ou piégeage mécanique selon l’environnement.",
      "Étanchéité : grilles sur les soupiraux, reprise des passages de tuyauterie, bas de portes renforcés pour bloquer les accès.",
      "Visite de contrôle pour vérifier la consommation des appâts et retirer les cadavres, puis rapport remis au syndic.",
      "Selon le cas : blattes des caves traitées par nébulisation ou fumigation, filets et pics contre les pigeons, destruction de nids de guêpes et de frelons.",
    ],
    organisation: [
      "Interventions discrètes, selon les horaires convenus avec le syndic, avec un rapport d’intervention pour chaque logement.",
      "Compte-rendu détaillé après chaque intervention, utile aux syndics et aux gestions collectives.",
      "Devis transparents et détaillés pour faciliter la répartition des charges entre copropriétaires.",
      "Contrat préventif possible : entretien des postes sécurisés, inspection des points d’étanchéité et rapport à chaque passage.",
      "Garantie de résultat ; en dératisation, deuxième passage gratuit si nécessaire et suivi gratuit pendant 30 jours.",
      "Collectivités : interventions dans les écoles, crèches et lieux publics ; pour un nid sur l’espace public, c’est la mairie qui mandate le professionnel.",
    ],
    cases: [
      {
        title: "Rats dans les caves d’une copropriété",
        place: "Villeurbanne – cours Tolstoï",
        text: "Copropriété de six lots, infestation massive dans les caves après trois interventions infructueuses d’une autre société. Inspection des caves et du vide sanitaire, neuf postes sécurisés, trous d’accès repris avec grille et mousse, rapport écrit remis au syndic. Plus aucune activité en quinze jours.",
      },
      {
        title: "Pigeons sur la façade d’un immeuble",
        place: "Villeurbanne – Charpennes",
        text: "Une vingtaine de pigeons sur les rebords de fenêtres, climatiseurs obstrués, façades abîmées par les fientes. Après diagnostic, filets en façade et pics discrets sur les rebords de toit, posés en une demi-journée. Quelques jours plus tard, le syndic confirmait qu’aucun pigeon n’était revenu.",
      },
    ],
    faq: [
      {
        q: "Qui paie la dératisation en copropriété ?",
        a: "Les parties communes sont à la charge du syndicat des copropriétaires, réparties selon les tantièmes généraux. Si un seul appartement est touché, le copropriétaire concerné paie ; un locataire peut l’être si l’infestation vient d’un défaut d’entretien du logement.",
      },
      {
        q: "Le syndic peut-il agir sans assemblée générale ?",
        a: "Oui en cas d’urgence sanitaire, par exemple des rats visibles dans les parties communes. Un contrat annuel d’entretien se vote en revanche en assemblée générale.",
      },
      {
        q: "Que contient le rapport remis au syndic ?",
        a: "Les zones traitées et les produits utilisés, pour la traçabilité. Nous fournissons un rapport d’intervention pour chaque logement traité.",
      },
      {
        q: "Intervenez-vous pour les écoles et les collectivités ?",
        a: "Oui, dans les écoles, crèches et lieux publics, y compris en urgence (rats dans une école, nid de frelons). Pour un nid sur l’espace public, signalez-le à la mairie : c’est elle qui mandate un professionnel.",
      },
    ],
    articles: [
      "deratisation-copropriete-qui-paie-organisation-protocole",
      "rats-copropriete-villeurbanne",
      "loi-obligation-deratisation",
    ],
  },
  {
    slug: "commerces-bureaux",
    name: "Commerces et bureaux",
    service: "deratisation",
    tariffs: ["Rats et souris", "Blattes / Cafards", "Fourmis", "Guêpes et frelons"],
    title: "Dératisation commerce et bureaux à Lyon et Villeurbanne",
    description:
      "Dératisation et désinsectisation de commerces et bureaux à Lyon et Villeurbanne : intervention hors heures d’ouverture, discrète, avec rapport et suivi.",
    h1: "Dératisation de commerces et bureaux à Lyon",
    intro:
      "Souris dans les stocks, cafards en boutique, fourmis dans les bureaux, nid de frelons dans un faux plafond : dans un local professionnel, il faut agir vite sans interrompre l’activité. HA Nuisibles intervient hors heures d’ouverture, avec des véhicules sans marquage, et remet un rapport détaillé après chaque intervention.",
    stakes: [
      "Dans un commerce alimentaire, un rongeur vu lors d’un contrôle peut conduire à une fermeture administrative, à des amendes et à une perte de clientèle.",
      "Pour les commerçants et les artisans, toute présence de rongeurs est une violation potentielle des normes d’hygiène, passible de sanctions administratives.",
      "Dans un commerce, la priorité est la réactivité, la continuité d’activité et l’image de marque.",
      "Bâtiments anciens, petits commerces serrés et livraisons favorisent l’entrée des rongeurs et des insectes ; même les bureaux modernes de la Part-Dieu accueillent des nids de guêpes et de frelons.",
      "Bombes et pièges du commerce sont rarement efficaces : ils dispersent les nuisibles sans atteindre le foyer.",
    ],
    method: [
      "Diagnostic sur place : identification du nuisible, repérage des nids et des points d’entrée, photos et constat.",
      "Traitement ciblé : pièges et appâts en boîtiers scellés contre les rongeurs, gel, pulvérisation ou nébulisation contre les insectes, traitement localisé contre les fourmis.",
      "Nid de guêpes ou de frelons : sécurisation de la zone puis destruction du nid avec un matériel adapté.",
      "Prévention : colmatage complet des accès, recommandations d’hygiène et plan de contrôle.",
      "Suivi : second passage si nécessaire et rapport d’intervention.",
    ],
    organisation: [
      "Intervention hors heures d’ouverture, horaires flexibles et interventions de nuit possibles pour ne pas perturber l’activité.",
      "Véhicules non marqués et techniciens sobres : le problème est réglé sans attirer l’attention de vos clients.",
      "Traitements discrets et traçables, qui respectent les normes HACCP dans les commerces de bouche.",
      "Contrat de maintenance anti-nuisibles possible, avec rapport d’intervention et suivi mensuel.",
      "En dératisation, garantie de résultat : deuxième passage gratuit si nécessaire et suivi gratuit pendant 30 jours.",
    ],
    cases: [
      {
        title: "Souris dans un commerce",
        place: "Vieux Lyon – épicerie fine",
        text: "Souris découvertes dans les stocks alimentaires. Intervention le jour même : six points d’entrée, nids dans les stocks, pièges, appâts et colmatage complet, puis contrôles mensuels pendant trois mois. Infestation éliminée, normes respectées.",
      },
      {
        title: "Nid de frelons dans un bureau",
        place: "Lyon – Part-Dieu",
        text: "Bruit suspect dans le faux plafond d’un grand bureau. Après investigation, un nid de frelons est découvert : intervention en soirée, évacuation temporaire de l’étage, traitement et sécurisation complète.",
      },
      {
        title: "Guêpes dans le faux plafond d’un commerce",
        place: "Villeurbanne – Grandclément",
        text: "Nid logé dans le faux plafond de la boutique : traitement du nid et sécurisation de nuit, en dehors des heures d’ouverture.",
      },
    ],
    faq: [
      {
        q: "Pouvez-vous intervenir en dehors de nos horaires d’ouverture ?",
        a: "Oui. Pour un commerce, nous intervenons hors heures d’ouverture ; les horaires sont flexibles et les interventions de nuit possibles, pour ne pas perturber l’activité.",
      },
      {
        q: "Quels locaux professionnels traitez-vous ?",
        a: "Boutiques, boulangeries, salons de coiffure, cabinets médicaux, locaux techniques, bureaux : l’entreprise est habilitée à traiter les établissements recevant du public (ERP).",
      },
      {
        q: "Le prix dépend-il de la surface du local ?",
        a: "Oui : le coût s’adapte à la surface réelle du local, au nuisible et au niveau d’infestation. Un devis gratuit est établi avant tout traitement.",
      },
      {
        q: "Peut-on mettre en place un suivi régulier ?",
        a: "Oui, avec un contrat de maintenance anti-nuisibles : passages réguliers, rapport d’intervention et suivi mensuel.",
      },
    ],
    articles: ["comment-savoir-si-on-a-des-souris", "cafards-resistent-sprays", "loi-obligation-deratisation"],
  },
];
