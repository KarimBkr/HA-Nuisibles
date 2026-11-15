# Guide de test — site HA Nuisibles

## Lancer le site

- **Version livrée** : servir le dossier `deliverable/` tel quel, par exemple `npx serve deliverable -l 8080` puis ouvrir http://localhost:8080 (ou l'envoyer sur Hostinger, voir README.md).
- **Développement** : `npm install` puis `npm run dev` → http://localhost:3000.

## À tester à la main (mobile d'abord, puis ordinateur)

1. **Accueil** (direction « dossier d'intervention ») : titre « Nuisibles ? Dératisation et désinsectisation à Lyon » à côté du portrait du technicien ; 01 index des 7 services (« dès N € » / « sur devis »), 02 bloc urgence vert (dimanche +50 %), 03 méthode (détails repliés), 04 prix en lignes pointillées, 05 un avis et « Avis suivant », bloc final « un appel suffit » avec le grand numéro, FAQ. Barre fixe « Appeler / Prendre rendez-vous » en bas sur mobile (absente sur `/rendez-vous/`). Sur mobile, la page reste courte (≤ 3 800 px).
2. **Appel direct** : sur un téléphone, « Appeler » ouvre le composeur avec le 07 64 46 46 91.
3. **Trouver son problème** : menu Services ▾ (panneau avec lignes numérotées 01–07 et « Tous nos services »), Tarifs, Conseils, Contact ; sur mobile, le burger ouvre un panneau plein écran (grands liens, appel et rendez-vous en bas, Échap ou « Fermer » rend la main au burger). Pied de page vert en 3 colonnes numérotées, Contact d'abord, listes repliées sur mobile. Chaque page de service est une « fiche d'intervention » : colonne fixe à gauche sur ordinateur (tarif « dès N € », durée « jusqu'à N h », délai, boutons rendez-vous prérempli et appel), bandeau compact sous le titre sur mobile ; à droite 01 prix, 02 FAQ, 03 « Le dossier complet » (replié), 04 un avis, 05 « Aussi à … ».
4. **Prendre rendez-vous** (`/rendez-vous/`) : assistant en 2 étapes. Étape 1 : choisir son problème dans la liste numérotée (« jusqu'à N h ») ; immeubles et gros chantiers : appel ou devis. Étape 2 : l'agenda Cal.com du service se charge, avec un récapitulatif (service, durée, « Changer », appel) ; le choix reste dans l'adresse (`#service`). Réserver un créneau test, vérifier qu'il apparaît dans Google Agenda et que les autres services perdent ces heures, puis l'annuler. Le lien « Ouvrir l'agenda dans un nouvel onglet » fonctionne.
5. **Contact et devis** (`/contact/`) : le grand numéro, les horaires et « Prendre rendez-vous en ligne » d'abord ; puis 01 Devis : envoyer le formulaire vide (messages d'erreur, curseur sur le premier champ), puis un vrai devis : la confirmation remplace le formulaire (bouton « Envoyer une autre demande ») et l'e-mail arrive sur la boîte liée à Web3Forms. 02 Coordonnées : la carte Google ne s'affiche qu'après un clic, avec une ligne de consentement.
6. **Blog** (`/conseils-nuisibles/`) : filtres par catégorie, cartes avec date · catégorie et titre ; un article propose « Besoin d'un professionnel » et « À lire aussi ». `/tarifs/` : lignes de prix et index numéroté des pages de prix.
7. **Zones** (`/zones-d-intervention/`) : villes et communes servies, liens vers les pages locales Lyon et Villeurbanne de chaque service.
8. **Confidentialité** (`/confidentalite/`) : la liste des services tiers (Cal.com, Google Maps, Web3Forms, statistiques) ; aucune bannière, car rien ne pose de cookie avant un clic.
9. **Adresses de l'ancien site** : `/deratisation-lyon-2/`, `/contact` (sans barre finale → redirigé), une adresse inconnue → page 404 avec liens utiles.
10. **Référencement** : `/sitemap.xml` et `/robots.txt` s'affichent ; tester une page dans https://search.google.com/test/rich-results (entreprise locale, FAQ, fil d'Ariane).
11. **Vitesse** : https://pagespeed.web.dev/ sur l'accueil et une page de service une fois en ligne.

## Sur ordinateur (1280 à 1920 px de large)

Depuis la refonte « bureau » (novembre 2026), chaque page n'a qu'une seule colonne centrée, sauf les fiches de service :
1. **Accueil** : bandeau d'ouverture (titre, note, « Appeler » / « Prendre rendez-vous », portrait), puis les sections 01 à 05 séparées par un filet et un grand espace ; rien ne reste fixé à l'écran. Chaque écran se lit d'un coup d'œil (peu de texte visible à la fois).
2. **Fiche de service** : le fil d'Ariane au-dessus ; à gauche une seule carte fixe (titre, « dès N € », durée, délai, Rendez-vous et Appeler, petite photo) qui tient dans un écran de 1280×720 ; à droite une phrase, 4 lignes de prix puis « Voir les autres », la FAQ (3 questions puis la suite repliée), « En détail » replié, la méthode, un avis, « Aussi à … ». Aucune phrase n'est répétée entre la carte et la colonne.
3. **Contact** : le grand numéro et le rendez-vous en tête ; le formulaire de devis et les coordonnées côte à côte, séparés par un filet ; les horaires une seule fois ; l'ancien texte est replié dans « 03 — À savoir ».
4. **Tarifs** : les prix « dès » puis un groupe par page de prix, 4 lignes au plus puis « Voir les N autres tarifs ».
5. **Rendez-vous** : l'assistant et le récapitulatif dans une colonne centrée.
6. **Blog, article, zones, mentions, 404** : filtres sur une ligne, cartes de même format ; articles et pages légales en colonne de lecture étroite (≤ 720 px) ; zones en sections numérotées.
7. Redimensionner la fenêtre de 1280 à 1920 px : jamais de barre de défilement horizontale ; puis passer en largeur mobile : la version mobile est inchangée.

## Tarifs et rendez-vous (grille de novembre 2025)

1. **/tarifs/** : « Diagnostic Gratuit » et « Déplacement 70 € » en haut, puis les 7 catégories numérotées ; comparer chaque ligne avec le PDF « Tarifs Novembre 2025 » (25 lignes : prestation, prix, condition). Aucun montant arrondi, aucune mention HT/TTC. Sur mobile (360–390 px), pas de défilement horizontal.
2. Chaque catégorie : le titre ouvre la page du service, « Prendre rendez-vous » ouvre /rendez-vous/ à l'étape 2 du bon service, « Durée : 1 h » est affiché.
3. Accueil (bloc « Tarifs »), une page service (bloc « Nos tarifs ») et une ancienne page de prix (ex. /prix-traitement-punaise-de-lit/, /tarif-desinsectisation-cafard-2026/) : seuls les montants de la grille apparaissent, y compris dans les FAQ.
4. **/rendez-vous/** : choisir chacune des 8 options → « 1 h » au récapitulatif, l'agenda Cal.com du bon service s'affiche ; le bouton Retour du navigateur revient à l'étape 1.
5. **Cal.com, durée de 1 h** : sur chaque page `cal.com/ha-nuisibles/<service>`, les horaires proposés doivent se suivre d'heure en heure (9:00, 10:00, 11:00…). Au 15/11/2026, seul « guepes-frelons » est à 1 h ; les 7 autres types sont encore à 2–5 h et doivent être passés à 60 minutes dans Cal.com (Types d'événements → Durée → Enregistrer).
6. **Créneau déjà réservé** : réserver un créneau test sur un service, recharger les pages des 8 services : ce créneau ne doit plus être proposé nulle part (chevauchements gérés par Cal.com et Google Agenda), puis annuler la réservation test.

## Paramètres de la réservation (côté client)

Sur Cal.com (compte `ha-nuisibles`, relié à Google Agenda) : un type de rendez-vous par service, d'une durée de 1 h (toutes les interventions, urgence du dimanche comprise). Les adresses sont `cal.com/ha-nuisibles/<service>` ; les réglages se font chez Cal.com, le site affiche simplement ces pages.

## Tests automatiques

`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.
