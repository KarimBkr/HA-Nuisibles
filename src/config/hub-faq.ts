// M73: short FAQs that give the hub pages real answers (≥ 400 words of main text). Facts only from site.ts, tariffs.ts,
// sectors.ts and the booking setup; Markdown answers (rendered by renderMarkdown, FAQPage JSON-LD by <Faq>).
export type HubFaq = { q: string; a: string }[];

export const SERVICES_FAQ: HubFaq = [
  {
    q: "Quels nuisibles traitez-vous à Lyon et Villeurbanne ?",
    a: "Rats et souris (dératisation), punaises de lit, cafards et blattes, fourmis, guêpes et frelons, moustiques, pigeons (dépigeonnage), ainsi que la désinfection des locaux. Chaque service a sa page avec la méthode, le déroulé et les prix : choisissez celui qui correspond à votre problème dans la liste ci-dessus.",
  },
  {
    q: "Comment se déroule une intervention ?",
    a: "Nous commençons par un diagnostic gratuit : identification de l'espèce, des points d'entrée et de l'ampleur de l'infestation. Le technicien vous annonce ensuite le traitement et son prix avant de commencer. Après l'intervention, il vous laisse des consignes simples pour éviter le retour des nuisibles et fixe, si besoin, un passage de contrôle.",
  },
  {
    q: "En combien de temps pouvez-vous intervenir ?",
    a: "Nous intervenons sous 24h à Lyon, Villeurbanne et dans les communes voisines, du lundi au samedi de 9h à 18h. Le dimanche, nous nous déplaçons pour les urgences uniquement, avec une majoration de 50 %. Le plus rapide reste d'appeler le [07 64 46 46 91](tel:+33764464691) ou de [réserver un créneau en ligne](/rendez-vous/).",
  },
  {
    q: "Vos techniciens sont-ils certifiés ?",
    a: "Oui. Nos techniciens sont certifiés Certibiocide, la certification obligatoire en France pour utiliser les produits biocides professionnels. Les produits et les méthodes sont choisis selon le lieu : logement avec enfants ou animaux, cuisine de restaurant, chambre d'hôtel ou parties communes d'une copropriété.",
  },
  {
    q: "Le résultat est-il garanti ?",
    a: "Oui, la garantie de résultat est écrite : suivi gratuit de 30 jours en dératisation, 3, 6 ou 12 mois pour les punaises de lit selon le traitement, et un nouveau nid de guêpes traité gratuitement. Les conditions sont détaillées sur la page [garanties](/garanties/) ; le devis reste gratuit et sans engagement.",
  },
];

export const PRICES_FAQ: HubFaq = [
  {
    q: "Le diagnostic est-il payant ?",
    a: "Non, le diagnostic est gratuit. Il permet d'identifier le nuisible et l'ampleur du problème avant de vous proposer un traitement chiffré. Le déplacement est facturé 70 € lorsqu'une intervention a lieu.",
  },
  {
    q: "Combien coûte une dératisation ?",
    a: "La dératisation est facturée à la boîte posée : 20 € par boîte pour les rats et 10 € par boîte pour les souris, plus le déplacement de 70 €. Le nombre de boîtes dépend de la surface et des points de passage repérés pendant le diagnostic.",
  },
  {
    q: "Quel est le prix d'un traitement contre les punaises de lit ?",
    a: "Selon l'infestation, nous proposons une pulvérisation facturée au m², un traitement vapeur et chimique à 450 € ou une tente chauffante à partir de 500 €. Le technicien vous recommande la méthode adaptée après avoir inspecté la literie et les meubles.",
  },
  {
    q: "Combien coûte la destruction d'un nid de guêpes ou de frelons ?",
    a: "La destruction d'un nid de guêpes coûte 110 € et celle d'un nid de frelons 130 €. Pour les cafards, le traitement au gel démarre à 110 € ; pour les fourmis, le forfait gel est de 150 €.",
  },
  {
    q: "Y a-t-il des frais le dimanche ?",
    a: "Le dimanche, nous intervenons pour les urgences uniquement, avec une majoration de 50 % sur le prix de l'intervention. Du lundi au samedi, de 9h à 18h, les prix affichés sur cette page s'appliquent sans supplément. Pour un chantier particulier (dépigeonnage, grands locaux), le prix est établi sur devis gratuit.",
  },
];

export const ZONES_FAQ: HubFaq = [
  {
    q: "Dans quels quartiers de Lyon intervenez-vous ?",
    a: "Dans tous les arrondissements de Lyon, notamment la Croix-Rousse, Monplaisir, Bellecour, Vaise, la Guillotière, la Part-Dieu, le Vieux Lyon et Jean-Macé. Nous intervenons sous 24h, du lundi au samedi de 9h à 18h.",
  },
  {
    q: "Et à Villeurbanne ?",
    a: "Notre local est au 127 cours Tolstoï, à Villeurbanne : nous couvrons toute la ville, des Gratte-Ciel aux Charpennes, en passant par le Tonkin, Cusset et Grandclément. C'est là que nos délais sont les plus courts.",
  },
  {
    q: "Vous déplacez-vous dans les communes voisines ?",
    a: "Oui, nous intervenons aussi à Bron, Caluire-et-Cuire, Vénissieux, Vaulx-en-Velin et Décines, ainsi que dans le reste de la région Rhône-Alpes sur rendez-vous. Le déplacement est facturé 70 €, quel que soit le quartier de Lyon ou de Villeurbanne.",
  },
  {
    q: "Ma commune n'est pas dans la liste : que faire ?",
    a: "Appelez-nous au [07 64 46 46 91](tel:+33764464691) : nous vous dirons tout de suite si nous pouvons intervenir et sous quel délai. Vous pouvez aussi décrire votre problème dans le [formulaire de contact](/contact/), photos à l'appui.",
  },
];

export const SECTORS_FAQ: HubFaq = [
  {
    q: "Intervenez-vous en dehors des heures d'ouverture ?",
    a: "Nous intervenons du lundi au samedi de 9h à 18h, et le dimanche pour les urgences (majoration de 50 %). Pour un restaurant, un commerce ou un hôtel, nous fixons ensemble le créneau qui gêne le moins votre activité et vos clients.",
  },
  {
    q: "Fournissez-vous un rapport d'intervention ?",
    a: "Oui. Après chaque passage, vous recevez un compte rendu : nuisibles constatés, zones traitées, produits utilisés et recommandations. Ce document sert à votre suivi interne et à vos contrôles d'hygiène.",
  },
  {
    q: "Proposez-vous un suivi régulier ?",
    a: "Oui, pour les professionnels exposés (restauration, hôtellerie, copropriétés), nous proposons des passages de contrôle réguliers pour vérifier les postes d'appâtage et repérer une nouvelle infestation avant qu'elle ne s'installe. Le rythme est fixé sur devis gratuit.",
  },
  {
    q: "Pouvez-vous rester discrets ?",
    a: "Oui : nous intervenons hors service, aux heures que vous choisissez, avec des méthodes peu visibles comme le gel alimentaire ciblé et les postes d'appâtage sécurisés. Vos clients et vos résidents ne remarquent rien.",
  },
];
