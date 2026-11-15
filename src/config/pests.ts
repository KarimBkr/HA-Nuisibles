import type { ServiceKey } from "@/config/services";

// Pest pages /nuisibles/<slug>/ (M68–M69): facts condensed from the old site (.athanor/docs/OLD_SITE.md, content/pages, content/posts),
// never copied paragraphs; prices come only from the grid (src/config/tariffs.ts, category `tariff`).

export type PestPage = {
  slug: string; // URL /nuisibles/<slug>/
  name: string; // « Rats et souris »
  service: ServiceKey; // its service page (SERVICES.mainSlug) and booking key
  tariff: string; // TARIFFS category title whose rows are shown
  title: string; // <title>, 30–65 chars, keyword first
  description: string; // meta description, 70–165 chars
  h1: string;
  intro: string; // direct answer, 2–3 sentences
  signs: string[]; // signs of an infestation
  risks: string[];
  treatment: string[]; // HA Nuisibles method, in order
  followUp: string; // online booking (never state a slot length: booking.spec) and the follow-up visit / guarantee as written on the old site
  faq: { q: string; a: string }[];
  articles: string[]; // slugs of existing pages/posts to read further (must exist in content/)
};

export const PESTS_HREF = "/nuisibles/";
export const pestHref = (slug: string) => `${PESTS_HREF}${slug}/`;

export const PEST_PAGES: PestPage[] = [
  {
    slug: "rats-souris",
    name: "Rats et souris",
    service: "deratisation",
    tariff: "Rats et souris",
    title: "Rats et souris : qui appeler pour des rats à Lyon ?",
    description:
      "Rats ou souris chez vous à Lyon ou Villeurbanne ? Signes à repérer, risques, méthode de dératisation HA Nuisibles et suivi gratuit pendant 30 jours.",
    h1: "Rats et souris à Lyon : qui appeler et comment s’en débarrasser",
    intro:
      "Face à des rats ou des souris, le bon interlocuteur est un dératiseur professionnel : en logement privé c’est à l’occupant ou au propriétaire d’agir, en partie commune au syndic. HA Nuisibles intervient à Lyon et Villeurbanne avec un diagnostic sur place, un traitement adapté au rongeur identifié et une garantie écrite de résultat.",
    signs: [
      "Grattements, petites courses ou couinements la nuit dans les cloisons, les faux plafonds ou les combles.",
      "Crottes noires près des murs, sous l’évier ou derrière l’électroménager : allongées chez le rat, plus petites et pointues chez la souris.",
      "Câbles, plinthes, isolant ou emballages alimentaires rongés, avec des trous aux bords nets.",
      "Une odeur musquée d’urine qui s’intensifie dans les pièces fermées, ou une odeur de décomposition si un animal est mort dans un mur.",
      "Traînées grasses le long des murs, empreintes dans la poussière et nids faits de papier ou d’isolant déchiqueté.",
      "Un rongeur aperçu en plein jour : signe qu’il n’y a plus de cachette libre et que l’infestation est déjà avancée.",
    ],
    risks: [
      "Santé : l’urine et les excréments peuvent transmettre leptospirose, salmonellose ou hantavirus et souiller aliments et ustensiles.",
      "Incendie et dégâts : un câble électrique rongé peut provoquer un court-circuit ; isolation, tuyaux et bois sont aussi attaqués.",
      "Prolifération : une femelle rat peut avoir jusqu’à 12 portées par an, si bien qu’un couple devient vite une colonie.",
      "Commerces alimentaires : un rongeur repéré lors d’un contrôle d’hygiène peut entraîner une fermeture administrative.",
    ],
    treatment: [
      "Inspection de 30 à 60 minutes des caves, combles, gaines et vides sanitaires pour identifier l’espèce (rat brun, rat noir ou souris), le niveau d’infestation, les nids et les points d’entrée.",
      "Pièges mécaniques installés sur les trajets habituels des rongeurs, au pied des murs, efficaces tout de suite et sans produit chimique.",
      "Appâts placés dans des boîtiers verrouillés, hors de portée des enfants et des animaux, pour les rongeurs qui se méfient des pièges.",
      "Pulvérisation ou nébulisation de produits biocides homologués lorsque l’infestation est massive ou les zones peu accessibles.",
      "Bouchage des accès avec grillage métallique, ciment, joints ou brosses de porte : un rat passe par 2 cm, une souris par 5 mm.",
      "Remise d’un rapport avec photos et emplacement des dispositifs, puis conseils pour stocker les denrées et éviter le retour des rongeurs.",
    ],
    followUp:
      "La dératisation se réserve en ligne, au créneau de votre choix, ou par téléphone. Ensuite, nous vous appelons à J+7, nous repassons gratuitement contrôler à J+14 et, si besoin, faisons un dernier point à J+30. La garantie écrite comprend ce deuxième passage gratuit (J+14) et 30 jours de suivi gratuit : si les rongeurs reviennent dans ce délai, nous revenons sans frais.",
    faq: [
      {
        q: "Qui appeler quand on a des rats chez soi ?",
        a: "Un professionnel de la dératisation, équipé et formé aux produits biocides. En copropriété, les parties communes relèvent du syndic, qui mandate l’entreprise. Si l’infestation menace des tiers, la mairie peut imposer une dératisation après mise en demeure.",
      },
      {
        q: "Qui paie la dératisation, le locataire ou le propriétaire ?",
        a: "Tout dépend de l’origine du problème. Un défaut d’entretien courant, comme des déchets mal gérés, est à la charge du locataire. Un défaut du bâtiment, comme des murs troués ou des canalisations abîmées, revient au propriétaire, et le syndic gère les parties communes.",
      },
      {
        q: "Combien de temps faut-il pour éliminer rats et souris ?",
        a: "Comptez une à deux semaines pour une infestation légère, deux à quatre pour une infestation modérée et jusqu’à huit semaines pour un cas grave. Les contrôles programmés permettent de vérifier que l’activité baisse réellement.",
      },
      {
        q: "Les appâts sont-ils dangereux pour mes enfants ou mon chien ?",
        a: "Les appâts restent enfermés dans des boîtiers verrouillés et les produits sont homologués. Le technicien protège les pièces sensibles et vous laisse des consignes claires. Il suffit d’attendre 2 à 3 heures avant de revenir dans une pièce traitée.",
      },
      {
        q: "Que faire en attendant le technicien ?",
        a: "Mettez la nourriture dans des boîtes hermétiques, retirez miettes et eau stagnante et bouchez au ciment les trous visibles. Ne manipulez pas un rongeur mort et n’employez pas de poison sans protection adaptée.",
      },
    ],
    articles: [
      "comment-se-debarrasser-des-rats-solutions-efficaces",
      "comment-savoir-si-on-a-des-souris",
      "combien-temps-dure-deratisation",
      "loi-obligation-deratisation",
      "rats-combles-elimination-infestation-reelle",
    ],
  },
  {
    slug: "cafards-blattes",
    name: "Cafards et blattes",
    service: "desinsectisation",
    tariff: "Blattes / Cafards",
    title: "Cafards et blattes : traitement professionnel à Lyon",
    description:
      "Cafards ou blattes en cuisine à Lyon ? Repérez les signes, comprenez les risques et découvrez notre traitement gel, régulateur et nébulisation.",
    h1: "Cafards et blattes : traitement efficace à Lyon et Villeurbanne",
    intro:
      "Les blattes fuient la lumière : pour une seule aperçue, des dizaines restent cachées dans la cuisine, la salle de bains ou les gaines de l’immeuble. Les bombes du commerce ne touchent pas le nid, d’où un traitement professionnel qui vise à la fois les adultes et les œufs.",
    signs: [
      "Des déjections semblables à du poivre moulu sur les charnières de placard, derrière le frigo ou sous l’évier.",
      "Des oothèques, petites capsules brunes d’environ 8 mm qui renferment 30 à 40 œufs chez la blatte germanique.",
      "Des mues translucides et jaunâtres accumulées près des cachettes, preuve que les jeunes grandissent sur place.",
      "Une odeur de moisi, huileuse et un peu sucrée, qui persiste dans la pièce.",
      "Un cafard qui circule le jour : les cachettes sont saturées et l’infestation est déjà installée.",
    ],
    risks: [
      "Les blattes transportent bactéries et germes, avec un risque de salmonellose ou de dysenterie si elles souillent la nourriture.",
      "Leurs excréments, mues et débris déclenchent allergies et crises d’asthme, surtout chez les enfants.",
      "Une population discrète devient incontrôlable en quelques semaines, et les insecticides vendus en magasin finissent par ne plus agir.",
    ],
    treatment: [
      "Diagnostic pour identifier l’espèce, mesurer l’infestation et localiser les foyers dans les recoins chauds et humides.",
      "Pose de gouttes de gel appât professionnel sur les zones de passage : les blattes le consomment puis contaminent le reste de la colonie.",
      "Application d’un régulateur de croissance : les œufs n’éclosent plus et les nymphes de devenir adultes, pour couper le cycle de reproduction.",
      "Nébulisation en gouttelettes fines pour atteindre fissures, plinthes, faux plafonds et moteurs d’appareils, complétée si besoin par une pulvérisation ciblée.",
      "Compte-rendu d’intervention et consignes concrètes : réparer les fuites, essuyer l’évier, ranger les denrées dans des boîtes fermées.",
    ],
    followUp:
      "Le traitement se réserve en ligne, au créneau de votre choix, ou par téléphone. Les premiers effets se voient sous 48 à 72 heures ; une visite de contrôle, incluse, est prévue 2 à 3 semaines plus tard pour traiter les blattes nées des oothèques, que les insecticides n’atteignent pas. Si l’infestation persiste, nous revenons gratuitement, selon les conditions du devis.",
    faq: [
      {
        q: "Un seul passage suffit-il contre les cafards ?",
        a: "Rarement quand l’infestation est établie. Les œufs protégés par leur capsule résistent au premier traitement. La visite de contrôle quelques semaines après élimine cette nouvelle génération.",
      },
      {
        q: "Pourquoi mes bombes insecticides ne marchent-elles pas ?",
        a: "Sprays, vinaigre et huiles essentielles repoussent les blattes un temps sans atteindre le foyer de reproduction. Elles changent de cachette et la population continue de croître. Un gel professionnel associé à un régulateur de croissance agit sur toute la colonie.",
      },
      {
        q: "Peut-on rester dans le logement pendant le traitement ?",
        a: "Le gel est discret et convient aux logements occupés. Pour une nébulisation, suivez les consignes de sécurité que vous laisse le technicien, en particulier pour les enfants et les animaux.",
      },
      {
        q: "Intervenez-vous dans les restaurants et commerces ?",
        a: "Oui, à Lyon comme à Villeurbanne, y compris dans les immeubles anciens avec gaines techniques et parties communes. Nous intervenons avec discrétion dans les établissements recevant du public, et un compte-rendu vous est remis.",
      },
    ],
    articles: [
      "guide-cafards-blattes-elimination",
      "comment-savoir-si-on-a-des-cafards-signes-infestation",
      "cafards-resistent-sprays",
      "cafards-restaurant-intervention-rapide-discrete-lyon",
    ],
  },
  {
    slug: "punaises-de-lit",
    name: "Punaises de lit",
    service: "punaises-de-lit",
    tariff: "Punaises de lit",
    title: "Punaises de lit à Lyon : diagnostic, méthodes et garantie",
    description:
      "Piqûres au réveil, points noirs sur le matelas ? Traitement des punaises de lit à Lyon et Villeurbanne : vapeur, chimique raisonné, froid, garantie écrite.",
    h1: "Punaises de lit : traitement professionnel à Lyon et Villeurbanne",
    intro:
      "Avec le tourisme, les locations courte durée et la vie étudiante, les punaises de lit voyagent facilement d’un logement lyonnais à l’autre. Elles vivent cachées et survivent des mois sans repas : seul un protocole complet, préparé avec vous, en vient à bout.",
    signs: [
      "Des piqûres groupées ou alignées par trois ou quatre sur le visage, le cou, les bras ou les jambes, qui démangent surtout le matin.",
      "Des points noirs le long des coutures du matelas et sur le sommier : ce sont des déjections qui bavent si on les frotte avec un linge humide.",
      "Des taches couleur rouille ou brun foncé sur les draps.",
      "Des exuvies, peaux de mue dorées et vides, laissées à chacun des cinq stades de croissance.",
      "En forte densité, une odeur douceâtre et moisie, parfois comparée à la coriandre.",
    ],
    risks: [
      "Elles ne transmettent pas de maladie, mais les nuits hachées et l’angoisse pèsent lourd sur le moral.",
      "Certaines personnes développent de fortes réactions cutanées, alors que d’autres ne marquent pas du tout et laissent l’infestation progresser.",
      "Une femelle pond jusqu’à 500 œufs au cours de sa vie : sans traitement, la colonie s’étend aux autres pièces et aux logements voisins.",
    ],
    treatment: [
      "Diagnostic sur place ou à distance, avec détection canine si besoin pour trouver les foyers que l’œil ne voit pas.",
      "Remise d’un protocole préparatoire : aspirer sols, matelas et plinthes, laver le linge à haute température, laisser chaque meuble dans sa pièce.",
      "Traitement à la vapeur haute température, qui tue insectes et œufs au contact, complété si besoin par un traitement chimique raisonné.",
      "Pour les personnes sensibles aux produits, une solution sans résidu associe vapeur sèche et froid ; vêtements et oreillers peuvent passer en chambre froide à -20 °C.",
      "Avec la méthode chimique, un second passage a lieu 15 jours après le premier, le temps que les œufs éclosent et que les jeunes soient éliminés.",
      "Bilan détaillé et rapport d’intervention, utile pour vos démarches auprès du bailleur ou de l’assureur.",
    ],
    followUp:
      "Chaque passage se réserve en ligne, au créneau de votre choix, ou par téléphone. La garantie de résultat est incluse : au moins 3 mois après un traitement chimique ou vapeur standard, 6 mois après un traitement combiné, et jusqu’à 12 mois si vous souscrivez un contrat de suivi préventif. Pendant cette période, toute réapparition entraîne une intervention gratuite, sans limite de nombre, à condition d’avoir respecté la préparation et les deux passages ; nous vous rappelons à J+7, J+15, J+30 puis J+90.",
    faq: [
      {
        q: "Peut-on avoir des punaises de lit sans en voir ?",
        a: "Oui. Elles sortent la nuit et passent la journée dans les fentes du lit ou des plinthes. On peut être piqué plusieurs semaines sans croiser un seul insecte vivant.",
      },
      {
        q: "Combien de temps dure le traitement complet ?",
        a: "De 15 à 30 jours, suivant la méthode retenue. Les piqûres s’arrêtent en général sous 3 à 5 jours, puis l’éradication, œufs compris, se confirme entre J+15 et J+30.",
      },
      {
        q: "Faut-il quitter le logement pendant le traitement ?",
        a: "Après un passage chimique, il faut sortir 5 à 6 heures avant de revenir. Le traitement à la vapeur, lui, n’impose aucune éviction. Le technicien vous précise la marche à suivre lors du diagnostic.",
      },
      {
        q: "Comment éviter d’en ramener après un voyage ?",
        a: "Inspectez la literie de l’hôtel et les coutures de vos bagages avant de défaire la valise. Lavez vos vêtements à chaud au retour et examinez soigneusement tout meuble acheté d’occasion.",
      },
    ],
    articles: [
      "guide-complet-punaises-lit-elimination-definitive",
      "comment-savoir-si-on-a-des-punaises-de-lit",
      "punaises-de-lit-que-faire",
      "punaises-de-lit-vs-puces-differences",
    ],
  },
  {
    slug: "guepes-frelons",
    name: "Guêpes et frelons",
    service: "guepes-frelons",
    tariff: "Guêpes et frelons",
    title: "Frelon asiatique et guêpes : destruction de nid à Lyon",
    description:
      "Nid de frelon asiatique ou de guêpes à Lyon ou Villeurbanne ? Comment les reconnaître, les dangers, qui appeler et notre intervention sécurisée.",
    h1: "Guêpes, frelon asiatique : destruction de nid à Lyon et Villeurbanne",
    intro:
      "Un nid de guêpes ou de frelons, ça ne se règle pas avec un spray ou un bâton : la colonie se défend en masse dès qu’elle se sent menacée. Sur une propriété privée, les pompiers ne se déplacent plus sauf urgence vitale, c’est donc à un professionnel équipé de neutraliser et retirer le nid.",
    signs: [
      "Un va-et-vient régulier d’insectes toujours au même endroit : sous une tuile, un volet roulant, un coffre de store ou une haie.",
      "Un bourdonnement continu derrière un mur, un plafond ou dans les combles.",
      "Des boulettes grises de papier mâché autour d’une cavité, ou des ailes et des insectes morts au sol.",
      "Le frelon asiatique se reconnaît à son corps noir, à son unique anneau orange sur l’abdomen et à ses pattes jaunes au bout.",
      "En été, il construit souvent un grand nid sphérique haut dans un arbre, qui peut approcher un mètre de diamètre et s’ouvre sur le côté.",
    ],
    risks: [
      "Une attaque groupée provoque de multiples piqûres, avec œdème ou choc allergique ; environ 10 % de la population risque une réaction grave.",
      "Enfants, personnes âgées et animaux sont les plus exposés, notamment au jardin, sur un balcon ou dans une cour d’école.",
      "La taille d’un nid peut doubler en 10 à 15 jours : à peine une poignée d’insectes en avril, une colonie de plusieurs centaines ou milliers au cœur de l’été.",
      "Le frelon asiatique, très agressif près de son nid, chasse sur plusieurs dizaines de mètres et s’attaque aux abeilles des ruches.",
    ],
    treatment: [
      "Pré-diagnostic par téléphone ou sur photos, puis repérage du nid, identification de l’espèce et analyse de l’accès.",
      "Balisage de la zone et mise à l’écart des personnes et des animaux ; le technicien travaille en combinaison, masque et gants.",
      "Injection d’insecticide professionnel en poudre, mousse ou spray, avec une perche quand le nid est haut placé et avec caméra thermique si le nid est caché.",
      "Retrait du nid dans un sac fermé quand il est accessible, ou traitement sur place quand il est enfermé dans une paroi.",
      "Contrôle des lieux, traitement préventif des points d’accès et remise d’un rapport photo avec nos recommandations.",
    ],
    followUp:
      "La destruction du nid se réserve en ligne, au créneau de votre choix, ou par téléphone ; sur place, elle demande en général 30 minutes à 1 heure. Le suivi est inclus : si un autre nid se forme au même endroit au cours des 3 semaines suivantes, nous revenons le traiter gratuitement.",
    faq: [
      {
        q: "Qui appeler pour un nid de frelon asiatique ?",
        a: "Chez vous, balcon, garage ou jardin privatif compris, contactez directement un professionnel. Dans les parties communes, c’est au syndic ou au bailleur de mandater l’entreprise. Sur la voie publique, prévenez la mairie ou la police municipale, qui mandate un professionnel.",
      },
      {
        q: "Quand peut-on revenir dans la zone traitée ?",
        a: "La colonie est neutralisée immédiatement et l’espace est en général sûr en moins d’une heure. Nous conseillons de patienter 2 à 3 heures avant de revenir sur place, le temps que les derniers insectes disparaissent.",
      },
      {
        q: "Faut-il détruire un nid en hiver ?",
        a: "En hiver, la colonie est souvent morte et un nid vide ne présente plus de danger. Mieux vaut quand même le retirer avant le printemps. La période idéale pour traiter un nid actif va du printemps à l’automne.",
      },
      {
        q: "Que faire en cas de piqûres multiples ?",
        a: "Appelez d’abord les secours : le 18 ou le 112 pour les pompiers, le 15 pour le SAMU. Une fois la personne prise en charge, faites détruire le nid sans tarder pour éviter de nouvelles attaques.",
      },
    ],
    articles: [
      "difference-guepe-frelon-reconnaitre",
      "peut-on-laisser-un-nid-de-guepes",
      "nid-guepes-toiture-destruction-securisee-lyon",
      "nid-de-guepes",
    ],
  },
];
