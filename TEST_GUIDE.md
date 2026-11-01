# Guide de test — site HA Nuisibles

## Lancer le site

- **Version livrée** : servir le dossier `deliverable/` tel quel, par exemple `npx serve deliverable -l 8080` puis ouvrir http://localhost:8080 (ou l'envoyer sur Hostinger, voir README.md).
- **Développement** : `npm install` puis `npm run dev` → http://localhost:3000.

## À tester à la main (mobile d'abord, puis ordinateur)

1. **Accueil** : bandeau « Urgence ? » sous l'en-tête (appel + « Le dimanche, urgences seulement (+50 %) ») ; un titre, une phrase, deux boutons (rendez-vous, appel) ; aperçu des prix « à partir de » avec un lien vers `/tarifs/` ; barre fixe « Appeler / Prendre rendez-vous » en bas sur mobile (absente sur `/rendez-vous/`). Avis clients : 3 visibles, « Voir plus d'avis » pour les autres.
2. **Appel direct** : sur un téléphone, « Appeler » ouvre le composeur avec le 07 64 46 46 91.
3. **Trouver son problème** : menu Services ▾ (7 services + « Tous les services »), Tarifs, Conseils, Contact (burger sur mobile) ; pied de page en 3 colonnes (repliables sur mobile). Dératisation, Punaises de lit, Guêpes & frelons… chaque page a son titre, ses prix, sa FAQ dépliable, ses textes longs repliés (« En détail ») et ses boutons d'action. Sur mobile, « Prendre rendez-vous » de la barre fixe ouvre l'agenda du service de la page.
3 bis. **Tarifs** (`/tarifs/`) : les 4 prix « à partir de » et ce qu'ils comprennent (devis gratuit, rapport, second passage, garantie), puis les liens vers le détail par service.
4. **Prendre rendez-vous** (`/rendez-vous/`) : choisir un service, 3 points de réassurance (devis gratuit, sous 24 h, garantie de résultat) et un message « pas de créneau ? appelez-nous » apparaissent ; l'agenda Cal.com de ce service s'affiche avec la bonne durée (dératisation 4 h, punaises 5 h, guêpes 1 h…) ; réserver un créneau test, vérifier qu'il apparaît dans Google Agenda et que les autres services perdent ces heures, puis l'annuler. Le lien « Ouvrir l'agenda dans un nouvel onglet » fonctionne.
5. **Devis** (`/contact/#mon-devis`) : envoyer le formulaire vide (messages d'erreur, curseur sur le premier champ), puis un vrai devis : la confirmation remplace le formulaire (bouton « Envoyer une autre demande ») et l'e-mail arrive sur la boîte liée à Web3Forms. La carte Google ne s'affiche qu'après un clic, avec une ligne de consentement.
6. **Blog** (`/conseils-nuisibles/`) : filtres par catégorie, articles avec photo, liens vers les pages de service.
7. **Zones** (`/zones-d-intervention/`) : villes et communes servies, liens vers les pages locales Lyon et Villeurbanne de chaque service.
8. **Confidentialité** (`/confidentalite/`) : la liste des services tiers (Cal.com, Google Maps, Web3Forms, statistiques) ; aucune bannière, car rien ne pose de cookie avant un clic.
9. **Adresses de l'ancien site** : `/deratisation-lyon-2/`, `/contact` (sans barre finale → redirigé), une adresse inconnue → page 404 avec liens utiles.
10. **Référencement** : `/sitemap.xml` et `/robots.txt` s'affichent ; tester une page dans https://search.google.com/test/rich-results (entreprise locale, FAQ, fil d'Ariane).
11. **Vitesse** : https://pagespeed.web.dev/ sur l'accueil et une page de service une fois en ligne.

## Paramètres de la réservation (côté client)

Sur Cal.com (compte `ha-nuisibles`, relié à Google Agenda) : un type de rendez-vous par service, avec la durée la plus longue de l'intervention (dératisation 4 h, punaises de lit 5 h, désinsectisation 2 h, guêpes et frelons 1 h, démoustication 4 h, dépigeonnage 4 h, désinfection 5 h, urgence dimanche 4 h). Les adresses sont `cal.com/ha-nuisibles/<service>` ; les réglages se font chez Cal.com, le site affiche simplement ces pages.

## Tests automatiques

`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.
