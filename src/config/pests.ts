import type { ServiceKey } from "@/config/services";
import { COMMON_ROWS, TARIFFS } from "@/config/tariffs";

// Pest pages /nuisibles/<slug>/ (M68–M69): facts condensed from the old site (.athanor/docs/OLD_SITE.md, content/pages, content/posts),
// never copied paragraphs; prices come only from the grid (src/config/tariffs.ts, category `tariff`).

export type PestPage = {
  slug: string; // URL /nuisibles/<slug>/
  name: string; // « Rats et souris »
  service: ServiceKey; // its service page (SERVICES.mainSlug) and booking key
  tariff: string; // TARIFFS category title whose rows are shown ("" when the grid has none: only the common rows)
  rows?: string[]; // only these row labels of the category (a category shared with other pests)
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

/** Grid rows of a pest (its tariff category), then the rows common to every intervention. */
export const pestRows = (p: PestPage) => [
  ...(TARIFFS.find((c) => c.title === p.tariff)?.rows ?? []).filter((r) => !p.rows || p.rows.includes(r.label)),
  ...COMMON_ROWS,
];

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
  {
    slug: "pigeons",
    name: "Pigeons",
    service: "depigeonnage",
    tariff: "Pigeons",
    title: "Pigeons à Lyon : pics, filets et nettoyage des fientes",
    description:
      "Pigeons sur votre balcon, façade ou toiture à Lyon ? Dégâts des fientes, risques sanitaires et notre dépigeonnage : nettoyage, pics, filets et suivi.",
    h1: "Pigeons à Lyon et Villeurbanne : dépigeonnage durable des façades et balcons",
    intro:
      "Un pigeon qui a trouvé un rebord abrité, de la nourriture et un point d’eau revient toujours au même endroit, et la colonie grossit vite. Les astuces maison ne tiennent que quelques jours : HA Nuisibles nettoie, désinfecte puis pose des dispositifs qui empêchent les oiseaux de se poser et de nicher, sans leur faire de mal.",
    signs: [
      "Des fientes qui s’accumulent sur les rebords de fenêtres, les balcons, les corniches ou les voitures garées en dessous.",
      "Des roucoulements dès le matin et des allées et venues en groupe sur la toiture ou la façade.",
      "Des nids, brindilles et plumes dans les recoins abrités : sous le toit, sur une corniche, derrière un climatiseur.",
      "Des climatiseurs obstrués et une odeur qui persiste dans la cour ou les parties communes.",
      "Des oiseaux qui reviennent malgré l’épouvantail, les CD suspendus ou le répulsif posé quelques jours plus tôt.",
    ],
    risks: [
      "Dégâts matériels : acides et corrosives, les fientes abîment façades, toitures, monuments et carrosseries.",
      "Santé : les déjections contiennent bactéries, champignons et parasites, et les oiseaux transportent eux-mêmes des parasites.",
      "Bruit : roucoulements constants et déplacements en groupe deviennent vite pénibles pour les occupants.",
      "Autres nuisibles : restes de nourriture et nids attirent rats et insectes, ce qui aggrave la situation.",
    ],
    treatment: [
      "Inspection et diagnostic pour repérer les zones de pose et de nidification, les points d’accès et ce qui attire les oiseaux.",
      "Mise en sécurité du site : nettoyage des fientes, retrait des nids et désinfection des surfaces souillées.",
      "Pose des dispositifs adaptés au bâtiment : pics anti-pigeons sur les rebords, filets de protection en façade, fils tendus, répulsifs sonores ou solutions naturelles.",
      "Pour une façade haute ou une toiture difficile d’accès, équipement spécifique comme la nacelle, prévu dès le devis.",
      "Conseils pour ne plus attirer les pigeons : ne jamais les nourrir, fermer les poubelles et ne laisser aucune nourriture accessible.",
    ],
    followUp:
      "Le dépigeonnage se réserve en ligne ou par téléphone, et un devis détaillé vous est remis avant toute pose de matériel. Les pigeons installés depuis longtemps peuvent tenter de revenir dans les jours qui suivent : nous restons en contact avec vous pendant les semaines suivantes et ajustons le dispositif si nécessaire, pour une protection qui dure.",
    faq: [
      {
        q: "Pourquoi les pigeons choisissent-ils mon balcon ?",
        a: "Ils cherchent trois choses : de la nourriture facile, un abri sûr pour nicher et un point d’eau proche, comme une fontaine. Une fois installés, leur instinct les ramène toujours au même endroit, d’où la difficulté à les déloger sans dispositif adapté.",
      },
      {
        q: "Pics ou filets : quel dispositif pour mon immeuble ?",
        a: "Tout dépend de la configuration. Les pics empêchent les oiseaux de se poser sur les rebords et les toits, les filets ferment l’accès à une façade, une cour ou un balcon. Dans une copropriété proche de Charpennes, nous avons par exemple associé filets en façade et pics discrets sur les rebords de toit.",
      },
      {
        q: "Qu’est-ce qui fait varier le prix d’un dépigeonnage ?",
        a: "Quatre critères : la surface à protéger, l’ampleur de l’infestation, les dispositifs posés et l’accessibilité du site. Un bâtiment haut ou difficile d’accès demande un matériel spécifique, c’est pourquoi chaque chantier fait l’objet d’un devis personnalisé.",
      },
      {
        q: "Intervenez-vous pour les syndics et les commerces ?",
        a: "Oui. À Villeurbanne, plus de 60 % de nos interventions concernent des bâtiments collectifs, et nous travaillons aussi pour des commerces de bouche, des restaurants et des établissements de santé.",
      },
      {
        q: "Que faire en attendant l’intervention ?",
        a: "Ne nourrissez pas les pigeons, fermez bien les poubelles et ne laissez aucun reste alimentaire sur le balcon. Le nettoyage des fientes, le retrait des nids et la désinfection font ensuite partie de notre intervention.",
      },
    ],
    articles: ["comment-faire-fuir-les-pigeons", "depigeonnage-tarif"],
  },
  {
    slug: "moustiques",
    name: "Moustiques et moustiques tigres",
    service: "demoustication",
    tariff: "",
    title: "Moustique tigre à Lyon : signes, risques et traitement",
    description:
      "Moustiques ou moustique tigre dans votre jardin à Lyon ? Gîtes larvaires, risques sanitaires et notre démoustication : diagnostic, traitement ciblé, conseils.",
    h1: "Moustiques et moustique tigre à Lyon : démoustication du jardin et du logement",
    intro:
      "Les moustiques pondent dans la moindre eau stagnante et se multiplient dès que les températures montent, surtout près du Rhône et de la Saône. Le moustique tigre, installé en ville, pique aussi en journée. HA Nuisibles traite à la fois les adultes et les larves, puis vous aide à supprimer les points d’eau qui les font revenir.",
    signs: [
      "Des piqûres à répétition dès les soirées de printemps et d’été, sur la terrasse, le balcon ou dans la chambre.",
      "Des piqûres en pleine journée : c’est le comportement typique du moustique tigre.",
      "De l’eau qui stagne dans les soucoupes, les pots de fleurs, les gouttières bouchées, un bidon ou un bassin laissé à l’abandon.",
      "Des moustiques qui reviennent chaque été au même endroit, malgré les sprays et les diffuseurs.",
    ],
    risks: [
      "Démangeaisons, irritations cutanées et réactions allergiques chez certaines personnes.",
      "Les moustiques peuvent transmettre des maladies comme la dengue, le chikungunya ou le virus Zika.",
      "Le moustique tigre (Aedes albopictus), espèce invasive, s’est installé dans plus de 67 départements français et s’adapte très bien aux zones urbaines.",
      "Sans action, la population explose avec la chaleur et devient de plus en plus difficile à contenir.",
    ],
    treatment: [
      "Inspection complète du site pour repérer les zones à risque et les lieux de reproduction : coupelles, pots, gouttières, bassins.",
      "Élimination des larves dans les points d’eau, pour empêcher l’éclosion d’une nouvelle génération.",
      "Traitement des adultes par pulvérisation d’insecticides spécifiques ou nébulisation, avec des produits certifiés adaptés aux végétaux et aux surfaces extérieures.",
      "Installation de pièges lorsque la situation s’y prête.",
      "Conseils personnalisés : vider les soucoupes, couvrir les récupérateurs d’eau, entretenir gouttières et espaces verts.",
    ],
    followUp:
      "La démoustication se réserve en ligne ou par téléphone. La baisse des moustiques adultes se remarque dès les premières heures, et il faut quelques jours pour bloquer l’éclosion des larves. Dans un jardin propice aux moustiques, nous conseillons une ou deux interventions supplémentaires en cours d’été, et idéalement une intervention chaque année en début de saison.",
    faq: [
      {
        q: "Comment reconnaître un moustique tigre ?",
        a: "Son premier indice est son horaire : contrairement aux autres moustiques, qui piquent surtout la nuit, il pique en journée. Il s’adapte très bien à la ville et pond dans de toutes petites quantités d’eau, comme une soucoupe ou un vase.",
      },
      {
        q: "Pourquoi y a-t-il autant de moustiques près du Rhône et de la Saône ?",
        a: "Les deux fleuves, les zones humides et les jardins offrent beaucoup d’eau stagnante, leur site de ponte. À Lyon, nous intervenons chaque été sur des balcons et des jardins situés près des quais.",
      },
      {
        q: "Les traitements sont-ils sans danger pour mes plantes et mes animaux ?",
        a: "Nous utilisons des produits certifiés, choisis pour préserver les végétaux et les animaux domestiques. Le technicien adapte le traitement aux surfaces extérieures et vous indique les précautions à prendre.",
      },
      {
        q: "Quels gestes limitent les piqûres au quotidien ?",
        a: "Posez des moustiquaires, portez des vêtements longs et clairs aux heures de forte activité et appliquez un répulsif adapté. Un ventilateur aide aussi, car les moustiques volent mal face aux courants d’air. Citronnelle et géranium complètent ces gestes.",
      },
      {
        q: "Les moustiques reviendront-ils l’année prochaine ?",
        a: "Souvent, si les points d’eau restent en place. C’est pourquoi le traitement s’accompagne de mesures préventives, et qu’une intervention en début de saison est conseillée dans les jardins les plus exposés.",
      },
    ],
    articles: ["comment-eloigner-les-moustiques"],
  },
  {
    slug: "fourmis",
    name: "Fourmis",
    service: "desinsectisation",
    tariff: "Fourmis",
    title: "Fourmis à Lyon : traitement professionnel au gel",
    description:
      "Fourmis dans la cuisine ou les murs à Lyon ? Pourquoi elles reviennent, où se cache le nid et notre traitement au gel qui atteint la reine et la colonie.",
    h1: "Fourmis à Lyon : éliminer la colonie, pas seulement les ouvrières",
    intro:
      "Une file de fourmis dans la cuisine n’est que la partie visible d’une colonie installée dans un mur, sous un plancher ou dans le jardin. Les sprays tuent les ouvrières sans toucher la reine : HA Nuisibles localise le nid et pose un gel qu’elles ramènent elles-mêmes jusqu’à la colonie.",
    signs: [
      "Une file bien organisée de petites fourmis entre une fissure, une fenêtre ou une prise électrique et vos provisions.",
      "Des fourmis autour du sucre, des miettes, des restes de repas ou de la gamelle de l’animal.",
      "Des allées et venues répétées le long des plinthes ou sous l’évier, qui trahissent un nid proche.",
      "Des fourmis qui reviennent chaque printemps, ou aussitôt après un nettoyage au spray.",
    ],
    risks: [
      "Hygiène : les fourmis marchent sur tout, plans de travail, placards et réserves alimentaires compris.",
      "Leur présence révèle souvent un problème plus profond : humidité, fissure ou nourriture mal stockée.",
      "La fourmi charpentière attaque le bois et peut fragiliser une structure, avec des dégâts comparables à ceux des termites.",
      "Une seule éclaireuse laisse une trace chimique que toute la colonie suit : en une journée, la cuisine devient un point de ravitaillement.",
    ],
    treatment: [
      "Diagnostic sur place : suivi des trajets, repérage des points d’entrée et localisation du nid ou des colonies.",
      "Pose d’un gel insecticide à effet retard sur les passages : les ouvrières le rapportent au nid, où il atteint la reine.",
      "Traitement localisé, discret, qui convient aux cuisines, aux bureaux et aux écoles.",
      "Repérage des fissures, interstices sous les plinthes et ouvertures à colmater pour couper les accès.",
      "Conseils de prévention : contenants hermétiques, plans de travail nettoyés après chaque repas, passages effacés au vinaigre blanc.",
    ],
    followUp:
      "Le traitement se réserve en ligne ou par téléphone. Chaque intervention donne lieu à un rapport détaillé avec nos recommandations contre la récidive, et nous assurons un suivi après traitement, avec une garantie de résultat. Si les fourmis reviennent malgré tout, c’est souvent le signe d’un second nid : prévenez-nous.",
    faq: [
      {
        q: "Pourquoi ai-je des fourmis alors que ma cuisine est propre ?",
        a: "Il suffit d’une source de nourriture accessible, même minime, et d’une entrée minuscule. Une seule fourmi éclaireuse qui trouve du sucre ou des croquettes peut déclencher l’arrivée de toute la colonie.",
      },
      {
        q: "Où se cache le nid des fourmis dans une maison ?",
        a: "Sous les plinthes, derrière une cloison, dans les combles, dans les murs ou dans le jardin, à quelques mètres des fondations. Il est rarement visible, mais leurs allers-retours permettent de le localiser indirectement.",
      },
      {
        q: "Le vinaigre blanc suffit-il contre les fourmis ?",
        a: "Non, il ne les tue pas. Il efface en revanche la trace chimique qu’elles laissent et désoriente les suivantes. C’est un bon complément après le traitement, pas une solution contre un nid installé.",
      },
      {
        q: "Pourquoi les fourmis reviennent-elles sans arrêt ?",
        a: "Le plus souvent, le nid n’a pas été détruit ou plusieurs colonies cohabitent. Tant que la reine est vivante et que les accès restent ouverts, de nouvelles ouvrières reviennent, surtout au printemps.",
      },
      {
        q: "Les fourmis sont-elles dangereuses ?",
        a: "La plupart ne présentent pas de danger direct et ne transmettent pas de maladie grave ; seules les fourmis rouges piquent. Le vrai risque vient de l’hygiène des denrées et, pour la fourmi charpentière, des dégâts sur le bois.",
      },
    ],
    articles: ["fourmis-dans-la-maison-que-faire-vraiment-pour-sen-debarrasser", "comment-se-debarrasser-des-fourmis"],
  },
  {
    slug: "chenilles-processionnaires",
    name: "Chenilles processionnaires",
    service: "desinsectisation",
    tariff: "",
    title: "Chenilles processionnaires à Lyon : traitement des nids",
    description:
      "Chenilles processionnaires sur vos pins ou chênes à Lyon ? Dangers des poils urticants pour vous et votre chien, gestes d’urgence et notre traitement.",
    h1: "Chenilles processionnaires à Lyon : protéger jardin, enfants et animaux",
    intro:
      "Les chenilles processionnaires s’installent sur les pins et les chênes, et les températures douces de la région lyonnaise favorisent leur développement. Leurs poils urticants menacent les humains comme les animaux : il ne faut jamais les manipuler, mais traiter les arbres dès les premiers nids.",
    signs: [
      "Des nids soyeux accrochés aux branches des pins ou des chênes.",
      "Des chenilles qui se déplacent en file indienne sur le tronc ou au sol, le plus souvent entre janvier et mai.",
      "Des aiguilles de pin ou des feuilles de chêne dévorées, et un arbre qui s’affaiblit.",
    ],
    risks: [
      "Leurs poils urticants provoquent démangeaisons, irritations graves et réactions allergiques sévères chez l’homme.",
      "Un chien qui renifle, lèche ou marche sur une chenille risque un gonflement de la langue, une hypersalivation, des vomissements, voire une nécrose des tissus de la bouche.",
      "Chats, chevaux et autres animaux domestiques peuvent aussi être touchés.",
      "Les arbres infestés s’affaiblissent et deviennent vulnérables aux maladies ; les nids peuvent rester en place toute l’année.",
    ],
    treatment: [
      "Inspection des arbres pour repérer les nids et mesurer l’ampleur de l’infestation, sans contact direct avec les chenilles.",
      "Destruction des nids : les cocons sont coupés dans les arbres puis brûlés, avant que la colonie ne descende au sol.",
      "Pose de colliers pièges autour des troncs, qui capturent les chenilles quand elles descendent pour s’enterrer.",
      "Traitement biologique au Bacillus thuringiensis, une bactérie naturelle qui élimine les larves avant qu’elles ne deviennent urticantes.",
      "Conseils adaptés pour protéger les enfants, les animaux et le jardin et éviter une nouvelle infestation.",
    ],
    followUp:
      "L’intervention se réserve en ligne ou par téléphone, et le diagnostic permet d’établir un devis adapté à vos arbres. Nous assurons ensuite un suivi personnalisé, avec des conseils pour éviter toute nouvelle infestation la saison suivante.",
    faq: [
      {
        q: "À quelle période les chenilles processionnaires sont-elles présentes ?",
        a: "Elles apparaissent surtout entre janvier et mai, quand elles descendent des arbres en procession. Leurs nids peuvent cependant rester en place toute l’année.",
      },
      {
        q: "Mon chien a touché une chenille processionnaire : que faire ?",
        a: "Rincez immédiatement la zone touchée à l’eau claire, sans frotter, puis consultez un vétérinaire en urgence. Surveillez la langue, la salivation et les vomissements.",
      },
      {
        q: "Peut-on retirer un nid soi-même ?",
        a: "C’est déconseillé : toute manipulation directe expose aux poils urticants et à des réactions cutanées sévères. En cas d’infestation avancée, un traitement professionnel garantit une élimination totale et sécurisée.",
      },
      {
        q: "Existe-t-il un traitement respectueux de l’environnement ?",
        a: "Oui. Le Bacillus thuringiensis est une bactérie naturelle qui cible les larves, et les colliers pièges capturent les chenilles sans produit. Ces méthodes préservent la biodiversité du jardin.",
      },
      {
        q: "Quels arbres faut-il surveiller ?",
        a: "Avant tout les pins et les chênes, dont les chenilles dévorent les aiguilles et les feuilles. Faites-les traiter dès les premiers signes de nidification.",
      },
    ],
    articles: ["comment-se-debarrasser-des-chenilles"],
  },
  {
    slug: "mouches",
    name: "Mouches",
    service: "desinsectisation",
    tariff: "Autres insectes",
    rows: ["Mouches de grenier", "Mouches à drain"],
    title: "Mouches à Lyon : trouver la source de ponte et traiter",
    description:
      "Invasion de mouches à Lyon ? Causes, signes d’un foyer caché, gestes immédiats et notre désinsectisation : traitement ciblé, curatif et préventif.",
    h1: "Mouches à Lyon : en finir avec une invasion qui revient",
    intro:
      "Une invasion de mouches n’arrive jamais par hasard : déchets, fruits trop mûrs, siphon encrassé ou animal mort dans un conduit leur offrent de quoi pondre. Une mouche peut déposer jusqu’à 600 œufs qui éclosent en 24 heures, d’où l’intérêt de trouver la source avant de traiter.",
    signs: [
      "Des dizaines de mouches sur les vitres, autour des lampes ou dans la cuisine, qui reviennent après chaque aération.",
      "Des moucherons autour de la corbeille de fruits ou des bouteilles : ce sont des drosophiles, attirées par ce qui fermente.",
      "Des mouches qui tournent autour de l’évier : un siphon mal entretenu peut abriter des larves.",
      "Beaucoup de mouches vertes en un même endroit : souvent le signe d’un animal mort dans les combles, un conduit ou un mur.",
      "Des mouches qui réapparaissent malgré le ménage, les pièges et les plantes répulsives.",
    ],
    risks: [
      "Les mouches domestiques se posent sur les déchets et les excréments puis sur vos aliments : ce sont de redoutables vecteurs de bactéries.",
      "Elles salissent l’espace de vie et révèlent souvent un dysfonctionnement d’hygiène ou du bâtiment.",
      "La ponte massive fait exploser la population en quelques jours si la source reste en place.",
    ],
    treatment: [
      "Diagnostic pour identifier l’espèce, car mouche domestique, drosophile ou mouche verte ne renvoient pas à la même source.",
      "Recherche du foyer : siphons, poubelles, coins humides, cloisons, gouttières, combles ou garage.",
      "Traitement par pulvérisation ou nébulisation des zones où le foyer a été localisé.",
      "Volet préventif : consignes de nettoyage des siphons, de gestion des déchets et pose de moustiquaires aux fenêtres.",
      "Rapport détaillé avec nos recommandations pour éviter une nouvelle invasion.",
    ],
    followUp:
      "La désinsectisation se réserve en ligne ou par téléphone. Nous assurons un suivi après intervention pour éviter toute récidive, avec une garantie de résultat ; si les mouches réapparaissent, signalez-le-nous, car un foyer caché peut subsister.",
    faq: [
      {
        q: "Pourquoi ai-je soudain plein de mouches chez moi ?",
        a: "Une source de nourriture ou d’humidité a permis une ponte : déchets organiques, fruits mûrs, restes alimentaires, litière ou canalisation bouchée. Les œufs éclosent très vite quand les conditions sont favorables.",
      },
      {
        q: "Mouches domestiques ou mouches à fruits : quelle différence ?",
        a: "Les mouches domestiques, plus grandes, recherchent déchets et matières en décomposition. Les mouches à fruits, ou drosophiles, plus petites, sont attirées par ce qui fermente : fruits trop mûrs, vinaigre, vin.",
      },
      {
        q: "Que faire en attendant le technicien ?",
        a: "Videz et lavez les poubelles, rangez les fruits au frais, rincez les gamelles des animaux et nettoyez les siphons. Aérez en créant un courant d’air et aspirez les mouches visibles, sur les vitres comme au plafond.",
      },
      {
        q: "Les sprays et diffuseurs du commerce suffisent-ils ?",
        a: "Ils réduisent le nombre de mouches un temps, mais l’invasion revient tant que le foyer de ponte n’est pas éliminé. Il faut coupler le traitement à un nettoyage en profondeur.",
      },
      {
        q: "Quand faire appel à un professionnel ?",
        a: "Quand les mouches reviennent malgré vos efforts ou que vous soupçonnez une cause cachée : nid inaccessible, animal mort, conduit infecté. Le technicien localise la source et propose un traitement curatif et préventif.",
      },
    ],
    articles: ["invasion-de-mouches-que-faire"],
  },
];
