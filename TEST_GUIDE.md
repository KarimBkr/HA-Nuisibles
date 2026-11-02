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

## Paramètres de la réservation (côté client)

Sur Cal.com (compte `ha-nuisibles`, relié à Google Agenda) : un type de rendez-vous par service, avec la durée la plus longue de l'intervention (dératisation 4 h, punaises de lit 5 h, désinsectisation 2 h, guêpes et frelons 1 h, démoustication 4 h, dépigeonnage 4 h, désinfection 5 h, urgence dimanche 4 h). Les adresses sont `cal.com/ha-nuisibles/<service>` ; les réglages se font chez Cal.com, le site affiche simplement ces pages.

## Tests automatiques

`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.
